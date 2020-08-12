pragma solidity 0.6.5;

interface ERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256 supply);

    function balanceOf(address who) external view returns (uint256 balance);

    function transfer(address to, uint256 value) external returns (bool success);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool success);

    function approve(address spender, uint256 value) external returns (bool success);

    function allowance(address owner, address spender) external view returns (uint256 amount);
}
