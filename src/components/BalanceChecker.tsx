import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Search, 
  Wallet, 
  Copy, 
  ExternalLink,
  Bitcoin,
  Zap,
  Globe,
  Shield,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Triangle,
  Hexagon,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { getBalance, validateAddress, type BalanceResult } from '@/services/balanceService'

interface Network {
  id: string
  name: string
  symbol: string
  color: string
  icon: React.ReactNode
  placeholder: string
  explorerUrl: string
}

interface BalanceCheckerProps {
  onBack: () => void
}

const networks: Network[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
    icon: <div className="w-4 h-4 rounded-full bg-blue-500" />,
    placeholder: '0x742d35Cc6634C0532925a3b8D4C9db96DfbB8b2e',
    explorerUrl: 'https://etherscan.io/address/'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    color: 'border-orange-500/50 bg-orange-500/10 text-orange-400',
    icon: <Bitcoin className="w-4 h-4" />,
    placeholder: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    explorerUrl: 'https://blockstream.info/address/'
  },
  {
    id: 'bnb-chain',
    name: 'BNB Chain',
    symbol: 'BNB',
    color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
    icon: <div className="w-4 h-4 rounded-full bg-yellow-500" />,
    placeholder: '0x742d35Cc6634C0532925a3b8D4C9db96DfbB8b2e',
    explorerUrl: 'https://bscscan.com/address/'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    color: 'border-purple-600/50 bg-purple-600/10 text-purple-400',
    icon: <Hexagon className="w-4 h-4" />,
    placeholder: '0x742d35Cc6634C0532925a3b8D4C9db96DfbB8b2e',
    explorerUrl: 'https://polygonscan.com/address/'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    color: 'border-red-500/50 bg-red-500/10 text-red-400',
    icon: <Triangle className="w-4 h-4" />,
    placeholder: '0x742d35Cc6634C0532925a3b8D4C9db96DfbB8b2e',
    explorerUrl: 'https://snowtrace.io/address/'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
    icon: <div className="w-4 h-4 rounded-full bg-purple-500" />,
    placeholder: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
    explorerUrl: 'https://solscan.io/account/'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    color: 'border-blue-600/50 bg-blue-600/10 text-blue-300',
    icon: <div className="w-4 h-4 rounded-full bg-blue-600" />,
    placeholder: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a',
    explorerUrl: 'https://cardanoscan.io/address/'
  },
  {
    id: 'sui',
    name: 'Sui',
    symbol: 'SUI',
    color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
    icon: <div className="w-4 h-4 rounded-full bg-cyan-500" />,
    placeholder: '0x2d178b9704706393d2630fe6cf9415c2c50b181e9e3c7a977237bb2929f82d9c',
    explorerUrl: 'https://suiexplorer.com/address/'
  },
  {
    id: 'algorand',
    name: 'Algorand',
    symbol: 'ALGO',
    color: 'border-gray-500/50 bg-gray-500/10 text-gray-400',
    icon: <div className="w-4 h-4 rounded-full bg-gray-500" />,
    placeholder: 'ALGORANDMAINNETADDRESSEXAMPLEHERE234567890ABCDEFGHIJK',
    explorerUrl: 'https://algoexplorer.io/address/'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    color: 'border-pink-500/50 bg-pink-500/10 text-pink-400',
    icon: <div className="w-4 h-4 rounded-full bg-pink-500" />,
    placeholder: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg',
    explorerUrl: 'https://polkadot.subscan.io/account/'
  },
  {
    id: 'sonic',
    name: 'Sonic',
    symbol: 'S',
    color: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
    icon: <div className="w-4 h-4 rounded-full bg-purple-500" />,
    placeholder: '0x...',
    explorerUrl: 'https://explorer.sonic.network/address/'
  }
]

const BalanceChecker: React.FC<BalanceCheckerProps> = ({ onBack }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]) // Start with Ethereum
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [balance, setBalance] = useState<BalanceResult | null>(null)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isNetworkListExpanded, setIsNetworkListExpanded] = useState(false)

  // List of supported networks (with working APIs) - Algorand moved to coming soon
  const supportedNetworks = ['bitcoin', 'ethereum', 'cardano', 'sui', 'solana', 'bnb-chain', 'polygon', 'avalanche']

  const handleAddressChange = (value: string) => {
    setAddress(value)
    setValidationError('')
    setError('')
    
    // Real-time validation
    if (value.trim() && !validateAddress(value.trim(), selectedNetwork.id)) {
      setValidationError(`Invalid ${selectedNetwork.name} address format`)
    }
  }

  const handleNetworkChange = (network: Network) => {
    setSelectedNetwork(network)
    setAddress('')
    setBalance(null)
    setError('')
    setValidationError('')
    setIsNetworkListExpanded(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address.trim()) {
      setError('Please enter a wallet address')
      return
    }

    if (!validateAddress(address.trim(), selectedNetwork.id)) {
      setError(`Invalid ${selectedNetwork.name} address format`)
      return
    }

    // Check if network is supported
    if (!supportedNetworks.includes(selectedNetwork.id)) {
      setError(`${selectedNetwork.name} support is coming soon! Try Bitcoin, Ethereum, Cardano, Sui, Solana, BNB Chain, Polygon, or Avalanche for now.`)
      return
    }

    setIsLoading(true)
    setError('')
    setBalance(null)

    try {
      const result = await getBalance(address.trim(), selectedNetwork.id)
      setBalance(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
    } finally {
      setIsLoading(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
  }

  const openExplorer = () => {
    if (address.trim()) {
      window.open(`${selectedNetwork.explorerUrl}${address.trim()}`, '_blank')
    }
  }

  const formatNumber = (num: string) => {
    const number = parseFloat(num)
    if (number === 0) return '0'
    if (number < 0.000001) return '< 0.000001'
    return number.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const visibleNetworks = isNetworkListExpanded ? networks : networks.slice(0, 6)

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <Badge 
              variant="outline" 
              className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 backdrop-blur-sm px-4 py-2 mb-6"
            >
              <Search className="w-4 h-4 mr-2" />
              Balance Checker
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent mb-6">
              Check Your Balance
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Enter any wallet address and select a blockchain to instantly check the balance across multiple networks.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-cyan-400" />
                    Wallet Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Network Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Select Network
                    </label>
                    <div className="space-y-2">
                      {/* Selected Network Display */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsNetworkListExpanded(!isNetworkListExpanded)}
                        className={`w-full p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ${selectedNetwork.color}`}
                      >
                        <div className="flex items-center gap-3">
                          {selectedNetwork.icon}
                          <span className="font-medium">{selectedNetwork.name}</span>
                          <span className="text-sm opacity-70">({selectedNetwork.symbol})</span>
                          {supportedNetworks.includes(selectedNetwork.id) && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        {isNetworkListExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </motion.button>

                      {/* Network List */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: isNetworkListExpanded ? 'auto' : 0,
                          opacity: isNetworkListExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pt-2 max-h-80 overflow-y-auto custom-scrollbar">
                          {networks.filter(network => network.id !== selectedNetwork.id).map((network) => (
                            <motion.button
                              key={network.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleNetworkChange(network)}
                              className="w-full p-3 rounded-lg border border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600/50 transition-all duration-200 flex items-center gap-3"
                            >
                              {network.icon}
                              <span className="font-medium">{network.name}</span>
                              <span className="text-sm opacity-70">({network.symbol})</span>
                              {!supportedNetworks.includes(network.id) && (
                                <Badge variant="outline" className="ml-auto text-xs border-yellow-500/50 text-yellow-400">
                                  Coming Soon
                                </Badge>
                              )}
                              {supportedNetworks.includes(network.id) && (
                                <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Address Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Wallet Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        placeholder={selectedNetwork.placeholder}
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          validationError 
                            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50' 
                            : 'border-slate-700/50 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50'
                        }`}
                      />
                      {address && (
                        <button
                          onClick={copyAddress}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {validationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {validationError}
                      </motion.div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !!validationError}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 py-6 text-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Checking Balance...
                      </div>
                    ) : (
                      <>
                        <Search className="mr-2 w-5 h-5" />
                        Check Balance
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {balance ? (
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      Balance Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Network Info */}
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      {selectedNetwork.icon}
                      <div>
                        <div className="font-medium text-white">{balance.network}</div>
                        <div className="text-sm text-slate-400">Network</div>
                      </div>
                    </div>

                    {/* Balance Display */}
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                        <div className="text-sm text-slate-400 mb-1">Native Balance</div>
                        <div className="text-2xl font-bold text-white">
                          {formatNumber(balance.native)} {balance.symbol}
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-sm text-slate-400 mb-1">USD Value</div>
                        <div className="text-2xl font-bold text-green-400">
                          ${formatNumber(balance.usd)}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openExplorer}
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Explorer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyAddress}
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Ready to Check</h3>
                    <p className="text-slate-400 mb-4">
                      Enter a wallet address and select a network to see the balance results here.
                    </p>
                    <div className="text-sm text-cyan-400">
                      ✅ 8 networks ready: Bitcoin, Ethereum, BNB Chain, Polygon, Avalanche, Solana, Cardano, and Sui!
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-slate-800/50"
          >
            {[
              { icon: Shield, text: 'Secure & Private', desc: 'No data stored' },
              { icon: Zap, text: 'Real-time Data', desc: 'Live blockchain data' },
              { icon: Globe, text: 'Multi-Chain', desc: '8 networks ready' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-400">
                <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{feature.text}</div>
                  <div className="text-xs text-slate-500">{feature.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BalanceChecker