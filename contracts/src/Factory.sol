// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Owned} from "solmate/auth/Owned.sol";
import {Vault} from "./Vault.sol";

contract Factory is Owned {

    event VaultCreated(address indexed owner, address indexed asset, address vault);

    mapping(address => mapping(address => address[])) public vaults;

    constructor(address initialOwner) Owned(initialOwner) {}

    function createVault(
        address owner,
        uint256 harvestFee,
        address feeRecipient,
        address feeToken,
        address strategy,
        address operator,
        address asset,
        string memory name,
        string memory symbol
    ) public returns (address) {
        address vault = address(
            new Vault(
            owner,
            harvestFee,
            feeRecipient,
            feeToken,
            strategy,
            operator,
            asset,
            name,
            symbol)
        );

        vaults[owner][asset].push(vault);
        emit VaultCreated(owner, asset, vault);

        return vault;
    }
}
