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
        "name": "_profileUrl",
        "type": "string"
      }
    ],
    "name": "registerAsScholar",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "internalType": "string",
        "name": "_details",
        "type": "string"
      }
    ],
    "name": "submitTransactionForVerification",
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
  
  // Verify transaction
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_verificationId",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "_verificationId",
        "type": "uint256"
      }
    ],
    "name": "getVerificationDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "transactionHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "details",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "submitter",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "verifier",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isCompliant",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "comments",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
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
  
  // Get scholar details
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_scholarAddress",
        "type": "address"
      }
    ],
    "name": "getScholarDetails",
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
            "internalType": "string",
            "name": "profileUrl",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "verificationCount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isRegistered",
            "type": "bool"
          }
        ],
        "internalType": "struct ScholarVerification.Scholar",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
