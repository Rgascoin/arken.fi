// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";

contract HarvestTest is ApeCoinTest {
    function test_Harvest_Normal(uint256 amount) public {
        amount = bound(amount, 1e18, 10000e18);

        deal(address(apeCoin), alice, amount);

        vm.startPrank(alice);

        apeCoin.approve(address(vault), amount);
        vault.deposit(amount, alice);

        vm.stopPrank();

        vm.warp(100 days);

        vm.prank(operator);

        vault.harvest();

        assertEq(apeStaker.getApeCoinStake(address(strategy)).unclaimed, 0);

    }
}
