import { useWeb3 } from '../context/Web3Context.jsx'
import './WalletConnect.css'

const WalletConnect = () => {
  const { 
    isConnected, 
    isConnecting, 
    address, 
    balance, 
    isWrongNetwork,
    isMetaMaskAvailable,
    connectWallet, 
    disconnectWallet, 
    switchToSepolia,
    formatAddress,
    formatBalance
  } = useWeb3()

  // If connected, show wallet info and disconnect option
  if (isConnected) {
    return (
      <div className="wallet-header-connected">
        <div className="wallet-info-compact">
          <div className="wallet-address-compact">
            <span className="address-text" title={address}>
              {formatAddress(address)}
            </span>
          </div>
          <div className="wallet-balance-compact">
            <span className="balance-text">
              {formatBalance(balance)} ETH
            </span>
          </div>
        </div>
        
        {isWrongNetwork && (
          <button 
            onClick={switchToSepolia}
            className="network-switch-btn"
            title="Switch to Sepolia testnet"
          >
            Switch Network
          </button>
        )}
        
        <button 
          onClick={disconnectWallet}
          className="disconnect-btn-compact"
          title="Disconnect wallet"
        >
          Disconnect
        </button>
      </div>
    )
  }

  // If not connected, show connect button
  return (
    <div className="wallet-header-connect">
      <button
        onClick={() => connectWallet('metaMask')}
        disabled={isConnecting || !isMetaMaskAvailable}
        className="connect-btn-compact"
        title={
          !isMetaMaskAvailable 
            ? "MetaMask not installed" 
            : isConnecting 
              ? "Connecting..." 
              : "Connect with MetaMask"
        }
      >
        {isConnecting ? (
          <>
            <div className="spinner-small" />
            <span>Connecting...</span>
          </>
        ) : !isMetaMaskAvailable ? (
          <>
            <span className="metamask-icon">🦊</span>
            <span>Install MetaMask</span>
          </>
        ) : (
          <>
            <span className="metamask-icon">🦊</span>
            <span>Connect MetaMask</span>
          </>
        )}
      </button>
    </div>
  )
}

export default WalletConnect 