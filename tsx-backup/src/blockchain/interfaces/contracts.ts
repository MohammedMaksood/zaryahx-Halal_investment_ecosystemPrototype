// Contract ABIs for Zaryah smart contracts
export const StockPurchaseABI = [
  // Events
  "event StockPurchased(address indexed buyer, string symbol, uint256 quantity, uint256 price, uint256 total)",
  "event StockSold(address indexed seller, string symbol, uint256 quantity, uint256 price, uint256 total)",
  
  // Functions
  "function buyStock(string calldata symbol, string calldata name, uint256 quantity, uint256 price) external payable",
  "function sellStock(string calldata symbol, uint256 quantity, uint256 price) external",
  "function getBalance() external view returns (uint256)",
  "function updateFeePercentage(uint256 _feePercentage) external",
  "function feePercentage() external view returns (uint256)"
];

export const PortfolioManagerABI = [
  // Events
  "event StockAdded(address indexed user, string symbol, uint256 quantity, uint256 price)",
  "event StockRemoved(address indexed user, string symbol, uint256 quantity, uint256 price)",
  "event TransactionRecorded(address indexed user, string symbol, string transactionType, uint256 quantity, uint256 price)",
  
  // Functions
  "function getUserHoldings(address user) external view returns (string[] memory symbols, string[] memory names, uint256[] memory quantities, uint256[] memory avgPrices, uint256[] memory totalInvested)",
  "function getTransactionCount(address user) external view returns (uint256)",
  "function getUserTransactions(address user, uint256 offset, uint256 limit) external view returns (string[] memory symbols, string[] memory types, uint256[] memory quantities, uint256[] memory prices, uint256[] memory totals, uint256[] memory timestamps)",
  "function getPortfolioValue(address user) external view returns (uint256 totalValue)"
];

export const ComplianceGuardABI = [
  // Events
  "event ComplianceStatusUpdated(string symbol, bool isCompliant, uint256 score)",
  
  // Functions
  "function isStockCompliant(string calldata symbol) external view returns (bool)",
  "function getComplianceDetails(string calldata symbol) external view returns (uint256 score, string[] memory issues, uint256 lastVerified)"
];

export const SukukManagerABI = [
  // Events
  "event SukukIssued(uint256 indexed sukukId, address indexed issuer, string name, uint256 totalSupply, uint256 unitPrice)",
  "event SukukInvested(uint256 indexed sukukId, address indexed investor, uint256 units, uint256 amount)",
  "event ProfitDistributed(uint256 indexed sukukId, uint256 profitPerUnit, uint256 totalProfit)",
  "event ProfitWithdrawn(uint256 indexed sukukId, address indexed investor, uint256 amount)",
  "event SukukMatured(uint256 indexed sukukId)",
  
  // Functions
  "function issueSukuk(string calldata name, string calldata description, string calldata assetType, uint256 totalSupply, uint256 unitPrice, uint256 profitRate, uint256 maturityDays) external returns (uint256)",
  "function investInSukuk(uint256 sukukId, uint256 units) external payable",
  "function distributeProfit(uint256 sukukId) external payable",
  "function withdrawProfit(uint256 investmentIndex) external",
  "function matureSukuk(uint256 sukukId) external",
  "function getIssuedSukuks(address issuer) external view returns (uint256[] memory)",
  "function getInvestments(address investor) external view returns (uint256[] memory sukukIds, uint256[] memory units, uint256[] memory amounts, uint256[] memory dates, bool[] memory withdrawn)",
  "function getSukukDetails(uint256 sukukId) external view returns (string memory name, string memory description, string memory assetType, uint256 totalSupply, uint256 unitPrice, uint256 profitRate, uint256 maturityDate, address issuer, bool isActive, uint256 remainingUnits)"
];

export const MurabahaContractABI = [
  // Events
  "event AgreementCreated(uint256 indexed agreementId, address indexed buyer, address indexed seller, uint256 totalAmount)",
  "event DownPaymentReceived(uint256 indexed agreementId, uint256 amount)",
  "event InstallmentPaid(uint256 indexed agreementId, uint256 installmentNumber, uint256 amount)",
  "event AgreementCompleted(uint256 indexed agreementId)",
  "event AgreementCancelled(uint256 indexed agreementId, string reason)",
  
  // Functions
  "function createAgreement(address buyer, string calldata assetDescription, uint256 assetCost, uint256 profitMargin, uint256 downPaymentPercent, uint256 installmentCount, uint256 intervalDays) external returns (uint256)",
  "function makeDownPayment(uint256 agreementId) external payable",
  "function payInstallment(uint256 agreementId) external payable",
  "function cancelAgreement(uint256 agreementId, string calldata reason) external",
  "function getBuyerAgreements(address buyer) external view returns (uint256[] memory)",
  "function getSellerAgreements(address seller) external view returns (uint256[] memory)",
  "function getAgreementPayments(uint256 agreementId) external view returns (uint256[] memory installmentNumbers, uint256[] memory amounts, uint256[] memory dates)",
  "function getAgreementDetails(uint256 agreementId) external view returns (address buyer, address seller, string memory assetDescription, uint256 assetCost, uint256 profitMargin, uint256 totalAmount, uint256 downPayment, uint256 remainingAmount, uint256 installmentAmount, uint256 installmentCount, uint256 paidInstallments, uint256 nextInstallmentDate, bool isActive)"
];

// Contract addresses (to be updated after deployment)
export const CONTRACT_ADDRESSES = {
  // Polygon Mumbai Testnet
  MUMBAI: {
    PORTFOLIO_MANAGER: "0x0000000000000000000000000000000000000000",
    COMPLIANCE_GUARD: "0x0000000000000000000000000000000000000000",
    STOCK_PURCHASE: "0x0000000000000000000000000000000000000000",
    SUKUK_MANAGER: "0x0000000000000000000000000000000000000000",
    MURABAHA_CONTRACT: "0x0000000000000000000000000000000000000000"
  },
  // Polygon Mainnet
  POLYGON: {
    PORTFOLIO_MANAGER: "0x0000000000000000000000000000000000000000",
    COMPLIANCE_GUARD: "0x0000000000000000000000000000000000000000",
    STOCK_PURCHASE: "0x0000000000000000000000000000000000000000",
    SUKUK_MANAGER: "0x0000000000000000000000000000000000000000",
    MURABAHA_CONTRACT: "0x0000000000000000000000000000000000000000"
  }
};
