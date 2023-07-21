// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Owned} from "solmate/auth/Owned.sol";
import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {AOperator} from "./abstracts/AOperator.sol";
import {AStrategy} from "./abstracts/AStrategy.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import {AFees} from "./abstracts/AFees.sol";

contract Vault is Owned, ERC4626, AStrategy, AOperator, AFees {
    using SafeTransferLib for ERC20;

    event Compounded();
    event Harvested();

    constructor(
        address initialOwner,
        address initialStrategy,
        address initialOperator,
        uint256 initialFee,
        address initialFeeRecipient,
        address definitiveAsset,
        string memory definitiveName,
        string memory definitiveSymbol
    )
        Owned(initialOwner)
        ERC4626(ERC20(definitiveAsset), definitiveName, definitiveSymbol)
        AStrategy(initialStrategy)
        AOperator(initialOperator)
        AFees(initialFee, initialFeeRecipient)
    {}

    function totalAssets() public view override returns (uint256) {
        return IStrategy(strategy).totalAssets();
    }

    function harvest() external onlyOperatorOrOwner {
        emit Harvested();

        IStrategy(strategy).harvest();

        // Collect the admin fee
        uint256 balance = ERC20(asset).balanceOf(address(this));
        uint256 fee = balance * harvestFee / MAX_BPS;

        ERC20(asset).safeTransfer(feeRecipient, fee);
    }

    function compound() external onlyOperatorOrOwner {
        emit Compounded();

        IStrategy(strategy).compound();
    }

    function beforeWithdraw(uint256 assets, uint256 shares) internal virtual override {
        IStrategy(strategy).beforeWithdraw(assets, shares);

        ERC20(asset).safeTransferFrom(strategy, address(this), assets);
    }

    function afterDeposit(uint256 assets, uint256 shares) internal virtual override {
        ERC20(asset).safeTransfer(strategy, assets);

        IStrategy(strategy).afterDeposit(assets, shares);
    }
}
