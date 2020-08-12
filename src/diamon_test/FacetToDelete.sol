pragma solidity 0.6.5;

contract FacetToDelete {
    function hello(string calldata name) external view returns (string memory) {
        return string(abi.encodePacked("hello : ", name));
    }
}
