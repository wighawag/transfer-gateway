pragma solidity 0.6.5;

import "./Interfaces/ERC20.sol";

/* TODO is MetaTransactionReceiver */
contract ERC20TransferGateway {
    function transferERC20AndCall(
        ERC20 token,
        uint256 amount,
        address to,
        bytes calldata callData
    ) external {
        address sender = msg.sender; // TODO use _msgSender() from MetaTransactionReceiver
        _transferERC20(sender, token, amount, to);
        _call(sender, token, amount, to, callData);
    }

    //////////////////////////// INTERNAL /////////////////////////////
    function _transferERC20(
        address sender,
        ERC20 token,
        uint256 amount,
        address to
    ) internal {
        require(
            token.transferFrom(sender, to, amount),
            "ERC20_TRANSFER_FAILED"
        ); // TODO support non-standard ERC20
    }

    function _call(
        address sender,
        ERC20 token,
        uint256 amount,
        address to,
        bytes memory callData
    ) internal {
        (bool success, ) = to.call(
            // append the transfer data with sender at the end (EIP-2771)
            abi.encodePacked(callData, abi.encode(token, amount, sender))
        );
        if (!success) {
            assembly {
                let returnDataSize := returndatasize()
                returndatacopy(0, 0, returnDataSize)
                revert(0, returnDataSize)
            }
        }
    }
}
