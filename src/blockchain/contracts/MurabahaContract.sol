// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ComplianceGuard.sol";

/**
 * @title MurabahaContract
 * @dev Implements Murabaha (cost-plus financing) in accordance with Shariah principles
 */
contract MurabahaContract {
    // Contract owner
    address public owner;
    
    // Reference to compliance guard
    ComplianceGuard public complianceGuard;
    
    // Murabaha agreement structure
    struct MurabahaAgreement {
        uint256 id;
        address buyer;
        address seller;
        string assetDescription;
        uint256 assetCost;           // Original cost of the asset
        uint256 profitMargin;        // Profit margin in basis points (100 = 1%)
        uint256 totalAmount;         // Total amount to be paid (cost + profit)
        uint256 downPayment;         // Initial payment made
        uint256 remainingAmount;     // Amount remaining to be paid
        uint256 installmentAmount;   // Amount per installment
        uint256 installmentCount;    // Total number of installments
        uint256 paidInstallments;    // Number of installments paid
        uint256 nextInstallmentDate; // Timestamp for next installment
        uint256 intervalDays;        // Days between installments
        uint256 startDate;           // Agreement start date
        bool isActive;               // Whether the agreement is active
    }
    
    // Payment structure
    struct Payment {
        uint256 agreementId;
        uint256 installmentNumber;
        uint256 amount;
        uint256 paymentDate;
    }
    
    // Mapping of agreement ID to agreement details
    mapping(uint256 => MurabahaAgreement) public agreements;
    
    // Mapping of buyer address to their agreement IDs
    mapping(address => uint256[]) public buyerAgreements;
    
    // Mapping of seller address to their agreement IDs
    mapping(address => uint256[]) public sellerAgreements;
    
    // Mapping of agreement ID to payments
    mapping(uint256 => Payment[]) public payments;
    
    // Counter for agreement IDs
    uint256 public nextAgreementId = 1;
    
    // Events
    event AgreementCreated(uint256 indexed agreementId, address indexed buyer, address indexed seller, uint256 totalAmount);
    event DownPaymentReceived(uint256 indexed agreementId, uint256 amount);
    event InstallmentPaid(uint256 indexed agreementId, uint256 installmentNumber, uint256 amount);
    event AgreementCompleted(uint256 indexed agreementId);
    event AgreementCancelled(uint256 indexed agreementId, string reason);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier agreementExists(uint256 agreementId) {
        require(agreements[agreementId].id == agreementId, "Agreement does not exist");
        _;
    }
    
    modifier onlyBuyer(uint256 agreementId) {
        require(msg.sender == agreements[agreementId].buyer, "Only buyer can call this function");
        _;
    }
    
    modifier onlySeller(uint256 agreementId) {
        require(msg.sender == agreements[agreementId].seller, "Only seller can call this function");
        _;
    }
    
    modifier agreementActive(uint256 agreementId) {
        require(agreements[agreementId].isActive, "Agreement is not active");
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
     * @dev Create a new Murabaha agreement
     */
    function createAgreement(
        address buyer,
        string calldata assetDescription,
        uint256 assetCost,
        uint256 profitMargin,
        uint256 downPaymentPercent,
        uint256 installmentCount,
        uint256 intervalDays
    ) external returns (uint256) {
        require(assetCost > 0, "Asset cost must be greater than 0");
        require(profitMargin <= 5000, "Profit margin cannot exceed 50%");
        require(downPaymentPercent <= 10000, "Down payment percentage cannot exceed 100%");
        require(installmentCount > 0, "Installment count must be greater than 0");
        require(intervalDays > 0, "Interval days must be greater than 0");
        
        // Calculate total amount
        uint256 profitAmount = (assetCost * profitMargin) / 10000;
        uint256 totalAmount = assetCost + profitAmount;
        
        // Calculate down payment
        uint256 downPayment = (totalAmount * downPaymentPercent) / 10000;
        uint256 remainingAmount = totalAmount - downPayment;
        
        // Calculate installment amount
        uint256 installmentAmount = remainingAmount / installmentCount;
        
        uint256 agreementId = nextAgreementId++;
        
        agreements[agreementId] = MurabahaAgreement({
            id: agreementId,
            buyer: buyer,
            seller: msg.sender,
            assetDescription: assetDescription,
            assetCost: assetCost,
            profitMargin: profitMargin,
            totalAmount: totalAmount,
            downPayment: downPayment,
            remainingAmount: remainingAmount,
            installmentAmount: installmentAmount,
            installmentCount: installmentCount,
            paidInstallments: 0,
            nextInstallmentDate: block.timestamp + (intervalDays * 1 days),
            intervalDays: intervalDays,
            startDate: block.timestamp,
            isActive: true
        });
        
        // Add to buyer and seller agreements
        buyerAgreements[buyer].push(agreementId);
        sellerAgreements[msg.sender].push(agreementId);
        
        emit AgreementCreated(agreementId, buyer, msg.sender, totalAmount);
        return agreementId;
    }
    
    /**
     * @dev Make down payment for an agreement
     */
    function makeDownPayment(uint256 agreementId) external payable agreementExists(agreementId) onlyBuyer(agreementId) agreementActive(agreementId) {
        MurabahaAgreement storage agreement = agreements[agreementId];
        
        require(agreement.paidInstallments == 0, "Down payment already made");
        require(msg.value >= agreement.downPayment, "Insufficient down payment amount");
        
        // Transfer down payment to seller
        payable(agreement.seller).transfer(agreement.downPayment);
        
        // Record payment
        payments[agreementId].push(Payment({
            agreementId: agreementId,
            installmentNumber: 0, // 0 indicates down payment
            amount: agreement.downPayment,
            paymentDate: block.timestamp
        }));
        
        // Refund excess payment
        if (msg.value > agreement.downPayment) {
            payable(msg.sender).transfer(msg.value - agreement.downPayment);
        }
        
        emit DownPaymentReceived(agreementId, agreement.downPayment);
    }
    
    /**
     * @dev Pay installment for an agreement
     */
    function payInstallment(uint256 agreementId) external payable agreementExists(agreementId) onlyBuyer(agreementId) agreementActive(agreementId) {
        MurabahaAgreement storage agreement = agreements[agreementId];
        
        require(agreement.paidInstallments < agreement.installmentCount, "All installments already paid");
        require(msg.value >= agreement.installmentAmount, "Insufficient installment amount");
        
        // Increment paid installments
        agreement.paidInstallments++;
        
        // Update remaining amount
        agreement.remainingAmount -= agreement.installmentAmount;
        
        // Update next installment date
        agreement.nextInstallmentDate = block.timestamp + (agreement.intervalDays * 1 days);
        
        // Record payment
        payments[agreementId].push(Payment({
            agreementId: agreementId,
            installmentNumber: agreement.paidInstallments,
            amount: agreement.installmentAmount,
            paymentDate: block.timestamp
        }));
        
        // Transfer installment to seller
        payable(agreement.seller).transfer(agreement.installmentAmount);
        
        // Refund excess payment
        if (msg.value > agreement.installmentAmount) {
            payable(msg.sender).transfer(msg.value - agreement.installmentAmount);
        }
        
        // Check if all installments are paid
        if (agreement.paidInstallments == agreement.installmentCount) {
            agreement.isActive = false;
            emit AgreementCompleted(agreementId);
        } else {
            emit InstallmentPaid(agreementId, agreement.paidInstallments, agreement.installmentAmount);
        }
    }
    
    /**
     * @dev Cancel an agreement (can only be done by seller)
     */
    function cancelAgreement(uint256 agreementId, string calldata reason) external agreementExists(agreementId) onlySeller(agreementId) agreementActive(agreementId) {
        MurabahaAgreement storage agreement = agreements[agreementId];
        agreement.isActive = false;
        
        emit AgreementCancelled(agreementId, reason);
    }
    
    /**
     * @dev Get all agreements for a buyer
     */
    function getBuyerAgreements(address buyer) external view returns (uint256[] memory) {
        return buyerAgreements[buyer];
    }
    
    /**
     * @dev Get all agreements for a seller
     */
    function getSellerAgreements(address seller) external view returns (uint256[] memory) {
        return sellerAgreements[seller];
    }
    
    /**
     * @dev Get all payments for an agreement
     */
    function getAgreementPayments(uint256 agreementId) external view agreementExists(agreementId) returns (
        uint256[] memory installmentNumbers,
        uint256[] memory amounts,
        uint256[] memory dates
    ) {
        Payment[] memory agreementPayments = payments[agreementId];
        uint256 count = agreementPayments.length;
        
        installmentNumbers = new uint256[](count);
        amounts = new uint256[](count);
        dates = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            Payment memory payment = agreementPayments[i];
            installmentNumbers[i] = payment.installmentNumber;
            amounts[i] = payment.amount;
            dates[i] = payment.paymentDate;
        }
        
        return (installmentNumbers, amounts, dates);
    }
    
    /**
     * @dev Get details of a specific agreement
     */
    function getAgreementDetails(uint256 agreementId) external view agreementExists(agreementId) returns (
        address buyer,
        address seller,
        string memory assetDescription,
        uint256 assetCost,
        uint256 profitMargin,
        uint256 totalAmount,
        uint256 downPayment,
        uint256 remainingAmount,
        uint256 installmentAmount,
        uint256 installmentCount,
        uint256 paidInstallments,
        uint256 nextInstallmentDate,
        bool isActive
    ) {
        MurabahaAgreement memory agreement = agreements[agreementId];
        
        return (
            agreement.buyer,
            agreement.seller,
            agreement.assetDescription,
            agreement.assetCost,
            agreement.profitMargin,
            agreement.totalAmount,
            agreement.downPayment,
            agreement.remainingAmount,
            agreement.installmentAmount,
            agreement.installmentCount,
            agreement.paidInstallments,
            agreement.nextInstallmentDate,
            agreement.isActive
        );
    }
}
