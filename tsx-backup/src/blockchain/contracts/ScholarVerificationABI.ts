// ABI (Application Binary Interface) for the Scholar Verification smart contract
// This defines how to interact with the contract on the blockchain

export const ScholarVerificationABI = [
  // Scholar registration
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_institution",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_specialization",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_credentials",
        "type": "string"
      }
    ],
    "name": "registerScholar",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Get scholar details
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_scholarAddress",
        "type": "address"
      }
    ],
    "name": "getScholar",
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
            "name": "institution",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "specialization",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "verificationCount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "reputationScore",
            "type": "uint256"
          }
        ],
        "internalType": "struct ScholarVerification.Scholar",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Submit transaction for verification
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_transactionHash",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "_scholarAddresses",
        "type": "address[]"
      }
    ],
    "name": "submitTransactionForVerification",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Verify transaction (scholar only)
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_transactionHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_isCompliant",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "_comments",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_complianceScore",
        "type": "uint256"
      }
    ],
    "name": "verifyTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Get verification details
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_transactionHash",
        "type": "string"
      }
    ],
    "name": "getVerificationDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "requester",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "scholars",
            "type": "address[]"
          },
          {
            "internalType": "bool[]",
            "name": "isCompliant",
            "type": "bool[]"
          },
          {
            "internalType": "string[]",
            "name": "comments",
            "type": "string[]"
          },
          {
            "internalType": "uint256[]",
            "name": "complianceScores",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "enum ScholarVerification.VerificationStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct ScholarVerification.Verification",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Get all scholars
  {
    "inputs": [],
    "name": "getAllScholars",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Get all verifications for a user
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "name": "getUserVerifications",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
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
        "internalType": "address",
        "name": "scholarAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "ScholarRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "transactionHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "VerificationRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "transactionHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "scholar",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isCompliant",
        "type": "bool"
      }
    ],
    "name": "TransactionVerified",
    "type": "event"
  }
];

// Contract addresses for different networks
export const ScholarVerificationAddresses = {
  // Ethereum Mainnet
  1: '0x0000000000000000000000000000000000000000', // Placeholder
  
  // Polygon Mainnet
  137: '0x0000000000000000000000000000000000000000', // Placeholder
  
  // Binance Smart Chain
  56: '0x0000000000000000000000000000000000000000', // Placeholder
  
  // Testnet (for development)
  5: '0x0000000000000000000000000000000000000000', // Goerli testnet placeholder
};
