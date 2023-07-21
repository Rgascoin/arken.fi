// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

interface IStrategy {
    function beforeWithdraw(uint256 assets, uint256 shares) external;
    function afterDeposit(uint256 assets, uint256 shares) external;
    function harvest() external;
    function compound() external;
    function totalAssets() external view returns (uint256);
}
