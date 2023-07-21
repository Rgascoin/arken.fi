// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.20;

import {Owned} from "solmate/auth/Owned.sol";
import {Errors} from "../utils/Errors.sol";

abstract contract AFees is Owned {
    event HarvestFeeUpdated(uint256 oldHarvestFee, uint256 newHarvestFee);
    event FeeRecipientUpdated(address oldFeeRecipient, address newFeeRecipient);
    event FeeTokenUpdated(address oldFeeToken, address newFeeToken);

    uint256 public constant MAX_BPS = 10_000;

    uint256 public harvestFee;
    address public feeRecipient;
    address public feeToken;

    constructor(uint256 initialHarvestFee, address initialFeeRecipient, address initialFeeToken) {
        if (initialFeeRecipient == address(0) || initialFeeToken == address(0)) revert Errors.ZeroAddress();
        if (initialHarvestFee > MAX_BPS) {
            revert Errors.InvalidFee();
        }

        harvestFee = initialHarvestFee;
        feeRecipient = initialFeeRecipient;
        feeToken = initialFeeToken;
    }

    function setHarvestFee(uint256 newHarvestFee) external virtual onlyOwner {
        if (newHarvestFee > MAX_BPS) {
            revert Errors.InvalidFee();
        }

        uint256 oldHarvestFee = harvestFee;
        harvestFee = newHarvestFee;

        emit HarvestFeeUpdated(oldHarvestFee, newHarvestFee);
    }

    function setFeeRecipient(address newFeeRecipient) external virtual onlyOwner {
        if (newFeeRecipient == address(0)) revert Errors.ZeroAddress();

        address oldFeeRecipient = feeRecipient;
        feeRecipient = newFeeRecipient;

        emit FeeRecipientUpdated(oldFeeRecipient, newFeeRecipient);
    }

    function setFeeToken(address newFeeToken) external virtual onlyOwner {
        if (newFeeToken == address(0)) revert Errors.ZeroAddress();

        address oldFeeToken = feeToken;
        feeToken = newFeeToken;

        emit FeeTokenUpdated(oldFeeToken, newFeeToken);
    }
}
