// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";

contract DepositTest is ApeCoinTest {
    function test_Deposit_Normal(uint256 amount) public {
        amount = bound(amount, 1e18, 10000e18);

        vm.startPrank(alice);

        deal(address(apeCoin), alice, amount);

        apeCoin.approve(address(vault), amount);
        vault.deposit(amount, alice);

        vm.stopPrank();

        assertEq(apeCoin.balanceOf(address(vault)), 0);
        assertEq(apeStaker.getApeCoinStake(address(strategy)).deposited, amount);
        assertEq(vault.balanceOf(alice), amount);
    }
}
