import { ethers } from 'ethers';
import { CommunityPortfolioABI } from '../contracts/CommunityPortfolioABI';

// Types for Community Portfolio - converted from TypeScript interfaces to JSDoc
/**
 * @typedef {Object} Portfolio
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} location
 * @property {string} impactCategory
 * @property {string} targetAmount
 * @property {string} currentAmount
 * @property {string} minContribution
 * @property {string} creator
 * @property {number} contributorCount
 * @property {number} proposalCount
 * @property {number} createdAt
 * @property {number} totalImpactScore
 */

// Export Portfolio type for use in other components
export const Portfolio = {};

/**
 * @typedef {Object} Proposal
 * @property {number} id
 * @property {number} portfolioId
 * @property {string} name
 * @property {string} description
 * @property {string} recipient
 * @property {string} amount
 * @property {string} expectedImpact
 * @property {string} proposer
 * @property {number} yesVotes
 * @property {number} noVotes
 * @property {boolean} executed
 * @property {number} createdAt
 * @property {string} impactMetrics
 * @property {number} impactScore
 */

// Export Proposal type for use in other components
export const Proposal = {};

/**
 * @typedef {Object} Contribution
 * @property {number} portfolioId
 * @property {string} amount
 * @property {number} timestamp
 */

/**
 * @typedef {Object} CreatePortfolioParams
 * @property {string} name
 * @property {string} description
 * @property {string} location
 * @property {string} impactCategory
 * @property {string} targetAmount
 * @property {string} minContribution
 */

// Export CreatePortfolioParams type for use in other components
export const CreatePortfolioParams = {};

/**
 * @typedef {Object} ProposeInvestmentParams
 * @property {number} portfolioId
 * @property {string} name
 * @property {string} description
 * @property {string} recipient
 * @property {string} amount
 * @property {string} expectedImpact
 */

// Export ProposeInvestmentParams type for use in other components
export const ProposeInvestmentParams = {};

/**
 * Service for interacting with the Community Portfolio smart contract
 */
class CommunityPortfolioService {
  constructor(provider, contractAddress) {
    this.provider = provider;
    this.contractAddress = contractAddress;
    this.contract = new ethers.Contract(
      contractAddress,
      CommunityPortfolioABI,
      provider
    );
  }

  /**
   * Create a new community portfolio
   * @param {CreatePortfolioParams} params - Portfolio creation parameters
   * @param {ethers.Signer} signer - Ethereum signer
   * @returns {Promise<number>} - Portfolio ID
   */
  async createPortfolio(params, signer) {
    const contract = this.contract.connect(signer);
    const tx = await contract.createPortfolio(
      params.name,
      params.description,
      params.location,
      params.impactCategory,
      ethers.utils.parseEther(params.targetAmount),
      ethers.utils.parseEther(params.minContribution)
    );
    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === 'PortfolioCreated');
    return event.args.portfolioId.toNumber();
  }

  /**
   * Get portfolio details
   * @param {number} portfolioId - Portfolio ID
   * @returns {Promise<Portfolio>} - Portfolio details
   */
  async getPortfolio(portfolioId) {
    const data = await this.contract.getPortfolio(portfolioId);
    return {
      id: portfolioId,
      name: data.name,
      description: data.description,
      location: data.location,
      impactCategory: data.impactCategory,
      targetAmount: ethers.utils.formatEther(data.targetAmount),
      currentAmount: ethers.utils.formatEther(data.currentAmount),
      minContribution: ethers.utils.formatEther(data.minContribution),
      creator: data.creator,
      contributorCount: data.contributorCount.toNumber(),
      proposalCount: data.proposalCount.toNumber(),
      createdAt: data.createdAt.toNumber(),
      totalImpactScore: data.totalImpactScore.toNumber()
    };
  }

  /**
   * Contribute to a portfolio
   * @param {number} portfolioId - Portfolio ID
   * @param {string} amount - Amount to contribute in ETH
   * @param {ethers.Signer} signer - Ethereum signer
   * @returns {Promise<boolean>} - Success status
   */
  async contribute(portfolioId, amount, signer) {
    const contract = this.contract.connect(signer);
    const tx = await contract.contribute(portfolioId, {
      value: ethers.utils.parseEther(amount)
    });
    await tx.wait();
    return true;
  }

  /**
   * Get all portfolios
   * @returns {Promise<number[]>} - Array of portfolio IDs
   */
  async getAllPortfolios() {
    const portfolioIds = await this.contract.getAllPortfolios();
    return portfolioIds.map(id => id.toNumber());
  }

  /**
   * Get portfolios created by an address
   * @param {string} address - Creator's address
   * @returns {Promise<number[]>} - Array of portfolio IDs
   */
  async getPortfoliosByCreator(address) {
    const portfolioIds = await this.contract.getPortfoliosByCreator(address);
    return portfolioIds.map(id => id.toNumber());
  }

  /**
   * Get portfolios contributed to by an address
   * @param {string} address - Contributor's address
   * @returns {Promise<number[]>} - Array of portfolio IDs
   */
  async getPortfoliosByContributor(address) {
    const portfolioIds = await this.contract.getPortfoliosByContributor(address);
    return portfolioIds.map(id => id.toNumber());
  }
}

export default CommunityPortfolioService;
