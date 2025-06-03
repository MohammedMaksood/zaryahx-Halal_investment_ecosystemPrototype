import { ethers } from 'ethers';
import { CommunityPortfolioABI, CommunityPortfolioAddresses } from '../contracts/CommunityPortfolioABI';

// Types for Community Portfolio
export interface Portfolio {
  id: number;
  name: string;
  description: string;
  location: string;
  impactCategory: string;
  targetAmount: string;
  currentAmount: string;
  minContribution: string;
  creator: string;
  contributorCount: number;
  proposalCount: number;
  createdAt: number;
  totalImpactScore: number;
}

export interface Proposal {
  id: number;
  portfolioId: number;
  name: string;
  description: string;
  recipient: string;
  amount: string;
  expectedImpact: string;
  proposer: string;
  yesVotes: number;
  noVotes: number;
  executed: boolean;
  createdAt: number;
  impactMetrics: string;
  impactScore: number;
}

export interface Contribution {
  portfolioId: number;
  amount: string;
  timestamp: number;
}

export interface CreatePortfolioParams {
  name: string;
  description: string;
  location: string;
  impactCategory: string;
  targetAmount: string;
  minContribution: string;
}

export interface ProposeInvestmentParams {
  portfolioId: number;
  name: string;
  description: string;
  recipient: string;
  amount: string;
  expectedImpact: string;
}

export interface ReportImpactParams {
  portfolioId: number;
  proposalId: number;
  impactMetrics: string;
  impactScore: number;
}

class CommunityPortfolioService {
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
    
    const contractAddress = CommunityPortfolioAddresses[this.networkId] || 
                           CommunityPortfolioAddresses[1]; // Fallback to Ethereum mainnet
    
    this.contract = new ethers.Contract(
      contractAddress,
      CommunityPortfolioABI,
      this.signer
    );
  }

  /**
   * Create a new community portfolio
   */
  public async createPortfolio(params: CreatePortfolioParams): Promise<number> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.createPortfolio(
        params.name,
        params.description,
        params.location,
        params.impactCategory,
        ethers.utils.parseEther(params.targetAmount),
        ethers.utils.parseEther(params.minContribution)
      );
      
      const receipt = await tx.wait();
      
      // Find the PortfolioCreated event in the receipt
      const event = receipt.events?.find(
        (event: any) => event.event === 'PortfolioCreated'
      );
      
      if (event && event.args) {
        return event.args.portfolioId.toNumber();
      }
      
      throw new Error('Portfolio creation event not found');
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  }

  /**
   * Contribute to a portfolio
   */
  public async contribute(portfolioId: number, amount: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.contribute(portfolioId, {
        value: ethers.utils.parseEther(amount)
      });
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error contributing to portfolio:', error);
      throw error;
    }
  }

  /**
   * Propose an investment
   */
  public async proposeInvestment(params: ProposeInvestmentParams): Promise<number> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.proposeInvestment(
        params.portfolioId,
        params.name,
        params.description,
        params.recipient,
        ethers.utils.parseEther(params.amount),
        params.expectedImpact
      );
      
      const receipt = await tx.wait();
      
      // Find the ProposalCreated event in the receipt
      const event = receipt.events?.find(
        (event: any) => event.event === 'ProposalCreated'
      );
      
      if (event && event.args) {
        return event.args.proposalId.toNumber();
      }
      
      throw new Error('Proposal creation event not found');
    } catch (error) {
      console.error('Error proposing investment:', error);
      throw error;
    }
  }

  /**
   * Vote on an investment proposal
   */
  public async vote(portfolioId: number, proposalId: number, support: boolean): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.vote(portfolioId, proposalId, support);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error voting on proposal:', error);
      throw error;
    }
  }

  /**
   * Execute an approved investment
   */
  public async executeInvestment(portfolioId: number, proposalId: number): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.executeInvestment(portfolioId, proposalId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error executing investment:', error);
      throw error;
    }
  }

  /**
   * Report impact metrics for an investment
   */
  public async reportImpact(params: ReportImpactParams): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.reportImpact(
        params.portfolioId,
        params.proposalId,
        params.impactMetrics,
        params.impactScore
      );
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error reporting impact:', error);
      throw error;
    }
  }

  /**
   * Get portfolio details
   */
  public async getPortfolio(portfolioId: number): Promise<Portfolio | null> {
    if (!this.contract) return null;
    
    try {
      const result = await this.contract.getPortfolio(portfolioId);
      
      return {
        id: portfolioId,
        name: result[0],
        description: result[1],
        location: result[2],
        impactCategory: result[3],
        targetAmount: ethers.utils.formatEther(result[4]),
        currentAmount: ethers.utils.formatEther(result[5]),
        minContribution: ethers.utils.formatEther(result[6]),
        creator: result[7],
        contributorCount: result[8].toNumber(),
        proposalCount: result[9].toNumber(),
        createdAt: result[10].toNumber(),
        totalImpactScore: result[11].toNumber()
      };
    } catch (error) {
      console.error('Error getting portfolio:', error);
      return null;
    }
  }

  /**
   * Get proposal details
   */
  public async getProposal(portfolioId: number, proposalId: number): Promise<Proposal | null> {
    if (!this.contract) return null;
    
    try {
      const result = await this.contract.getProposal(portfolioId, proposalId);
      
      return {
        id: proposalId,
        portfolioId,
        name: result[0],
        description: result[1],
        recipient: result[2],
        amount: ethers.utils.formatEther(result[3]),
        expectedImpact: result[4],
        proposer: result[5],
        yesVotes: result[6].toNumber(),
        noVotes: result[7].toNumber(),
        executed: result[8],
        createdAt: result[9].toNumber(),
        impactMetrics: result[10],
        impactScore: result[11].toNumber()
      };
    } catch (error) {
      console.error('Error getting proposal:', error);
      return null;
    }
  }

  /**
   * Get all portfolios
   */
  public async getAllPortfolios(): Promise<Portfolio[]> {
    if (!this.contract) return [];
    
    try {
      const count = await this.contract.getPortfolioCount();
      const portfolios: Portfolio[] = [];
      
      for (let i = 1; i <= count.toNumber(); i++) {
        const portfolio = await this.getPortfolio(i);
        if (portfolio) {
          portfolios.push(portfolio);
        }
      }
      
      return portfolios;
    } catch (error) {
      console.error('Error getting all portfolios:', error);
      return [];
    }
  }

  /**
   * Get user's contributions
   */
  public async getUserContributions(userAddress: string): Promise<Contribution[]> {
    if (!this.contract) return [];
    
    try {
      const result = await this.contract.getUserContributions(userAddress);
      
      return result.map((contribution: any) => ({
        portfolioId: contribution[0].toNumber(),
        amount: ethers.utils.formatEther(contribution[1]),
        timestamp: contribution[2].toNumber()
      }));
    } catch (error) {
      console.error('Error getting user contributions:', error);
      return [];
    }
  }

  /**
   * Get the contract address for the current network
   */
  public getContractAddress(): string {
    return CommunityPortfolioAddresses[this.networkId] || 
           CommunityPortfolioAddresses[1]; // Fallback to Ethereum mainnet
  }
  
  /**
   * Check if the current user is a contributor to a portfolio
   */
  public async isContributor(portfolioId: number): Promise<boolean> {
    if (!this.contract || !this.signer) return false;
    
    try {
      const address = await this.signer.getAddress();
      const contributions = await this.getUserContributions(address);
      
      return contributions.some(
        contribution => contribution.portfolioId === portfolioId
      );
    } catch (error) {
      console.error('Error checking if user is a contributor:', error);
      return false;
    }
  }
  
  /**
   * Get all proposals for a portfolio
   */
  public async getPortfolioProposals(portfolioId: number): Promise<Proposal[]> {
    if (!this.contract) return [];
    
    try {
      const portfolio = await this.getPortfolio(portfolioId);
      if (!portfolio) return [];
      
      const proposals: Proposal[] = [];
      
      for (let i = 1; i <= portfolio.proposalCount; i++) {
        const proposal = await this.getProposal(portfolioId, i);
        if (proposal) {
          proposals.push(proposal);
        }
      }
      
      return proposals;
    } catch (error) {
      console.error('Error getting portfolio proposals:', error);
      return [];
    }
  }
}

// Create a singleton instance
const communityPortfolioService = new CommunityPortfolioService();
export default communityPortfolioService;
