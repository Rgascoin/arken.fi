// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Owned} from "solmate/auth/Owned.sol";
import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {AFees} from "./abstracts/AFees.sol";
import {AOperator} from "./abstracts/AOperator.sol";
import {AStrategy} from "./abstracts/AStrategy.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";

contract Vault is Owned, ERC4626, AFees, AStrategy, AOperator {
    constructor(
        address initialOwner,
        uint256 initialHarvestFee,
        address initialFeeRecipient,
        address initialFeeToken,
        address initialStrategy,
        address initialOperator,
        address definitiveAsset,
        string memory definitiveName,
        string memory definitiveSymbol
    )
        Owned(initialOwner)
        ERC4626(ERC20(definitiveAsset), definitiveName, definitiveSymbol)
        AFees(initialHarvestFee, initialFeeRecipient, initialFeeToken)
        AStrategy(initialStrategy)
        AOperator(initialOperator)
    {}

    function totalAssets() public view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function harvest(bytes[] calldata data) external onlyOperatorOrOwner {
        (bool success, bytes memory result) = strategy.delegatecall(abi.encodeWithSignature("harvest(bytes[])", data));

        if (!success) {
            revert(string(result));
        }
    }

    function compound(bytes[] calldata data) external onlyOperatorOrOwner {
        (bool success, bytes memory result) = strategy.delegatecall(abi.encodeWithSignature("compound(bytes[])", data));

        if (!success) {
            revert(string(result));
        }
    }

    function beforeWithdraw(uint256 assets, uint256 shares) internal virtual override {
        (bool success, bytes memory result) =
            strategy.delegatecall(abi.encodeWithSignature("beforeWithdraw(uint256,uint256)", assets, shares));

        if (!success) {
            revert(string(result));
        }
    }

    function afterDeposit(uint256 assets, uint256 shares) internal virtual override {
        (bool success, bytes memory result) =
            strategy.delegatecall(abi.encodeWithSignature("afterDeposit(uint256,uint256)", assets, shares));

        if (!success) {
            revert(string(result));
        }
    }
}
