// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;

import "./BaseERC20.sol";
import "../Interfaces/IDAIERC20.sol";

contract DAIWithInitialBalance is BaseERC20, IDAIERC20 {
    // bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address holder,address spender,uint256 nonce,uint256 expiry,bool allowed)");
    bytes32 internal constant PERMIT_TYPEHASH = 0xea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb;

    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
        return _DOMAIN_SEPARATOR;
    }

    function nonces(address owner) external view override returns (uint256) {
        return _nonces[owner];
    }

    function permit(
        address holder,
        address spender,
        uint256 nonce,
        uint256 expiry,
        bool allowed,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                _DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, holder, spender, nonce, expiry, allowed))
            )
        );

        require(holder != address(0), "Dai/invalid-address-0");
        require(holder == ecrecover(digest, v, r, s), "Dai/invalid-permit");
        require(expiry == 0 || block.timestamp <= expiry, "Dai/permit-expired");
        require(nonce == _nonces[holder]++, "Dai/invalid-nonce");
        uint256 wad = allowed ? uint256(-1) : 0;
        _allowances[holder][spender] = wad;
        emit Approval(holder, spender, wad);
    }

    // /////////////////////////////////// STORAGE SLOTS /////////////////////////////////////////

    /*immutable*/
    bytes32 internal _DOMAIN_SEPARATOR;
    mapping(address => uint256) internal _nonces;

    // //////////////////////////////////// CONSTRUCTOR ///////////////////////////////////////////

    constructor(
        uint256 supply,
        uint256 initialIndividualSupply,
        address gateway
    ) BaseERC20(supply, initialIndividualSupply, gateway) {
        // TODO chainId
        _DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes("1")),
                address(this)
            )
        );
    }
}
