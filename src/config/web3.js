import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMask, injected } from 'wagmi/connectors'

// Wagmi configuration - MetaMask and injected connectors for better compatibility
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'TM Client',
      }
    }),
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [sepolia.id]: http()
  }
})

// Contract addresses from environment variables with fallback
export const POOL_MANAGER_ADDRESS = import.meta.env.VITE_POOL_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000'
export const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS || '0xA0b86a33E6417aB1E7b53D91d84b9A06B48fF071' // USDC on Sepolia

// Chain configurations
export const SUPPORTED_CHAINS = [sepolia]

// RPC URLs
export const RPC_URLS = {
  [sepolia.id]: import.meta.env.VITE_INFURA_API_KEY 
    ? `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
    : 'https://sepolia.infura.io/v3/'
}

// Contract configurations
export const CONTRACTS = {
  POOL_MANAGER: {
    address: POOL_MANAGER_ADDRESS,
    chainId: sepolia.id
  },
  USDC: {
    address: USDC_ADDRESS,
    chainId: sepolia.id,
    decimals: 6,
    symbol: 'USDC'
  }
}

// Network configurations
export const NETWORK_CONFIG = {
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    currency: 'ETH',
    poolCurrency: 'USDC',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: RPC_URLS[sepolia.id]
  }
}

// Enhanced MetaMask detection
export const isMetaMaskInstalled = () => {
  if (typeof window === 'undefined') return false
  
  // Check for MetaMask in multiple ways
  const hasEthereum = !!window.ethereum
  const isMetaMask = window.ethereum?.isMetaMask === true
  const hasMetaMaskProvider = window.ethereum?.providers?.some(p => p.isMetaMask) === true
  
  return hasEthereum && (isMetaMask || hasMetaMaskProvider)
}

// Get detailed MetaMask info for debugging
export const getMetaMaskInfo = () => {
  if (typeof window === 'undefined') return { available: false, reason: 'SSR' }
  
  if (!window.ethereum) {
    return { available: false, reason: 'No window.ethereum' }
  }
  
  if (window.ethereum.isMetaMask) {
    return { available: true, reason: 'Direct MetaMask detection' }
  }
  
  if (window.ethereum.providers) {
    const metamaskProvider = window.ethereum.providers.find(p => p.isMetaMask)
    if (metamaskProvider) {
      return { available: true, reason: 'MetaMask found in providers array' }
    }
  }
  
  return { 
    available: false, 
    reason: 'window.ethereum exists but isMetaMask is false',
    details: {
      isMetaMask: window.ethereum.isMetaMask,
      hasProviders: !!window.ethereum.providers,
      providerCount: window.ethereum.providers?.length || 0
    }
  }
}

// Log configuration in development
console.log('🔧 Web3 Configuration:', {
  contractAddress: POOL_MANAGER_ADDRESS,
  supportedChains: SUPPORTED_CHAINS.map(chain => chain.name),
  connectors: ['MetaMask', 'Injected'],
  metaMaskInstalled: isMetaMaskInstalled(),
}) 