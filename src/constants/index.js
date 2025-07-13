// Application Constants
export const APP_VERSION = '1.0.0'
export const APP_NAME = 'TM Client'
export const APP_DESCRIPTION = 'Decentralized Investment Pool Manager'

// Deployment Information
export const DEPLOYMENT_INFO = {
  version: APP_VERSION,
  network: 'Sepolia Testnet',
  chainId: 11155111,
}

// Contract Roles (from the ABI)
export const CONTRACT_ROLES = {
  DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
  MANAGER_ROLE: '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08'
}

// Application Configuration
export const APP_CONFIG = {
  // UI Settings
  REFRESH_INTERVAL: 30000, // 30 seconds
  TOAST_DURATION: 4000, // 4 seconds
  
  // Contract Settings
  DEFAULT_GAS_LIMIT: 300000,
  GAS_LIMIT_BUFFER: 1.2, // 20% buffer
  
  // Feature Flags
  ENABLE_ADMIN_PANEL: true,
  ENABLE_DEBUG_MODE: true, // Enable for development
  ENABLE_ANALYTICS: false,
  
  // Network Settings
  SUPPORTED_NETWORKS: [11155111], // Sepolia
  BLOCK_CONFIRMATIONS: 1,
  
  // Pool Settings
  MIN_DEPOSIT_AMOUNT: '1', // USDC
  MIN_WITHDRAWAL_AMOUNT: '1', // USDC
}

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your MetaMask wallet',
  WRONG_NETWORK: 'Please switch to Sepolia testnet',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  INVALID_AMOUNT: 'Please enter a valid amount',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  CONTRACT_NOT_FOUND: 'Contract not found on this network',
  METAMASK_NOT_INSTALLED: 'MetaMask is not installed',
  UNAUTHORIZED: 'You are not authorized to perform this action'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully!',
  TRANSACTION_SENT: 'Transaction sent! Please wait for confirmation.',
  DEPOSIT_SUCCESS: 'Deposit completed successfully!',
  WITHDRAWAL_SUCCESS: 'Withdrawal completed successfully!',
  ADMIN_ACTION_SUCCESS: 'Admin action completed successfully!',
  NETWORK_SWITCHED: 'Network switched successfully!'
}

// API Endpoints
export const API_ENDPOINTS = {
  ETHERSCAN: 'https://sepolia.etherscan.io',
  INFURA: 'https://sepolia.infura.io/v3',
  COINGECKO: 'https://api.coingecko.com/api/v3'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  LAST_CONNECTED_WALLET: 'tm-client-last-wallet',
  USER_PREFERENCES: 'tm-client-preferences',
  CACHE_TIMESTAMP: 'tm-client-cache-timestamp'
}

// Transaction Types for tracking
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  FULFILL_WITHDRAWAL: 'fulfill_withdrawal',
  EMERGENCY_WITHDRAW: 'emergency_withdraw',
  MANUAL_TRANSFER: 'manual_transfer',
  SET_THRESHOLD: 'set_threshold',
  SET_LOCK_PERIOD: 'set_lock_period',
  SET_MANAGER: 'set_manager',
  SET_MULTISIG: 'set_multisig',
  GRANT_ROLE: 'grant_role',
  REVOKE_ROLE: 'revoke_role'
}

// Admin Panel Configuration
export const ADMIN_CONFIG = {
  SECTIONS: [
    {
      id: 'pool-settings',
      name: 'Pool Settings',
      description: 'Manage pool parameters and configuration'
    },
    {
      id: 'role-management',
      name: 'Role Management',
      description: 'Grant and revoke user roles'
    },
    {
      id: 'emergency-actions',
      name: 'Emergency Actions',
      description: 'Emergency withdrawals and manual transfers'
    },
    {
      id: 'system-info',
      name: 'System Information',
      description: 'View contract and system information'
    }
  ]
} 