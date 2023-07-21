// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

interface IStrategy {
    function beforeWithdraw(uint256 assets, uint256 shares) external;
    function afterDeposit(uint256 assets, uint256 shares) external;
    function harvest(bytes[] calldata data) external returns (uint256);
    function compound(bytes[] calldata data) external;
}
