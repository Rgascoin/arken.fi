// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";
import {Errors} from "../../src/utils/Errors.sol";

contract SetFeeRecipient is ApeCoinTest {
    function test_setFeeRecipient_Normal(address recipient) public {
        vm.assume(recipient != address(0));

        vm.prank(owner);
        vault.setFeeRecipient(recipient);
        assertEq(vault.feeRecipient(), recipient, "FeeRecipient should be recipient");
    }

    function test_setFeeRecipient_NotOwner(address recipient) public {
        vm.assume(recipient != address(0));

        vm.prank(alice);
        vm.expectRevert("UNAUTHORIZED");
        vault.setFeeRecipient(recipient);
    }

    function test_setFeeRecipient_ZeroAddress() public {
        vm.expectRevert(Errors.ZeroAddress.selector);
        vm.prank(owner);
        vault.setFeeRecipient(address(0));
    }
}
