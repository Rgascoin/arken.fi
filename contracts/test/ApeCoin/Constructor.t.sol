// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./ApeCoinTest.sol";

contract Constructor is ApeCoinTest {
    function test_constructor_Normal() public {
        assertEq(vault.owner(), owner);
        assertEq(address(vault.asset()), address(apeCoin));
        assertEq(vault.strategy(), address(strategy));
        assertEq(vault.feeRecipient(), owner);
        assertEq(vault.harvestFee(), 500);
        assertEq(vault.operator(), operator);
    }

    function test_constructor_InvalidFee() public {
        vm.expectRevert();
        factory.createVault(
            owner, address(strategy), operator, 100000, owner, 1 weeks, address(apeCoin), "wstkAPE Token", "wstkAPE"
        );
    }

    function test_constructor_ZeroAddressStrategy() public {
        vm.expectRevert();
        factory.createVault(
            owner, zero, operator, 500, owner, 1 weeks, address(apeCoin), "wstkAPE Token", "wstkAPE"
        );
    }

    function test_constructor_ZeroAddressOperator() public {
        vm.expectRevert();
        factory.createVault(
            owner, address(strategy), zero, 500, owner, 1 weeks, address(apeCoin), "wstkAPE Token", "wstkAPE"
        );
    }

    function test_constructor_ZeroAddressFeeRecipient() public {
        vm.expectRevert();
        factory.createVault(
            owner, address(strategy), operator, 500, zero, 1 weeks, address(apeCoin), "wstkAPE Token", "wstkAPE"
        );
    }

    function test_constructor_ZeroAddressAsset() public {
        vm.expectRevert();
        factory.createVault(
            owner, address(strategy), operator, 500, owner, 1 weeks, zero, "wstkAPE Token", "wstkAPE"
        );
    }
}