pragma solidity 0.6.5;

import "./ALibrary.sol";

contract AContract {
    using ALibrary for uint256;

    function times4(uint256 t) external pure returns (uint256) {
        return t.twice().twice();
    }

    function times6(uint256 t) external pure returns (uint256) {
        return t.twice().twice().twice();
    }
}
