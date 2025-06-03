// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title PortfolioManager
 * @dev Manages user stock holdings and portfolio data
 */
contract PortfolioManager {
    // Contract owner
    address public owner;
    
    // Authorized contracts that can modify portfolio data
    mapping(address => bool) public authorizedContracts;
    
    // Stock holding structure
    struct StockHolding {
        string symbol;
        string name;
        uint256 quantity;
        uint256 avgPrice;
        uint256 totalInvested;
        uint256 lastUpdated;
    }
    
    // Transaction structure
    struct Transaction {
        string symbol;
        string transactionType; // "buy" or "sell"
        uint256 quantity;
        uint256 price;
        uint256 total;
        uint256 timestamp;
    }
    
    // User portfolios: user address => symbol => StockHolding
    mapping(address => mapping(string => StockHolding)) public holdings;
    
    // User transaction history: user address => array of transactions
    mapping(address => Transaction[]) public transactions;
    
    // List of symbols in a user's portfolio for easy iteration
    mapping(address => string[]) public userSymbols;
    
    // Events
    event StockAdded(address indexed user, string symbol, uint256 quantity, uint256 price);
    event StockRemoved(address indexed user, string symbol, uint256 quantity, uint256 price);
    event TransactionRecorded(address indexed user, string symbol, string transactionType, uint256 quantity, uint256 price);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(msg.sender == owner || authorizedContracts[msg.sender], "Not authorized");
        _;
    }
    
    /**
     * @dev Constructor sets the owner
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Add or remove an authorized contract
     */
    function setAuthorizedContract(address contractAddress, bool isAuthorized) external onlyOwner {
        authorizedContracts[contractAddress] = isAuthorized;
    }
    
    /**
     * @dev Add stock to user's portfolio
     */
    function addStock(
        address user,
        string calldata symbol,
        string calldata name,
        uint256 quantity,
        uint256 price
    ) external onlyAuthorized returns (bool) {
        uint256 total = quantity * price;
        
        // Check if user already has this stock
        if (holdings[user][symbol].quantity > 0) {
            // Update existing holding
            StockHolding storage holding = holdings[user][symbol];
            
            // Calculate new average price
            uint256 totalShares = holding.quantity + quantity;
            uint256 totalValue = holding.totalInvested + total;
            uint256 newAvgPrice = totalValue / totalShares;
            
            // Update holding
            holding.quantity = totalShares;
            holding.avgPrice = newAvgPrice;
            holding.totalInvested = totalValue;
            holding.lastUpdated = block.timestamp;
        } else {
            // Add new holding
            holdings[user][symbol] = StockHolding({
                symbol: symbol,
                name: name,
                quantity: quantity,
                avgPrice: price,
                totalInvested: total,
                lastUpdated: block.timestamp
            });
            
            // Add symbol to user's list
            userSymbols[user].push(symbol);
        }
        
        // Record transaction
        recordTransaction(user, symbol, "buy", quantity, price, total);
        
        emit StockAdded(user, symbol, quantity, price);
        return true;
    }
    
    /**
     * @dev Remove stock from user's portfolio (for selling)
     */
    function removeStock(
        address user,
        string calldata symbol,
        uint256 quantity
    ) external onlyAuthorized returns (bool) {
        // Check if user has this stock and enough quantity
        require(holdings[user][symbol].quantity >= quantity, "Insufficient shares");
        
        StockHolding storage holding = holdings[user][symbol];
        uint256 currentPrice = holding.avgPrice; // Using avg price as current price for calculation
        uint256 total = quantity * currentPrice;
        
        // Update holding
        if (holding.quantity == quantity) {
            // Remove holding completely if selling all shares
            delete holdings[user][symbol];
            
            // Remove symbol from user's list
            removeSymbolFromUserList(user, symbol);
        } else {
            // Update quantity and total invested
            uint256 percentageSold = (quantity * 100) / holding.quantity;
            uint256 investmentReduced = (holding.totalInvested * percentageSold) / 100;
            
            holding.quantity -= quantity;
            holding.totalInvested -= investmentReduced;
            holding.lastUpdated = block.timestamp;
        }
        
        // Record transaction
        recordTransaction(user, symbol, "sell", quantity, currentPrice, total);
        
        emit StockRemoved(user, symbol, quantity, currentPrice);
        return true;
    }
    
    /**
     * @dev Record a transaction in user's history
     */
    function recordTransaction(
        address user,
        string memory symbol,
        string memory transactionType,
        uint256 quantity,
        uint256 price,
        uint256 total
    ) internal {
        transactions[user].push(Transaction({
            symbol: symbol,
            transactionType: transactionType,
            quantity: quantity,
            price: price,
            total: total,
            timestamp: block.timestamp
        }));
        
        emit TransactionRecorded(user, symbol, transactionType, quantity, price);
    }
    
    /**
     * @dev Remove a symbol from user's list
     */
    function removeSymbolFromUserList(address user, string memory symbolToRemove) internal {
        string[] storage symbols = userSymbols[user];
        for (uint i = 0; i < symbols.length; i++) {
            if (keccak256(bytes(symbols[i])) == keccak256(bytes(symbolToRemove))) {
                // Move the last element to the position of the element to delete
                if (i < symbols.length - 1) {
                    symbols[i] = symbols[symbols.length - 1];
                }
                // Remove the last element
                symbols.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Get all holdings for a user
     */
    function getUserHoldings(address user) external view returns (
        string[] memory symbols,
        string[] memory names,
        uint256[] memory quantities,
        uint256[] memory avgPrices,
        uint256[] memory totalInvested
    ) {
        string[] memory userSymbolsList = userSymbols[user];
        uint256 length = userSymbolsList.length;
        
        symbols = new string[](length);
        names = new string[](length);
        quantities = new uint256[](length);
        avgPrices = new uint256[](length);
        totalInvested = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            string memory symbol = userSymbolsList[i];
            StockHolding memory holding = holdings[user][symbol];
            
            symbols[i] = holding.symbol;
            names[i] = holding.name;
            quantities[i] = holding.quantity;
            avgPrices[i] = holding.avgPrice;
            totalInvested[i] = holding.totalInvested;
        }
        
        return (symbols, names, quantities, avgPrices, totalInvested);
    }
    
    /**
     * @dev Get transaction count for a user
     */
    function getTransactionCount(address user) external view returns (uint256) {
        return transactions[user].length;
    }
    
    /**
     * @dev Get transactions for a user with pagination
     */
    function getUserTransactions(address user, uint256 offset, uint256 limit) external view returns (
        string[] memory symbols,
        string[] memory types,
        uint256[] memory quantities,
        uint256[] memory prices,
        uint256[] memory totals,
        uint256[] memory timestamps
    ) {
        uint256 totalCount = transactions[user].length;
        
        // Check bounds
        if (offset >= totalCount) {
            return (new string[](0), new string[](0), new uint256[](0), new uint256[](0), new uint256[](0), new uint256[](0));
        }
        
        // Calculate actual limit
        uint256 actualLimit = (offset + limit > totalCount) ? (totalCount - offset) : limit;
        
        symbols = new string[](actualLimit);
        types = new string[](actualLimit);
        quantities = new uint256[](actualLimit);
        prices = new uint256[](actualLimit);
        totals = new uint256[](actualLimit);
        timestamps = new uint256[](actualLimit);
        
        for (uint256 i = 0; i < actualLimit; i++) {
            Transaction memory txn = transactions[user][offset + i];
            
            symbols[i] = txn.symbol;
            types[i] = txn.transactionType;
            quantities[i] = txn.quantity;
            prices[i] = txn.price;
            totals[i] = txn.total;
            timestamps[i] = txn.timestamp;
        }
        
        return (symbols, types, quantities, prices, totals, timestamps);
    }
    
    /**
     * @dev Get portfolio value for a user
     */
    function getPortfolioValue(address user) external view returns (uint256 totalValue) {
        string[] memory userSymbolsList = userSymbols[user];
        
        for (uint256 i = 0; i < userSymbolsList.length; i++) {
            string memory symbol = userSymbolsList[i];
            StockHolding memory holding = holdings[user][symbol];
            
            totalValue += holding.quantity * holding.avgPrice;
        }
        
        return totalValue;
    }
}
