// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";

contract WithdrawTest is ApeCoinTest {
    function test_Withdraw_Normal(uint256 amount) public {
        amount = bound(amount, 1e18, 10000e18);

        vm.startPrank(alice);

        deal(address(apeCoin), alice, amount);

        apeCoin.approve(address(vault), amount);
        vault.deposit(amount, alice);

        vault.withdraw(amount, alice, alice);
        vm.stopPrank();

        assertEq(apeCoin.balanceOf(address(vault)), 0);
        assertEq(apeStaker.getApeCoinStake(address(strategy)).deposited, 0);
        assertEq(vault.balanceOf(alice), 0);
        assertEq(apeCoin.balanceOf(alice), amount);
    }
}
