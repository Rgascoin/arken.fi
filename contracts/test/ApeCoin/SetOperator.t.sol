// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";
import {Errors} from "../../src/utils/Errors.sol";

contract SetOperator is ApeCoinTest {
    function test_setOperator_Normal(address newOperator) public {
        vm.assume(newOperator != address(0));

        vm.prank(owner);
        vault.setOperator(newOperator);
        assertEq(vault.operator(), newOperator, "Operator should be newOperator");
    }

    function test_setOperator_NotOwner(address newOperator) public {
        vm.assume(newOperator != address(0));

        vm.prank(alice);
        vm.expectRevert("UNAUTHORIZED");
        vault.setOperator(newOperator);
    }

    function test_setOperator_ZeroAddress() public {
        vm.expectRevert(Errors.ZeroAddress.selector);
        vm.prank(owner);
        vault.setOperator(address(0));
    }
}
