// Balance Service - API calls for different blockchains
export interface BalanceResult {
  native: string
  usd: string
  symbol: string
  network: string
}

export interface ApiError {
  message: string
  code?: string
}

// Bitcoin API using BlockCypher (no API key required)
export const getBitcoinBalance = async (address: string): Promise<BalanceResult> => {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`)
    
    if (!response.ok) {
      throw new Error(`Bitcoin API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Convert satoshis to BTC (1 BTC = 100,000,000 satoshis)
    const balanceInBTC = (data.balance / 100000000).toFixed(8)
    
    // Get BTC price in USD from CoinGecko (free API)
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const btcPrice = priceData.bitcoin?.usd || 0
    
    const usdValue = (parseFloat(balanceInBTC) * btcPrice).toFixed(2)
    
    return {
      native: balanceInBTC,
      usd: usdValue,
      symbol: 'BTC',
      network: 'Bitcoin'
    }
  } catch (error) {
    console.error('Bitcoin balance fetch error:', error)
    throw new Error('Failed to fetch Bitcoin balance. Please check the address format.')
  }
}

// Ethereum API using Etherscan with API key
export const getEthereumBalance = async (address: string): Promise<BalanceResult> => {
  try {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY
    
    if (!apiKey || apiKey === 'YourEtherscanApiKeyHere') {
      throw new Error('Etherscan API key is required. Please add VITE_ETHERSCAN_API_KEY to your .env.local file.')
    }
    
    // Get balance from Etherscan API with API key
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`)
    
    if (!response.ok) {
      throw new Error(`Ethereum API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status !== '1') {
      if (data.message === 'NOTOK') {
        throw new Error('Invalid API key or rate limit exceeded. Please check your Etherscan API key.')
      }
      throw new Error(data.message || 'Invalid Ethereum address or API error')
    }
    
    // Convert Wei to ETH (1 ETH = 10^18 Wei)
    const balanceInETH = (parseInt(data.result) / Math.pow(10, 18)).toFixed(6)
    
    // Get ETH price in USD from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const ethPrice = priceData.ethereum?.usd || 0
    
    const usdValue = (parseFloat(balanceInETH) * ethPrice).toFixed(2)
    
    return {
      native: balanceInETH,
      usd: usdValue,
      symbol: 'ETH',
      network: 'Ethereum'
    }
  } catch (error) {
    console.error('Ethereum balance fetch error:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch Ethereum balance. Please check the address format.')
  }
}

// Cardano API using Blockfrost with API key
export const getCardanoBalance = async (address: string): Promise<BalanceResult> => {
  try {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_BLOCKFROST_API_KEY
    
    if (!apiKey || apiKey === 'YourBlockfrostApiKeyHere') {
      throw new Error('Blockfrost API key is required. Please add VITE_BLOCKFROST_API_KEY to your .env.local file.')
    }
    
    // Get balance from Blockfrost API with API key
    const response = await fetch(`https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}`, {
      headers: {
        'project_id': apiKey
      }
    })
    
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Invalid Cardano address format')
      }
      if (response.status === 403) {
        throw new Error('Invalid Blockfrost API key or access denied')
      }
      if (response.status === 404) {
        throw new Error('Address not found on Cardano network')
      }
      throw new Error(`Cardano API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Get the total amount (sum of all UTXOs)
    const totalLovelace = data.amount.find((asset: any) => asset.unit === 'lovelace')?.quantity || '0'
    
    // Convert Lovelace to ADA (1 ADA = 1,000,000 Lovelace)
    const balanceInADA = (parseInt(totalLovelace) / 1000000).toFixed(6)
    
    // Get ADA price in USD from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const adaPrice = priceData.cardano?.usd || 0
    
    const usdValue = (parseFloat(balanceInADA) * adaPrice).toFixed(2)
    
    return {
      native: balanceInADA,
      usd: usdValue,
      symbol: 'ADA',
      network: 'Cardano'
    }
  } catch (error) {
    console.error('Cardano balance fetch error:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch Cardano balance. Please check the address format.')
  }
}

// Sui API using official RPC endpoint (no API key required)
export const getSuiBalance = async (address: string): Promise<BalanceResult> => {
  try {
    const response = await fetch('https://fullnode.mainnet.sui.io:443', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'suix_getBalance',
        params: [address]
      })
    })
    
    if (!response.ok) {
      throw new Error(`Sui API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message || 'Invalid Sui address')
    }
    
    // Convert MIST to SUI (1 SUI = 1,000,000,000 MIST)
    const balanceInSui = (parseInt(data.result.totalBalance) / 1000000000).toFixed(6)
    
    // Get SUI price in USD from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const suiPrice = priceData.sui?.usd || 0
    
    const usdValue = (parseFloat(balanceInSui) * suiPrice).toFixed(2)
    
    return {
      native: balanceInSui,
      usd: usdValue,
      symbol: 'SUI',
      network: 'Sui'
    }
  } catch (error) {
    console.error('Sui balance fetch error:', error)
    throw new Error('Failed to fetch Sui balance. Please check the address format.')
  }
}

// Solana API using Helius RPC endpoint with API key
export const getSolanaBalance = async (address: string): Promise<BalanceResult> => {
  try {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_HELIUS_API_KEY
    
    if (!apiKey || apiKey === 'YourHeliusApiKeyHere') {
      throw new Error('Helius API key is required. Please add VITE_HELIUS_API_KEY to your .env.local file.')
    }
    
    // Use Helius RPC endpoint with API key
    const rpcUrl = `https://rpc.helius.xyz/?api-key=${apiKey}`
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      })
    })
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Invalid Helius API key or access denied. Please check your API key.')
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      throw new Error(`Solana API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.error) {
      if (data.error.code === -32602) {
        throw new Error('Invalid Solana address format')
      }
      throw new Error(data.error.message || 'Invalid Solana address')
    }
    
    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    const balanceInSol = (data.result.value / 1000000000).toFixed(6)
    
    // Get SOL price in USD from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const solPrice = priceData.solana?.usd || 0
    
    const usdValue = (parseFloat(balanceInSol) * solPrice).toFixed(2)
    
    return {
      native: balanceInSol,
      usd: usdValue,
      symbol: 'SOL',
      network: 'Solana'
    }
  } catch (error) {
    console.error('Solana balance fetch error:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch Solana balance. Please check the address format and API key.')
  }
}

// Algorand API using AlgoExplorer (no API key required)
export const getAlgorandBalance = async (address: string): Promise<BalanceResult> => {
  try {
    const response = await fetch(`https://algoindexer.algoexplorerapi.io/v2/accounts/${address}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Address not found on Algorand network')
      }
      throw new Error(`Algorand API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.account) {
      throw new Error('Invalid Algorand address or account not found')
    }
    
    // Convert microAlgos to ALGO (1 ALGO = 1,000,000 microAlgos)
    const balanceInAlgo = (data.account.amount / 1000000).toFixed(6)
    
    // Get ALGO price in USD from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const algoPrice = priceData.algorand?.usd || 0
    
    const usdValue = (parseFloat(balanceInAlgo) * algoPrice).toFixed(2)
    
    return {
      native: balanceInAlgo,
      usd: usdValue,
      symbol: 'ALGO',
      network: 'Algorand'
    }
  } catch (error) {
    console.error('Algorand balance fetch error:', error)
    throw new Error('Failed to fetch Algorand balance. Please check the address format.')
  }
}

// BNB Chain (Binance Smart Chain) API using BscScan with API key
export const getBnbChainBalance = async (address: string): Promise<BalanceResult> => {
  try {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_BSCSCAN_API_KEY
    
    if (!apiKey || apiKey === 'YourBscScanApiKeyHere') {
      throw new Error('BscScan API key is required. Please add VITE_BSCSCAN_API_KEY to your .env.local file.')
    }
    
    // Get balance from BscScan API with API key
    const response = await fetch(`https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`)
    
    if (!response.ok) {
      throw new Error(`BNB Chain API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status !== '1') {
      if (data.message === 'NOTOK') {
        throw new Error('Invalid API key or rate limit exceeded. Please check your BscScan API key.')
      }
      throw new Error(data.message || 'Invalid BNB Chain address or API error')
    }
    
    // Convert Wei to BNB (1 BNB = 10^18 Wei)
    const balanceInBNB = (parseInt(data.result) / Math.pow(10, 18)).toFixed(6)
    
    // Get BNB price in USD from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const bnbPrice = priceData.binancecoin?.usd || 0
    
    const usdValue = (parseFloat(balanceInBNB) * bnbPrice).toFixed(2)
    
    return {
      native: balanceInBNB,
      usd: usdValue,
      symbol: 'BNB',
      network: 'BNB Chain'
    }
  } catch (error) {
    console.error('BNB Chain balance fetch error:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch BNB Chain balance. Please check the address format.')
  }
}

// Polygon API using PolygonScan with API key
export const getPolygonBalance = async (address: string): Promise<BalanceResult> => {
  try {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_POLYGONSCAN_API_KEY
    
    if (!apiKey || apiKey === 'YourPolygonScanApiKeyHere') {
      throw new Error('PolygonScan API key is required. Please add VITE_POLYGONSCAN_API_KEY to your .env.local file.')
    }
    
    // Get balance from PolygonScan API with API key
    const response = await fetch(`https://api.polygonscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`)
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status !== '1') {
      if (data.message === 'NOTOK') {
        throw new Error('Invalid API key or rate limit exceeded. Please check your PolygonScan API key.')
      }
      throw new Error(data.message || 'Invalid Polygon address or API error')
    }
    
    // Convert Wei to MATIC (1 MATIC = 10^18 Wei)
    const balanceInMATIC = (parseInt(data.result) / Math.pow(10, 18)).toFixed(6)
    
    // Get MATIC price in USD from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const maticPrice = priceData['matic-network']?.usd || 0
    
    const usdValue = (parseFloat(balanceInMATIC) * maticPrice).toFixed(2)
    
    return {
      native: balanceInMATIC,
      usd: usdValue,
      symbol: 'MATIC',
      network: 'Polygon'
    }
  } catch (error) {
    console.error('Polygon balance fetch error:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch Polygon balance. Please check the address format.')
  }
}

// Avalanche API using SnowTrace (no API key required for basic balance queries)
export const getAvalancheBalance = async (address: string): Promise<BalanceResult> => {
  try {
    // Try without API key first
    let response = await fetch(`https://api.snowtrace.io/api?module=account&action=balance&address=${address}&tag=latest`)
    
    // If that fails, try with API key if available
    if (!response.ok) {
      const apiKey = import.meta.env.VITE_SNOWTRACE_API_KEY
      if (apiKey && apiKey !== 'YourSnowTraceApiKeyHere') {
        response = await fetch(`https://api.snowtrace.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`)
      }
    }
    
    if (!response.ok) {
      throw new Error(`Avalanche API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status !== '1') {
      if (data.message === 'NOTOK' && data.result?.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please add VITE_SNOWTRACE_API_KEY to your .env.local file for higher limits.')
      }
      throw new Error(data.message || 'Invalid Avalanche address or API error')
    }
    
    // Convert Wei to AVAX (1 AVAX = 10^18 Wei)
    const balanceInAVAX = (parseInt(data.result) / Math.pow(10, 18)).toFixed(6)
    
    // Get AVAX price in USD from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd')
    const priceData = await priceResponse.json()
    const avaxPrice = priceData['avalanche-2']?.usd || 0
    
    const usdValue = (parseFloat(balanceInAVAX) * avaxPrice).toFixed(2)
    
    return {
      native: balanceInAVAX,
      usd: usdValue,
      symbol: 'AVAX',
      network: 'Avalanche'
    }
  } catch (error) {
    console.error('Avalanche balance fetch error:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch Avalanche balance. Please check the address format.')
  }
}

// Main balance checker function
export const getBalance = async (address: string, network: string): Promise<BalanceResult> => {
  if (!address.trim()) {
    throw new Error('Address is required')
  }
  
  switch (network.toLowerCase()) {
    case 'bitcoin':
      return await getBitcoinBalance(address)
    case 'ethereum':
      return await getEthereumBalance(address)
    case 'cardano':
      return await getCardanoBalance(address)
    case 'sui':
      return await getSuiBalance(address)
    case 'solana':
      return await getSolanaBalance(address)
    case 'algorand':
      return await getAlgorandBalance(address)
    case 'bnb-chain':
      return await getBnbChainBalance(address)
    case 'polygon':
      return await getPolygonBalance(address)
    case 'avalanche':
      return await getAvalancheBalance(address)
    default:
      throw new Error(`Network ${network} is not yet supported`)
  }
}

// Address validation helpers
export const validateAddress = (address: string, network: string): boolean => {
  switch (network.toLowerCase()) {
    case 'bitcoin':
      // Basic Bitcoin address validation (starts with 1, 3, or bc1)
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address)
    case 'ethereum':
    case 'bnb-chain':
    case 'polygon':
    case 'avalanche':
      // EVM-compatible address validation (starts with 0x and 40 hex characters)
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case 'cardano':
      // Cardano address validation (Shelley addresses start with addr1, Byron addresses are Base58)
      return /^addr1[a-z0-9]+$/.test(address) || /^[1-9A-HJ-NP-Za-km-z]+$/.test(address)
    case 'sui':
      // Sui address validation (starts with 0x and 64 hex characters)
      return /^0x[a-fA-F0-9]{64}$/.test(address)
    case 'solana':
      // Solana address validation (Base58 encoded, typically 32-44 characters)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
    case 'algorand':
      // Algorand address validation (Base32 encoded, 58 characters)
      return /^[A-Z2-7]{58}$/.test(address)
    default:
      return true // For other networks, we'll validate later
  }
}