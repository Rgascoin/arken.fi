// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.20;

import "../BaseTest.sol";
import {Factory} from "../../src/Factory.sol";
import {Vault} from "../../src/Vault.sol";

contract FactoryTest is BaseTest {
    Factory factory;

    function setUp() public virtual {
        vm.prank(owner);
        factory = new Factory(owner);
    }
}
