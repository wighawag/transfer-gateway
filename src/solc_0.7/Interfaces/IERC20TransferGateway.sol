// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;

import "../../../_lib/openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20TransferGateway {
    function transferAndCall(
        IERC20 token,
        uint256 amount,
        address to,
        bytes calldata callData
    ) external payable returns (bytes memory);

    function daiPermitTransferAndCall(
        IERC20 token,
        uint256 nonce,
        uint256 expiry,
        uint8 v,
        bytes32 r,
        bytes32 s,
        uint256 amount,
        address to,
        bytes calldata callData
    ) external payable returns (bytes memory);

    function permitTransferAndCall(
        IERC20 token,
        uint256 permitValue,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        uint256 amount,
        address to,
        bytes calldata callData
    ) external payable returns (bytes memory);

    function forward(
        IERC20 token,
        uint256 amount,
        address to,
        bytes calldata callData
    ) external payable returns (bytes memory);
}
