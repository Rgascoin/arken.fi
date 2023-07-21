// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.20;

import {Errors} from "../src/utils/Errors.sol";
import "forge-std/Test.sol";

contract BaseTest is Test {
    // Useful addresses
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address admin = makeAddr("admin");
    address owner = makeAddr("owner");
    address zero = address(0);
    address operator = makeAddr("operator");
}
