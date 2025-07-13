# TM Client - Decentralized Investment Pool Manager

A modern, full-width React dApp for managing USDC investment pools on Ethereum Sepolia testnet. Built with React 19, Wagmi, and featuring comprehensive ERC20 token support.

## 🚀 Features

### User Features
- **Connect MetaMask** - Streamlined wallet connection with enhanced detection
- **USDC Pool Management** - View pool information, USDC balances, and your portion
- **USDC Wallet Balance** - Monitor your USDC wallet balance in real-time
- **Token Approval System** - Automatic USDC approval handling for deposits
- **Deposit USDC** - Deposit USDC into the investment pool with lock periods
- **Withdraw USDC** - Withdraw your USDC funds (respecting lock periods)
- **Pending Withdrawals** - View and fulfill pending withdrawal requests
- **Real-time Updates** - Automatic data refresh and transaction monitoring

### Admin Features
- **Admin Panel** - Comprehensive administration interface for pool managers
- **Pool Settings** - Configure threshold, lock periods, multisig addresses
- **Role Management** - Grant and revoke admin/manager roles
- **Emergency Actions** - Manual transfers and emergency ERC20 withdrawals
- **System Information** - View contract addresses, versions, and permissions

## 🛠️ Technology Stack

- **React 19** - Latest React with improved performance
- **Wagmi** - React hooks for Ethereum
- **Viem** - Type-safe Ethereum client
- **TanStack Query** - Powerful data synchronization
- **React Hot Toast** - Beautiful notifications
- **CSS3** - Modern styling with gradients and animations

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ and pnpm
- MetaMask browser extension
- Sepolia testnet ETH for gas fees
- Sepolia testnet USDC for testing (available from faucets)

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd tm-client
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
# Contract Configuration
VITE_POOL_MANAGER_ADDRESS=0x... # Your deployed PoolManager contract address
VITE_USDC_ADDRESS=0xA0b86a33E6417aB1E7b53D91d84b9A06B48fF071 # USDC on Sepolia

# Optional: Infura API Key for better RPC performance
VITE_INFURA_API_KEY=your_infura_project_id

# Build Information (optional)
VITE_BUILD_HASH=your_build_hash
VITE_COMMIT_HASH=your_commit_hash
```

4. **Deploy your contract**
Deploy the PoolManager contract to Sepolia testnet and update the address in `.env`

5. **Start the development server**
```bash
pnpm dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

## 🎯 Usage Guide

### For Regular Users

1. **Connect Wallet**
   - Click "Connect MetaMask" in the top-right corner
   - Ensure you're on Sepolia testnet
   - Approve the connection

2. **View Pool Information**
   - See total pool balance, your deposit, and your portion
   - Check lock periods and pending withdrawals
   - Monitor your access level

3. **Make Deposits**
   - Go to "Deposit" tab
   - Enter amount (minimum 1 USDC)
   - Click "Approve USDC" to allow contract to spend your tokens
   - Once approved, click "Deposit" to complete the transaction
   - Wait for confirmation

4. **Withdraw Funds**
   - Go to "Withdraw" tab
   - Enter amount to withdraw
   - Respect lock periods (shown in UI)
   - Confirm transaction

5. **Manage Pending Withdrawals**
   - Go to "Pending" tab
   - View all pending withdrawal requests
   - Click "Fulfill" to complete withdrawals

### For Admins & Managers

1. **Access Admin Panel**
   - Connect with admin/manager wallet
   - Click "🔧 Admin" tab
   - Navigate between different admin sections

2. **Pool Settings**
   - Set threshold amounts
   - Configure lock periods
   - Update multisig addresses (admin only)
   - Set manager addresses (admin only)

3. **Role Management** (Admin Only)
   - Grant admin or manager roles
   - Revoke roles from users
   - Select role type from dropdown

4. **Emergency Actions**
   - Manual transfers to multisig
   - Emergency ERC20 withdrawals (admin only)
   - Configure emergency parameters

5. **System Information**
   - View contract addresses
   - Check application version
   - Monitor your permissions

## 📋 Contract Functions

### User Functions
- `deposit(uint256 amount)` - Deposit USDC into pool (requires prior approval)
- `withdraw(uint256 amount)` - Withdraw USDC from pool
- `fulfillPendingWithdrawal(uint256 id)` - Fulfill pending withdrawal

### ERC20 Functions (USDC)
- `approve(address spender, uint256 amount)` - Approve pool contract to spend USDC
- `balanceOf(address account)` - Get USDC balance
- `allowance(address owner, address spender)` - Get approval amount

### Admin Functions
- `setThreshold(uint256 newThreshold)` - Set pool threshold
- `setLockPeriod(uint256 newLockPeriod)` - Set lock period in seconds
- `setMultisig(address newMultisig)` - Update multisig address
- `setManager(address newManager)` - Set manager address
- `manualTransferToMultisig(uint256 amount)` - Manual transfer
- `emergencyWithdrawERC20(address token, address to, uint256 amount)` - Emergency withdrawal
- `grantRole(bytes32 role, address account)` - Grant role to user
- `revokeRole(bytes32 role, address account)` - Revoke role from user

### View Functions
- `poolBalance()` - Get total pool balance
- `deposits(address user)` - Get user deposit info
- `userPortion(address user)` - Get user's portion
- `threshold()` - Get current threshold
- `lockPeriod()` - Get lock period
- `getPendingWithdrawals(address user)` - Get pending withdrawals
- `hasRole(bytes32 role, address account)` - Check user roles

## 🔐 Security Features

- **Role-based Access Control** - Admin and Manager roles
- **Lock Periods** - Prevent immediate withdrawals
- **Threshold Management** - Configurable pool thresholds
- **Multisig Integration** - Secure fund management
- **Emergency Functions** - Admin-only emergency procedures

## 🎨 UI Features

- **Full-width Design** - Utilizes entire screen width
- **Responsive Layout** - Works on all device sizes
- **Modern Styling** - Gradient backgrounds and smooth animations
- **Real-time Updates** - Automatic data refresh
- **Toast Notifications** - User-friendly feedback
- **MetaMask Integration** - Seamless wallet connection

## 📊 Configuration

The application uses a centralized configuration system in `src/constants/index.js`:

```javascript
// Minimum amounts
MIN_DEPOSIT_AMOUNT: '1' // USDC
MIN_WITHDRAWAL_AMOUNT: '1' // USDC

// UI Settings
REFRESH_INTERVAL: 30000 // 30 seconds
TOAST_DURATION: 4000 // 4 seconds

// Feature Flags
ENABLE_ADMIN_PANEL: true
ENABLE_DEBUG_MODE: development mode
```

## 🚨 Important Notes

- **Testnet Only** - This dApp is configured for Sepolia testnet
- **MetaMask Required** - Only MetaMask wallet is supported
- **USDC Required** - Pool operates with USDC tokens (6 decimals)
- **Token Approval** - Must approve USDC before depositing
- **Admin Permissions** - Admin panel requires proper contract roles
- **Lock Periods** - Respect deposit lock periods before withdrawing
- **Gas Fees** - Ensure sufficient Sepolia ETH for gas fees

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari)
- Mobile browsers with MetaMask app
- Tablet devices

## 🔄 Updates & Versioning

- **Version**: 1.0.0
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Build Info**: Available in System Information

## 🆘 Troubleshooting

### Common Issues

1. **MetaMask Not Detected**
   - Ensure MetaMask is installed and enabled
   - Refresh the page
   - Check browser compatibility

2. **Wrong Network**
   - Switch to Sepolia testnet in MetaMask
   - App will prompt for network change

3. **Transaction Failures**
   - Ensure sufficient Sepolia ETH for gas fees
   - Check USDC balance and allowance
   - Verify contract addresses (Pool Manager and USDC)
   - Approve USDC before depositing

4. **Admin Panel Not Visible**
   - Ensure you have admin or manager role
   - Check contract permissions
   - Verify admin panel is enabled

### Debug Information

Enable debug mode by setting `NODE_ENV=development` to see:
- Detailed console logs
- MetaMask detection info
- Contract interaction details
- Connection status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React 19 and Wagmi
- Styled with modern CSS3
- Tested on Sepolia testnet
- MetaMask integration
