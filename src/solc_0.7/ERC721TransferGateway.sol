// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;
pragma experimental ABIEncoderV2;

import "../../_lib/openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../../_lib/openzeppelin/contracts/utils/Address.sol";

///@notice Gateway that forwward erc721 token transfers to the destination and call it.
/// This allow the receiver to know the sender and tokens received.
/// As the gateway append data to the call, contracts can continue using normal solidity functions (abi-encoded).
/// The Gateway need to be approved for each token contract.
/// For new contracts, they could be pre-approved it globally.
contract ERC721TransferGateway {
    using Address for address;

    struct TransfersPerContract {
        IERC721 tokenContract;
        uint256[] tokens;
    }

    ///@notice this transfers the tokens to the destination and call the function (callData).
    /// The information (sender, tokenTransfers) is appended to the function call.
    /// This allows the recipient contract to keep using normal solidity functions (abi-encoded).
    function transferAndCall(
        TransfersPerContract[] memory tokenTransfers, // TODO solidity upgrade to use calldata instead of memory
        address to,
        bytes calldata callData
    ) external payable returns (bytes memory) {
        address sender = _msgSender();
        for (uint256 i = 0; i < tokenTransfers.length; i++) {
            for (uint256 j = 0; j < tokenTransfers[i].tokens.length; j++) {
                tokenTransfers[i].tokenContract.transferFrom(sender, to, tokenTransfers[i].tokens[j]);
            }
        }
        return _call(sender, tokenTransfers, to, callData);
    }

    ///@notice This functions is special in that it need to be called atomatically after the transfers are done.
    /// The transfers are made to the gateway itself before hand. The gateway will then forward them to the destination.
    /// This allows the gateway to proceed without being approved first at the cost of extra gas.
    /// For the receiver, it behaves exactly like `transferAndCall`.
    /// And so the information (sender, tokenTransfers) is appended to the function call the same way.
    function forward(
        TransfersPerContract[] memory tokenTransfers, // TODO solidity upgrade to use calldata instead of memory
        address to,
        bytes calldata callData
    ) external payable returns (bytes memory) {
        address sender = _msgSender();
        for (uint256 i = 0; i < tokenTransfers.length; i++) {
            for (uint256 j = 0; j < tokenTransfers[i].tokens.length; j++) {
                tokenTransfers[i].tokenContract.transferFrom(address(this), to, tokenTransfers[i].tokens[j]);
            }
        }
        return _call(sender, tokenTransfers, to, callData);
    }

    // -------------------------------
    // INTERNAL
    // -------------------------------

    function _call(
        address sender,
        TransfersPerContract[] memory tokenTransfers,
        address to,
        bytes calldata callData
    ) internal returns (bytes memory) {
        bytes memory data = abi.encodePacked(callData, abi.encode(tokenTransfers, sender));
        return to.functionCallWithValue(data, msg.value);
    }

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }
}
