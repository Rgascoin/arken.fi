// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";

contract RedeemTest is ApeCoinTest {
    function test_Redeem_Normal(uint256 amount) public {
        amount = bound(amount, 1e18, 10000e18);

        vm.startPrank(alice);

        deal(address(apeCoin), alice, amount);

        apeCoin.approve(address(vault), amount);
        vault.deposit(amount, alice);

        vault.redeem(amount, alice, alice);
        vm.stopPrank();

        assertEq(apeCoin.balanceOf(address(vault)), 0);
        assertEq(apeStaker.getApeCoinStake(address(strategy)).deposited, 0);
        assertEq(vault.balanceOf(alice), 0);
        assertEq(apeCoin.balanceOf(alice), amount);
    }

    function test_Redeem_Zero() public {
        vm.startPrank(alice);

        apeCoin.approve(address(vault), 0);

        vm.expectRevert("ZERO_ASSETS");
        vault.redeem(0, alice, alice);

        vm.stopPrank();
    }
}
