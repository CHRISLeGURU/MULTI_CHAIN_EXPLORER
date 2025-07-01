# Multi-Chain Wallet Balance Checker

A simple and developer-friendly web app that lets you check the balance of any public blockchain address across multiple networks — Bitcoin, Ethereum, Cardano, Polkadot, Sui, and Solana — and instantly see its USD equivalent using the CoinGecko API.

## Features

- Supports major blockchains: **Bitcoin, Ethereum, Cardano, Polkadot, Sui, and Solana**
- Real-time balance fetching using public blockchain explorers and RPC APIs
- Automatic **USD conversion** with **CoinGecko**
- Clean and lightweight **frontend-only architecture** (no backend or database required)
- Built with **TypeScript**, **Vite**, and modern **React**

## Tech Stack

- **Blockchain APIs:**
  - Bitcoin: BlockCypher
  - Ethereum: Etherscan
  - Cardano: Blockfrost
 
  - Sui: JSON-RPC
  - Solana: Helius RPC or Solscan API
  - Polygon/BNB CHAIN: Polyscan, BSCScan
- **Frontend:** React + Vite + Tailwind CSS and framer motion
- **Pricing API:** CoinGecko

## Installation

```bash
md multi-chain-balance-checker
cd multi-chain-balance-checker
git clone https://github.com/CHRISLeGURU/...

npm install
npm run dev
Usage
Enter a valid blockchain address and select the blockchain network.

The app will fetch the balance and display it in native token and USD value.

Environment Variables
Create a .env.local file in the root folder and add your API keys:


VITE_BLOCKFROST_API_KEY=your_blockfrost_api_key
VITE_HELIUS_API_KEY=your_helius_api_key
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
VITE_BSCSCAN_API_KEY=.......
VITE_POLYGONSCAN_API_KEY=........

##Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.
