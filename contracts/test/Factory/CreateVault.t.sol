// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.20;

import "./FactoryTest.sol";

contract CreateVault is FactoryTest {
    function test_createVault_Normal() public {
        assertEq(factory.owner(), owner);
    }
}
