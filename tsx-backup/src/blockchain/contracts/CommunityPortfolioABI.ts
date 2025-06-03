// ABI (Application Binary Interface) for the Community-Directed Impact Portfolio smart contract
// This defines how to interact with the contract on the blockchain

export const CommunityPortfolioABI = [
  // Create a new community portfolio
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_impactCategory",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_targetAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minContribution",
        "type": "uint256"
      }
    ],
    "name": "createPortfolio",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Contribute to a portfolio
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      }
    ],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  
  // Propose an investment
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_investmentName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_expectedImpact",
        "type": "string"
      }
    ],
    "name": "proposeInvestment",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Vote on an investment proposal
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_proposalId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_support",
        "type": "bool"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Execute an approved investment
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_proposalId",
        "type": "uint256"
      }
    ],
    "name": "executeInvestment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Report impact metrics for an investment
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_proposalId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_impactMetrics",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_impactScore",
        "type": "uint256"
      }
    ],
    "name": "reportImpact",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Get portfolio details
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      }
    ],
    "name": "getPortfolio",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "impactCategory",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "targetAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currentAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minContribution",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "contributorCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "proposalCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalImpactScore",
            "type": "uint256"
          }
        ],
        "internalType": "struct CommunityPortfolio.Portfolio",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Get investment proposal details
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_proposalId",
        "type": "uint256"
      }
    ],
    "name": "getProposal",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "expectedImpact",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "proposer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "yesVotes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "noVotes",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "executed",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "impactMetrics",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "impactScore",
            "type": "uint256"
          }
        ],
        "internalType": "struct CommunityPortfolio.Proposal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Get all portfolios
  {
    "inputs": [],
    "name": "getPortfolioCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Get user's contributions
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserContributions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "portfolioId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct CommunityPortfolio.Contribution[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "portfolioId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "PortfolioCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "portfolioId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Contribution",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "portfolioId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "proposer",
        "type": "address"
      }
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "portfolioId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "support",
        "type": "bool"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "portfolioId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "executor",
        "type": "address"
      }
    ],
    "name": "ProposalExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "portfolioId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "proposalId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "impactScore",
        "type": "uint256"
      }
    ],
    "name": "ImpactReported",
    "type": "event"
  }
];

// Contract addresses for different networks
export const CommunityPortfolioAddresses = {
  // Ethereum Mainnet
  1: '0x0000000000000000000000000000000000000000', // Placeholder
  
  // Polygon Mainnet
  137: '0x0000000000000000000000000000000000000000', // Placeholder
  
  // Binance Smart Chain
  56: '0x0000000000000000000000000000000000000000', // Placeholder
  
  // Testnet (for development)
  5: '0x0000000000000000000000000000000000000000', // Goerli testnet placeholder
};
