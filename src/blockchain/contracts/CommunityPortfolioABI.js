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
        "internalType": "string[]",
        "name": "_impactCategories",
        "type": "string[]"
      }
    ],
    "name": "createCommunityPortfolio",
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
  
  // Get portfolio details
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      }
    ],
    "name": "getPortfolioDetails",
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
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "totalFunding",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "impactCategories",
            "type": "string[]"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
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
  
  // Contribute funds to a portfolio
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_portfolioId",
        "type": "uint256"
      }
    ],
    "name": "contributeFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  
  // Get all portfolios
  {
    "inputs": [],
    "name": "getAllPortfolios",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Get portfolios by creator
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      }
    ],
    "name": "getPortfoliosByCreator",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
