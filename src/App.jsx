import WalletConnect from './components/WalletConnect.jsx'
import PoolManager from './components/PoolManager.jsx'
import { useWeb3 } from './context/Web3Context.jsx'
import { APP_VERSION, DEPLOYMENT_INFO } from './constants/index.js'
import { CONTRACTS } from './config/web3.js'
import './App.css'

function App() {
  const { isConnected, formatAddress } = useWeb3()

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>TM Client</h1>
            <p>Decentralized Investment Pool Manager</p>
          </div>
          <div className="header-right">
            <WalletConnect />
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {isConnected ? (
          <div className="pool-section">
            <PoolManager />
          </div>
        ) : (
          <div className="connect-prompt">
            <div className="connect-message">
              <h2>Welcome to TM Client</h2>
              <p>Connect your MetaMask wallet to access the Investment Pool Manager</p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <span>Manage your investments</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Secure lock periods</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Real-time pool data</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌐</span>
                  <span>Sepolia testnet</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>&copy; 2024 TM Client v{APP_VERSION}. Built with React & Wagmi on {DEPLOYMENT_INFO.network}.</p>
          </div>
          <div className="footer-contract">
            <span className="contract-label">Pool Manager:</span>
            <code className="contract-address-footer">{formatAddress(CONTRACTS.POOL_MANAGER.address)}</code>
            <a 
              href={`https://sepolia.etherscan.io/address/${CONTRACTS.POOL_MANAGER.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-etherscan-link"
              title="View on Etherscan"
            >
              🔍
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
