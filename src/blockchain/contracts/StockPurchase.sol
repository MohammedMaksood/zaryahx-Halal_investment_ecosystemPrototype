// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PortfolioManager.sol";
import "./ComplianceGuard.sol";

/**
 * @title StockPurchase
 * @dev Handles the buying and selling of tokenized stocks with Shariah compliance
 */
contract StockPurchase {
    // Contract owner
    address public owner;
    
    // Reference to other contracts
    PortfolioManager public portfolioManager;
    ComplianceGuard public complianceGuard;
    
    // Fee percentage (in basis points, 100 = 1%)
    uint256 public feePercentage = 25; // 0.25% fee
    
    // Events
    event StockPurchased(address indexed buyer, string symbol, uint256 quantity, uint256 price, uint256 total);
    event StockSold(address indexed seller, string symbol, uint256 quantity, uint256 price, uint256 total);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Constructor sets the owner and references to other contracts
     */
    constructor(address _portfolioManager, address _complianceGuard) {
        owner = msg.sender;
        portfolioManager = PortfolioManager(_portfolioManager);
        complianceGuard = ComplianceGuard(_complianceGuard);
    }
    
    /**
     * @dev Update contract references
     */
    function updateContractReferences(address _portfolioManager, address _complianceGuard) external onlyOwner {
        portfolioManager = PortfolioManager(_portfolioManager);
        complianceGuard = ComplianceGuard(_complianceGuard);
    }
    
    /**
     * @dev Update fee percentage
     */
    function updateFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 500, "Fee percentage cannot exceed 5%");
        feePercentage = _feePercentage;
    }
    
    /**
     * @dev Buy stock with Shariah compliance check
     * @param symbol Stock symbol
     * @param name Stock name
     * @param quantity Number of shares to buy
     * @param price Price per share
     */
    function buyStock(
        string calldata symbol,
        string calldata name,
        uint256 quantity,
        uint256 price
    ) external payable {
        // Calculate total cost including fee
        uint256 totalCost = quantity * price;
        uint256 fee = (totalCost * feePercentage) / 10000;
        uint256 totalWithFee = totalCost + fee;
        
        // Ensure enough funds were sent
        require(msg.value >= totalWithFee, "Insufficient funds sent");
        
        // Check if stock is Shariah compliant
        require(complianceGuard.isStockCompliant(symbol), "Stock is not Shariah compliant");
        
        // Add stock to user's portfolio
        portfolioManager.addStock(msg.sender, symbol, name, quantity, price);
        
        // Transfer fee to contract owner and refund excess
        payable(owner).transfer(fee);
        if (msg.value > totalWithFee) {
            payable(msg.sender).transfer(msg.value - totalWithFee);
        }
        
        // Emit event
        emit StockPurchased(msg.sender, symbol, quantity, price, totalCost);
    }
    
    /**
     * @dev Sell stock
     * @param symbol Stock symbol
     * @param quantity Number of shares to sell
     * @param price Current price per share
     */
    function sellStock(
        string calldata symbol,
        uint256 quantity,
        uint256 price
    ) external {
        // Calculate total value
        uint256 totalValue = quantity * price;
        uint256 fee = (totalValue * feePercentage) / 10000;
        uint256 totalAfterFee = totalValue - fee;
        
        // Remove stock from user's portfolio
        require(portfolioManager.removeStock(msg.sender, symbol, quantity), "Failed to remove stock from portfolio");
        
        // Transfer funds to seller
        payable(msg.sender).transfer(totalAfterFee);
        
        // Transfer fee to contract owner
        payable(owner).transfer(fee);
        
        // Emit event
        emit StockSold(msg.sender, symbol, quantity, price, totalValue);
    }
    
    /**
     * @dev Withdraw funds (only owner)
     */
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
