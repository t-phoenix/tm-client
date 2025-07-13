import { createContext, useContext, useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { isMetaMaskInstalled, getMetaMaskInfo } from '../config/web3.js'
import toast from 'react-hot-toast'

const Web3Context = createContext()

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export const Web3Provider = ({ children }) => {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)

  // Get ETH balance
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address,
    enabled: !!address
  })

  // Check if user is on correct network
  useEffect(() => {
    if (isConnected && chainId !== sepolia.id) {
      setIsWrongNetwork(true)
      toast.error('Please switch to Sepolia testnet')
    } else {
      setIsWrongNetwork(false)
    }
  }, [isConnected, chainId])

  // Log available connectors and MetaMask status
  useEffect(() => {
    console.log('🔍 Available connectors:', connectors.map(c => ({ 
      id: c.id, 
      name: c.name, 
      type: c.type 
    })))
    console.log('🦊 MetaMask installed:', isMetaMaskInstalled())
    console.log('🔍 MetaMask info:', getMetaMaskInfo())
    console.log('🌍 Window.ethereum:', typeof window !== 'undefined' ? !!window.ethereum : 'N/A')
  }, [connectors])

  // Fallback method to connect directly to MetaMask
  const connectMetaMaskDirect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }
      
      console.log('🔗 Attempting direct MetaMask connection...')
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length > 0) {
        console.log('✅ Direct MetaMask connection successful:', accounts[0])
        toast.success('MetaMask connected directly!')
        return accounts[0]
      } else {
        throw new Error('No accounts returned')
      }
    } catch (error) {
      console.error('❌ Direct MetaMask connection failed:', error)
      throw error
    }
  }

  // Connect wallet function - improved MetaMask detection
  const connectWallet = async (preferredConnector = 'metaMask') => {
    try {
      // Check if MetaMask is installed first
      if (!isMetaMaskInstalled()) {
        toast.error('MetaMask is not installed. Please install MetaMask extension.')
        window.open('https://metamask.io/download/', '_blank')
        return
      }

      // Try to find MetaMask connector first, then fallback to injected
      let connector = connectors.find(c => c.id === 'metaMask')
      
      if (!connector) {
        // Fallback to injected connector (which includes MetaMask)
        connector = connectors.find(c => c.id === 'injected')
      }

      if (!connector) {
        console.log('🔄 No wagmi connector found, trying direct MetaMask connection...')
        await connectMetaMaskDirect()
        return
      }

      console.log('🔗 Connecting with connector:', connector.id, connector.name)
      
      await connect({ connector })
      toast.success('MetaMask connected successfully!')
    } catch (error) {
      console.error('MetaMask connection error:', error)
      
      if (error.message.includes('User rejected')) {
        toast.error('Connection rejected by user')
      } else if (error.message.includes('No compatible connector')) {
        toast.error('Unable to find MetaMask connector. Please refresh the page.')
      } else if (error.message.includes('already connected')) {
        toast.error('Wallet is already connected')
      } else {
        toast.error(`Connection failed: ${error.message}`)
      }
    }
  }

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      await disconnect()
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Disconnect error:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await switchChain({ chainId: sepolia.id })
      toast.success('Switched to Sepolia testnet')
    } catch (error) {
      console.error('Network switch error:', error)
      if (error.message.includes('User rejected')) {
        toast.error('Network switch rejected by user')
      } else {
        toast.error('Failed to switch network. Please switch manually in MetaMask.')
      }
    }
  }

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Format balance for display
  const formatBalance = (bal) => {
    if (!bal) return '0'
    return parseFloat(bal.formatted).toFixed(4)
  }

  // Check if MetaMask is available
  const isMetaMaskAvailable = isMetaMaskInstalled()

  const value = {
    // Wallet state
    address,
    isConnected,
    isConnecting: isConnecting || isPending,
    balance,
    chainId,
    isWrongNetwork,
    isMetaMaskAvailable,
    connectError,
    
    // Wallet functions
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    refetchBalance,
    
    // Available connectors
    connectors,
    
    // Utility functions
    formatAddress,
    formatBalance
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
} 