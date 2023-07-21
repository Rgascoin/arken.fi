// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../MainnetTest.sol";
import "../Factory/FactoryTest.sol";
import {IApeStaker} from "./interfaces/IApeStaker.sol";
import {ApeCoinStrategy} from "../../src/examples/ApeCoinStrategy.sol";

contract ApeCoinTest is MainnetTest, FactoryTest {
    IApeStaker public constant apeStaker = IApeStaker(0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9);
    IERC20 public constant apeCoin = IERC20(0x4d224452801ACEd8B2F0aebE155379bb5D594381);

    Vault vault;
    ApeCoinStrategy strategy;

    function setUp() public virtual override(MainnetTest, FactoryTest) {
        forkMainnet();

        super.setUp();

        vm.startPrank(owner);

        strategy = new ApeCoinStrategy(owner, address(apeStaker), address(apeCoin));

        vault = Vault(factory.createVault(owner, address(strategy), operator, 500, owner, address(apeCoin), "wstkAPE Token", "wstkAPE"));

        strategy.setVault(address(vault));
        vm.stopPrank();
    }
}
