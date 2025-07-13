import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, parseUnits, formatUnits } from 'viem'
import { PoolManagerABI } from '../abi/PoolManagerABI.js'
import { ERC20ABI } from '../abi/ERC20ABI.js'
import { CONTRACTS } from '../config/web3.js'
import { useWeb3 } from '../context/Web3Context.jsx'
import { 
  CONTRACT_ROLES, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  APP_CONFIG,
  TRANSACTION_TYPES 
} from '../constants/index.js'
import toast from 'react-hot-toast'

export const usePoolManager = () => {
  const { address, isConnected, refetchBalance } = useWeb3()
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // ============================================================================
  // READ CONTRACT FUNCTIONS
  // ============================================================================

  // Basic pool information
  const { data: poolBalance, refetch: refetchPoolBalance } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'poolBalance',
    enabled: !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: threshold, refetch: refetchThreshold } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'threshold',
    enabled: !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: lockPeriod, refetch: refetchLockPeriod } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'lockPeriod',
    enabled: !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: multisig, refetch: refetchMultisig } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'multisig',
    enabled: !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: fundingToken, refetch: refetchFundingToken } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'fundingToken',
    enabled: !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: poolToken, refetch: refetchPoolToken } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'poolToken',
    enabled: !!CONTRACTS.POOL_MANAGER.address
  })

  // USDT contract interactions
  const { data: userUSDTBalance, refetch: refetchUserUSDTBalance } = useReadContract({
    address: CONTRACTS.USDT.address,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address && !!CONTRACTS.USDT.address
  })

  const { data: usdtAllowance, refetch: refetchUSDTAllowance } = useReadContract({
    address: CONTRACTS.USDT.address,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: [address, CONTRACTS.POOL_MANAGER.address],
    enabled: !!address && !!CONTRACTS.USDT.address && !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: usdtDecimals } = useReadContract({
    address: CONTRACTS.USDT.address,
    abi: ERC20ABI,
    functionName: 'decimals',
    enabled: !!CONTRACTS.USDT.address
  })

  const { data: usdtSymbol } = useReadContract({
    address: CONTRACTS.USDT.address,
    abi: ERC20ABI,
    functionName: 'symbol',
    enabled: !!CONTRACTS.USDT.address
  })

  // User-specific information
  const { data: userDeposit, refetch: refetchUserDeposit } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'deposits',
    args: [address],
    enabled: !!address && !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: userPortion, refetch: refetchUserPortion } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'userPortion',
    args: [address],
    enabled: !!address && !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: pendingWithdrawals, refetch: refetchPendingWithdrawals } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'getPendingWithdrawals',
    args: [address],
    enabled: !!address && !!CONTRACTS.POOL_MANAGER.address
  })

  // Role management
  const { data: isAdmin } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'hasRole',
    args: [CONTRACT_ROLES.DEFAULT_ADMIN_ROLE, address],
    enabled: !!address && !!CONTRACTS.POOL_MANAGER.address
  })

  const { data: isManager } = useReadContract({
    address: CONTRACTS.POOL_MANAGER.address,
    abi: PoolManagerABI,
    functionName: 'hasRole',
    args: [CONTRACT_ROLES.MANAGER_ROLE, address],
    enabled: !!address && !!CONTRACTS.POOL_MANAGER.address
  })

  // ============================================================================
  // WRITE CONTRACT FUNCTIONS - USER FUNCTIONS
  // ============================================================================

  const approveUSDT = async (amount) => {
    if (!isConnected) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    try {
      const decimals = usdtDecimals || CONTRACTS.USDT.defaultDecimals
      const amountInUSDT = parseUnits(amount.toString(), decimals)
      
      await writeContract({
        address: CONTRACTS.USDT.address,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [CONTRACTS.POOL_MANAGER.address, amountInUSDT]
      })

      toast.success('USDT approval sent! Please wait for confirmation.')
    } catch (error) {
      console.error('Approve error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const deposit = async (amount) => {
    if (!isConnected) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    if (!amount || parseFloat(amount) < parseFloat(APP_CONFIG.MIN_DEPOSIT_AMOUNT)) {
      toast.error(`Minimum deposit amount is ${APP_CONFIG.MIN_DEPOSIT_AMOUNT} USDT`)
      return
    }

    try {
      const decimals = usdtDecimals || CONTRACTS.USDT.defaultDecimals
      const amountInUSDT = parseUnits(amount.toString(), decimals)
      
      // Check if user has sufficient allowance
      const currentAllowance = usdtAllowance || 0n
      if (currentAllowance < amountInUSDT) {
        toast.error('Insufficient USDT allowance. Please approve USDT first.')
        return
      }

      // Check if user has sufficient balance
      const userBalance = userUSDTBalance || 0n
      if (userBalance < amountInUSDT) {
        toast.error('Insufficient USDT balance.')
        return
      }
      
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'deposit',
        args: [amountInUSDT]
        // Note: No value sent as this is ERC20 transfer
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Deposit error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const withdraw = async (amount) => {
    if (!isConnected) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    if (!amount || parseFloat(amount) < parseFloat(APP_CONFIG.MIN_WITHDRAWAL_AMOUNT)) {
      toast.error(`Minimum withdrawal amount is ${APP_CONFIG.MIN_WITHDRAWAL_AMOUNT} USDT`)
      return
    }

    try {
      const decimals = usdtDecimals || CONTRACTS.USDT.defaultDecimals
      const amountInUSDT = parseUnits(amount.toString(), decimals)
      
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'withdraw',
        args: [amountInUSDT]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Withdrawal error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const fulfillPendingWithdrawal = async (withdrawalId) => {
    if (!isConnected) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'fulfillPendingWithdrawal',
        args: [withdrawalId]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Fulfill withdrawal error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  // ============================================================================
  // WRITE CONTRACT FUNCTIONS - ADMIN FUNCTIONS
  // ============================================================================

  const setThreshold = async (newThreshold) => {
    if (!isAdmin && !isManager) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    try {
      const decimals = usdtDecimals || CONTRACTS.USDT.defaultDecimals
      const thresholdInUSDT = parseUnits(newThreshold.toString(), decimals)
      
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'setThreshold',
        args: [thresholdInUSDT]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Set threshold error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const setLockPeriod = async (newLockPeriod) => {
    if (!isAdmin && !isManager) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    try {
      // Convert days to seconds
      const lockPeriodInSeconds = BigInt(newLockPeriod * 24 * 60 * 60)
      
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'setLockPeriod',
        args: [lockPeriodInSeconds]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Set lock period error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const setMultisig = async (newMultisigAddress) => {
    if (!isAdmin) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'setMultisig',
        args: [newMultisigAddress]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Set multisig error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const setManager = async (newManagerAddress) => {
    if (!isAdmin) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'setManager',
        args: [newManagerAddress]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Set manager error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const manualTransferToMultisig = async (amount) => {
    if (!isAdmin && !isManager) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    try {
      const decimals = usdtDecimals || CONTRACTS.USDT.defaultDecimals
      const amountInUSDT = parseUnits(amount.toString(), decimals)
      
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'manualTransferToMultisig',
        args: [amountInUSDT]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Manual transfer error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const emergencyWithdrawERC20 = async (tokenAddress, toAddress, amount) => {
    if (!isAdmin) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    try {
      // For ERC20 tokens, amount should be in token decimals
      // Assuming 18 decimals for most tokens, but this should be configurable
      const amountInWei = parseEther(amount.toString())
      
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'emergencyWithdrawERC20',
        args: [tokenAddress, toAddress, amountInWei]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Emergency withdraw error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  // Role management functions
  const grantRole = async (role, userAddress) => {
    if (!isAdmin) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'grantRole',
        args: [role, userAddress]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Grant role error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  const revokeRole = async (role, userAddress) => {
    if (!isAdmin) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    try {
      await writeContract({
        address: CONTRACTS.POOL_MANAGER.address,
        abi: PoolManagerABI,
        functionName: 'revokeRole',
        args: [role, userAddress]
      })

      toast.success(SUCCESS_MESSAGES.TRANSACTION_SENT)
    } catch (error) {
      console.error('Revoke role error:', error)
      toast.error(error.shortMessage || ERROR_MESSAGES.TRANSACTION_FAILED)
    }
  }

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  // Format token balances (deposits, withdrawals, thresholds) - uses USDT decimals
  const formatBalance = (balance) => {
    if (!balance) return '0'
    const decimals = usdtDecimals || CONTRACTS.USDT.defaultDecimals
    return formatUnits(balance, decimals)
  }

  // Format USDT wallet balance - uses USDT decimals
  const formatUSDTBalance = (balance) => {
    if (!balance) return '0'
    const decimals = usdtDecimals || CONTRACTS.USDT.defaultDecimals
    return formatUnits(balance, decimals)
  }

  // Format user portion (fraction of pool ownership) - uses 18 decimals
  const formatPortion = (portion, asPercentage = false) => {
    if (!portion) return asPercentage ? '0%' : '0'
    const formatted = formatEther(portion) // userPortion uses 18 decimals
    if (asPercentage) {
      const percentage = (parseFloat(formatted) * 100).toFixed(2)
      return `${percentage}%`
    }
    return formatted
  }

  const hasInsufficientAllowance = (amount) => {
    if (!amount || !usdtAllowance) return true
    const decimals = usdtDecimals || CONTRACTS.USDT.defaultDecimals
    const amountInUSDT = parseUnits(amount.toString(), decimals)
    return usdtAllowance < amountInUSDT
  }

  const isDepositLocked = (deposit) => {
    if (!deposit || !deposit.lockUntil) return false
    return Date.now() / 1000 < Number(deposit.lockUntil)
  }

  const getLockTimeRemaining = (deposit) => {
    if (!deposit || !deposit.lockUntil) return 0
    const remaining = Number(deposit.lockUntil) - Date.now() / 1000
    return Math.max(0, remaining)
  }

  const formatLockPeriodDays = (lockPeriodSeconds) => {
    if (!lockPeriodSeconds) return '0'
    return Math.floor(Number(lockPeriodSeconds) / (24 * 60 * 60))
  }

  // Refetch all data
  const refetchAll = () => {
    refetchBalance()
    refetchPoolBalance()
    refetchUserDeposit()
    refetchUserPortion()
    refetchThreshold()
    refetchLockPeriod()
    refetchPendingWithdrawals()
    refetchMultisig()
    refetchFundingToken()
    refetchPoolToken()
    refetchUserUSDTBalance()
    refetchUSDTAllowance()
  }

  // Check if user has administrative privileges
  const hasAdminAccess = () => {
    return isAdmin || isManager
  }

  return {
    // ============================================================================
    // CONTRACT DATA
    // ============================================================================
    poolBalance,
    userDeposit,
    userPortion,
    threshold,
    lockPeriod,
    pendingWithdrawals,
    multisig,
    fundingToken,
    poolToken,
    
    // ============================================================================
    // USDT DATA
    // ============================================================================
    userUSDTBalance,
    usdtAllowance,
    usdtDecimals,
    usdtSymbol,
    
    // ============================================================================
    // USER PERMISSIONS
    // ============================================================================
    isAdmin: !!isAdmin,
    isManager: !!isManager,
    hasAdminAccess: hasAdminAccess(),
    
    // ============================================================================
    // USER FUNCTIONS
    // ============================================================================
    deposit,
    withdraw,
    fulfillPendingWithdrawal,
    approveUSDT,
    
    // ============================================================================
    // ADMIN FUNCTIONS
    // ============================================================================
    setThreshold,
    setLockPeriod,
    setMultisig,
    setManager,
    manualTransferToMultisig,
    emergencyWithdrawERC20,
    grantRole,
    revokeRole,
    
    // ============================================================================
    // TRANSACTION STATE
    // ============================================================================
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
    
    // ============================================================================
    // HELPER FUNCTIONS
    // ============================================================================
    formatBalance,
    formatUSDTBalance,
    formatPortion,
    hasInsufficientAllowance,
    isDepositLocked,
    getLockTimeRemaining,
    formatLockPeriodDays,
    refetchAll
  }
} 