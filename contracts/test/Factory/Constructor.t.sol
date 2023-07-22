// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.20;

import "./FactoryTest.sol";

contract Constructor is FactoryTest {
    function test_constructor_Normal() public {
        assertEq(factory.owner(), owner);
    }
}
