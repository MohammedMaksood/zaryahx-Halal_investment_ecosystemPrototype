import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * @typedef {Object} ComplianceViolation
 * @property {string} id - Violation ID
 * @property {string} companySymbol - Company stock symbol
 * @property {string} companyName - Company name
 * @property {'interest'|'excessive-debt'|'impermissible-income'|'impermissible-business'} violationType - Type of violation
 * @property {'low'|'medium'|'high'|'critical'} severity - Severity level
 * @property {string} description - Description of the violation
 * @property {'financial-ratio'|'business-activity'|'nlp-news'|'manual-review'} detectionMethod - How the violation was detected
 * @property {Date} detectedAt - When the violation was detected
 * @property {string} [sourceUrl] - Optional source URL for the violation
 * @property {number} confidence - Confidence score (0-1)
 */

/**
 * @typedef {Object} PurificationCalculation
 * @property {string} companySymbol - Company stock symbol
 * @property {string} companyName - Company name
 * @property {number} totalInvestmentValue - Total investment value
 * @property {number} impermissibleIncomeRatio - Ratio of impermissible income
 * @property {number} purificationAmount - Amount to purify
 * @property {'income-based'|'asset-based'} calculationMethod - Method used for calculation
 * @property {Date} lastUpdated - When the calculation was last updated
 * @property {Array<{category: string, amount: number, percentage: number}>} breakdown - Breakdown of purification
 */

/**
 * @typedef {Object} ComplianceForecast
 * @property {string} companySymbol - Company stock symbol
 * @property {string} companyName - Company name
 * @property {number} currentComplianceScore - Current compliance score
 * @property {number} forecastedComplianceScore - Forecasted compliance score
 * @property {'3-months'|'6-months'|'1-year'} timeframe - Forecast timeframe
 * @property {Array<{factor: string, impact: string, probability: number}>} riskFactors - Risk factors
 * @property {string[]} recommendedActions - Recommended actions
 * @property {Date} generatedAt - When the forecast was generated
 */

/**
 * @typedef {Object} ComplianceReport
 * @property {string} companySymbol - Company stock symbol
 * @property {string} companyName - Company name
 * @property {'compliant'|'partially-compliant'|'non-compliant'} overallRating - Overall compliance rating
 * @property {Object} financialRatios - Financial ratios
 * @property {'AAOIFI'|'MSCI'|'S&P'|'FTSE'|'custom'} screeningMethodology - Screening methodology
 * @property {Date} lastUpdated - When the report was last updated
 * @property {string} detailedAnalysis - Detailed analysis
 */

/**
 * @typedef {Object} ShariahComplianceContextType
 * @property {ComplianceViolation[]} violations - List of compliance violations
 * @property {function(string): ComplianceViolation[]} getViolationsForCompany - Get violations for a company
 * @property {PurificationCalculation[]} purificationData - Purification data
 * @property {function(string, number): PurificationCalculation|null} calculatePurification - Calculate purification
 * @property {function(Array): PurificationCalculation[]} getPurificationForPortfolio - Get purification for portfolio
 * @property {ComplianceForecast[]} complianceForecasts - Compliance forecasts
 * @property {function(string): ComplianceForecast|null} getForecastForCompany - Get forecast for company
 * @property {ComplianceReport[]} complianceReports - Compliance reports
 * @property {function(string): ComplianceReport|null} getReportForCompany - Get report for company
 * @property {function(string): Promise<ComplianceReport>} analyzeNewInvestment - Analyze new investment
 * @property {function(string): Promise<ComplianceViolation[]>} analyzeNews - Analyze news
 * @property {function(string, string): Promise<ComplianceViolation[]>} analyzeFinancialReport - Analyze financial report
 * @property {boolean} isAnalyzing - Whether analysis is in progress
 * @property {Date|null} lastUpdated - When the data was last updated
 */

const ShariahComplianceContext = createContext(undefined);

export const ShariahComplianceProvider = ({ children }) => {
  const { user } = useAuth();
  /** @type {[ComplianceViolation[], function(ComplianceViolation[]): void]} */
  const [violations, setViolations] = useState([]);
  /** @type {[PurificationCalculation[], function(PurificationCalculation[]): void]} */
  const [purificationData, setPurificationData] = useState([]);
  /** @type {[ComplianceForecast[], function(ComplianceForecast[]): void]} */
  const [complianceForecasts, setComplianceForecasts] = useState([]);
  /** @type {[ComplianceReport[], function(ComplianceReport[]): void]} */
  const [complianceReports, setComplianceReports] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  /** @type {[Date|null, function(Date|null): void]} */
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Load initial data
  useEffect(() => {
    if (user) {
      // In a real implementation, this would fetch data from an API
      loadSampleData();
    }
  }, [user]);
  
  const loadSampleData = () => {
    // Sample data for demonstration purposes
    // In a real implementation, this would be fetched from an API
    const currentDate = new Date();
    
    // Sample financial ratios for demonstration
    const financialRatios = {
      debtToAssets: 0.28,
      cashAndInterestBearing: 0.15,
      accountsReceivable: 0.12,
      nonCompliantIncome: 0.04
    };
    
    // Sample violations
    const sampleViolations= [
      {
        id: 'v1',
        companySymbol: 'AAPL',
        companyName: 'Apple Inc.',
        violationType: 'interest',
        severity: 'low',
        description: 'Company h cash reserves generating interest income above threshold',
        detectionMethod: 'financial-ratio',
        detectedAt: currentDate,
        confidence: 0.92
      },
      {
        id: 'v2',
        companySymbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        violationType: 'excessive-debt',
        severity: 'medium',
        description: 'Debt to asset ratio exceeded 33% in recent quarter',
        detectionMethod: 'financial-ratio',
        detectedAt: currentDate,
        confidence: 0.95
      },
      {
        id: 'v3',
        companySymbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        violationType: 'impermissible-income',
        severity: 'low',
        description: 'NLP analysis detected potential new revenue stream from gambling-related advertising',
        detectionMethod: 'nlp-news',
        detectedAt: currentDate,
        sourceUrl: 'https://example.com/news/tech-advertising',
        confidence: 0.78
      }
    ];
    
    // Sample purification calculations
    const samplePurification= [
      {
        companySymbol: 'AAPL',
        companyName: 'Apple Inc.',
        totalInvestmentValue: 1826.30,
        impermissibleIncomeRatio: 0.0127,
        purificationAmount: 23.19,
        calculationMethod: 'income-based',
        lastUpdated: currentDate,
        breakdown: [
          {
            category: 'Interest Income',
            amount: 19.45,
            percentage: 0.0106
          },
          {
            category: 'Other Non-Compliant',
            amount: 3.74,
            percentage: 0.0021
          }
        ]
      },
      {
        companySymbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        totalInvestmentValue: 1686.10,
        impermissibleIncomeRatio: 0.0095,
        purificationAmount: 16.02,
        calculationMethod: 'income-based',
        lastUpdated: currentDate,
        breakdown: [
          {
            category: 'Interest Income',
            amount: 12.65,
            percentage: 0.0075
          },
          {
            category: 'Other Non-Compliant',
            amount: 3.37,
            percentage: 0.0020
          }
        ]
      }
    ];
    
    // Sample forecasts
    const sampleForecasts= [
      {
        companySymbol: 'AAPL',
        companyName: 'Apple Inc.',
        currentComplianceScore: 0.85,
        forecastedComplianceScore: 0.75,
        timeframe: '6-months',
        riskFactors: [
          {
            factor: 'Increasing cash reserves',
            impact: 'medium',
            probability: 0.85
          },
          {
            factor: 'New financial services expansion',
            impact: 'high',
            probability: 0.65
          }
        ],
        recommendedActions: [
          'Monitor quarterly reports for changes in interest income',
          'Review new Apple Pay and financial services for Shariah compliance'
        ],
        generatedAt: currentDate
      },
      {
        companySymbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        currentComplianceScore: 0.80,
        forecastedComplianceScore: 0.70,
        timeframe: '6-months',
        riskFactors: [
          {
            factor: 'Increasing debt financing',
            impact: 'high',
            probability: 0.72
          }
        ],
        recommendedActions: [
          'Monitor debt to asset ratio in upcoming quarterly reports',
          'Consider reducing position if ratio exceeds 33% for two consecutive quarters'
        ],
        generatedAt: currentDate
      }
    ];
    
    // Sample reports
    const sampleReports= [
      {
        companySymbol: 'AAPL',
        companyName: 'Apple Inc.',
        overallRating: 'partially-compliant',
        financialRatios,
        screeningMethodology: 'AAOIFI',
        lastUpdated,
        detailedAnalysis: 'Apple Inc. is largely compliant with Shariah principles, with debt levels below the 33% threshold. However, the company maintains significant cash reserves that generate interest income, requiring purification. The company does not engage in prohibited business activities  primary business.'
      },
      {
        companySymbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        overallRating: 'partially-compliant',
        financialRatios,
        screeningMethodology: 'AAOIFI',
        lastUpdated,
        detailedAnalysis: 'Microsoft Corporation is approaching the debt threshold with a debt-to-assets ratio of 31%. The company h cash reserves generating interest income. Primary business activities are permissible, but interest income requires purification.'
      },
      {
        companySymbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        overallRating: 'partially-compliant',
        financialRatios,
        screeningMethodology: 'AAOIFI',
        lastUpdated,
        detailedAnalysis: 'Alphabet Inc. h relatively low debt-to-assets ratio but significant cash reserves generating interest income. NLP analysis of recent news indicates potential expansion into advertising categories that may include gambling-related content, which requires monitoring.'
      }
    ];
    
    setViolations(sampleViolations);
    setPurificationData(samplePurification);
    setComplianceForecasts(sampleForecasts);
    setComplianceReports(sampleReports);
    setLastUpdated(currentDate);
  };
  
  /**
   * Get violations for a company
   * @param {string} symbol - Company symbol
   * @returns {ComplianceViolation[]} - List of violations
   */
  const getViolationsForCompany = (symbol) => {
    return violations.filter(v => v.companySymbol === symbol);
  };
  
  /**
   * Calculate purification for a company
   * @param {string} symbol - Company symbol
   * @param {number} investmentValue - Investment value
   * @returns {PurificationCalculation|null} - Purification calculation
   */
  const calculatePurification = (symbol, investmentValue) => {
    const existingCalc = purificationData.find(p => p.companySymbol === symbol);
    
    if (!existingCalc) return null;
    
    // Recalculate based on current investment value
    return {
      ...existingCalc,
      totalInvestmentValue,
      purificationAmount: investmentValue * existingCalc.impermissibleIncomeRatio,
      breakdown: existingCalc.breakdown.map(b => ({
        ...b,
        amount: investmentValue * b.percentage
      }))
    };
  };
  
  /**
   * Get purification for a portfolio
   * @param {Array<{symbol: string, value: number, name: string}>} holdings - Portfolio holdings
   * @returns {PurificationCalculation[]} - List of purification calculations
   */
  const getPurificationForPortfolio = (holdings) => {
    return holdings.map(holding => {
      const symbol = holding.symbol;
      const value = holding.value;
      const calculation = calculatePurification(symbol, value);
      return calculation || {
        companySymbol: symbol,
        companyName: holding.name,
        totalInvestmentValue: value,
        impermissibleIncomeRatio: 0,
        purificationAmount: 0,
        calculationMethod: 'income-based',
        lastUpdated: new Date(),
        breakdown: []
      };
    }).filter(calc => calc.purificationAmount > 0);
  };
  
  /**
   * Get forecast for a company
   * @param {string} symbol - Company symbol
   * @returns {ComplianceForecast|null} - Compliance forecast
   */
  const getForecastForCompany = (symbol) => {
    return complianceForecasts.find(f => f.companySymbol === symbol) || null;
  };
  
  /**
   * Get report for a company
   * @param {string} symbol - Company symbol
   * @returns {ComplianceReport|null} - Compliance report
   */
  const getReportForCompany = (symbol) => {
    return complianceReports.find(r => r.companySymbol === symbol) || null;
  };
  
  /**
   * Analyze a new investment
   * @param {string} symbol - Company symbol
   * @returns {Promise<ComplianceReport>} - Compliance report
   */
  const analyzeNewInvestment = async (symbol) => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would call an API to perform the analysis
    // For demonstration, we'll return a sample report after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingReport = complianceReports.find(r => r.companySymbol === symbol);
        
        if (existingReport) {
          setIsAnalyzing(false);
          resolve(existingReport);
        } else {
          // Generate a sample report for demonstration
          const newReport= {
            companySymbol,
            companyName: symbol + ' Inc.',
            overallRating: 'partially-compliant',
            financialRatios: {
              debtToAssets: 0.25,
              cashToAssets: 0.15,
              interestIncome: 0.03
            },
            screeningMethodology: 'AAOIFI',
            lastUpdated: new Date(),
            detailedAnalysis: `${symbol} Inc. h analyzed using our multi-modal AI system. The company h debt-to-assets ratio of 25%, which is below the 33% threshold. Some interest income requires purification. Primary business activities appear to be permissible based on initial analysis.`
          };
          
          setComplianceReports(prev => [...prev, newReport]);
          setIsAnalyzing(false);
          resolve(newReport);
        }
      }, 2000);
    });
  };
  
  /**
   * Analyze portfolio for Shariah compliance
   * @param {StockHolding[]} holdings - Portfolio holdings
   * @returns {Promise<{overallCompliance: number, violationCount: number, purificationTotal: number, recommendations: string[]}>} - Analysis results
   */
  const analyzePortfolio = async (holdings) => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would analyze the entire portfolio
    // For demonstration, we'll calculate based on existing data
    return new Promise((resolve) => {
      setTimeout(() => {
        const portfolioPurification = getPurificationForPortfolio(holdings);
        const purificationTotal = portfolioPurification.reduce((total, calc) => total + calc.purificationAmount, 0);
        
        const holdingSymbols = holdings.map(h => h.symbol);
        const relevantViolations = violations.filter(v => holdingSymbols.includes(v.companySymbol));
        
        // Calculate weighted compliance score
        const totalValue = holdings.reduce((total, h) => total + h.value, 0);
        let weightedComplianceScore = 0;
        
        holdings.forEach(holding => {
          const report = complianceReports.find(r => r.companySymbol === holding.symbol);
          if (report) {
            const weight = holding.value / totalValue;
            let score = 0;
            
            switch(report.overallRating) {
              case 'compliant':
                score = 100;
                break;
              case 'partially-compliant':
                score = 70;
                break;
              case 'non-compliant':
                score = 0;
                break;
            }
            
            weightedComplianceScore += score * weight;
          }
        });
        
        // Generate recommendations
        const recommendations = [];
        
        if (purificationTotal > 0) {
          recommendations.push(`Purify $${purificationTotal.toFixed(2)} from your portfolio to maintain Shariah compliance.`);
        }
        
        if (relevantViolations.length > 0) {
          const highSeverityCount = relevantViolations.filter(v => v.severity === 'high').length;
          if (highSeverityCount > 0) {
            recommendations.push(`Address ${highSeverityCount} high-severity compliance violations in your portfolio.`);
          }
        }
        
        // Add a recommendation about portfolio diversification if needed
        if (holdings.length < 3) {
          recommendations.push('Consider diversifying your portfolio with more Shariah-compliant securities.');
        }
        
        setIsAnalyzing(false);
        resolve({
          overallCompliance: Math.round(weightedComplianceScore),
          violationCount: relevantViolations.length,
          purificationTotal,
          recommendations
        });
      }, 2000);
    });
  };
  
  /**
   * Analyze news for a company
   * @param {string} symbol - Company symbol
   * @returns {Promise<ComplianceViolation[]>} - List of violations
   */
  const analyzeNews = async (symbol) => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would use NLP to analyze recent news
    // For demonstration, we'll return sample violations after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingViolations = violations.filter(
          v => v.companySymbol === symbol && v.detectionMethod === 'nlp-news'
        );
        
        if (existingViolations.length > 0) {
          setIsAnalyzing(false);
          resolve(existingViolations);
        } else {
          // No existing violations found, return empty array
          setIsAnalyzing(false);
          resolve([]);
        }
      }, 1500);
    });
  };
  
  /**
   * Analyze financial report for a company
   * @param {string} symbol - Company symbol
   * @param {string} reportUrl - URL to financial report
   * @returns {Promise<ComplianceViolation[]>} - List of violations
   */
  const analyzeFinancialReport = async (symbol, reportUrl) => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would use NLP to analyze the financial report
    // For demonstration, we'll return sample violations after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a sample violation for demonstration
        const newViolation= {
          id: `v-${Date.now()}`,
          companySymbol,
          companyName: symbol + ' Inc.',
          violationType: 'excessive-debt',
          severity: 'medium',
          description: `NLP analysis of financial report at ${reportUrl} detected potential increase in debt financing above Shariah-compliant thresholds.`,
          detectionMethod: 'nlp-reports',
          detectedAt: new Date(),
          sourceUrl,
          confidence: 0.82
        };
        
        setViolations(prev => [...prev, newViolation]);
        setIsAnalyzing(false);
        resolve([newViolation]);
      }, 2500);
    });
  };
  
  // analyzeFinancialReport function is already defined above
  
  const value = {
    violations,
    getViolationsForCompany,
    purificationData,
    calculatePurification,
    getPurificationForPortfolio,
    complianceForecasts,
    getForecastForCompany,
    complianceReports,
    getReportForCompany,
    analyzeNewInvestment,
    analyzePortfolio,
    analyzeNews,
    analyzeFinancialReport,
    isAnalyzing,
    lastUpdated
  };
  
  return (
    <ShariahComplianceContext.Provider value={value}>
      {children}
    </ShariahComplianceContext.Provider>
  );
};

export const useShariahCompliance = () => {
  const context = useContext(ShariahComplianceContext);
  
  if (context === undefined) {
    throw new Error('useShariahCompliance must be used within a ShariahComplianceProvider');
  }
  
  return context;
};
