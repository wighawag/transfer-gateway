// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;

import "../../_lib/openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../_lib/openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "../../_lib/openzeppelin/contracts/utils/Address.sol";

interface IDaiPermit {
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
}

interface IERC2612 {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function nonces(address owner) external view returns (uint256);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
}

///@notice Gateway that forwward payment information to the destination and call it.
/// This allow the receiver to know the payer, token and amount received.
/// As the gateway append data to the call, contracts can continue using normal solidity functions (abi-encoded).
/// The Gateway need to be approved for each ERC20.
/// For new contracts, they could be pre-approved it globally.
contract ERC20TransferGateway {
    using SafeERC20 for IERC20;
    using Address for address;

    ///@notice this transfers the tokens to the destination and call the function (callData).
    /// The information (sender, token, amount) is appended to the function call.
    /// This allows the recipient contract to keep using normal solidity functions (abi-encoded).
    function transferAndCall(
        IERC20 token,
        uint256 amount,
        address to,
        bytes calldata callData
    ) external payable returns (bytes memory) {
        address sender = _msgSender();
        token.safeTransferFrom(sender, to, amount);
        return _call(sender, token, amount, to, callData);
    }

    ///@notice this call permit (dai version) and transfers the tokens to the destination and call the function (callData).
    /// The information (sender, token, amount) is appended to the function call.
    /// This allows the recipient contract to keep using normal solidity functions (abi-encoded).
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
    ) external payable returns (bytes memory) {
        address sender = _msgSender();
        IDaiPermit(address(token)).permit(sender, address(this), nonce, expiry, true, v, r, s);
        token.safeTransferFrom(sender, to, amount);
        return _call(sender, token, amount, to, callData);
    }

    // address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s
    ///@notice this call permit (ERC2612 version) and transfers the tokens to the destination and call the function (callData).
    /// The information (sender, token, amount) is appended to the function call.
    /// This allows the recipient contract to keep using normal solidity functions (abi-encoded).
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
    ) external payable returns (bytes memory) {
        address sender = _msgSender();
        IERC2612(address(token)).permit(sender, address(this), permitValue, deadline, v, r, s);
        token.safeTransferFrom(sender, to, amount);
        return _call(sender, token, amount, to, callData);
    }

    ///@notice This functions is special in that it need to be called atomatically after the transfer is done.
    /// The transfer is made to the gateway itself. The gateway will then forward it to the destination.
    /// This allows the gateway to proceed without being approved first at the cost of extra gas.
    /// For the receiver, it behaves exactly like `transferERC20AndCall`.
    /// And so the information (sender, token, amount) is appended to the function call the same way.
    function forward(
        IERC20 token,
        uint256 amount,
        address to,
        bytes calldata callData
    ) external payable returns (bytes memory) {
        address sender = _msgSender();
        token.safeTransfer(to, amount);
        return _call(sender, token, amount, to, callData);
    }

    // -------------------------------
    // INTERNAL
    // -------------------------------

    function _call(
        address sender,
        IERC20 token,
        uint256 amount,
        address to,
        bytes calldata callData
    ) internal returns (bytes memory) {
        bytes memory data = abi.encodePacked(callData, abi.encode(token, amount, sender));
        return to.functionCallWithValue(data, msg.value);
    }

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }
}
