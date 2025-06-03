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
  "function getInvestedSukuks(address investor) external view returns (uint256[] memory)",
  "function getSukukDetails(uint256 sukukId) external view returns (string memory name, string memory description, string memory assetType, address issuer, uint256 totalSupply, uint256 remainingSupply, uint256 unitPrice, uint256 profitRate, uint256 maturityDate, bool isMatured)",
  "function getInvestmentDetails(uint256 investmentIndex) external view returns (uint256 sukukId, uint256 units, uint256 amount, uint256 profitAccrued, bool isActive)"
];

export const ZakatCalculatorABI = [
  // Events
  "event ZakatCalculated(address indexed user, uint256 zakatAmount, uint256 totalWealth)",
  "event ZakatPaid(address indexed user, uint256 amount, address recipient)",
  
  // Functions
  "function calculateZakat(uint256 gold, uint256 silver, uint256 cash, uint256 investments, uint256 receivables, uint256 businessAssets, uint256 liabilities) external view returns (uint256 zakatAmount, uint256 totalZakatableWealth)",
  "function payZakat(address recipient) external payable",
  "function getNisabThreshold() external view returns (uint256)",
  "function updateGoldPrice(uint256 _goldPrice) external",
  "function updateSilverPrice(uint256 _silverPrice) external"
];
