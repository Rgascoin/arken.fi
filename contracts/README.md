# Contracts

This directory contains the smart contracts for the project using foundry development framework.

## Contracts

### Vault

The vault contract is the main contract of the project. It is an ERC20 token that represents the shares of the vault. It is deployed by the factory contract.

### Factory

The factory contract is used to deploy vaults.

### IStrategy

The IStrategy interface is used to implement strategies. It is used by the vault contract to interact with the strategy.
It had a MockStrategy implementation that can be used for testing and an ApeCoinStrategy that showcase an vault of the apecoin in ethereum mainnet.


## Deploy

To deploy the contracts, you need to create a `.env` file with the following variables:

```
MAINNET_RPC_URL=
GOERLI_RPC_URL=
PRIVATE_KEY=

MANTLE_RPC_URL=https://rpc.testnet.mantle.xyz
NEON_RPC_URL=https://devnet.neonevm.org/
GNOSIS_RPC_URL=https://rpc.chiadochain.net

# Factory address to create new vaults
FACTORY_ADDRESS=
````

Then, you can run the following command:

```
make deployGoerli
```

## Test

To run the tests, you need to have MAINNET_RPC_URL set in your `.env` file.

Then, you can run the following command:

```
make test
```