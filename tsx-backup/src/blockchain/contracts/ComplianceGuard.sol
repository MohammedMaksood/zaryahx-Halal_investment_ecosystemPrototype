// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ComplianceGuard
 * @dev Ensures all transactions comply with Shariah finance principles
 */
contract ComplianceGuard {
    // Contract owner
    address public owner;
    
    // Oracle address that provides compliance data
    address public oracleAddress;
    
    // Compliance status of stocks: symbol => isCompliant
    mapping(string => bool) public compliantStocks;
    
    // Compliance details
    struct ComplianceDetails {
        uint256 score;        // 0-100 score
        string[] issues;      // List of compliance issues
        uint256 lastVerified; // Timestamp of last verification
    }
    
    // Detailed compliance information: symbol => ComplianceDetails
    mapping(string => ComplianceDetails) public complianceDetails;
    
    // Events
    event ComplianceStatusUpdated(string symbol, bool isCompliant, uint256 score);
    event OracleAddressUpdated(address oldOracle, address newOracle);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Only oracle can call this function");
        _;
    }
    
    /**
     * @dev Constructor sets the owner and initial oracle
     */
    constructor(address _oracleAddress) {
        owner = msg.sender;
        oracleAddress = _oracleAddress;
    }
    
    /**
     * @dev Update oracle address
     */
    function updateOracleAddress(address _oracleAddress) external onlyOwner {
        emit OracleAddressUpdated(oracleAddress, _oracleAddress);
        oracleAddress = _oracleAddress;
    }
    
    /**
     * @dev Check if a stock is Shariah compliant
     */
    function isStockCompliant(string calldata symbol) external view returns (bool) {
        return compliantStocks[symbol];
    }
    
    /**
     * @dev Get detailed compliance information for a stock
     */
    function getComplianceDetails(string calldata symbol) external view returns (
        uint256 score,
        string[] memory issues,
        uint256 lastVerified
    ) {
        ComplianceDetails memory details = complianceDetails[symbol];
        return (details.score, details.issues, details.lastVerified);
    }
    
    /**
     * @dev Update compliance status for a stock (called by oracle)
     */
    function updateComplianceStatus(
        string calldata symbol,
        bool isCompliant,
        uint256 score,
        string[] calldata issues
    ) external onlyOracle {
        compliantStocks[symbol] = isCompliant;
        
        complianceDetails[symbol] = ComplianceDetails({
            score: score,
            issues: issues,
            lastVerified: block.timestamp
        });
        
        emit ComplianceStatusUpdated(symbol, isCompliant, score);
    }
    
    /**
     * @dev Batch update compliance status for multiple stocks (called by oracle)
     */
    function batchUpdateComplianceStatus(
        string[] calldata symbols,
        bool[] calldata isCompliant,
        uint256[] calldata scores,
        string[][] calldata allIssues
    ) external onlyOracle {
        require(
            symbols.length == isCompliant.length && 
            symbols.length == scores.length && 
            symbols.length == allIssues.length,
            "Array lengths must match"
        );
        
        for (uint256 i = 0; i < symbols.length; i++) {
            compliantStocks[symbols[i]] = isCompliant[i];
            
            complianceDetails[symbols[i]] = ComplianceDetails({
                score: scores[i],
                issues: allIssues[i],
                lastVerified: block.timestamp
            });
            
            emit ComplianceStatusUpdated(symbols[i], isCompliant[i], scores[i]);
        }
    }
    
    /**
     * @dev Manual override for compliance status (emergency use only)
     */
    function manualOverrideCompliance(
        string calldata symbol,
        bool isCompliant,
        uint256 score,
        string[] calldata issues
    ) external onlyOwner {
        compliantStocks[symbol] = isCompliant;
        
        complianceDetails[symbol] = ComplianceDetails({
            score: score,
            issues: issues,
            lastVerified: block.timestamp
        });
        
        emit ComplianceStatusUpdated(symbol, isCompliant, score);
    }
}
