// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// @dev UI focused payload
struct DashboardStake {
    uint256 poolId;
    uint256 tokenId;
    uint256 deposited;
    uint256 unclaimed;
    uint256 rewards24hr;
    DashboardPair pair;
}

struct DashboardPair {
    uint256 mainTokenId;
    uint256 mainTypePoolId;
}

interface IApeStaker {
    function getApeCoinStake(address _address) external view returns (DashboardStake memory);
}
