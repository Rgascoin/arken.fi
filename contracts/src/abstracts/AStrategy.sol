// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.20;

import {Owned} from "solmate/auth/Owned.sol";
import {Errors} from "../utils/Errors.sol";

abstract contract AStrategy is Owned {
    event StrategyUpdated(address oldStrategy, address newStrategy);

    address public strategy;

    constructor(address initialStrategy) {
        if (initialStrategy == address(0)) revert Errors.ZeroAddress();

        strategy = initialStrategy;
    }

    function setStrategy(address newStrategy) external onlyOwner {
        if (newStrategy == address(0)) revert Errors.ZeroAddress();

        address oldStrategy = strategy;
        strategy = newStrategy;

        emit StrategyUpdated(oldStrategy, newStrategy);
    }
}
