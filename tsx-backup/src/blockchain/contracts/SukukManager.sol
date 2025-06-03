// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ComplianceGuard.sol";

/**
 * @title SukukManager
 * @dev Manages Shariah-compliant Sukuk (Islamic bonds) issuance and investments
 */
contract SukukManager {
    // Contract owner
    address public owner;
    
    // Reference to compliance guard
    ComplianceGuard public complianceGuard;
    
    // Sukuk structure
    struct Sukuk {
        uint256 id;
        string name;
        string description;
        string assetType;      // Underlying asset type
        uint256 totalSupply;   // Total sukuk units available
        uint256 unitPrice;     // Price per unit
        uint256 profitRate;    // Expected profit rate (in basis points, 500 = 5%)
        uint256 maturityDate;  // Timestamp when sukuk matures
        uint256 issuedDate;    // Timestamp when sukuk was issued
        address issuer;        // Address of the issuer
        bool isActive;         // Whether the sukuk is active
        uint256 remainingUnits; // Remaining units available for purchase
    }
    
    // Investment structure
    struct Investment {
        uint256 sukukId;
        uint256 units;
        uint256 investmentAmount;
        uint256 investmentDate;
        bool hasWithdrawn;     // Whether profits have been withdrawn
    }
    
    // Profit distribution structure
    struct ProfitDistribution {
        uint256 sukukId;
        uint256 distributionDate;
        uint256 profitPerUnit;
    }
    
    // Mapping of Sukuk ID to Sukuk details
    mapping(uint256 => Sukuk) public sukuks;
    
    // Mapping of user address to their investments
    mapping(address => Investment[]) public investments;
    
    // Mapping of Sukuk ID to profit distributions
    mapping(uint256 => ProfitDistribution[]) public profitDistributions;
    
    // Counter for Sukuk IDs
    uint256 public nextSukukId = 1;
    
    // Events
    event SukukIssued(uint256 indexed sukukId, address indexed issuer, string name, uint256 totalSupply, uint256 unitPrice);
    event SukukInvested(uint256 indexed sukukId, address indexed investor, uint256 units, uint256 amount);
    event ProfitDistributed(uint256 indexed sukukId, uint256 profitPerUnit, uint256 totalProfit);
    event ProfitWithdrawn(uint256 indexed sukukId, address indexed investor, uint256 amount);
    event SukukMatured(uint256 indexed sukukId);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier sukukExists(uint256 sukukId) {
        require(sukuks[sukukId].id == sukukId, "Sukuk does not exist");
        _;
    }
    
    modifier sukukActive(uint256 sukukId) {
        require(sukuks[sukukId].isActive, "Sukuk is not active");
        _;
    }
    
    /**
     * @dev Constructor sets the owner and compliance guard
     */
    constructor(address _complianceGuard) {
        owner = msg.sender;
        complianceGuard = ComplianceGuard(_complianceGuard);
    }
    
    /**
     * @dev Update compliance guard address
     */
    function updateComplianceGuard(address _complianceGuard) external onlyOwner {
        complianceGuard = ComplianceGuard(_complianceGuard);
    }
    
    /**
     * @dev Issue a new Sukuk
     */
    function issueSukuk(
        string calldata name,
        string calldata description,
        string calldata assetType,
        uint256 totalSupply,
        uint256 unitPrice,
        uint256 profitRate,
        uint256 maturityDays
    ) external returns (uint256) {
        require(totalSupply > 0, "Total supply must be greater than 0");
        require(unitPrice > 0, "Unit price must be greater than 0");
        require(profitRate <= 2000, "Profit rate cannot exceed 20%");
        require(maturityDays > 0, "Maturity days must be greater than 0");
        
        uint256 sukukId = nextSukukId++;
        uint256 maturityDate = block.timestamp + (maturityDays * 1 days);
        
        sukuks[sukukId] = Sukuk({
            id: sukukId,
            name: name,
            description: description,
            assetType: assetType,
            totalSupply: totalSupply,
            unitPrice: unitPrice,
            profitRate: profitRate,
            maturityDate: maturityDate,
            issuedDate: block.timestamp,
            issuer: msg.sender,
            isActive: true,
            remainingUnits: totalSupply
        });
        
        emit SukukIssued(sukukId, msg.sender, name, totalSupply, unitPrice);
        return sukukId;
    }
    
    /**
     * @dev Invest in a Sukuk
     */
    function investInSukuk(uint256 sukukId, uint256 units) external payable sukukExists(sukukId) sukukActive(sukukId) {
        Sukuk storage sukuk = sukuks[sukukId];
        
        require(units > 0, "Units must be greater than 0");
        require(sukuk.remainingUnits >= units, "Not enough units available");
        require(block.timestamp < sukuk.maturityDate, "Sukuk has matured");
        
        uint256 investmentAmount = units * sukuk.unitPrice;
        require(msg.value >= investmentAmount, "Insufficient funds sent");
        
        // Update Sukuk remaining units
        sukuk.remainingUnits -= units;
        
        // Record investment
        investments[msg.sender].push(Investment({
            sukukId: sukukId,
            units: units,
            investmentAmount: investmentAmount,
            investmentDate: block.timestamp,
            hasWithdrawn: false
        }));
        
        // Transfer funds to issuer
        payable(sukuk.issuer).transfer(investmentAmount);
        
        // Refund excess payment
        if (msg.value > investmentAmount) {
            payable(msg.sender).transfer(msg.value - investmentAmount);
        }
        
        emit SukukInvested(sukukId, msg.sender, units, investmentAmount);
    }
    
    /**
     * @dev Distribute profits for a Sukuk (called by issuer)
     */
    function distributeProfit(uint256 sukukId) external payable sukukExists(sukukId) {
        Sukuk storage sukuk = sukuks[sukukId];
        require(msg.sender == sukuk.issuer, "Only issuer can distribute profits");
        
        uint256 totalUnitsIssued = sukuk.totalSupply - sukuk.remainingUnits;
        require(totalUnitsIssued > 0, "No units have been purchased");
        
        // Calculate profit per unit
        uint256 profitPerUnit = msg.value / totalUnitsIssued;
        require(profitPerUnit > 0, "Profit per unit must be greater than 0");
        
        // Record profit distribution
        profitDistributions[sukukId].push(ProfitDistribution({
            sukukId: sukukId,
            distributionDate: block.timestamp,
            profitPerUnit: profitPerUnit
        }));
        
        emit ProfitDistributed(sukukId, profitPerUnit, msg.value);
    }
    
    /**
     * @dev Withdraw profits for a specific investment
     */
    function withdrawProfit(uint256 investmentIndex) external {
        require(investmentIndex < investments[msg.sender].length, "Investment does not exist");
        
        Investment storage investment = investments[msg.sender][investmentIndex];
        require(!investment.hasWithdrawn, "Profits already withdrawn");
        
        uint256 sukukId = investment.sukukId;
        Sukuk storage sukuk = sukuks[sukukId];
        
        // Calculate total profit
        uint256 totalProfit = 0;
        for (uint256 i = 0; i < profitDistributions[sukukId].length; i++) {
            ProfitDistribution memory distribution = profitDistributions[sukukId][i];
            if (distribution.distributionDate > investment.investmentDate) {
                totalProfit += distribution.profitPerUnit * investment.units;
            }
        }
        
        require(totalProfit > 0, "No profits available to withdraw");
        
        // Mark as withdrawn
        investment.hasWithdrawn = true;
        
        // Transfer profit to investor
        payable(msg.sender).transfer(totalProfit);
        
        emit ProfitWithdrawn(sukukId, msg.sender, totalProfit);
    }
    
    /**
     * @dev Mark a Sukuk as matured (can be called by issuer or after maturity date)
     */
    function matureSukuk(uint256 sukukId) external sukukExists(sukukId) sukukActive(sukukId) {
        Sukuk storage sukuk = sukuks[sukukId];
        require(
            msg.sender == sukuk.issuer || block.timestamp >= sukuk.maturityDate,
            "Only issuer can mature before maturity date"
        );
        
        sukuk.isActive = false;
        
        emit SukukMatured(sukukId);
    }
    
    /**
     * @dev Get all Sukuks issued by an address
     */
    function getIssuedSukuks(address issuer) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count sukuks issued by this address
        for (uint256 i = 1; i < nextSukukId; i++) {
            if (sukuks[i].issuer == issuer) {
                count++;
            }
        }
        
        // Create array of IDs
        uint256[] memory issuedSukukIds = new uint256[](count);
        uint256 index = 0;
        
        // Fill array
        for (uint256 i = 1; i < nextSukukId; i++) {
            if (sukuks[i].issuer == issuer) {
                issuedSukukIds[index++] = i;
            }
        }
        
        return issuedSukukIds;
    }
    
    /**
     * @dev Get all investments for an investor
     */
    function getInvestments(address investor) external view returns (
        uint256[] memory sukukIds,
        uint256[] memory units,
        uint256[] memory amounts,
        uint256[] memory dates,
        bool[] memory withdrawn
    ) {
        Investment[] memory userInvestments = investments[investor];
        uint256 count = userInvestments.length;
        
        sukukIds = new uint256[](count);
        units = new uint256[](count);
        amounts = new uint256[](count);
        dates = new uint256[](count);
        withdrawn = new bool[](count);
        
        for (uint256 i = 0; i < count; i++) {
            Investment memory inv = userInvestments[i];
            sukukIds[i] = inv.sukukId;
            units[i] = inv.units;
            amounts[i] = inv.investmentAmount;
            dates[i] = inv.investmentDate;
            withdrawn[i] = inv.hasWithdrawn;
        }
        
        return (sukukIds, units, amounts, dates, withdrawn);
    }
    
    /**
     * @dev Get details of a specific Sukuk
     */
    function getSukukDetails(uint256 sukukId) external view sukukExists(sukukId) returns (
        string memory name,
        string memory description,
        string memory assetType,
        uint256 totalSupply,
        uint256 unitPrice,
        uint256 profitRate,
        uint256 maturityDate,
        address issuer,
        bool isActive,
        uint256 remainingUnits
    ) {
        Sukuk memory sukuk = sukuks[sukukId];
        
        return (
            sukuk.name,
            sukuk.description,
            sukuk.assetType,
            sukuk.totalSupply,
            sukuk.unitPrice,
            sukuk.profitRate,
            sukuk.maturityDate,
            sukuk.issuer,
            sukuk.isActive,
            sukuk.remainingUnits
        );
    }
}
