// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";

contract TotalAssets is ApeCoinTest {
    function test_totalAssets_Normal(uint256 amount) public {
        amount = bound(amount, 1e18, 10000e18);

        deal(address(apeCoin), address(alice), amount);

        vm.startPrank(alice);

        apeCoin.approve(address(vault), amount);
        vault.deposit(amount, alice);

        vm.stopPrank();

        assertEqDecimal(vault.totalAssets(), amount, 18);
    }
}
