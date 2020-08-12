pragma solidity 0.6.5;

import "@nomiclabs/buidler/console.sol";

contract Greeter {
    string greeting;
    address _admin;

    constructor(string memory _greeting) public {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
        _admin = msg.sender;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
        revert("testing error blocking");
    }

    function setGreetingThatWorks(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }

    function getAdmin() external view returns (address admin) {
        return _admin;
    }

    function setAdmin(address newAdmin) external {
        require(msg.sender == _admin, "NOT_AUTHORIZED_ADMIN");
        _admin = newAdmin;
    }
}
