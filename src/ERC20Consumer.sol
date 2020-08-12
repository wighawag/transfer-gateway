pragma solidity 0.6.5;

import "./ERC20TransferGateway.sol";
import "./Interfaces/ERC20.sol";

contract ERC20Consumer {
    function purchase(uint256 id) external {
        address sender = msg.sender;
        if (sender == address(_erc20TransferGateway)) {
            (address token, uint256 amount, address transferSender) = _extract(
                msg.data
            );
            require(token == address(_token), "UNEXPECTED_ERC20_TOKEN");
            require(amount == _price, "UNEXPECTED_AMOUNT"); // Alternative: reimburse the diff but fails on less
            sender = transferSender;
        } else {
            require(
                _token.transferFrom(sender, address(this), _price),
                "ERC20_TRANSFER_FAILED"
            ); // TODO suppport non-standard erc20
        }
        // at this point the purchase has been paid and `sender` is the purchaser
    }

    // ////////////////////////// INTERNAL /////////////////////////

    function _extract(bytes memory data)
        internal
        returns (
            address token,
            uint256 amount,
            address transferSender
        )
    {
        uint256 length = data.length;
        assembly {
            transferSender := mload(sub(add(data, length), 0x0))
            amount := mload(sub(add(data, length), 0x20))
            token := mload(sub(add(data, length), 0x40))
        }
    }

    constructor(
        ERC20TransferGateway erc20TransferGateway,
        address token,
        uint256 price
    ) public {
        _erc20TransferGateway = erc20TransferGateway;
        _token = ERC20(token);
        _price = price;
    }

    ERC20TransferGateway _erc20TransferGateway;
    uint256 _price;
    ERC20 _token;
}
