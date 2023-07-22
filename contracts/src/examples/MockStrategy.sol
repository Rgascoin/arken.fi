// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {IStrategy} from "../interfaces/IStrategy.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {Errors} from "../utils/Errors.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol, decimals) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract MockStaker {
    using SafeTransferLib for MockERC20;

    MockERC20 public asset;

    mapping(address => uint256) public balanceOf;

    constructor(address definitiveAsset) {
        asset = MockERC20(definitiveAsset);
    }

    function stake(uint256 _amount) external {
        balanceOf[msg.sender] += _amount;
        asset.safeTransferFrom(msg.sender, address(this), _amount);
    }

    function unstake(uint256 _amount) external {
        balanceOf[msg.sender] -= _amount;
        asset.safeTransfer(msg.sender, _amount);
    }

    function claim() external {
        asset.mint(msg.sender, balanceOf[msg.sender]);
    }
}

contract MockStrategy is IStrategy, Owned {
    using SafeTransferLib for ERC20;

    event OwnerUpdated(address oldOwner, address newOwner);

    address public staker;
    address public asset;
    address public vault;

    constructor(address initialOwner, address definitiveStaker, address definitiveAsset) Owned(initialOwner) {
        staker = definitiveStaker;
        asset = definitiveAsset;

        ERC20(asset).safeApprove(staker, type(uint256).max);
    }

    function setVault(address newVault) external onlyOwner {
        if (newVault == address(0)) revert Errors.ZeroAddress();

        address oldVault = vault;
        vault = newVault;

        ERC20(asset).safeApprove(vault, type(uint256).max);

        emit OwnerUpdated(oldVault, newVault);
    }

    function beforeWithdraw(uint256 assets, uint256 /* shares */ ) external override {
        MockStaker(staker).unstake(assets);
    }

    function afterDeposit(uint256 assets, uint256 /* shares */ ) external override {
        MockStaker(staker).stake(assets);
    }

    function harvest() external override {
        MockStaker(staker).claim();
    }

    function compound() external override {
        MockStaker(staker).stake(MockStaker(staker).balanceOf(address(this)));
    }

    function totalAssets() external view returns (uint256) {
        return MockStaker(staker).balanceOf(address(this));
    }
}
