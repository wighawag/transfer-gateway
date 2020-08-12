// SPDX-License-Identifier: GPL
pragma solidity 0.6.5;

import "@nomiclabs/buidler/console.sol";

library ALibrary {
    function twice(uint256 t) external pure returns (uint256) {
        return t * 2;
    }

    function test() external view {
        console.log("test3");
    }
}
