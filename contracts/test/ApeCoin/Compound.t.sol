// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";

contract CompoundTest is ApeCoinTest {
    function test_Compound_Normal(uint256 amount, uint256 topUpAmount) public {
        amount = bound(amount, 1e18, 10000e18);
        topUpAmount = bound(topUpAmount, 1e18, 10000e18);

        deal(address(apeCoin), alice, amount);

        vm.startPrank(alice);

        apeCoin.approve(address(vault), amount);
        vault.deposit(amount, alice);

        vm.stopPrank();

        deal(address(apeCoin), address(strategy), topUpAmount);

        vm.prank(operator);

        vault.compound();

        assertEq(apeStaker.getApeCoinStake(address(strategy)).deposited, amount + topUpAmount);

    }
}
