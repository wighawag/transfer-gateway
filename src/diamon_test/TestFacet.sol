pragma solidity 0.6.5;

import "./StorageLayout.sol";

contract TestFacet is StorageLayout {
    function saveNumber(uint256 v) external {
        _value = v;
    }

    function getNumber() external view returns (uint256) {
        return _value;
    }
}
