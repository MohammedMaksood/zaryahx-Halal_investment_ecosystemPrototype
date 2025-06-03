import { ethers } from 'ethers';
import { 
  StockPurchaseABI, 
  PortfolioManagerABI, 
  ComplianceGuardABI,
  SukukManagerABI
} from '../interfaces/contracts';

// Define contract addresses for different networks
const CONTRACT_ADDRESSES = {
  POLYGON: {
    STOCK_PURCHASE: '0x1234567890123456789012345678901234567890',
    PORTFOLIO_MANAGER: '0x1234567890123456789012345678901234567890',
    COMPLIANCE_GUARD: '0x1234567890123456789012345678901234567890',
    SUKUK_MANAGER: '0x1234567890123456789012345678901234567890'
  },
  MUMBAI: {
    STOCK_PURCHASE: '0x1234567890123456789012345678901234567890',
    PORTFOLIO_MANAGER: '0x1234567890123456789012345678901234567890',
    COMPLIANCE_GUARD: '0x1234567890123456789012345678901234567890',
    SUKUK_MANAGER: '0x1234567890123456789012345678901234567890'
  }
};

/**
 * Service for interacting with Zaryah smart contracts
 */
class SmartContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.chainId = 80001; // Default to Mumbai Testnet
    
    // Contract instances
    this.stockPurchaseContract = null;
    this.portfolioManagerContract = null;
    this.complianceGuardContract = null;
    this.sukukManagerContract = null;
  }
  
  /**
   * Initialize the service with a Web3 provider
   * @param {ethers.providers.Web3Provider} provider - Ethereum provider
   * @param {number} chainId - Chain ID of the network
   */
  initialize(provider, chainId) {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.chainId = chainId;
    
    this.initializeContracts();
  }
  
  /**
   * Initialize contract instances
   * @private
   */
  initializeContracts() {
    if (!this.provider || !this.signer) {
      console.error('Provider or signer not available');
      return;
    }
    
    // Determine which network to use
    const networkAddresses = this.chainId === 137 
      ? CONTRACT_ADDRESSES.POLYGON 
      : CONTRACT_ADDRESSES.MUMBAI;
    
    // Initialize contracts
    if (networkAddresses.STOCK_PURCHASE) {
      this.stockPurchaseContract = new ethers.Contract(
        networkAddresses.STOCK_PURCHASE,
        StockPurchaseABI,
        this.provider
      );
    }
    
    if (networkAddresses.PORTFOLIO_MANAGER) {
      this.portfolioManagerContract = new ethers.Contract(
        networkAddresses.PORTFOLIO_MANAGER,
        PortfolioManagerABI,
        this.provider
      );
    }
    
    if (networkAddresses.COMPLIANCE_GUARD) {
      this.complianceGuardContract = new ethers.Contract(
        networkAddresses.COMPLIANCE_GUARD,
        ComplianceGuardABI,
        this.provider
      );
    }
    
    if (networkAddresses.SUKUK_MANAGER) {
      this.sukukManagerContract = new ethers.Contract(
        networkAddresses.SUKUK_MANAGER,
        SukukManagerABI,
        this.provider
      );
    }
  }
  
  /**
   * Buy stock
   * @param {string} symbol - Stock symbol
   * @param {string} name - Stock name
   * @param {number} quantity - Quantity to buy
   * @param {number} price - Price per share
   * @returns {Promise<ethers.providers.TransactionReceipt>} Transaction receipt
   */
  async buyStock(symbol, name, quantity, price) {
    if (!this.stockPurchaseContract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }
    
    const contract = this.stockPurchaseContract.connect(this.signer);
    const totalPrice = quantity * price;
    const tx = await contract.buyStock(symbol, name, quantity, price, {
      value: ethers.utils.parseEther(totalPrice.toString())
    });
    
    return await tx.wait();
  }
  
  /**
   * Sell stock
   * @param {string} symbol - Stock symbol
   * @param {number} quantity - Quantity to sell
   * @param {number} price - Price per share
   * @returns {Promise<ethers.providers.TransactionReceipt>} Transaction receipt
   */
  async sellStock(symbol, quantity, price) {
    if (!this.stockPurchaseContract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }
    
    const contract = this.stockPurchaseContract.connect(this.signer);
    const tx = await contract.sellStock(symbol, quantity, price);
    
    return await tx.wait();
  }
  
  /**
   * Get user's portfolio holdings
   * @param {string} address - User's address
   * @returns {Promise<Object>} User's holdings
   */
  async getUserHoldings(address) {
    if (!this.portfolioManagerContract) {
      throw new Error('Contract not initialized');
    }
    
    const [symbols, names, quantities, avgPrices, totalInvested] = 
      await this.portfolioManagerContract.getUserHoldings(address);
    
    // Format the data
    const holdings = [];
    for (let i = 0; i < symbols.length; i++) {
      holdings.push({
        symbol: symbols[i],
        name: names[i],
        quantity: quantities[i].toNumber(),
        avgPrice: ethers.utils.formatEther(avgPrices[i]),
        totalInvested: ethers.utils.formatEther(totalInvested[i])
      });
    }
    
    return holdings;
  }
  
  /**
   * Get user's transaction history
   * @param {string} address - User's address
   * @param {number} offset - Pagination offset
   * @param {number} limit - Pagination limit
   * @returns {Promise<Object[]>} User's transactions
   */
  async getUserTransactions(address, offset = 0, limit = 10) {
    if (!this.portfolioManagerContract) {
      throw new Error('Contract not initialized');
    }
    
    const [symbols, types, quantities, prices, totals, timestamps] = 
      await this.portfolioManagerContract.getUserTransactions(address, offset, limit);
    
    // Format the data
    const transactions = [];
    for (let i = 0; i < symbols.length; i++) {
      transactions.push({
        symbol: symbols[i],
        type: types[i],
        quantity: quantities[i].toNumber(),
        price: ethers.utils.formatEther(prices[i]),
        total: ethers.utils.formatEther(totals[i]),
        timestamp: new Date(timestamps[i].toNumber() * 1000)
      });
    }
    
    return transactions;
  }
  
  /**
   * Check if a stock is Shariah compliant
   * @param {string} symbol - Stock symbol
   * @returns {Promise<boolean>} Compliance status
   */
  async isStockCompliant(symbol) {
    if (!this.complianceGuardContract) {
      throw new Error('Contract not initialized');
    }
    
    return await this.complianceGuardContract.isStockCompliant(symbol);
  }
  
  /**
   * Get compliance details for a stock
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Compliance details
   */
  async getComplianceDetails(symbol) {
    if (!this.complianceGuardContract) {
      throw new Error('Contract not initialized');
    }
    
    const [score, issues, lastVerified] = 
      await this.complianceGuardContract.getComplianceDetails(symbol);
    
    return {
      score: score.toNumber(),
      issues,
      lastVerified: new Date(lastVerified.toNumber() * 1000)
    };
  }
}

export default SmartContractService;
