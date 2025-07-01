import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, Zap, Globe, Shield, ArrowRight, Sparkles, Github, Bitcoin, Triangle, Hexagon } from 'lucide-react'

interface NetworkNode {
  id: string
  name: string
  color: string
  x: number
  y: number
  size: number
}

interface Connection {
  from: string
  to: string
}

interface Web3HeroSectionProps {
  onNavigateToChecker: () => void
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const networks: NetworkNode[] = [
    { id: 'btc', name: 'Bitcoin', color: '#f7931a', x: 0.2, y: 0.3, size: 8 },
    { id: 'eth', name: 'Ethereum', color: '#627eea', x: 0.8, y: 0.2, size: 10 },
    { id: 'ada', name: 'Cardano', color: '#0033ad', x: 0.7, y: 0.7, size: 6 },
    { id: 'sol', name: 'Solana', color: '#9945ff', x: 0.3, y: 0.8, size: 7 },
    { id: 'sui', name: 'Sui', color: '#4da2ff', x: 0.9, y: 0.5, size: 5 },
    { id: 'bnb', name: 'BNB Chain', color: '#f3ba2f', x: 0.1, y: 0.1, size: 7 },
    { id: 'matic', name: 'Polygon', color: '#8247e5', x: 0.6, y: 0.4, size: 6 },
    { id: 'avax', name: 'Avalanche', color: '#e84142', x: 0.4, y: 0.2, size: 6 },
  ]

  const connections: Connection[] = [
    { from: 'btc', to: 'eth' },
    { from: 'eth', to: 'ada' },
    { from: 'sol', to: 'sui' },
    { from: 'ada', to: 'bnb' },
    { from: 'eth', to: 'sol' },
    { from: 'bnb', to: 'matic' },
    { from: 'matic', to: 'avax' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      time += 0.01

      // Draw connections
      connections.forEach((connection, index) => {
        const fromNode = networks.find(n => n.id === connection.from)
        const toNode = networks.find(n => n.id === connection.to)
        
        if (fromNode && toNode) {
          const fromX = fromNode.x * canvas.offsetWidth
          const fromY = fromNode.y * canvas.offsetHeight
          const toX = toNode.x * canvas.offsetWidth
          const toY = toNode.y * canvas.offsetHeight

          // Animated gradient line
          const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY)
          const alpha = (Math.sin(time * 2 + index) + 1) * 0.3 + 0.1
          gradient.addColorStop(0, `${fromNode.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`)
          gradient.addColorStop(1, `${toNode.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(fromX, fromY)
          ctx.lineTo(toX, toY)
          ctx.stroke()

          // Flowing particles
          const progress = (Math.sin(time * 3 + index) + 1) / 2
          const particleX = fromX + (toX - fromX) * progress
          const particleY = fromY + (toY - fromY) * progress
          
          ctx.fillStyle = fromNode.color
          ctx.beginPath()
          ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Draw network nodes
      networks.forEach((node, index) => {
        const x = node.x * canvas.offsetWidth
        const y = node.y * canvas.offsetHeight
        const pulse = Math.sin(time * 2 + index) * 0.3 + 1

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, node.size * pulse * 3)
        gradient.addColorStop(0, `${node.color}40`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, node.size * pulse * 3, 0, Math.PI * 2)
        ctx.fill()

        // Main node
        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(x, y, node.size * pulse, 0, Math.PI * 2)
        ctx.fill()

        // Inner highlight
        ctx.fillStyle = '#ffffff40'
        ctx.beginPath()
        ctx.arc(x - node.size * 0.3, y - node.size * 0.3, node.size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
      style={{ background: 'radial-gradient(ellipse at center, rgba(99, 126, 234, 0.1) 0%, transparent 70%)' }}
    />
  )
}

const DashboardMockup: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative"
    >
      <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
            <Sparkles className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Portfolio Overview */}
        <div className="space-y-4">
          <div className="text-sm text-slate-400">Total Portfolio Value</div>
          <div className="text-3xl font-bold text-white">$247,892.15</div>
          <div className="text-xs text-green-400 leading-relaxed max-w-xs">
            Enter a valid blockchain address and instantly get its balance, converted to USD using the CoinGecko API.
          </div>
        </div>

        {/* Network Cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            { name: 'Ethereum', balance: '$45,230', color: 'bg-blue-500' },
            { name: 'BNB Chain', balance: '$38,450', color: 'bg-yellow-500' },
            { name: 'Polygon', balance: '$32,100', color: 'bg-purple-500' },
            { name: 'Avalanche', balance: '$28,679', color: 'bg-red-500' },
          ].map((network, index) => (
            <motion.div
              key={network.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${network.color}`}></div>
                <span className="text-xs text-slate-400">{network.name}</span>
              </div>
              <div className="text-sm font-semibold text-white">{network.balance}</div>
            </motion.div>
          ))}
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center"
        >
          <Zap className="w-4 h-4 text-cyan-400" />
        </motion.div>
      </div>
    </motion.div>
  )
}

const BlockchainLogos: React.FC = () => {
  const blockchains = [
    { 
      name: 'Bitcoin', 
      icon: Bitcoin, 
      imageUrl: null,
      color: 'bg-orange-500 border-orange-400' 
    },
    { 
      name: 'Ethereum', 
      icon: null, 
      imageUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      color: 'bg-blue-500 border-blue-400' 
    },
    { 
      name: 'BNB Chain', 
      icon: null, 
      imageUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      color: 'bg-yellow-500 border-yellow-400' 
    },
    { 
      name: 'Polygon', 
      icon: null, 
      imageUrl: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      color: 'bg-purple-500 border-purple-400' 
    },
    { 
      name: 'Avalanche', 
      icon: null, 
      imageUrl: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
      color: 'bg-red-500 border-red-400' 
    },
    { 
      name: 'Solana', 
      icon: null, 
      imageUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      color: 'bg-purple-500 border-purple-400' 
    },
    { 
      name: 'Cardano', 
      icon: null, 
      imageUrl: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      color: 'bg-blue-100 border-blue-500' 
    },
    { 
      name: 'Sui', 
      icon: null, 
      imageUrl: 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg',
      color: 'bg-cyan-500 border-cyan-400' 
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="flex items-center gap-6"
    >
      <span className="text-sm text-slate-400">Supported blockchains:</span>
      <div className="flex items-center">
        {blockchains.map((blockchain, index) => (
          <motion.div
            key={blockchain.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 + index * 0.1 }}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-white shadow-lg ${blockchain.color} ${
              index > 0 ? '-ml-3' : ''
            }`}
            style={{ zIndex: blockchains.length - index }}
            title={blockchain.name}
          >
            {blockchain.imageUrl ? (
              <img 
                src={blockchain.imageUrl} 
                alt={blockchain.name}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  // Fallback to background color if image fails to load
                  const target = e.currentTarget as HTMLImageElement
                  target.style.display = 'none'
                  // Show the first letter of the blockchain name as fallback
                  const parent = target.parentElement
                  if (parent && !parent.querySelector('.fallback-text')) {
                    const fallback = document.createElement('span')
                    fallback.className = 'fallback-text text-xs font-bold'
                    fallback.textContent = blockchain.name.charAt(0)
                    parent.appendChild(fallback)
                  }
                }}
              />
            ) : blockchain.icon ? (
              <blockchain.icon className="w-5 h-5" />
            ) : (
              <span className="text-xs font-bold">{blockchain.name.charAt(0)}</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const Web3HeroSection: React.FC<Web3HeroSectionProps> = ({ onNavigateToChecker }) => {
  const handleGitHubClick = () => {
    window.open('https://github.com/CHRISLeGURU/MULTI_CHAIN_EXPLORER', '_blank')
  }

  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
     
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge 
                variant="outline" 
                className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 backdrop-blur-sm px-4 py-2"
              >
                <Globe className="w-4 h-4 mr-2" />
                Multi-Chain Explorer
              </Badge>
            </motion.div>

            {/* Headlines */}
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                One Portal.
                <br />
                <span className="text-cyan-400">Every Chain.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl"
              >
                Explore all your crypto assets and their current USD value in one place. 
                Real-time data across 8+ blockchains. No more switching explorers.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                onClick={onNavigateToChecker}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-6 text-lg font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
              >
                Start Exploring
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleGitHubClick}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg backdrop-blur-sm"
              >
                <Github className="mr-3 w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Open Source</span>
                  <span className="text-sm opacity-70">Star on GitHub</span>
                </div>
              </Button>
            </motion.div>

            {/* Blockchain Support */}
            <BlockchainLogos />

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {[
                { icon: Shield, text: 'Free & Private' },
                { icon: Zap, text: 'Real-time Data' },
                { icon: Globe, text: '8+ Networks' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-slate-400">
                  <feature.icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="relative">
            <DashboardMockup />
            
            {/* Floating Network Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute -top-8 -left-8 hidden lg:block"
            >
              <Badge className="bg-orange-500/20 border-orange-500/50 text-orange-400">
                Bitcoin
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
              className="absolute -bottom-4 -right-8 hidden lg:block"
            >
              <Badge className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400">
                BNB Chain
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  )
}

export default Web3HeroSection