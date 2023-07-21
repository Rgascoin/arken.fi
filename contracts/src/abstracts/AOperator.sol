// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.20;

import {Owned} from "solmate/auth/Owned.sol";
import {Errors} from "../utils/Errors.sol";

abstract contract AOperator is Owned {
    event OperatorUpdated(address oldOperator, address newOperator);

    address public operator;

    modifier onlyOperatorOrOwner() {
        if (msg.sender != operator && msg.sender != owner) revert Errors.NotOperatorNorOwner();
        _;
    }

    constructor(address initialOperator) {
        if (initialOperator == address(0)) revert Errors.ZeroAddress();

        operator = initialOperator;
    }

    function setOperator(address newOperator) external onlyOwner {
        if (newOperator == address(0)) revert Errors.ZeroAddress();

        address oldOperator = operator;
        operator = newOperator;

        emit OperatorUpdated(oldOperator, newOperator);
    }
}
