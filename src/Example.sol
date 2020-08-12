pragma solidity 0.6.5;

import "@nomiclabs/buidler/console.sol";
import "./Greeter.sol";
import "buidler-deploy/solc_0.6/proxy/Proxied.sol";

contract Example is Proxied {
    function greet() public view returns (string memory) {
        return string(abi.encodePacked(_greeter.greet(), " : ", uint2str(_v)));
    }

    function uint2str(uint256 _i)
        private
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }

        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }

        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }

        return string(bstr);
    }

    function mint() external {
        _nextMintId++;
    }

    // ///////////////////////////// STORAGE ///////////////////////////////////

    Greeter internal _greeter;
    uint256 internal _v;
    uint256 internal _nextMintId;

    // ///////////////////////////// CONSTRUCTOR / UPGRADE //////////////////////////////

    function postUpgrade(Greeter greeter) public proxied {
        // guard to allow constructor like behavior
        if (_nextMintId == 0) {
            _nextMintId = 1; // allow to mintId to start at 1. the gaurd ensure it is never reset
        }
        _greeter = greeter;
        _v++;
        console.log("postUpgrade", _v);
        console.logAddress(address(this));
    }

    constructor(Greeter greeter) public {
        postUpgrade(greeter);
    }
}
