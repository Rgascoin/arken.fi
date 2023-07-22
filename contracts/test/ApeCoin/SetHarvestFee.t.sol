// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";

contract SetHarvestFee is ApeCoinTest {
    function test_setHarvestFee_Normal(uint256 amount) public {
        amount = bound(amount, 0, vault.MAX_BPS());

        vm.prank(owner);
        vault.setHarvestFee(amount);
        assertEq(vault.harvestFee(), amount, "HarvestFee should be amount");
    }

    function test_setHarvestFee_NotOwner(uint256 amount) public {
        amount = bound(amount, 0, vault.MAX_BPS());

        vm.prank(alice);
        vm.expectRevert("UNAUTHORIZED");
        vault.setHarvestFee(amount);
    }

    function test_setHarvestFee_InvalidFee(uint256 amount) public {
        amount = bound(amount, vault.MAX_BPS() + 1, UINT256_MAX);

        vm.expectRevert(Errors.InvalidFee.selector);
        vm.prank(owner);
        vault.setHarvestFee(amount);
    }
}
