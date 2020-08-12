pragma solidity 0.6.5;

import "./ERC20.sol";

interface DAIERC20 is ERC20 {
    function permit(
        address holder,
        address spender,
        uint256 nonce,
        uint256 expiry,
        bool allowed,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function nonces(address holder) external view returns (uint256);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
