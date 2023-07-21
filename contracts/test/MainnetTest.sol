// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.20;

import "./BaseTest.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract MainnetTest is BaseTest {
    function setUp() public virtual {}

    function forkMainnet() public {
        vm.createSelectFork(vm.rpcUrl("ethereum_mainnet"), 17_544_699);
    }
}
