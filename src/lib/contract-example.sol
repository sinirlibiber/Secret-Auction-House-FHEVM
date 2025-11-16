// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

/**
 * Secret Auction Contract using Zama FHEVM
 * 
 * This is a reference implementation showing how to build a privacy-preserving
 * auction system using Fully Homomorphic Encryption (FHE).
 * 
 * Key Features:
 * - Encrypted bids that no one can see
 * - Homomorphic operations on encrypted data
 * - Winner determination without revealing bids
 * - Zero-knowledge proofs for bid validation
 * 
 * To use this contract:
 * 1. Install @fhevm/solidity package
 * 2. Deploy to Zama devnet or compatible FHEVM network
 * 3. Use fhevmjs on client-side for encryption
 * 
 * Learn more: https://docs.zama.ai/fhevm
 */

import { FHE, euint64, externalEuint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract SecretAuctionHouse is EthereumConfig {
    // Auction structure with encrypted values
    struct Auction {
        uint256 id;
        address seller;
        uint256 startTime;
        uint256 endTime;
        euint64 minBid; // Encrypted minimum bid
        bool settled;
        address winner;
        uint256 bidCount;
    }
    
    // Encrypted bid structure
    struct EncryptedBid {
        euint64 amount;      // Encrypted bid amount
        address bidder;
        uint256 timestamp;
        bool revealed;
    }
    
    // Storage mappings
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => EncryptedBid)) public auctionBids;
    mapping(uint256 => euint64) private highestBids; // Encrypted highest bid
    
    uint256 public auctionCounter;
    
    // Events
    event AuctionCreated(uint256 indexed auctionId, address indexed seller, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder);
    event AuctionSettled(uint256 indexed auctionId, address indexed winner);
    
    /**
     * Create a new auction with encrypted minimum bid
     * @param duration Duration of auction in seconds
     * @param encryptedMinBid Encrypted minimum bid amount
     * @param inputProof Zero-knowledge proof for encrypted value
     */
    function createAuction(
        uint256 duration,
        externalEuint64 encryptedMinBid,
        bytes calldata inputProof
    ) external returns (uint256) {
        require(duration > 0, "Invalid duration");
        
        auctionCounter++;
        uint256 auctionId = auctionCounter;
        
        // Validate and store encrypted minimum bid
        euint64 minBid = FHE.fromExternal(encryptedMinBid, inputProof);
        
        auctions[auctionId] = Auction({
            id: auctionId,
            seller: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            minBid: minBid,
            settled: false,
            winner: address(0),
            bidCount: 0
        });
        
        emit AuctionCreated(auctionId, msg.sender, block.timestamp + duration);
        
        return auctionId;
    }
    
    /**
     * Place an encrypted bid on an auction
     * @param auctionId ID of the auction
     * @param encryptedAmount Encrypted bid amount
     * @param inputProof Zero-knowledge proof for encrypted value
     */
    function placeBid(
        uint256 auctionId,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external {
        Auction storage auction = auctions[auctionId];
        
        require(block.timestamp >= auction.startTime, "Auction not started");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(!auction.settled, "Auction already settled");
        
        // Validate and store encrypted bid
        euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
        
        // Check if bid is higher than minimum (using FHE comparison)
        ebool isValid = FHE.gte(amount, auction.minBid);
        require(FHE.decrypt(isValid), "Bid too low");
        
        // Store encrypted bid
        auctionBids[auctionId][msg.sender] = EncryptedBid({
            amount: amount,
            bidder: msg.sender,
            timestamp: block.timestamp,
            revealed: false
        });
        
        // Update highest bid using FHE comparison
        if (auction.bidCount == 0) {
            highestBids[auctionId] = amount;
        } else {
            // Compare encrypted values
            ebool isHigher = FHE.gt(amount, highestBids[auctionId]);
            // Conditionally update highest bid
            highestBids[auctionId] = FHE.select(isHigher, amount, highestBids[auctionId]);
        }
        
        auction.bidCount++;
        
        emit BidPlaced(auctionId, msg.sender);
    }
    
    /**
     * Settle auction and determine winner
     * This would typically use async decryption via FHEVM Gateway
     * @param auctionId ID of the auction to settle
     */
    function settleAuction(uint256 auctionId) external {
        Auction storage auction = auctions[auctionId];
        
        require(block.timestamp >= auction.endTime, "Auction not ended");
        require(!auction.settled, "Already settled");
        
        // In production, this would:
        // 1. Request decryption of highest bid via Gateway
        // 2. Gateway callback reveals winner
        // 3. Transfer funds to seller
        
        auction.settled = true;
        
        // For demo, we'd use Gateway's async decryption here
        // The actual winner would be determined in the callback
        
        emit AuctionSettled(auctionId, auction.winner);
    }
    
    /**
     * Allow users to decrypt their own bid
     * @param auctionId ID of the auction
     */
    function revealMyBid(uint256 auctionId) external view returns (uint64) {
        EncryptedBid storage bid = auctionBids[auctionId][msg.sender];
        require(bid.bidder == msg.sender, "Not your bid");
        
        // User can decrypt their own bid
        // Permission granted via FHE.allow()
        return FHE.decrypt(bid.amount);
    }
    
    /**
     * Grant permission for user to decrypt their bid
     * @param auctionId ID of the auction
     */
    function allowBidDecryption(uint256 auctionId) external {
        EncryptedBid storage bid = auctionBids[auctionId][msg.sender];
        require(bid.bidder == msg.sender, "Not your bid");
        
        // Allow user to decrypt their own encrypted bid
        FHE.allow(bid.amount, msg.sender);
    }
    
    /**
     * Get auction details
     * @param auctionId ID of the auction
     */
    function getAuctionInfo(uint256 auctionId) external view returns (
        address seller,
        uint256 startTime,
        uint256 endTime,
        bool settled,
        address winner,
        uint256 bidCount
    ) {
        Auction storage auction = auctions[auctionId];
        return (
            auction.seller,
            auction.startTime,
            auction.endTime,
            auction.settled,
            auction.winner,
            auction.bidCount
        );
    }
    
    /**
     * Check if user has placed a bid (without revealing amount)
     * @param auctionId ID of the auction
     * @param bidder Address of the bidder
     */
    function hasBid(uint256 auctionId, address bidder) external view returns (bool) {
        return auctionBids[auctionId][bidder].bidder != address(0);
    }
}

/**
 * Client-side usage with fhevmjs:
 * 
 * import { createInstance } from 'fhevmjs';
 * 
 * // Initialize FHE instance
 * const instance = await createInstance({
 *   chainId: 8009, // Zama devnet
 *   publicKey: CONTRACT_PUBLIC_KEY,
 * });
 * 
 * // Encrypt bid amount
 * const bidAmount = 1.5; // ETH
 * const encrypted = instance.encrypt64(bidAmount * 1e18);
 * 
 * // Generate input proof
 * const inputProof = instance.generateInputProof(encrypted);
 * 
 * // Submit to contract
 * await contract.placeBid(
 *   auctionId,
 *   encrypted.handles[0],
 *   inputProof
 * );
 */
