import { useState } from 'react'
import { APP_VERSION } from '../constants/index.js'
import { CONTRACTS } from '../config/web3.js'
import './Instructions.css'

const Instructions = () => {
  const [activeSection, setActiveSection] = useState('user')

  return (
    <div className="instructions">
      <div className="instructions-header">
        <h2>📖 User Guide</h2>
        <p>Complete guide to using TM Client v{APP_VERSION}</p>
      </div>

      <div className="instructions-nav">
        <button 
          className={`nav-btn ${activeSection === 'user' ? 'active' : ''}`}
          onClick={() => setActiveSection('user')}
        >
          👤 User Guide
        </button>
        <button 
          className={`nav-btn ${activeSection === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveSection('admin')}
        >
          👑 Admin Guide
        </button>
        <button 
          className={`nav-btn ${activeSection === 'setup' ? 'active' : ''}`}
          onClick={() => setActiveSection('setup')}
        >
          ⚙️ Setup
        </button>
      </div>

      <div className="instructions-content">
        {activeSection === 'user' && (
          <div className="instructions-section">
            <h3>User Instructions</h3>
            
            <div className="instruction-block">
              <h4>🦊 Step 1: Connect Your Wallet</h4>
              <ol>
                <li>Click the <strong>"Connect MetaMask"</strong> button in the top-right corner</li>
                <li>Make sure you have MetaMask installed in your browser</li>
                <li>Approve the connection request in MetaMask</li>
                <li>Ensure you're on <strong>Sepolia testnet</strong> (the app will prompt you to switch if needed)</li>
              </ol>
              <div className="tip">
                <strong>💡 Tip:</strong> If you don't have MetaMask, click the button to download it from the official website.
              </div>
            </div>

            <div className="instruction-block">
              <h4>📊 Step 2: Understanding Pool Information</h4>
              <p>In the <strong>Pool Info</strong> tab, you can view:</p>
              <ul>
                <li><strong>Total Pool Balance:</strong> Total ETH in the investment pool</li>
                <li><strong>Your Deposit:</strong> Amount you've deposited and lock status</li>
                <li><strong>Your Portion:</strong> Your calculated share of the pool</li>
                <li><strong>Threshold:</strong> Amount that triggers automatic transfers</li>
                <li><strong>Lock Period:</strong> How long deposits are locked (in days)</li>
                <li><strong>Access Level:</strong> Your permission level (User/Admin/Manager)</li>
                <li><strong>Contract Information:</strong> Pool Manager contract address and network details</li>
              </ul>
            </div>

            <div className="instruction-block">
              <h4>💰 Step 3: Making Deposits</h4>
              <ol>
                <li>Go to the <strong>Deposit</strong> tab</li>
                <li>Enter the amount of ETH you want to deposit (minimum 0.001 ETH)</li>
                <li>Click <strong>"Deposit"</strong> button</li>
                <li>Confirm the transaction in MetaMask</li>
                <li>Wait for transaction confirmation</li>
              </ol>
              <div className="warning">
                <strong>⚠️ Important:</strong> Deposits are locked for the specified lock period. You cannot withdraw immediately after depositing.
              </div>
            </div>

            <div className="instruction-block">
              <h4>💸 Step 4: Making Withdrawals</h4>
              <ol>
                <li>Go to the <strong>Withdraw</strong> tab</li>
                <li>Enter the amount you want to withdraw (minimum 0.001 ETH)</li>
                <li>Check if your deposit is still locked (warning will appear if locked)</li>
                <li>Click <strong>"Withdraw"</strong> button</li>
                <li>Confirm the transaction in MetaMask</li>
              </ol>
              <div className="tip">
                <strong>💡 Note:</strong> Some withdrawals may be processed immediately, while others might require fulfillment by pool managers.
              </div>
            </div>

            <div className="instruction-block">
              <h4>⏳ Step 5: Managing Pending Withdrawals</h4>
              <ol>
                <li>Go to the <strong>Pending</strong> tab</li>
                <li>View all your pending withdrawal requests</li>
                <li>Click <strong>"Fulfill"</strong> on any pending withdrawal to complete it</li>
                <li>Confirm the transaction in MetaMask</li>
              </ol>
            </div>

            <div className="instruction-block">
              <h4>🔧 Troubleshooting</h4>
              <ul>
                <li><strong>Transaction Failed:</strong> Ensure you have sufficient Sepolia ETH for gas fees</li>
                <li><strong>Wrong Network:</strong> Switch to Sepolia testnet in MetaMask</li>
                <li><strong>MetaMask Issues:</strong> Try refreshing the page or reconnecting your wallet</li>
                <li><strong>Locked Deposits:</strong> Wait for the lock period to expire before withdrawing</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'admin' && (
          <div className="instructions-section">
            <h3>Administrator Guide</h3>
            
            <div className="instruction-block">
              <h4>👑 Admin Access Requirements</h4>
              <ul>
                <li>Your wallet must have <strong>Admin</strong> or <strong>Manager</strong> role in the smart contract</li>
                <li>Connect with an authorized wallet address</li>
                <li>The <strong>🔧 Admin</strong> tab will appear when you have the required permissions</li>
              </ul>
            </div>

            <div className="instruction-block">
              <h4>⚙️ Pool Settings Management</h4>
              <p>In the <strong>Pool Settings</strong> section, you can:</p>
              <ul>
                <li><strong>Set Threshold:</strong> Configure the ETH amount that triggers automatic transfers to multisig</li>
                <li><strong>Set Lock Period:</strong> Change how long deposits are locked (in days)</li>
                <li><strong>Set Multisig Address</strong> (Admin only): Update the multisig wallet address</li>
                <li><strong>Set Manager Address</strong> (Admin only): Assign or change pool manager</li>
              </ul>
              <div className="warning">
                <strong>⚠️ Critical:</strong> Multisig and Manager changes are permanent and only available to full admins.
              </div>
            </div>

            <div className="instruction-block">
              <h4>👥 Role Management (Admin Only)</h4>
              <ol>
                <li>Go to <strong>Role Management</strong> section</li>
                <li>Enter the user's wallet address</li>
                <li>Select role type: <strong>Manager Role</strong> or <strong>Admin Role</strong></li>
                <li>Click <strong>"Grant Role"</strong> to give permissions</li>
                <li>Click <strong>"Revoke Role"</strong> to remove permissions</li>
              </ol>
              <div className="tip">
                <strong>💡 Roles Explained:</strong>
                <br />• <strong>Admin:</strong> Full control including role management and emergency functions
                <br />• <strong>Manager:</strong> Pool settings and manual transfers, but no role management
              </div>
            </div>

            <div className="instruction-block">
              <h4>🚨 Emergency Actions</h4>
              <p><strong>Manual Transfer to Multisig:</strong></p>
              <ol>
                <li>Enter amount in ETH to transfer</li>
                <li>Click <strong>"Transfer to Multisig"</strong></li>
                <li>Confirm the transaction</li>
              </ol>
              
              <p><strong>Emergency ERC20 Withdrawal (Admin Only):</strong></p>
              <ol>
                <li>Enter the ERC20 token contract address</li>
                <li>Enter the destination wallet address</li>
                <li>Enter the amount to withdraw</li>
                <li>Click <strong>"🚨 Emergency Withdraw"</strong></li>
              </ol>
              <div className="warning">
                <strong>⚠️ Use with Extreme Caution:</strong> Emergency functions are for critical situations only and cannot be undone.
              </div>
            </div>

            <div className="instruction-block">
              <h4>📊 System Information</h4>
              <p>Monitor important system details:</p>
              <ul>
                <li><strong>Application Info:</strong> Version, network, chain ID</li>
                <li><strong>Contract Addresses:</strong> Pool Manager, tokens, multisig (with Etherscan links)</li>
                <li><strong>Your Permissions:</strong> Current admin and manager status</li>
              </ul>
            </div>

            <div className="instruction-block">
              <h4>🔐 Best Practices for Admins</h4>
              <ul>
                <li>Always verify contract addresses before making changes</li>
                <li>Test with small amounts first</li>
                <li>Keep multisig address secure and backed up</li>
                <li>Document all administrative actions</li>
                <li>Only grant roles to trusted addresses</li>
                <li>Monitor pool balance and user activity regularly</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'setup' && (
          <div className="instructions-section">
            <h3>Setup & Configuration</h3>
            
            <div className="instruction-block">
              <h4>🔧 Initial Setup</h4>
              <ol>
                <li><strong>Install MetaMask:</strong> Download from <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">metamask.io</a></li>
                <li><strong>Get Sepolia ETH:</strong> Use faucets like:
                  <ul>
                    <li><a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer">sepoliafaucet.com</a></li>
                    <li><a href="https://www.alchemy.com/faucets/ethereum-sepolia" target="_blank" rel="noopener noreferrer">Alchemy Sepolia Faucet</a></li>
                  </ul>
                </li>
                <li><strong>Add Sepolia Network:</strong> MetaMask should auto-detect, or add manually:
                  <ul>
                    <li>Network Name: Sepolia Testnet</li>
                    <li>RPC URL: https://sepolia.infura.io/v3/YOUR_KEY</li>
                    <li>Chain ID: 11155111</li>
                    <li>Symbol: ETH</li>
                    <li>Explorer: https://sepolia.etherscan.io</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="instruction-block">
              <h4>📜 Contract Information</h4>
              <p>You are interacting with the following smart contract:</p>
              <div className="contract-info-block">
                <div className="contract-detail">
                  <strong>Pool Manager Contract:</strong>
                  <div className="contract-address-display">
                    <code>{CONTRACTS.POOL_MANAGER.address}</code>
                    <a 
                      href={`https://sepolia.etherscan.io/address/${CONTRACTS.POOL_MANAGER.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="verify-link"
                    >
                      🔍 Verify on Etherscan
                    </a>
                  </div>
                </div>
                <div className="contract-detail">
                  <strong>Network:</strong> Sepolia Testnet (Chain ID: 11155111)
                </div>
              </div>
              <div className="tip">
                <strong>💡 Security:</strong> Always verify the contract address matches what you expect before making transactions. You can view the contract on Etherscan to verify its authenticity.
              </div>
            </div>

            <div className="instruction-block">
              <h4>📋 Environment Configuration (Optional)</h4>
              <p>Create a <code>.env</code> file in your project root for better performance:</p>
              <div className="code-block">
                <pre>{`# Contract Configuration
VITE_POOL_MANAGER_ADDRESS=${CONTRACTS.POOL_MANAGER.address}

# Optional: Better RPC Performance  
VITE_INFURA_API_KEY=your_infura_key

# Optional: Build Information
VITE_BUILD_HASH=your_build_hash
VITE_COMMIT_HASH=your_commit_hash`}</pre>
              </div>
            </div>

            <div className="instruction-block">
              <h4>🌐 Network Information</h4>
              <ul>
                <li><strong>Network:</strong> Ethereum Sepolia Testnet</li>
                <li><strong>Chain ID:</strong> 11155111</li>
                <li><strong>Explorer:</strong> <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer">sepolia.etherscan.io</a></li>
                <li><strong>Supported Wallets:</strong> MetaMask (primary)</li>
                <li><strong>Gas Token:</strong> Sepolia ETH (free from faucets)</li>
              </ul>
            </div>

            <div className="instruction-block">
              <h4>📱 Browser Compatibility</h4>
              <ul>
                <li><strong>Recommended:</strong> Chrome, Firefox, Brave with MetaMask extension</li>
                <li><strong>Mobile:</strong> MetaMask mobile browser or mobile Chrome/Firefox</li>
                <li><strong>Requirements:</strong> Modern browser with Web3 support</li>
              </ul>
            </div>

            <div className="instruction-block">
              <h4>🆘 Getting Help</h4>
              <ul>
                <li><strong>Check Console:</strong> Open browser dev tools (F12) for error details</li>
                <li><strong>Transaction Issues:</strong> View on Etherscan for detailed information</li>
                <li><strong>Network Problems:</strong> Verify you're on Sepolia testnet</li>
                <li><strong>Gas Issues:</strong> Ensure sufficient Sepolia ETH in wallet</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Instructions 