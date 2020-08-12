pragma solidity 0.6.5;

import "./StorageLayout.sol";

contract ActionFacet is StorageLayout {
    function save(string calldata name) external {
        _name = name;
    }

    function action() external {
        _name = string(abi.encodePacked(_name, "_1"));
    }
}
