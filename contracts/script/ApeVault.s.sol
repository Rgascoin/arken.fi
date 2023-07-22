// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "forge-std/Script.sol";

import {Factory} from "../src/Factory.sol";
import {ApeCoinStrategy} from "../src/examples/ApeCoinStrategy.sol";
import {Vault} from "../src/Vault.sol";

contract ApeVaultScript is Script {
    Factory factory;
    address operator;

    address public constant apeStaker = 0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9;
    address public constant apeCoin = 0x4d224452801ACEd8B2F0aebE155379bb5D594381;

    function setUp() public {
        factory = Factory(vm.envAddress("FACTORY_ADDRESS"));
        operator = makeAddr("operator");
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.rememberKey(deployerPrivateKey);
        vm.startBroadcast(deployer);

        ApeCoinStrategy strategy = new ApeCoinStrategy(deployer, address(apeStaker), address(apeCoin));
        console.log("Strategy deployed at: %s", address(strategy));

        Vault vault = Vault(
            factory.createVault(
                deployer,
                address(strategy),
                operator,
                500,
                deployer,
                1 weeks,
                address(apeCoin),
                "wstkAPE Token",
                "wstkAPE"
            )
        );
        console.log("Vault deployed at: %s", address(vault));

        strategy.setVault(address(vault));

        vm.stopBroadcast();
    }
}
