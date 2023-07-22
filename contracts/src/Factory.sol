// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Owned} from "solmate/auth/Owned.sol";
import {Vault} from "./Vault.sol";

contract Factory is Owned {
    event VaultCreated(address indexed owner, address indexed asset, address vault);

    struct VaultInfo {
        address vault;
        uint256 interval;
    }

    mapping(address admin => mapping(address token => VaultInfo[] vaults)) public vaultsMapping;
    address[] public vaults;

    constructor(address initialOwner) Owned(initialOwner) {}

    function getAdminVaults(address admin) public view returns (address[] memory) {
        uint256 length = 0;
        for (uint256 i = 0; i < vaults.length; ++i) {
            if (Vault(vaults[i]).owner() == admin) {
                ++length;
            }
        }

        address[] memory adminVaults = new address[](length);
        uint256 index = 0;
        for (uint256 i = 0; i < vaults.length; ++i) {
            if (Vault(vaults[i]).owner() == admin) {
                adminVaults[index] = vaults[i];
                ++index;
            }
        }
        return adminVaults;
    }

    function getVaults() public view returns (address[] memory) {
        return vaults;
    }

    function getDepositedVaults(address user) public view returns (address[] memory) {
        uint256 length = 0;
        for (uint256 i = 0; i < vaults.length; ++i) {
            if (Vault(vaults[i]).balanceOf(user) > 0) {
                ++length;
            }
        }

        address[] memory depositedVaults = new address[](length);
        uint256 index = 0;
        for (uint256 i = 0; i < vaults.length; ++i) {
            if (Vault(vaults[i]).balanceOf(user) > 0) {
                depositedVaults[index] = vaults[i];
                ++index;
            }
        }
        return depositedVaults;
    }

    function createVault(
        address owner,
        address strategy,
        address operator,
        uint256 fee,
        address feeRecipient,
        uint256 interval,
        address asset,
        string memory name,
        string memory symbol
    ) public returns (address) {
        address vault = address(
            new Vault(
            owner,
            strategy,
            operator,
            fee,
            feeRecipient,
            asset,
            name,
            symbol)
        );

        vaultsMapping[owner][asset].push(VaultInfo(vault, interval));
        vaults.push(vault);
        emit VaultCreated(owner, asset, vault);

        return vault;
    }
}
