// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {IStrategy} from "../interfaces/IStrategy.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import {AFees} from "../abstracts/AFees.sol";
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

contract ApeCoinStrategy is IStrategy, Owned, AFees {
    using SafeTransferLib for ERC20;

    event OwnerUpdated(address oldOwner, address newOwner);

    address public staker;
    address public asset;
    address public vault;

    constructor(
        address initialOwner,
        uint256 initialHarvestFee,
        address initialFeeRecipient,
        address definitiveStaker,
        address definitiveAsset
    ) AFees(initialHarvestFee, initialFeeRecipient) Owned(initialOwner) {
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

    function beforeWithdraw(uint256 assets, uint256 /* shares */ ) external override {
        ApeStaking(staker).withdrawSelfApeCoin(assets);
    }

    function afterDeposit(uint256 assets, uint256 /* shares */ ) external override {
        ApeStaking(staker).depositSelfApeCoin(assets);
    }

    function harvest() external override {
        ApeStaking(staker).claimSelfApeCoin();

        // Collect the admin fee
        uint256 balance = ERC20(asset).balanceOf(address(this));
        uint256 fee = balance * harvestFee / MAX_BPS;

        ERC20(asset).safeTransfer(feeRecipient, fee);
    }

    function compound() external override {
        ApeStaking(staker).depositSelfApeCoin(ERC20(asset).balanceOf(address(this)));
    }

    function totalAssets() external view returns (uint256) {
        return ApeStaking(staker).getApeCoinStake(address(this)).deposited;
    }
}
