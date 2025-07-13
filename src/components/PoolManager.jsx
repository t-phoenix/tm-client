import { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context.jsx'
import { usePoolManager } from '../hooks/usePoolManager.js'
import { CONTRACTS } from '../config/web3.js'
import Instructions from './Instructions.jsx'
import './PoolManager.css'

const PoolManager = () => {
  const { isConnected, isWrongNetwork, formatAddress } = useWeb3()
  const {
    poolBalance,
    userDeposit,
    userPortion,
    threshold,
    lockPeriod,
    pendingWithdrawals,
    hasAdminAccess,
    userUSDCBalance,
    usdcAllowance,
    usdcSymbol,
    deposit,
    withdraw,
    fulfillPendingWithdrawal,
    approveUSDC,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    formatBalance,
    formatUSDCBalance,
    hasInsufficientAllowance,
    isDepositLocked,
    getLockTimeRemaining,
    refetchAll
  } = usePoolManager()

  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [activeTab, setActiveTab] = useState('pool')

  // Refetch data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchAll()
    }
  }, [isConfirmed, refetchAll])

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return
    await deposit(depositAmount)
    setDepositAmount('')
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return
    await withdraw(withdrawAmount)
    setWithdrawAmount('')
  }

  const formatLockTime = (seconds) => {
    if (seconds <= 0) return 'Not locked'
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (!isConnected) {
    return (
      <div className="pool-manager">
        <div className="connect-prompt">
          <h2>Connect your wallet to access the Pool Manager</h2>
          <p>Please connect your wallet to interact with the investment pool</p>
        </div>
      </div>
    )
  }

  if (isWrongNetwork) {
    return (
      <div className="pool-manager">
        <div className="wrong-network-prompt">
          <h2>Wrong Network</h2>
          <p>Please switch to Sepolia testnet to use this dApp</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pool-manager">
      <div className="pool-header">
        <h1>Investment Pool Manager</h1>
        <p>Manage your investments in the decentralized pool</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'pool' ? 'active' : ''}`}
          onClick={() => setActiveTab('pool')}
        >
          Pool Info
        </button>
        <button 
          className={`tab ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          Deposit
        </button>
        <button 
          className={`tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        {/* Show Admin tab only if user has admin access */}
        {hasAdminAccess && (
          <button 
            className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            🔧 Admin
          </button>
        )}
        <button 
          className={`tab ${activeTab === 'help' ? 'active' : ''}`}
          onClick={() => setActiveTab('help')}
        >
          📖 Help
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'pool' && (
          <div className="pool-info">
            <div className="info-cards">
              <div className="info-card">
                <h3>Total Pool Balance</h3>
                <p className="balance-value">
                  {formatBalance(poolBalance)} {usdcSymbol || 'USDC'}
                </p>
              </div>
              <div className="info-card">
                <h3>Your USDC Balance</h3>
                <p className="balance-value">
                  {formatUSDCBalance(userUSDCBalance)} {usdcSymbol || 'USDC'}
                </p>
                <p className="balance-subtext">
                  Available in wallet
                </p>
              </div>
              <div className="info-card">
                <h3>Your Deposit</h3>
                <p className="balance-value">
                  {userDeposit ? formatBalance(userDeposit.amount) : '0'} {usdcSymbol || 'USDC'}
                </p>
                {userDeposit && isDepositLocked(userDeposit) && (
                  <p className="lock-info">
                    🔒 Locked for {formatLockTime(getLockTimeRemaining(userDeposit))}
                  </p>
                )}
              </div>
              <div className="info-card">
                <h3>Your Portion</h3>
                <p className="balance-value">
                  {userPortion ? formatBalance(userPortion) : '0'} {usdcSymbol || 'USDC'}
                </p>
              </div>
              <div className="info-card">
                <h3>Threshold</h3>
                <p className="balance-value">
                  {formatBalance(threshold)} {usdcSymbol || 'USDC'}
                </p>
              </div>
              <div className="info-card">
                <h3>USDC Allowance</h3>
                <p className="balance-value">
                  {formatUSDCBalance(usdcAllowance)} {usdcSymbol || 'USDC'}
                </p>
                <p className="balance-subtext">
                  Approved for pool
                </p>
              </div>
            </div>
            
            {/* Additional pool information */}
            <div className="pool-details">
              <h3>Pool Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Lock Period:</label>
                  <span>{lockPeriod ? Math.floor(Number(lockPeriod) / (24 * 60 * 60)) : 0} days</span>
                </div>
                <div className="detail-item">
                  <label>Pending Withdrawals:</label>
                  <span>{pendingWithdrawals ? pendingWithdrawals.length : 0}</span>
                </div>
                <div className="detail-item">
                  <label>Your Access Level:</label>
                  <span className={hasAdminAccess ? 'admin-badge' : 'user-badge'}>
                    {hasAdminAccess ? '👑 Admin/Manager' : '👤 User'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contract Information */}
            <div className="contract-info">
              <h3>Contract Information</h3>
              <div className="contract-details">
                <div className="contract-item">
                  <label>Pool Manager Contract:</label>
                  <div className="contract-address">
                    <span className="address-text" title={CONTRACTS.POOL_MANAGER.address}>
                      {formatAddress(CONTRACTS.POOL_MANAGER.address)}
                    </span>
                    <a 
                      href={`https://sepolia.etherscan.io/address/${CONTRACTS.POOL_MANAGER.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="etherscan-link"
                      title="View on Etherscan"
                    >
                      🔍 View
                    </a>
                  </div>
                </div>
                <div className="contract-item">
                  <label>Network:</label>
                  <span>Sepolia Testnet (Chain ID: 11155111)</span>
                </div>
                <div className="contract-item">
                  <label>Full Address:</label>
                  <div className="full-address">
                    <code>{CONTRACTS.POOL_MANAGER.address}</code>
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(CONTRACTS.POOL_MANAGER.address)
                        alert('Address copied to clipboard!')
                      }}
                      title="Copy address"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deposit' && (
          <div className="deposit-section">
            <h3>Deposit {usdcSymbol || 'USDC'}</h3>
            
            {/* User balance info */}
            <div className="balance-info">
              <p>Your USDC Balance: <strong>{formatUSDCBalance(userUSDCBalance)} {usdcSymbol || 'USDC'}</strong></p>
              <p>Current Allowance: <strong>{formatUSDCBalance(usdcAllowance)} {usdcSymbol || 'USDC'}</strong></p>
            </div>

            <div className="input-group">
              <input
                type="number"
                placeholder={`Amount in ${usdcSymbol || 'USDC'}`}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="0"
                step="0.1"
                className="amount-input"
              />
              
              {/* Show approve button if insufficient allowance */}
              {depositAmount && hasInsufficientAllowance(depositAmount) ? (
                <button 
                  onClick={() => approveUSDC(depositAmount)}
                  disabled={isPending || isConfirming || !depositAmount}
                  className="action-btn approve-btn"
                >
                  {isPending || isConfirming ? 'Processing...' : `Approve ${usdcSymbol || 'USDC'}`}
                </button>
              ) : (
                <button 
                  onClick={handleDeposit}
                  disabled={isPending || isConfirming || !depositAmount}
                  className="action-btn deposit-btn"
                >
                  {isPending || isConfirming ? 'Processing...' : 'Deposit'}
                </button>
              )}
            </div>
            
            <p className="lock-period-info">
              ⏰ Lock period: {lockPeriod ? Math.floor(Number(lockPeriod) / (24 * 60 * 60)) : 0} days
            </p>
            <p className="min-amount-info">
              💡 Minimum deposit: 1 {usdcSymbol || 'USDC'}
            </p>
            
            {/* Instructions */}
            <div className="deposit-instructions">
              <p><strong>💡 How to deposit:</strong></p>
              <ol>
                <li>Enter the amount you want to deposit</li>
                <li>Click "Approve USDC" to allow the contract to spend your USDC</li>
                <li>Once approved, click "Deposit" to complete the transaction</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="withdraw-section">
            <h3>Withdraw {usdcSymbol || 'USDC'}</h3>
            
            {/* User deposit info */}
            <div className="balance-info">
              <p>Your Deposit: <strong>{userDeposit ? formatBalance(userDeposit.amount) : '0'} {usdcSymbol || 'USDC'}</strong></p>
              <p>Your Portion: <strong>{userPortion ? formatBalance(userPortion) : '0'} {usdcSymbol || 'USDC'}</strong></p>
            </div>

            <div className="input-group">
              <input
                type="number"
                placeholder={`Amount in ${usdcSymbol || 'USDC'}`}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                step="0.1"
                className="amount-input"
              />
              <button 
                onClick={handleWithdraw}
                disabled={isPending || isConfirming || !withdrawAmount}
                className="action-btn withdraw-btn"
              >
                {isPending || isConfirming ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
            
            {userDeposit && isDepositLocked(userDeposit) && (
              <p className="warning">
                ⚠️ Your deposit is locked for {formatLockTime(getLockTimeRemaining(userDeposit))}
              </p>
            )}
            <p className="min-amount-info">
              💡 Minimum withdrawal: 1 {usdcSymbol || 'USDC'}
            </p>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="pending-section">
            <h3>Pending Withdrawals</h3>
            {pendingWithdrawals && pendingWithdrawals.length > 0 ? (
              <div className="pending-list">
                {pendingWithdrawals.map((withdrawalId, index) => (
                  <div key={index} className="pending-item">
                    <span>Withdrawal ID: {withdrawalId.toString()}</span>
                    <button 
                      onClick={() => fulfillPendingWithdrawal(withdrawalId)}
                      disabled={isPending || isConfirming}
                      className="action-btn fulfill-btn"
                    >
                      {isPending || isConfirming ? 'Processing...' : 'Fulfill'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-pending">
                <p>No pending withdrawals</p>
                <p>All your withdrawal requests have been processed.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && hasAdminAccess && (
          <div className="admin-placeholder">
            <h3>🔧 Admin Panel</h3>
            <p>Admin functionality will be available when a valid contract address is configured.</p>
            <div className="admin-info">
              <p>Your account has administrative privileges.</p>
              <p>To enable full admin features, please configure:</p>
              <ul>
                <li>Contract address in environment variables</li>
                <li>Proper network connection</li>
                <li>Admin role permissions</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <Instructions />
        )}
      </div>

      {hash && activeTab !== 'admin' && activeTab !== 'help' && (
        <div className="transaction-hash">
          <p>Transaction Hash:</p>
          <a 
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hash-link"
          >
            {hash}
          </a>
        </div>
      )}
    </div>
  )
}

export default PoolManager 