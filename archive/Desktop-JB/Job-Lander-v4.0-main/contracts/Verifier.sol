// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ResumeVerifier
 * @dev Smart contract for verifying resume hashes on the blockchain
 */
contract ResumeVerifier {
    // Events
    event ResumeVerified(bytes32 indexed hash, address indexed sender, uint256 timestamp);
    event BatchVerified(bytes32[] hashes, address indexed sender, uint256 timestamp);
    
    // Mapping from resume hash to verification timestamp
    mapping(bytes32 => uint256) public verifiedResumes;
    
    // Mapping from resume hash to verifier address
    mapping(bytes32 => address) public verifiers;
    
    // Counter for total verifications
    uint256 public totalVerifications;
    
    /**
     * @dev Verify a single resume hash
     * @param resumeHash The SHA-256 hash of the resume
     */
    function verifyResume(bytes32 resumeHash) external {
        require(verifiedResumes[resumeHash] == 0, "Already verified");
        
        verifiedResumes[resumeHash] = block.timestamp;
        verifiers[resumeHash] = msg.sender;
        totalVerifications++;
        
        emit ResumeVerified(resumeHash, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Check if a resume hash is verified
     * @param resumeHash The resume hash to check
     * @return verified Whether the resume is verified
     * @return timestamp When it was verified (0 if not verified)
     * @return verifier Who verified it (address(0) if not verified)
     */
    function checkVerification(bytes32 resumeHash) external view returns (
        bool verified,
        uint256 timestamp,
        address verifier
    ) {
        timestamp = verifiedResumes[resumeHash];
        verified = timestamp > 0;
        verifier = verifiers[resumeHash];
    }
    
    /**
     * @dev Batch verify multiple resume hashes (gas efficient)
     * @param hashes Array of resume hashes to verify
     */
    function batchVerify(bytes32[] calldata hashes) external {
        uint256 length = hashes.length;
        require(length > 0, "Empty array");
        require(length <= 50, "Too many hashes"); // Limit for gas safety
        
        for (uint256 i = 0; i < length; i++) {
            if (verifiedResumes[hashes[i]] == 0) {
                verifiedResumes[hashes[i]] = block.timestamp;
                verifiers[hashes[i]] = msg.sender;
                totalVerifications++;
                emit ResumeVerified(hashes[i], msg.sender, block.timestamp);
            }
        }
        
        emit BatchVerified(hashes, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get verification details for multiple hashes
     * @param hashes Array of resume hashes to check
     * @return timestamps Array of verification timestamps
     * @return verifierAddresses Array of verifier addresses
     */
    function getMultipleVerifications(bytes32[] calldata hashes) external view returns (
        uint256[] memory timestamps,
        address[] memory verifierAddresses
    ) {
        uint256 length = hashes.length;
        timestamps = new uint256[](length);
        verifierAddresses = new address[](length);
        
        for (uint256 i = 0; i < length; i++) {
            timestamps[i] = verifiedResumes[hashes[i]];
            verifierAddresses[i] = verifiers[hashes[i]];
        }
        
        return (timestamps, verifierAddresses);
    }
}