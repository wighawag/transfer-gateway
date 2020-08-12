pragma solidity 0.6.5;

library SigUtil {
    function recover(bytes32 hash, bytes memory sig) internal pure returns (address recovered) {
        require(sig.length == 65, "SIGNATURE_INVALID_LENGTH");

        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }
        require(v == 27 || v == 28, "SIGNATURE_INVALID_V");

        recovered = ecrecover(hash, v, r, s);
        require(recovered != address(0), "SIGNATURE_ZERO_ADDRESS");
    }

    function eth_sign_prefix(bytes32 hash) internal pure returns (bytes memory) {
        return abi.encodePacked("\x19Ethereum Signed Message:\n32", hash);
    }
}
