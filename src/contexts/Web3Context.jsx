import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import scholarVerificationService from '@/blockchain/services/ScholarVerificationService';
import smartContractService from '@/blockchain/services/SmartContractService';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';

/**
 * @typedef {Object} Web3ContextType
 * 
 * @property {boolean} isConnected - Whether the wallet is connected
 * @property {boolean} isConnecting - Whether the wallet is connecting
 * @property {string|null} connectionError - Error message if connection failed
 * @property {string|null} account - Connected account address
 * @property {number} chainId - Current chain ID
 * @property {string} balance - Account balance in ETH
 * @property {string} balanceUSD - Account balance in USD
 * @property {boolean} isShariahCompliant - Whether the connected wallet is Shariah compliant
 * @property {Object} complianceDetails - Details about Shariah compliance
 * 
 * @property {boolean} smartContractsInitialized - Whether smart contracts are initialized
 * @property {Object} availableContracts - Available smart contracts
 * @property {boolean} availableContracts.stockPurchase - Stock purchase contract
 * @property {boolean} availableContracts.portfolioManager - Portfolio manager contract
 * @property {boolean} availableContracts.complianceGuard - Compliance guard contract
 * @property {boolean} availableContracts.sukukManager - Sukuk manager contract
 * @property {boolean} availableContracts.murabaha - Murabaha contract
 * 
 * @property {function(): Promise<void>} connect - Connect to wallet
 * @property {function(): void} disconnect - Disconnect from wallet
 * @property {function(string, string, string=): Promise<string>} sendTransaction - Send transaction
 * @property {function(string, string, number, number): Promise<string>} buyStock - Buy stock
 * @property {function(string, number, number): Promise<string>} sellStock - Sell stock
 * @property {function(): Promise<Object>} getOnChainHoldings - Get on-chain holdings
 * @property {function(number=, number=): Promise<Object>} getOnChainTransactions - Get on-chain transactions
 * @property {function(string): Promise<boolean>} checkStockCompliance - Check if stock is compliant
 * @property {function(string): Promise<Object>} getStockComplianceDetails - Get stock compliance details
 * @property {function(string, string, number, string): Promise<boolean>} addToken - Add token to wallet
 * @property {function(number): Promise<boolean>} switchNetwork - Switch network
 * @property {function(): Promise<void>} refreshBalance - Refresh balance
 */

// Create the context with default values
const Web3Context = createContext({
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  account: null,
  chainId: null,
  balance: '0',
  balanceUSD: '0',
  isShariahCompliant: false,
  complianceDetails: {},
  smartContractsInitialized: false,
  availableContracts: {
    stockPurchase: false,
    portfolioManager: false,
    complianceGuard: false,
    sukukManager: false,
    murabaha: false
  },
  connect: async () => {},
  disconnect: () => {},
  sendTransaction: async () => '',
  buyStock: async () => '',
  sellStock: async () => '',
  getOnChainHoldings: async () => ({}),
  getOnChainTransactions: async () => ({}),
  checkStockCompliance: async () => false,
  getStockComplianceDetails: async () => ({}),
  addToken: async () => false,
  switchNetwork: async () => false,
  refreshBalance: async () => {},
});

// Provider props


// Web3 Provider component
export const Web3Provider = ({ children }) => {
  const { toast } = useToast();
  /** @type {[string|null, function(string|null): void]} */
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [balanceUSD, setBalanceUSD] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  /** @type {[Object|null, function(Object|null): void]} */
  const [provider, setProvider] = useState(null);
  const [networkName, setNetworkName] = useState('Ethereum');
  const [networkId, setNetworkId] = useState(1);
  const [ethPrice, setEthPrice] = useState(2000); // Default ETH price in USD
  /** @type {[string|null, function(string|null): void]} */
  const [connectionError, setConnectionError] = useState(null);
  /** @type {[number|null, function(number|null): void]} */
  const [chainId, setChainId] = useState(null);
  const [isShariahCompliant, setIsShariahCompliant] = useState(false);
  
  // Define score variable before using it
  const score = 0;
  
  const [complianceDetails, setComplianceDetails] = useState({
    score: 0, // Initialize with default value
    issues: [],
    lastVerified: '',
  });
  
  // Smart contract states
  const [smartContractsInitialized, setSmartContractsInitialized] = useState(false);
  
  // Define contract variables before using them
  const stockPurchase = false;
  const portfolioManager = false;
  const complianceGuard = false;
  const sukukManager = false;
  const murabaha = false;
  
  const [availableContracts, setAvailableContracts] = useState({
    stockPurchase,
    portfolioManager,
    complianceGuard,
    sukukManager,
    murabaha,
  });

  // Check if Web3 provider exists in the browser
  const checkIfWeb3Exists = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Get ethers provider
  const getProvider = () => {
    if (!checkIfWeb3Exists()) return null;
    return new ethers.providers.Web3Provider(window.ethereum);
  };

  // Connect to Web3 provider and get account information
  const connect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('No Ethereum wallet detected. Please install MetaMask.');
      }
      
      // Reset state before connecting
      setIsConnected(false);
      setBalance('0');
      setBalanceUSD('0');
      
      // Force MetaMask to show the connection dialog by using wallet_requestPermissions
      // This ensures the user explicitly approves the connection
      let accounts = [];
      
      try {
        // First try the permissions request which forces the popup
        const permissionsArray = await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
        
        // If permissions granted, get the accounts
        if (permissionsArray && permissionsArray.length > 0) {
          accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
        } else {
          // User denied permission
          throw { code: 4001, message: 'User rejected the request.' };
        }
      } catch (permError) {
        // If permission request fails with 4001, user denied the request
        if (permError.code === 4001) {
          throw permError; // Re-throw to be caught by outer catch
        }
        
        // For other errors, try the regular eth_requestAccounts method
        console.log('Falling back to eth_requestAccounts');
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
      }
      
      // Verify we got accounts back
      if (!accounts || accounts.length === 0) {
        throw { code: 4001, message: 'No accounts returned. User likely rejected the request.' };
      }
      
      const account = accounts[0];
      
      // Initialize provider after user has approved the connection
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get chain ID
      const { chainId } = await provider.getNetwork();
      setChainId(chainId);

      // Get balance
      await updateBalance(provider, account);

      // Initialize the Scholar Verification service
      scholarVerificationService.initialize(provider);

      // Check Shariah compliance (mock for now)
      checkShariahCompliance(account);

      setAccount(account);
      setIsConnected(true);

      // Set up event listeners for real-time updates
      setupEventListeners();
      
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${account.substring(0, 6)}...${account.substring(account.length - 4)}`,
      });
    } catch (error) {
      console.error('Error connecting to Web3 provider:', error);
      
      // Handle user rejection specifically
      if (error.code === 4001) {
        setConnectionError('Connection rejected. You declined the connection request.');
        toast({
          title: 'Connection Cancelled',
          description: 'You declined the wallet connection request.',
          variant: 'destructive'
        });
      } else {
        setConnectionError('Failed to connect to your wallet. Please try again.');
      }
      
      // Ensure we're marked 
      setIsConnected(false);
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  };

  // Update balance and USD value
  /**
   * Update balance and USD value
   * @param {Object} provider - Ethers Web3Provider
   * @param {string} accountAddress - Account address
   * @returns {Promise<void>}
   */
  const updateBalance = useCallback(async (provider, accountAddress) => {
    try {
      const balance = await provider.getBalance(accountAddress);
      const formattedBalance = ethers.utils.formatEther(balance);
      setBalance(parseFloat(formattedBalance).toFixed(4));

      // Calculate USD value
      const usdValue = (parseFloat(formattedBalance) * (ethPrice || 0)).toFixed(2);
      setBalanceUSD(usdValue);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  }, [ethPrice]);

  // Set up event listeners for real-time updates
  const setupEventListeners = () => {
    if (!window.ethereum) return;

    // Handle account changes
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnect();
      } else if (accounts[0] !== account) {
        // User switched accounts
        setAccount(accounts[0]);

        // Update balance for new account
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await updateBalance(provider, accounts[0]);

        // Check Shariah compliance for new account
        checkShariahCompliance(accounts[0]);
      }
    };

    // Handle chain changes
    const handleChainChanged = async (chainIdHex) => {
      // Need to reload the page  by MetaMask
      window.location.reload();
    };

    // Handle connection events
    const handleConnect = ({ chainId }) => {
      setChainId(parseInt(chainId, 16));
      setIsConnected(true);
    };

    const handleDisconnect = (error) => {
      console.error('Wallet disconnected:', error);
      disconnect();
    };

    // Add event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('connect', handleConnect);
    window.ethereum.on('disconnect', handleDisconnect);

    // Set up periodic balance updates (every 30 seconds)
    const balanceInterval = setInterval(async () => {
      if (account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await updateBalance(provider, account);
      }
    }, 30000);

    // Clean up function
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('connect', handleConnect);
      window.ethereum.removeListener('disconnect', handleDisconnect);
      clearInterval(balanceInterval);
    };
  };

  // Disconnect from Web3 provider
  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance('0');
    setBalanceUSD('0');
    setChainId(null);
    setIsShariahCompliant(false);
    setComplianceDetails({
      score,
      issues: [],
      lastVerified: '',
    });

    // Note: We don't need to manually remove event listeners here
    // Event listeners are properly cleaned up in the useEffect cleanup function
    // when the component unmounts or when dependencies change

    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  // Function to check Shariah compliance
  const checkShariahCompliance = async (address) => {
    try {
      // In a real implementation, this would call a Shariah compliance API or smart contract
      // For now, we'll use a combination of mock data and our scholar verification service

      // Check if the address h verifications
      const verifications = await scholarVerificationService.getUserVerifications(address);

      // If there are verifications, we'll consider it compliant
      if (verifications && verifications.length > 0) {
        setIsShariahCompliant(true);
        setComplianceDetails({
          score,
          issues: [],
          lastVerified: new Date().toISOString(),
        });
        return;
      }

      // Otherwise, we'll use a mock check
      // In a real implementation, you would analyze the address's transaction history
      // and token holdings to determine compliance

      // For demo purposes, we'll use a random result
      const compliant = Math.random() > 0.3; // 70% chance of being compliant
      setIsShariahCompliant(compliant);

      if (compliant) {
        setComplianceDetails({
          score: 85 + Math.floor(Math.random() * 15), // Score between 85-100
          issues: [],
          lastVerified: new Date().toISOString(),
        });
      } else {
        setComplianceDetails({
          score: 50 + Math.floor(Math.random() * 35), // Score between 50-85
          issues: [
            'Contains interest-based assets above threshold',
            'Excessive debt ratio',
          ],
          lastVerified: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error checking Shariah compliance:', error);
      setIsShariahCompliant(false);
      setComplianceDetails({
        score,
        issues: ['Error checking compliance status'],
        lastVerified: new Date().toISOString(),
      });
    }
  };

  // Send transaction function
  /**
   * Send transaction function
   * @param {string} to - Recipient address
   * @param {string} amount - Amount to send
   * @param {string} [data] - Optional transaction data
   * @returns {Promise<string>} Transaction hash
   */
  const sendTransaction = async (to, amount, data) => {
    if (!isConnected || !account || !provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const signer = provider.getSigner();
      const parsedAmount = ethers.utils.parseEther(amount);

      // Check if user h balance
      const currentBalance = await provider.getBalance(account);
      if (currentBalance.lt(parsedAmount)) {
        throw new Error('Insufficient balance');
      }

      const tx = await signer.sendTransaction({
        to,
        value,
      });

      // Wait for transaction to be mined
      await tx.wait();

      // Update balance after transaction
      await updateBalance(provider, account);

      return tx.hash;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  };

  // Add token function
  /**
   * Add token function
   * @param {string} tokenAddress - Token contract address
   * @param {string} tokenSymbol - Token symbol
   * @param {number} tokenDecimals - Token decimals
   * @param {string} tokenImage - Token image URL
   * @returns {Promise<boolean>} Whether token was added
   */
  const addToken = async (
    tokenAddress,
    tokenSymbol,
    tokenDecimals,
    tokenImage) => {
    if (!checkIfWeb3Exists()) {
      return false;
    }

    try {
      // Call the wallet's addToken method
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage
          }
        }
      });

      if (wasAdded) {
        toast({
          title: 'Token Added',
          description: `${tokenSymbol} h added to your wallet`,
        });
      }

      return !!wasAdded;
    } catch (error) {
      console.error('Error adding token:', error);
      toast({
        title: 'Failed to Add Token',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Switch network function
  /**
   * Switch network function
   * @param {number} newChainId - Chain ID to switch to
   * @returns {Promise<boolean>} Whether the network switch was successful
   */
  const switchNetwork = async (newChainId) => {
    if (!checkIfWeb3Exists()) {
      return false;
    }

    try {
      // Format chain ID  string
      const chainIdHex = `0x${newChainId.toString(16)}`;

      // Try to switch to the network
      await (window ).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      // Update chain ID in state
      setChainId(newChainId);

      // Re-initialize the provider with the new network
      const provider = getProvider();
      if (provider && account) {
        // Update balance for the new network
        const balance = await provider.getBalance(account);
        const formattedBalance = ethers.utils.formatEther(balance);
        setBalance(parseFloat(formattedBalance).toFixed(4));

        // Calculate USD value
        const usdValue = (parseFloat(formattedBalance) * ethPrice).toFixed(2);
        setBalanceUSD(usdValue);

        // Re-initialize the scholar verification service
        scholarVerificationService.initialize(provider);
      }

      return true;
    } catch (error) {
      // If the chain hasn't been added to MetaMask, this will throw an error
      if (error.code === 4902) {
        toast({
          title: 'Network Not Found',
          description: 'This network needs to be added to your wallet first',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Network Switch Failed',
          description: error.message || 'Failed to switch network',
          variant: 'destructive',
        });
      }
      return false;
    }
  };

  // Refresh balance
  const refreshBalance = async () => {
    if (account && provider) {
      await updateBalance(provider, account);
      await fetchEthPrice();

      toast({
        title: 'Balance Updated',
        description: `Current balance: ${balance} ETH ($${balanceUSD})`,
      });
    }
  };

  // Fetch ETH price from API
  const fetchEthPrice = useCallback(async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      if (data.ethereum && data.ethereum.usd) {
        setEthPrice(data.ethereum.usd);
      }
    } catch (error) {
      console.error('Error fetching ETH price:', error);
    }
  }, []);

  // Update network information
  /**
   * Update network information
   * @param {Object} web3Provider - Ethers Web3Provider
   * @returns {Promise<void>}
   */
  const updateNetworkInfo = useCallback(async (web3Provider) => {
    try {
      const network = await web3Provider.getNetwork();
      setNetworkId(network.chainId);

      // Set network name based on chainId
      switch (network.chainId) {
        case 1:
          setNetworkName('Ethereum Mainnet');
          break;
        case 5:
          setNetworkName('Goerli Testnet');
          break;
        case 11155111:
          setNetworkName('Sepolia Testnet');
          break;
        case 137:
          setNetworkName('Polygon');
          break;
        case 80001:
          setNetworkName('Mumbai Testnet');
          break;
        default:
          setNetworkName(`Chain ID: ${network.chainId}`);
      }
    } catch (error) {
      console.error('Error updating network info:', error);
    }
  }, []);

  // Initialize smart contracts
  const initializeSmartContracts = useCallback(async () => {
    if (!provider || !account || !chainId) {
      setSmartContractsInitialized(false);
      return;
    }
    
    try {
      // Initialize smart contract service
      smartContractService.initialize(provider, chainId);
      setSmartContractsInitialized(true);
      
      // Check which contracts are available
      setAvailableContracts({
        stockPurchase: smartContractService.isContractAvailable('stockPurchase'),
        portfolioManager: smartContractService.isContractAvailable('portfolioManager'),
        complianceGuard: smartContractService.isContractAvailable('complianceGuard'),
        sukukManager: smartContractService.isContractAvailable('sukukManager'),
        murabaha: smartContractService.isContractAvailable('murabaha')
      });
      
      toast({
        title: 'Smart Contracts Initialized',
        description: 'Connected to Zaryah smart contracts'
      });
    } catch (error) {
      console.error('Failed to initialize smart contracts:', error);
      setSmartContractsInitialized(false);
    }
  }, [provider, account, chainId, toast]);
  
  // Buy stock using smart contract
  /**
   * Buy stock using smart contract
   * @param {string} symbol - Stock symbol
   * @param {string} name - Stock name
   * @param {number} quantity - Quantity to buy
   * @param {number} price - Price per share
   * @returns {Promise<string>} Transaction hash
   */
  const buyStock = async (symbol, name, quantity, price) => {
    if (!smartContractsInitialized || !availableContracts.stockPurchase) {
      throw new Error('Stock purchase contract not available');
    }
    
    try {
      const txHash = await smartContractService.buyStock(symbol, name, quantity, price);
      
      toast({
        title: 'Stock Purchase Successful',
        description: `Successfully purchased ${quantity} shares of ${symbol}`
      });
      
      return txHash;
    } catch (error) {
      console.error('Error buying stock:', error);
      
      toast({
        title: 'Stock Purchase Failed',
        description: error.message || 'Failed to purchase stock',
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  // Sell stock using smart contract
  /**
   * Sell stock using smart contract
   * @param {string} symbol - Stock symbol
   * @param {number} quantity - Quantity to sell
   * @param {number} price - Price per share
   * @returns {Promise<string>} Transaction hash
   */
  const sellStock = async (symbol, quantity, price) => {
    if (!smartContractsInitialized || !availableContracts.stockPurchase) {
      throw new Error('Stock purchase contract not available');
    }
    
    try {
      const txHash = await smartContractService.sellStock(symbol, quantity, price);
      
      toast({
        title: 'Stock Sale Successful',
        description: `Successfully sold ${quantity} shares of ${symbol}`
      });
      
      return txHash;
    } catch (error) {
      console.error('Error selling stock:', error);
      
      toast({
        title: 'Stock Sale Failed',
        description: error.message || 'Failed to sell stock',
        variant: 'destructive'
      });
      
      throw error;
    }
  };
  
  // Get on-chain holdings
  const getOnChainHoldings = async () => {
    if (!smartContractsInitialized || !availableContracts.portfolioManager || !account) {
      return { symbols: [], names: [], quantities: [], avgPrices: [], totalInvested: [] };
    }
    
    try {
      return await smartContractService.getUserHoldings(account);
    } catch (error) {
      console.error('Error getting on-chain holdings:', error);
      return { symbols: [], names: [], quantities: [], avgPrices: [], totalInvested: [] };
    }
  };
  
  // Get on-chain transactions
  const getOnChainTransactions = async (offset = 0, limit = 10) => {
    if (!smartContractsInitialized || !availableContracts.portfolioManager || !account) {
      return { symbols: [], types: [], quantities: [], prices: [], totals: [], timestamps: [] };
    }
    
    try {
      return await smartContractService.getUserTransactions(account, offset, limit);
    } catch (error) {
      console.error('Error getting on-chain transactions:', error);
      return { symbols: [], types: [], quantities: [], prices: [], totals: [], timestamps: [] };
    }
  };
  
  // Check if a stock is Shariah compliant
  /**
   * Check if a stock is Shariah compliant
   * @param {string} symbol - Stock symbol
   * @returns {Promise<boolean>} Whether the stock is compliant
   */
  const checkStockCompliance = async (symbol) => {
    if (!smartContractsInitialized || !availableContracts.complianceGuard) {
      // Fall back to off-chain compliance check
      return await scholarVerificationService.verifyStock(symbol);
    }
    
    try {
      return await smartContractService.isStockCompliant(symbol);
    } catch (error) {
      console.error('Error checking stock compliance:', error);
      // Fall back to off-chain compliance check
      return await scholarVerificationService.verifyStock(symbol);
    }
  };
  
  // Get detailed compliance information for a stock
  const getStockComplianceDetails = async (symbol) => {
    if (!smartContractsInitialized || !availableContracts.complianceGuard) {
      // Return basic compliance info
      const isCompliant = await scholarVerificationService.verifyStock(symbol);
      return {
        score: isCompliant ? 80 : 0,
        issues: isCompliant ? [] : ['No on-chain compliance data available'],
        lastVerified: new Date().toISOString()
      };
    }
    
    try {
      return await smartContractService.getComplianceDetails(symbol);
    } catch (error) {
      console.error('Error getting compliance details:', error);
      // Return basic compliance info
      const isCompliant = await scholarVerificationService.verifyStock(symbol);
      return {
        score: isCompliant ? 80 : 0,
        issues: isCompliant ? [] : ['Error retrieving on-chain compliance data'],
        lastVerified: new Date().toISOString()
      };
    }
  };
  
  // Initialize provider but don't automatically connect on component mount
  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Initialize provider without connecting
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      
      // Fetch ETH price for reference (doesn't require connection)
      fetchEthPrice();
      
      // Set up event listeners for account and network changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            // User disconnected their wallet
            disconnect();
          } else if (accounts[0] !== account) {
            // User switched accounts
            setAccount(accounts[0]);
            if (web3Provider) {
              updateBalance(web3Provider, accounts[0]);
              updateNetworkInfo(web3Provider);
            }
          }
        });

        window.ethereum.on('chainChanged', () => {
          // Reload the page when the chain changes
          window.location.reload();
        });
      }
      
      // Cleanup function to remove event listeners
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', () => {});
          window.ethereum.removeListener('chainChanged', () => {});
        }
      };
    }
  }, [updateBalance, updateNetworkInfo, fetchEthPrice]);
  
  // Initialize smart contracts when connected
  useEffect(() => {
    if (isConnected && provider && account && chainId) {
      initializeSmartContracts();
    } else {
      setSmartContractsInitialized(false);
      setAvailableContracts({
        stockPurchase,
        portfolioManager,
        complianceGuard,
        sukukManager,
        murabaha: false
      });
    }
  }, [isConnected, provider, account, chainId, initializeSmartContracts]);

  // Context value
  const value = {
    isConnected,
    isConnecting,
    connectionError,
    account,
    chainId,
    balance,
    balanceUSD,
    isShariahCompliant,
    complianceDetails,
    smartContractsInitialized,
    availableContracts,
    connect,
    disconnect,
    sendTransaction,
    buyStock,
    sellStock,
    getOnChainHoldings,
    getOnChainTransactions,
    checkStockCompliance,
    getStockComplianceDetails,
    addToken,
    switchNetwork,
    refreshBalance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);

export default Web3Context;
