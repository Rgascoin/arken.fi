// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {IStrategy} from "../interfaces/IStrategy.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {Errors} from "../utils/Errors.sol";

interface ApeStaking {
    function claimSelfApeCoin() external;
    function depositSelfApeCoin(uint256 _amount) external;
    function withdrawSelfApeCoin(uint256 _amount) external;
    function getApeCoinStake(address _address) external view returns (DashboardStake memory);

    struct DashboardStake {
        uint256 poolId;
        uint256 tokenId;
        uint256 deposited;
        uint256 unclaimed;
        uint256 rewards24hr;
        DashboardPair pair;
    }

    struct DashboardPair {
        uint256 mainTokenId;
        uint256 mainTypePoolId;
    }
}

contract ApeCoinStrategy is IStrategy, Owned {
    using SafeTransferLib for ERC20;

    event OwnerUpdated(address oldOwner, address newOwner);

    address public staker;
    address public asset;
    address public vault;

    modifier onlyVault() {
        if (msg.sender != vault) revert Errors.NotVault();
        _;
    }

    constructor(address initialOwner, address definitiveStaker, address definitiveAsset) Owned(initialOwner) {
        staker = definitiveStaker;
        asset = definitiveAsset;

        ERC20(asset).safeApprove(staker, type(uint256).max);
    }

    function setVault(address newVault) external onlyOwner {
        if (newVault == address(0)) revert Errors.ZeroAddress();

        address oldVault = vault;
        vault = newVault;

        ERC20(asset).safeApprove(vault, type(uint256).max);

        emit OwnerUpdated(oldVault, newVault);
    }

    function beforeWithdraw(uint256 assets, uint256 /* shares */ ) external override onlyVault {
        ApeStaking(staker).withdrawSelfApeCoin(assets);
    }

    function afterDeposit(uint256 assets, uint256 /* shares */ ) external override onlyVault {
        ApeStaking(staker).depositSelfApeCoin(assets);
    }

    function harvest() external override onlyVault {
        ApeStaking(staker).claimSelfApeCoin();
    }

    function compound() external override onlyVault {
        ApeStaking(staker).depositSelfApeCoin(ERC20(asset).balanceOf(address(this)));
    }

    function totalAssets() external view returns (uint256) {
        return ApeStaking(staker).getApeCoinStake(address(this)).deposited;
    }
}
