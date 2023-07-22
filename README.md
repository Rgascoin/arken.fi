# <h1 align="center"> Arkan.fi </h1>

<p align="center">
    <img src="./.github/assets/logo.png" style="border-radius:1%" alt="">
</p>

<p align="center">
    Premissionless auto compounder factory to let anyone deploy their own auto compounder without any difficulty on top of any ERC20.
</p>

## Motivation

This project offers a user-friendly solution for deploying personalized auto compounding tools on various yield-bearing assets. The primary focus is to cater to DeFi protocols looking to benefit from auto compounding without the high costs of extensive development and research.

To achieve this, the protocol can easily deploy their own strategy using a simple Solidity interface, consisting of four functions that we provide. Then, they can use our protocol to create a customized vault following the ERC4626 standard, which enhances compatibility with other DeFi protocols.

The last step to enable the auto compounder is to fund the operator by sending native tokens to it.

Once the vault is set up, it becomes accessible to all users through our interface, allowing them to conveniently deposit and withdraw funds. In the background, we handle the process of harvesting rewards and compounding them at regular intervals, as determined by the admin's preferences.

### Architecture

The project has three main components:
- The contracts that make up the protocol in solidity [(in the contracts folder)](contracts/README.md)
- The front-end interface for users [(in the front-end folder)](front-end/README.md)
- The operator server that handles the auto compounding [(in the operator folder)](operator/README.md)

## How to use

### Deploying a strategy

To deploy a strategy, you need to implement the following interface:

```solidity

interface IStrategy {
    function beforeWithdraw(uint256 assets, uint256 shares) external;
    function afterDeposit(uint256 assets, uint256 shares) external;
    function harvest() external;
    function compound() external;
    function totalAssets() external view returns (uint256);
}

```

The `beforeWithdraw` and `afterDeposit` functions are called before and after a user withdraws or deposits funds, respectively. The `harvest` function is called when the operator harvests the rewards. The `compound` function is called when the operator compounds the rewards. The `totalAssets` function returns the total amount of assets held by the strategy.

### Deploy a vault

You can now use the frontend to deploy a vault. You need to provide the following information:
- The strategy address
- The name of the vault
- The symbol of the vault
- The asset inside the vault
- The operator address givent to you by the operator server
- The admin address
- The harvest fee
- The fee recipient address

## Addresses

Here are the addresses for the deployed contracts:

### Factory

- mantle address: [0x9D56902F43E958E3605CFb0F8BEDA79717a1496F](https://explorer.testnet.mantle.xyz/address/0x9D56902F43E958E3605CFb0F8BEDA79717a1496F/contracts#address-tabs)
- gnosischain address: [0x836f2bed29187b97fc00d087b83ed40b1290829a](https://gnosis-chiado.blockscout.com/address/0x836F2bed29187B97FC00D087b83Ed40B1290829a)
- neon evm address: [0xe8A56109b80E521Ed407e3DbE41164b1fc5e8E2f](https://neonscan.org/address/0xe8A56109b80E521Ed407e3DbE41164b1fc5e8E2f)
- goerli address: [0xE493Aa5AFa3a93689C6CEA491821D7c777534949](https://goerli.etherscan.io/address/0xE493Aa5AFa3a93689C6CEA491821D7c777534949)
