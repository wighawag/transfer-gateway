// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract BaseERC20TransferRecipient {
    address internal immutable _erc20TransferGateway;

    constructor(address erc20TransferGateway) {
        _erc20TransferGateway = erc20TransferGateway;
    }

    function _getTokenTransfer()
        internal
        view
        returns (
            address token,
            uint256 amount,
            address sender
        )
    {
        sender = msg.sender;
        if (sender == _erc20TransferGateway) {
            return _extractTokenTransfer(msg.data);
        }
    }

    function _extractTokenTransfer(bytes memory data)
        internal
        pure
        returns (
            address token,
            uint256 amount,
            address sender
        )
    {
        uint256 length = data.length;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            sender := mload(sub(add(data, length), 0x0))
            amount := mload(sub(add(data, length), 0x20))
            token := mload(sub(add(data, length), 0x40))
        }
    }
}
