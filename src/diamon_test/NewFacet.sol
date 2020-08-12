pragma solidity 0.6.5;

import "./StorageLayout.sol";

contract NewFacet is StorageLayout {
    function hello2(string calldata name)
        external
        view
        returns (string memory)
    {
        return string(abi.encodePacked("hello2 ", name));
    }
}
