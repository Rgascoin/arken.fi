// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "forge-std/Script.sol";

import {Factory} from "../src/Factory.sol";
import {MockStrategy, MockERC20, MockStaker} from "../src/examples/MockStrategy.sol";
import {Vault} from "../src/Vault.sol";

contract MockVaultScript is Script {
    Factory factory;
    address operator;

    function setUp() public {
        factory = Factory(vm.envAddress("FACTORY_ADDRESS"));
        operator = 0x0Fe0698eD8B2a8Fd04aF7FE9C6A06726E7746528;
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.rememberKey(deployerPrivateKey);
        vm.startBroadcast(deployer);

        MockERC20 token = new MockERC20("Mock Token", "MOCK", 18);
        MockStaker staker = new MockStaker(address(token));
        MockStrategy strategy = new MockStrategy(deployer, address(staker), address(token));

        console.log("Strategy deployed at: %s", address(strategy));
        console.log("Token deployed at: %s", address(token));
        console.log("Staker deployed at: %s", address(staker));

        Vault vault = Vault(
            factory.createVault(
                deployer,
                address(strategy),
                operator,
                500,
                deployer,
                1 minutes,
                address(token),
                "Mock Token",
                "wMOCK"
            )
        );
        console.log("Vault deployed at: %s", address(vault));

        strategy.setVault(address(vault));

        vm.stopBroadcast();
    }
}
