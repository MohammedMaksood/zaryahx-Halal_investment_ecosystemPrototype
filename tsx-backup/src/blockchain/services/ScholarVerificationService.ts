import { ethers } from 'ethers';
import { ScholarVerificationABI, ScholarVerificationAddresses } from '../contracts/ScholarVerificationABI';

// Types for Scholar Verification
export interface Scholar {
  name: string;
  institution: string;
  specialization: string;
  verificationCount: number;
  isActive: boolean;
  reputationScore: number;
  address: string;
}

export interface VerificationRequest {
  transactionHash: string;
  scholarAddresses: string[];
}

export interface VerificationResult {
  requester: string;
  scholars: string[];
  isCompliant: boolean[];
  comments: string[];
  complianceScores: number[];
  timestamp: number;
  status: VerificationStatus;
  transactionHash: string;
}

export enum VerificationStatus {
  Pending = 0,
  Verified = 1,
  Rejected = 2
}

class ScholarVerificationService {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;
  private networkId: number = 1; // Default to Ethereum mainnet

  /**
   * Initialize the service with a Web3 provider
   */
  public initialize(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.getNetworkId();
  }

  /**
   * Get the current network ID
   */
  private async getNetworkId() {
    if (!this.provider) return;
    
    const network = await this.provider.getNetwork();
    this.networkId = network.chainId;
    this.initializeContract();
  }

  /**
   * Initialize the contract instance
   */
  private initializeContract() {
    if (!this.provider || !this.signer) return;
    
    const contractAddress = ScholarVerificationAddresses[this.networkId] || 
                           ScholarVerificationAddresses[1]; // Fallback to Ethereum mainnet
    
    this.contract = new ethers.Contract(
      contractAddress,
      ScholarVerificationABI,
      this.signer
    );
  }

  /**
   * Register a new scholar
   */
  public async registerScholar(
    name: string,
    institution: string,
    specialization: string,
    credentials: string
  ): Promise<boolean> {
    if (!this.contract) return false;
    
    try {
      const tx = await this.contract.registerScholar(
        name,
        institution,
        specialization,
        credentials
      );
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error registering scholar:', error);
      return false;
    }
  }

  /**
   * Get scholar details
   */
  public async getScholar(scholarAddress: string): Promise<Scholar | null> {
    if (!this.contract || !this.provider) return null;
    
    try {
      const result = await this.contract.getScholar(scholarAddress);
      
      return {
        name: result[0],
        institution: result[1],
        specialization: result[2],
        verificationCount: result[3].toNumber(),
        isActive: result[4],
        reputationScore: result[5].toNumber(),
        address: scholarAddress
      };
    } catch (error) {
      console.error('Error getting scholar details:', error);
      return null;
    }
  }

  /**
   * Submit a transaction for verification
   */
  public async submitTransactionForVerification(
    request: VerificationRequest
  ): Promise<boolean> {
    if (!this.contract) return false;
    
    try {
      const tx = await this.contract.submitTransactionForVerification(
        request.transactionHash,
        request.scholarAddresses
      );
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error submitting transaction for verification:', error);
      return false;
    }
  }

  /**
   * Verify a transaction (scholar only)
   */
  public async verifyTransaction(
    transactionHash: string,
    isCompliant: boolean,
    comments: string,
    complianceScore: number
  ): Promise<boolean> {
    if (!this.contract) return false;
    
    try {
      const tx = await this.contract.verifyTransaction(
        transactionHash,
        isCompliant,
        comments,
        complianceScore
      );
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }

  /**
   * Get verification details for a transaction
   */
  public async getVerificationDetails(
    transactionHash: string
  ): Promise<VerificationResult | null> {
    if (!this.contract) return null;
    
    try {
      const result = await this.contract.getVerificationDetails(transactionHash);
      
      return {
        requester: result[0],
        scholars: result[1],
        isCompliant: result[2],
        comments: result[3],
        complianceScores: result[4].map((score: ethers.BigNumber) => score.toNumber()),
        timestamp: result[5].toNumber(),
        status: result[6],
        transactionHash
      };
    } catch (error) {
      console.error('Error getting verification details:', error);
      return null;
    }
  }

  /**
   * Get all scholars
   */
  public async getAllScholars(): Promise<string[]> {
    if (!this.contract) return [];
    
    try {
      return await this.contract.getAllScholars();
    } catch (error) {
      console.error('Error getting all scholars:', error);
      return [];
    }
  }

  /**
   * Get all verifications for a user
   */
  public async getUserVerifications(userAddress: string): Promise<string[]> {
    if (!this.contract) return [];
    
    try {
      return await this.contract.getUserVerifications(userAddress);
    } catch (error) {
      console.error('Error getting user verifications:', error);
      return [];
    }
  }

  /**
   * Check if the current user is a registered scholar
   */
  public async isScholar(): Promise<boolean> {
    if (!this.contract || !this.signer) return false;
    
    try {
      const address = await this.signer.getAddress();
      const scholar = await this.getScholar(address);
      
      return scholar !== null && scholar.isActive;
    } catch (error) {
      console.error('Error checking if user is a scholar:', error);
      return false;
    }
  }

  /**
   * Get the contract address for the current network
   */
  public getContractAddress(): string {
    return ScholarVerificationAddresses[this.networkId] || 
           ScholarVerificationAddresses[1]; // Fallback to Ethereum mainnet
  }
  
  /**
   * Verify if a stock is Shariah compliant
   * This is a simplified implementation for integration with smart contracts
   * In a real implementation, this would check against a database or API
   */
  public async verifyStock(symbol: string): Promise<boolean> {
    // List of pre-approved Shariah-compliant stocks
    const compliantStocks = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'ADBE', 'PYPL',
      'NFLX', 'INTC', 'AMD', 'CSCO', 'ORCL', 'IBM', 'SHOP', 'CRM', 'BABA',
      'ASML', 'TSM', 'V', 'MA', 'JPM', 'BAC', 'WMT', 'PG', 'JNJ', 'UNH',
      'HD', 'MCD', 'NKE', 'DIS', 'KO', 'PEP', 'COST', 'AVGO', 'TXN', 'QCOM',
      'ADSK', 'INTU', 'ISRG', 'SBUX', 'ETSY', 'ZM', 'TEAM', 'SPOT', 'TWLO'
    ];
    
    // ETFs that are Shariah compliant
    const compliantETFs = [
      'SPUS-ETF', 'HLAL-ETF', 'ISDU-ETF', 'SPRE-ETF', 'SPSK-ETF', 'AMAL-ETF'
    ];
    
    // Check if the stock is in the compliant list
    if (compliantStocks.includes(symbol)) {
      return true;
    }
    
    // Check if it's a compliant ETF
    if (compliantETFs.includes(symbol)) {
      return true;
    }
    
    // For demo purposes, consider some stocks compliant based on a pattern
    // In a real implementation, this would be a more sophisticated check
    if (symbol.startsWith('SH') || symbol.endsWith('HALAL')) {
      return true;
    }
    
    // Default to false for unknown stocks
    return false;
  }
}

// Create a singleton instance
const scholarVerificationService = new ScholarVerificationService();
export default scholarVerificationService;
