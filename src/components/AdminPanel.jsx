import { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context.jsx'
import { usePoolManager } from '../hooks/usePoolManager.js'
import { CONTRACTS } from '../config/web3.js'
import { 
  CONTRACT_ROLES, 
  ADMIN_CONFIG,
  APP_VERSION,
  DEPLOYMENT_INFO,
  API_ENDPOINTS
} from '../constants/index.js'
import './AdminPanel.css'

const AdminPanel = () => {
  const { address, isConnected, formatAddress } = useWeb3()
  const {
    poolBalance,
    threshold,
    lockPeriod,
    multisig,
    fundingToken,
    poolToken,
    isAdmin,
    isManager,
    hasAdminAccess,
    formatBalance,
    formatLockPeriodDays,
    setThreshold,
    setLockPeriod,
    setMultisig,
    setManager,
    manualTransferToMultisig,
    emergencyWithdrawERC20,
    grantRole,
    revokeRole,
    isPending,
    isConfirming,
    hash
  } = usePoolManager()

  const [activeSection, setActiveSection] = useState('pool-settings')
  const [formData, setFormData] = useState({
    // Pool Settings
    newThreshold: '',
    newLockPeriod: '',
    newMultisig: '',
    newManager: '',
    
    // Emergency Actions
    transferAmount: '',
    emergencyTokenAddress: '',
    emergencyToAddress: '',
    emergencyAmount: '',
    
    // Role Management
    roleUserAddress: '',
    selectedRole: CONTRACT_ROLES.MANAGER_ROLE
  })

  // Reset form when switching sections
  useEffect(() => {
    setFormData({
      newThreshold: '',
      newLockPeriod: '',
      newMultisig: '',
      newManager: '',
      transferAmount: '',
      emergencyTokenAddress: '',
      emergencyToAddress: '',
      emergencyAmount: '',
      roleUserAddress: '',
      selectedRole: CONTRACT_ROLES.MANAGER_ROLE
    })
  }, [activeSection])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (action) => {
    switch (action) {
      case 'setThreshold':
        if (formData.newThreshold) {
          await setThreshold(formData.newThreshold)
        }
        break
      case 'setLockPeriod':
        if (formData.newLockPeriod) {
          await setLockPeriod(parseInt(formData.newLockPeriod))
        }
        break
      case 'setMultisig':
        if (formData.newMultisig) {
          await setMultisig(formData.newMultisig)
        }
        break
      case 'setManager':
        if (formData.newManager) {
          await setManager(formData.newManager)
        }
        break
      case 'manualTransfer':
        if (formData.transferAmount) {
          await manualTransferToMultisig(formData.transferAmount)
        }
        break
      case 'emergencyWithdraw':
        if (formData.emergencyTokenAddress && formData.emergencyToAddress && formData.emergencyAmount) {
          await emergencyWithdrawERC20(
            formData.emergencyTokenAddress,
            formData.emergencyToAddress,
            formData.emergencyAmount
          )
        }
        break
      case 'grantRole':
        if (formData.roleUserAddress && formData.selectedRole) {
          await grantRole(formData.selectedRole, formData.roleUserAddress)
        }
        break
      case 'revokeRole':
        if (formData.roleUserAddress && formData.selectedRole) {
          await revokeRole(formData.selectedRole, formData.roleUserAddress)
        }
        break
    }
  }

  if (!isConnected) {
    return (
      <div className="admin-panel">
        <div className="admin-error">
          <h2>Admin Panel Access Required</h2>
          <p>Please connect your wallet to access the admin panel.</p>
        </div>
      </div>
    )
  }

  if (!hasAdminAccess) {
    return (
      <div className="admin-panel">
        <div className="admin-error">
          <h2>Unauthorized Access</h2>
          <p>You don't have permission to access the admin panel.</p>
          <div className="access-info">
            <p><strong>Your Address:</strong> {formatAddress(address)}</p>
            <p><strong>Admin Status:</strong> {isAdmin ? '✅ Admin' : '❌ Not Admin'}</p>
            <p><strong>Manager Status:</strong> {isManager ? '✅ Manager' : '❌ Not Manager'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🔧 Admin Panel</h1>
        <div className="admin-status">
          <span className="status-badge">
            {isAdmin ? '👑 Admin' : '👥 Manager'}
          </span>
          <span className="address-info">{formatAddress(address)}</span>
        </div>
      </div>

      <div className="admin-navigation">
        {ADMIN_CONFIG.SECTIONS.map(section => (
          <button
            key={section.id}
            className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.name}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeSection === 'pool-settings' && (
          <div className="admin-section">
            <h2>Pool Settings</h2>
            <p>Manage pool parameters and configuration</p>

            <div className="current-values">
              <h3>Current Values</h3>
              <div className="value-grid">
                <div className="value-item">
                  <label>Pool Balance:</label>
                  <span>{formatBalance(poolBalance)} ETH</span>
                </div>
                <div className="value-item">
                  <label>Threshold:</label>
                  <span>{formatBalance(threshold)} ETH</span>
                </div>
                <div className="value-item">
                  <label>Lock Period:</label>
                  <span>{formatLockPeriodDays(lockPeriod)} days</span>
                </div>
                <div className="value-item">
                  <label>Multisig:</label>
                  <span title={multisig}>{formatAddress(multisig)}</span>
                </div>
              </div>
            </div>

            <div className="admin-forms">
              <div className="form-group">
                <label>Set New Threshold (ETH)</label>
                <div className="input-row">
                  <input
                    type="number"
                    placeholder="0.0"
                    step="0.001"
                    value={formData.newThreshold}
                    onChange={(e) => handleInputChange('newThreshold', e.target.value)}
                  />
                  <button 
                    onClick={() => handleSubmit('setThreshold')}
                    disabled={!formData.newThreshold || isPending}
                    className="action-btn primary"
                  >
                    {isPending ? 'Setting...' : 'Set Threshold'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Set Lock Period (Days)</label>
                <div className="input-row">
                  <input
                    type="number"
                    placeholder="30"
                    min="0"
                    value={formData.newLockPeriod}
                    onChange={(e) => handleInputChange('newLockPeriod', e.target.value)}
                  />
                  <button 
                    onClick={() => handleSubmit('setLockPeriod')}
                    disabled={!formData.newLockPeriod || isPending}
                    className="action-btn primary"
                  >
                    {isPending ? 'Setting...' : 'Set Lock Period'}
                  </button>
                </div>
              </div>

              {isAdmin && (
                <>
                  <div className="form-group">
                    <label>Set Multisig Address</label>
                    <div className="input-row">
                      <input
                        type="text"
                        placeholder="0x..."
                        value={formData.newMultisig}
                        onChange={(e) => handleInputChange('newMultisig', e.target.value)}
                      />
                      <button 
                        onClick={() => handleSubmit('setMultisig')}
                        disabled={!formData.newMultisig || isPending}
                        className="action-btn danger"
                      >
                        {isPending ? 'Setting...' : 'Set Multisig'}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Set Manager Address</label>
                    <div className="input-row">
                      <input
                        type="text"
                        placeholder="0x..."
                        value={formData.newManager}
                        onChange={(e) => handleInputChange('newManager', e.target.value)}
                      />
                      <button 
                        onClick={() => handleSubmit('setManager')}
                        disabled={!formData.newManager || isPending}
                        className="action-btn danger"
                      >
                        {isPending ? 'Setting...' : 'Set Manager'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeSection === 'role-management' && (
          <div className="admin-section">
            <h2>Role Management</h2>
            <p>Grant and revoke user roles</p>

            {!isAdmin && (
              <div className="warning-message">
                ⚠️ Only admins can manage roles. You have manager privileges.
              </div>
            )}

            {isAdmin && (
              <div className="admin-forms">
                <div className="form-group">
                  <label>User Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={formData.roleUserAddress}
                    onChange={(e) => handleInputChange('roleUserAddress', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.selectedRole}
                    onChange={(e) => handleInputChange('selectedRole', e.target.value)}
                  >
                    <option value={CONTRACT_ROLES.MANAGER_ROLE}>Manager Role</option>
                    <option value={CONTRACT_ROLES.DEFAULT_ADMIN_ROLE}>Admin Role</option>
                  </select>
                </div>

                <div className="button-group">
                  <button 
                    onClick={() => handleSubmit('grantRole')}
                    disabled={!formData.roleUserAddress || isPending}
                    className="action-btn success"
                  >
                    {isPending ? 'Granting...' : 'Grant Role'}
                  </button>
                  <button 
                    onClick={() => handleSubmit('revokeRole')}
                    disabled={!formData.roleUserAddress || isPending}
                    className="action-btn danger"
                  >
                    {isPending ? 'Revoking...' : 'Revoke Role'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'emergency-actions' && (
          <div className="admin-section">
            <h2>Emergency Actions</h2>
            <p>Emergency withdrawals and manual transfers</p>

            <div className="admin-forms">
              <div className="form-group">
                <label>Manual Transfer to Multisig (ETH)</label>
                <div className="input-row">
                  <input
                    type="number"
                    placeholder="0.0"
                    step="0.001"
                    value={formData.transferAmount}
                    onChange={(e) => handleInputChange('transferAmount', e.target.value)}
                  />
                  <button 
                    onClick={() => handleSubmit('manualTransfer')}
                    disabled={!formData.transferAmount || isPending}
                    className="action-btn warning"
                  >
                    {isPending ? 'Transferring...' : 'Transfer to Multisig'}
                  </button>
                </div>
              </div>

              {isAdmin && (
                <div className="emergency-section">
                  <h3>🚨 Emergency ERC20 Withdrawal</h3>
                  <div className="form-group">
                    <label>Token Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={formData.emergencyTokenAddress}
                      onChange={(e) => handleInputChange('emergencyTokenAddress', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>To Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={formData.emergencyToAddress}
                      onChange={(e) => handleInputChange('emergencyToAddress', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      placeholder="0.0"
                      step="0.001"
                      value={formData.emergencyAmount}
                      onChange={(e) => handleInputChange('emergencyAmount', e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => handleSubmit('emergencyWithdraw')}
                    disabled={
                      !formData.emergencyTokenAddress || 
                      !formData.emergencyToAddress || 
                      !formData.emergencyAmount || 
                      isPending
                    }
                    className="action-btn danger"
                  >
                    {isPending ? 'Withdrawing...' : '🚨 Emergency Withdraw'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'system-info' && (
          <div className="admin-section">
            <h2>System Information</h2>
            <p>View contract and system information</p>

            <div className="info-grid">
              <div className="info-section">
                <h3>Application Info</h3>
                <div className="info-items">
                  <div className="info-item">
                    <label>Version:</label>
                    <span>{APP_VERSION}</span>
                  </div>
                  <div className="info-item">
                    <label>Network:</label>
                    <span>{DEPLOYMENT_INFO.network}</span>
                  </div>
                  <div className="info-item">
                    <label>Chain ID:</label>
                    <span>{DEPLOYMENT_INFO.chainId}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Contract Addresses</h3>
                <div className="info-items">
                  <div className="info-item">
                    <label>Pool Manager:</label>
                    <a 
                      href={`${API_ENDPOINTS.ETHERSCAN}/address/${CONTRACTS.POOL_MANAGER.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="address-link"
                    >
                      {formatAddress(CONTRACTS.POOL_MANAGER.address)}
                    </a>
                  </div>
                  <div className="info-item">
                    <label>Funding Token:</label>
                    <span title={fundingToken}>{formatAddress(fundingToken)}</span>
                  </div>
                  <div className="info-item">
                    <label>Pool Token:</label>
                    <span title={poolToken}>{formatAddress(poolToken)}</span>
                  </div>
                  <div className="info-item">
                    <label>Multisig:</label>
                    <span title={multisig}>{formatAddress(multisig)}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Your Permissions</h3>
                <div className="info-items">
                  <div className="info-item">
                    <label>Address:</label>
                    <span>{formatAddress(address)}</span>
                  </div>
                  <div className="info-item">
                    <label>Admin Role:</label>
                    <span className={isAdmin ? 'status-success' : 'status-error'}>
                      {isAdmin ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Manager Role:</label>
                    <span className={isManager ? 'status-success' : 'status-error'}>
                      {isManager ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {hash && (
        <div className="transaction-status">
          <p>
            {isConfirming ? '⏳ Confirming transaction...' : '✅ Transaction sent!'}
          </p>
          <a 
            href={`${API_ENDPOINTS.ETHERSCAN}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View on Etherscan
          </a>
        </div>
      )}
    </div>
  )
}

export default AdminPanel 