import { ethers } from 'ethers';
import { 
  StockPurchaseABI, 
  PortfolioManagerABI, 
  ComplianceGuardABI,
  SukukManagerABI,
  MurabahaContractABI,
  CONTRACT_ADDRESSES 
} from '../interfaces/contracts';

/**
 * Service for interacting with Zaryah smart contracts
 */
class SmartContractService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private chainId: number = 80001; // Default to Mumbai Testnet
  
  // Contract instances
  private stockPurchaseContract: ethers.Contract | null = null;
  private portfolioManagerContract: ethers.Contract | null = null;
  private complianceGuardContract: ethers.Contract | null = null;
  private sukukManagerContract: ethers.Contract | null = null;
  private murabahaContract: ethers.Contract | null = null;
  
  /**
   * Initialize the service with a Web3 provider
   */
  public initialize(provider: ethers.providers.Web3Provider, chainId: number): void {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.chainId = chainId;
    
    this.initializeContracts();
  }
  
  /**
   * Initialize contract instances
   */
  private initializeContracts(): void {
    if (!this.provider || !this.signer) {
      console.error('Provider or signer not available');
      return;
    }
    
    // Determine which network to use
    const networkAddresses = this.chainId === 137 
      ? CONTRACT_ADDRESSES.POLYGON 
      : CONTRACT_ADDRESSES.MUMBAI;
    
    // Initialize contracts
    if (networkAddresses.STOCK_PURCHASE !== "0x0000000000000000000000000000000000000000") {
      this.stockPurchaseContract = new ethers.Contract(
        networkAddresses.STOCK_PURCHASE,
        StockPurchaseABI,
        this.signer
      );
    }
    
    if (networkAddresses.PORTFOLIO_MANAGER !== "0x0000000000000000000000000000000000000000") {
      this.portfolioManagerContract = new ethers.Contract(
        networkAddresses.PORTFOLIO_MANAGER,
        PortfolioManagerABI,
        this.signer
      );
    }
    
    if (networkAddresses.COMPLIANCE_GUARD !== "0x0000000000000000000000000000000000000000") {
      this.complianceGuardContract = new ethers.Contract(
        networkAddresses.COMPLIANCE_GUARD,
        ComplianceGuardABI,
        this.signer
      );
    }
    
    if (networkAddresses.SUKUK_MANAGER !== "0x0000000000000000000000000000000000000000") {
      this.sukukManagerContract = new ethers.Contract(
        networkAddresses.SUKUK_MANAGER,
        SukukManagerABI,
        this.signer
      );
    }
    
    if (networkAddresses.MURABAHA_CONTRACT !== "0x0000000000000000000000000000000000000000") {
      this.murabahaContract = new ethers.Contract(
        networkAddresses.MURABAHA_CONTRACT,
        MurabahaContractABI,
        this.signer
      );
    }
  }
  
  /**
   * Check if contracts are initialized
   */
  public isInitialized(): boolean {
    return this.provider !== null && this.signer !== null;
  }
  
  /**
   * Check if a specific contract is available
   */
  public isContractAvailable(contractName: 'stockPurchase' | 'portfolioManager' | 'complianceGuard' | 'sukukManager' | 'murabaha'): boolean {
    switch (contractName) {
      case 'stockPurchase':
        return this.stockPurchaseContract !== null;
      case 'portfolioManager':
        return this.portfolioManagerContract !== null;
      case 'complianceGuard':
        return this.complianceGuardContract !== null;
      case 'sukukManager':
        return this.sukukManagerContract !== null;
      case 'murabaha':
        return this.murabahaContract !== null;
      default:
        return false;
    }
  }
  
  /**
   * Buy stock using the StockPurchase contract
   */
  public async buyStock(symbol: string, name: string, quantity: number, price: number): Promise<string> {
    if (!this.stockPurchaseContract) {
      throw new Error('Stock Purchase contract not initialized');
    }
    
    try {
      // Convert price to wei (assuming price is in ETH)
      const priceInWei = ethers.utils.parseEther(price.toString());
      const totalCost = priceInWei.mul(quantity);
      
      // Add 0.25% fee
      const fee = totalCost.mul(25).div(10000);
      const totalWithFee = totalCost.add(fee);
      
      // Execute transaction
      const tx = await this.stockPurchaseContract.buyStock(
        symbol,
        name,
        quantity,
        priceInWei,
        { value: totalWithFee }
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error buying stock:', error);
      throw error;
    }
  }
  
  /**
   * Sell stock using the StockPurchase contract
   */
  public async sellStock(symbol: string, quantity: number, price: number): Promise<string> {
    if (!this.stockPurchaseContract) {
      throw new Error('Stock Purchase contract not initialized');
    }
    
    try {
      // Convert price to wei (assuming price is in ETH)
      const priceInWei = ethers.utils.parseEther(price.toString());
      
      // Execute transaction
      const tx = await this.stockPurchaseContract.sellStock(
        symbol,
        quantity,
        priceInWei
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error selling stock:', error);
      throw error;
    }
  }
  
  /**
   * Get user's portfolio holdings
   */
  public async getUserHoldings(userAddress: string): Promise<{
    symbols: string[];
    names: string[];
    quantities: number[];
    avgPrices: string[];
    totalInvested: string[];
  }> {
    if (!this.portfolioManagerContract) {
      throw new Error('Portfolio Manager contract not initialized');
    }
    
    try {
      const result = await this.portfolioManagerContract.getUserHoldings(userAddress);
      
      // Convert BigNumber values to strings
      const avgPrices = result.avgPrices.map((price: ethers.BigNumber) => 
        ethers.utils.formatEther(price)
      );
      
      const totalInvested = result.totalInvested.map((amount: ethers.BigNumber) => 
        ethers.utils.formatEther(amount)
      );
      
      // Convert BigNumber quantities to numbers
      const quantities = result.quantities.map((qty: ethers.BigNumber) => qty.toNumber());
      
      return {
        symbols: result.symbols,
        names: result.names,
        quantities,
        avgPrices,
        totalInvested
      };
    } catch (error) {
      console.error('Error getting user holdings:', error);
      throw error;
    }
  }
  
  /**
   * Get user's transaction history
   */
  public async getUserTransactions(userAddress: string, offset: number = 0, limit: number = 10): Promise<{
    symbols: string[];
    types: string[];
    quantities: number[];
    prices: string[];
    totals: string[];
    timestamps: Date[];
  }> {
    if (!this.portfolioManagerContract) {
      throw new Error('Portfolio Manager contract not initialized');
    }
    
    try {
      const result = await this.portfolioManagerContract.getUserTransactions(userAddress, offset, limit);
      
      // Convert BigNumber values to strings/numbers
      const quantities = result.quantities.map((qty: ethers.BigNumber) => qty.toNumber());
      const prices = result.prices.map((price: ethers.BigNumber) => ethers.utils.formatEther(price));
      const totals = result.totals.map((total: ethers.BigNumber) => ethers.utils.formatEther(total));
      const timestamps = result.timestamps.map((ts: ethers.BigNumber) => new Date(ts.toNumber() * 1000));
      
      return {
        symbols: result.symbols,
        types: result.types,
        quantities,
        prices,
        totals,
        timestamps
      };
    } catch (error) {
      console.error('Error getting user transactions:', error);
      throw error;
    }
  }
  
  /**
   * Check if a stock is Shariah compliant
   */
  public async isStockCompliant(symbol: string): Promise<boolean> {
    if (!this.complianceGuardContract) {
      throw new Error('Compliance Guard contract not initialized');
    }
    
    try {
      return await this.complianceGuardContract.isStockCompliant(symbol);
    } catch (error) {
      console.error('Error checking stock compliance:', error);
      throw error;
    }
  }
  
  /**
   * Get detailed compliance information for a stock
   */
  public async getComplianceDetails(symbol: string): Promise<{
    score: number;
    issues: string[];
    lastVerified: Date;
  }> {
    if (!this.complianceGuardContract) {
      throw new Error('Compliance Guard contract not initialized');
    }
    
    try {
      const result = await this.complianceGuardContract.getComplianceDetails(symbol);
      
      return {
        score: result.score.toNumber(),
        issues: result.issues,
        lastVerified: new Date(result.lastVerified.toNumber() * 1000)
      };
    } catch (error) {
      console.error('Error getting compliance details:', error);
      throw error;
    }
  }
  
  /**
   * Issue a new Sukuk
   */
  public async issueSukuk(
    name: string,
    description: string,
    assetType: string,
    totalSupply: number,
    unitPrice: number,
    profitRate: number,
    maturityDays: number
  ): Promise<number> {
    if (!this.sukukManagerContract) {
      throw new Error('Sukuk Manager contract not initialized');
    }
    
    try {
      // Convert unitPrice to wei
      const unitPriceInWei = ethers.utils.parseEther(unitPrice.toString());
      
      // Execute transaction
      const tx = await this.sukukManagerContract.issueSukuk(
        name,
        description,
        assetType,
        totalSupply,
        unitPriceInWei,
        profitRate * 100, // Convert percentage to basis points (e.g., 5% -> 500)
        maturityDays
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Find the SukukIssued event to get the ID
      const event = receipt.events?.find(e => e.event === 'SukukIssued');
      if (event && event.args) {
        return event.args.sukukId.toNumber();
      }
      
      throw new Error('Failed to get Sukuk ID from event');
    } catch (error) {
      console.error('Error issuing Sukuk:', error);
      throw error;
    }
  }
  
  /**
   * Invest in a Sukuk
   */
  public async investInSukuk(sukukId: number, units: number, unitPrice: string): Promise<string> {
    if (!this.sukukManagerContract) {
      throw new Error('Sukuk Manager contract not initialized');
    }
    
    try {
      // Calculate total investment amount
      const unitPriceInWei = ethers.utils.parseEther(unitPrice);
      const totalInvestment = unitPriceInWei.mul(units);
      
      // Execute transaction
      const tx = await this.sukukManagerContract.investInSukuk(
        sukukId,
        units,
        { value: totalInvestment }
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error investing in Sukuk:', error);
      throw error;
    }
  }
  
  /**
   * Create a new Murabaha agreement
   */
  public async createMurabahaAgreement(
    buyerAddress: string,
    assetDescription: string,
    assetCost: number,
    profitMargin: number,
    downPaymentPercent: number,
    installmentCount: number,
    intervalDays: number
  ): Promise<number> {
    if (!this.murabahaContract) {
      throw new Error('Murabaha contract not initialized');
    }
    
    try {
      // Convert assetCost to wei
      const assetCostInWei = ethers.utils.parseEther(assetCost.toString());
      
      // Convert percentages to basis points
      const profitMarginBps = Math.round(profitMargin * 100);
      const downPaymentBps = Math.round(downPaymentPercent * 100);
      
      // Execute transaction
      const tx = await this.murabahaContract.createAgreement(
        buyerAddress,
        assetDescription,
        assetCostInWei,
        profitMarginBps,
        downPaymentBps,
        installmentCount,
        intervalDays
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Find the AgreementCreated event to get the ID
      const event = receipt.events?.find(e => e.event === 'AgreementCreated');
      if (event && event.args) {
        return event.args.agreementId.toNumber();
      }
      
      throw new Error('Failed to get Agreement ID from event');
    } catch (error) {
      console.error('Error creating Murabaha agreement:', error);
      throw error;
    }
  }
}

// Export singleton instance
const smartContractService = new SmartContractService();
export default smartContractService;
