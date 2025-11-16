# 🎭 Secret Auction House

<div align="center">

**Privacy-First Decentralized Auction Platform powered by Zama FHEVM**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Zama FHEVM](https://img.shields.io/badge/Zama-FHEVM-9945FF?style=for-the-badge)](https://www.zama.ai/)
[![Base](https://img.shields.io/badge/Base-Network-0052FF?style=for-the-badge&logo=coinbase)](https://base.org/)

[Live Demo](https://your-demo-url.vercel.app) • [Documentation](https://docs.zama.ai/fhevm) • [Report Bug](https://github.com/yourusername/secret-auction-house/issues)

</div>

---

## 🌟 Overview

Secret Auction House is a revolutionary decentralized auction platform that leverages **Fully Homomorphic Encryption (FHE)** to enable completely private bidding. Unlike traditional auction systems where bids are visible, our platform ensures that all bid amounts remain encrypted on-chain until the auction ends.

### 🔐 Why Privacy Matters

In traditional auctions, bid visibility creates unfair advantages:
- 🎯 **Bid Sniping**: Last-minute bidders can see and slightly outbid current highest offers
- 📊 **Market Manipulation**: Early high bids can discourage competition
- 🕵️ **Privacy Concerns**: Your bidding strategy and budget become public knowledge

Secret Auction House solves these problems with cryptographic privacy guarantees.

---

## ✨ Features

### 🔒 Core Privacy Features
- **🛡️ Encrypted Bids**: All bids are encrypted using Zama's FHEVM technology
- **🤫 Zero-Knowledge Proofs**: Validate bids without revealing amounts
- **🎲 Fair Competition**: No one can see competing bids until auction ends
- **⛓️ On-Chain Privacy**: Privacy maintained even with public blockchain

### 🎨 User Experience
- **🌙 Dark Theme UI**: Beautiful privacy-focused design with purple/pink gradients
- **⚡ Real-time Updates**: Live auction countdown and status tracking
- **🔍 Search & Filter**: Easily find auctions by title, status, or category
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🎪 Animated Components**: Smooth transitions and interactions

### 🔗 Web3 Integration
- **👛 Privy Auth**: Seamless wallet connection and authentication
- **🌐 Base Network**: Built on Base for low fees and fast transactions
- **🎭 Farcaster Support**: Integrated with Farcaster mini-app ecosystem
- **🔔 Toast Notifications**: Real-time feedback for all actions

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 15.3 with App Router
- **UI Library**: React 19.1
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks

### Blockchain & Privacy
- **Privacy Layer**: Zama FHEVM (Fully Homomorphic Encryption Virtual Machine)
- **Network**: Base (Ethereum L2)
- **Wallet**: Privy Web3 Auth
- **Smart Contracts**: Solidity with FHE primitives

### Additional Technologies
- **Authentication**: Privy + Farcaster Quick Auth
- **Notifications**: Sonner (Toast)
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Basic understanding of blockchain concepts

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/secret-auction-house.git
cd secret-auction-house
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:
```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Optional: Farcaster Configuration
NEXT_PUBLIC_FARCASTER_APP_FID=your_farcaster_fid
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 How It Works

### 🔬 The Magic of FHE (Fully Homomorphic Encryption)

Traditional encryption requires decryption before computation. FHE allows computations on encrypted data:

```
Traditional:  Encrypt → Decrypt → Compute → Encrypt
FHE:         Encrypt → Compute on Encrypted Data → Decrypt Result
```

### 🎯 Auction Flow

1. **🎨 Create Auction**: Seller creates an auction with details and end time
2. **🔐 Submit Encrypted Bid**: Bidders submit encrypted amounts via smart contract
3. **🔒 On-Chain Privacy**: Bids stored encrypted on blockchain
4. **⏰ Auction Ends**: Time expires, no more bids accepted
5. **🎊 Reveal Winner**: Smart contract decrypts and reveals highest bidder
6. **💰 Settle**: Winner receives item, seller receives payment

### 🧮 Smart Contract Architecture

```solidity
// Simplified example from src/lib/contract-example.sol
contract SecretAuction {
    // Encrypted bid storage
    mapping(address => euint64) private encryptedBids;
    
    // Submit encrypted bid
    function submitBid(bytes calldata encryptedBid) external {
        euint64 bid = TFHE.asEuint64(encryptedBid);
        encryptedBids[msg.sender] = bid;
    }
    
    // Compare bids without decryption
    function determineWinner() private view returns (address) {
        // FHE comparison on encrypted values
        euint64 highest = encryptedBids[bidder1];
        ebool isHigher = TFHE.gt(encryptedBids[bidder2], highest);
        // ... determine winner without revealing amounts
    }
}
```

---

## 📁 Project Structure

```
secret-auction-house/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout with Privy provider
│   │   ├── page.tsx             # Main auction listing page
│   │   └── api/                 # API routes
│   │       ├── proxy/           # External API proxy
│   │       └── me/              # Auth verification
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── auction-card.tsx     # Auction display card
│   │   ├── bid-modal.tsx        # Encrypted bid submission
│   │   └── Farcaster*.tsx       # Farcaster integration
│   ├── lib/                     # Utilities and configs
│   │   ├── fhe-utils.ts         # FHE encryption helpers
│   │   ├── mock-data.ts         # Sample auction data
│   │   ├── contract-example.sol # Solidity smart contract
│   │   └── privy/               # Privy configuration
│   ├── types/                   # TypeScript type definitions
│   │   └── auction.ts           # Auction data types
│   └── hooks/                   # Custom React hooks
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies
```

---

## 🎮 Usage

### For Bidders

1. **Connect Wallet**: Click "Connect Wallet" and authenticate with Privy
2. **Browse Auctions**: Explore available auctions with live countdowns
3. **Place Bid**: Click "Place Bid" on any active auction
4. **Submit Encrypted Bid**: Enter your bid amount (encrypted automatically)
5. **Wait for Results**: Monitor auction status until it ends
6. **Check Results**: See if you won after auction closes

### For Sellers

1. **Connect Wallet**: Authenticate your Web3 wallet
2. **Create Auction**: (Future feature) List items with details and duration
3. **Monitor Bids**: Track number of bids (not amounts)
4. **End Auction**: Wait for time to expire
5. **Reveal Winner**: System automatically determines and reveals winner

---

## 🔐 Privacy & Security

### What's Encrypted?
- ✅ Bid amounts
- ✅ Bidder strategies
- ✅ Bid comparisons

### What's Public?
- ✅ Auction items and details
- ✅ Number of bids (not amounts)
- ✅ Auction start/end times
- ✅ Winner announcement (after auction ends)

### Security Best Practices
- 🔒 All FHE operations happen in smart contracts
- 🛡️ Private keys never leave your wallet
- ⛓️ Encrypted data stored on-chain
- 🔐 Zero-knowledge proofs for validation

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Basic auction UI
- [x] Privy wallet integration
- [x] Mock data for demonstration
- [x] FHE concept implementation
- [x] Responsive design

### Phase 2: Smart Contracts
- [ ] Deploy FHEVM smart contracts to testnet
- [ ] Real encrypted bid submission
- [ ] Automated winner determination
- [ ] On-chain auction creation

### Phase 3: Enhanced Features
- [ ] NFT auctions support
- [ ] Bid history and analytics
- [ ] User profiles and reputation
- [ ] Multi-currency support
- [ ] Email/push notifications

### Phase 4: Advanced Privacy
- [ ] Multi-party computation (MPC)
- [ ] Private auction metadata
- [ ] Anonymous bidder mode
- [ ] Privacy-preserving analytics

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **🍴 Fork the repository**
2. **🔀 Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push to the branch** (`git push origin feature/AmazingFeature`)
5. **🎉 Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📚 Learn More

### Zama FHEVM Resources
- [Zama Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Whitepaper](https://github.com/zama-ai/fhevm/blob/main/fhevm-whitepaper.pdf)
- [TFHE Library](https://github.com/zama-ai/tfhe-rs)
- [FHE Playground](https://playground.zama.ai/)

### Base Network
- [Base Documentation](https://docs.base.org/)
- [Base Bridge](https://bridge.base.org/)
- [Base Block Explorer](https://basescan.org/)

### Privy Auth
- [Privy Documentation](https://docs.privy.io/)
- [Privy Dashboard](https://dashboard.privy.io/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zama** - For pioneering FHE technology
- **Base** - For providing fast and affordable L2 infrastructure
- **Privy** - For seamless Web3 authentication
- **shadcn/ui** - For beautiful UI components
- **Next.js Team** - For the amazing framework

---

## 📞 Contact & Support

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/secret-auction-house/issues)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **Discord**: [Join our community](https://discord.gg/yourcommunity)

---

<div align="center">

**Built with ❤️ for a private future**

⭐ Star us on GitHub — it helps!

[⬆ Back to Top](#-secret-auction-house)

</div>
