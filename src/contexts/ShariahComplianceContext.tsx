import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define types for Shariah compliance data
export interface ComplianceViolation {
  id: string;
  companySymbol: string;
  companyName: string;
  violationType: 'interest' | 'prohibited-business' | 'excessive-debt' | 'impermissible-income' | 'uncertainty';
  severity: 'high' | 'medium' | 'low';
  description: string;
  detectionMethod: 'financial-ratio' | 'nlp-news' | 'nlp-reports' | 'earnings-analysis';
  detectedAt: Date;
  sourceUrl?: string;
  confidence: number; // 0-1 scale
}

export interface PurificationCalculation {
  companySymbol: string;
  companyName: string;
  totalInvestmentValue: number;
  impermissibleIncomeRatio: number;
  purificationAmount: number;
  calculationMethod: 'dividend-based' | 'income-based' | 'asset-based';
  lastUpdated: Date;
  breakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface ComplianceForecast {
  companySymbol: string;
  companyName: string;
  currentComplianceScore: number; // 0-100 scale
  forecastedComplianceScore: number;
  timeframe: '3-months' | '6-months' | '1-year';
  riskFactors: {
    factor: string;
    impact: 'high' | 'medium' | 'low';
    probability: number; // 0-1 scale
  }[];
  recommendedActions: string[];
  generatedAt: Date;
}

export interface ComplianceReport {
  companySymbol: string;
  companyName: string;
  overallRating: 'compliant' | 'partially-compliant' | 'non-compliant';
  financialRatios: {
    debtToAssets: number;
    cashAndInterestBearing: number;
    accountsReceivable: number;
    nonCompliantIncome: number;
  };
  screeningMethodology: 'AAOIFI' | 'MSCI' | 'S&P' | 'FTSE' | 'custom';
  lastUpdated: Date;
  detailedAnalysis: string;
}

interface ShariahComplianceContextType {
  // Current violations
  violations: ComplianceViolation[];
  getViolationsForCompany: (symbol: string) => ComplianceViolation[];
  
  // Purification calculations
  purificationData: PurificationCalculation[];
  calculatePurification: (symbol: string, investmentValue: number) => PurificationCalculation | null;
  getPurificationForPortfolio: (holdings: any[]) => PurificationCalculation[];
  
  // Forecasting
  complianceForecasts: ComplianceForecast[];
  getForecastForCompany: (symbol: string) => ComplianceForecast | null;
  
  // Detailed reports
  complianceReports: ComplianceReport[];
  getReportForCompany: (symbol: string) => ComplianceReport | null;
  
  // Analysis functions
  analyzeNewInvestment: (symbol: string) => Promise<ComplianceReport>;
  analyzePortfolio: (holdings: any[]) => Promise<{
    overallCompliance: number;
    violationCount: number;
    purificationTotal: number;
    recommendations: string[];
  }>;
  
  // NLP analysis
  analyzeNews: (symbol: string) => Promise<ComplianceViolation[]>;
  analyzeFinancialReport: (symbol: string, reportUrl: string) => Promise<ComplianceViolation[]>;
  
  // System state
  isAnalyzing: boolean;
  lastUpdated: Date | null;
}

const ShariahComplianceContext = createContext<ShariahComplianceContextType | undefined>(undefined);

export const ShariahComplianceProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const [violations, setViolations] = useState<ComplianceViolation[]>([]);
  const [purificationData, setPurificationData] = useState<PurificationCalculation[]>([]);
  const [complianceForecasts, setComplianceForecasts] = useState<ComplianceForecast[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
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
    
    // Sample violations
    const sampleViolations: ComplianceViolation[] = [
      {
        id: 'v1',
        companySymbol: 'AAPL',
        companyName: 'Apple Inc.',
        violationType: 'interest',
        severity: 'low',
        description: 'Company has increased cash reserves generating interest income above threshold',
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
    const samplePurification: PurificationCalculation[] = [
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
    const sampleForecasts: ComplianceForecast[] = [
      {
        companySymbol: 'AAPL',
        companyName: 'Apple Inc.',
        currentComplianceScore: 87,
        forecastedComplianceScore: 82,
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
        currentComplianceScore: 78,
        forecastedComplianceScore: 75,
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
    const sampleReports: ComplianceReport[] = [
      {
        companySymbol: 'AAPL',
        companyName: 'Apple Inc.',
        overallRating: 'partially-compliant',
        financialRatios: {
          debtToAssets: 0.29,
          cashAndInterestBearing: 0.18,
          accountsReceivable: 0.11,
          nonCompliantIncome: 0.0127
        },
        screeningMethodology: 'AAOIFI',
        lastUpdated: currentDate,
        detailedAnalysis: 'Apple Inc. is largely compliant with Shariah principles, with debt levels below the 33% threshold. However, the company maintains significant cash reserves that generate interest income, requiring purification. The company does not engage in prohibited business activities as its primary business.'
      },
      {
        companySymbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        overallRating: 'partially-compliant',
        financialRatios: {
          debtToAssets: 0.31,
          cashAndInterestBearing: 0.15,
          accountsReceivable: 0.09,
          nonCompliantIncome: 0.0095
        },
        screeningMethodology: 'AAOIFI',
        lastUpdated: currentDate,
        detailedAnalysis: 'Microsoft Corporation is approaching the debt threshold with a debt-to-assets ratio of 31%. The company has significant cash reserves generating interest income. Primary business activities are permissible, but interest income requires purification.'
      },
      {
        companySymbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        overallRating: 'partially-compliant',
        financialRatios: {
          debtToAssets: 0.22,
          cashAndInterestBearing: 0.21,
          accountsReceivable: 0.08,
          nonCompliantIncome: 0.0115
        },
        screeningMethodology: 'AAOIFI',
        lastUpdated: currentDate,
        detailedAnalysis: 'Alphabet Inc. has a relatively low debt-to-assets ratio but significant cash reserves generating interest income. NLP analysis of recent news indicates potential expansion into advertising categories that may include gambling-related content, which requires monitoring.'
      }
    ];
    
    setViolations(sampleViolations);
    setPurificationData(samplePurification);
    setComplianceForecasts(sampleForecasts);
    setComplianceReports(sampleReports);
    setLastUpdated(currentDate);
  };
  
  const getViolationsForCompany = (symbol: string): ComplianceViolation[] => {
    return violations.filter(v => v.companySymbol === symbol);
  };
  
  const calculatePurification = (symbol: string, investmentValue: number): PurificationCalculation | null => {
    const existingCalc = purificationData.find(p => p.companySymbol === symbol);
    
    if (!existingCalc) return null;
    
    // Recalculate based on current investment value
    return {
      ...existingCalc,
      totalInvestmentValue: investmentValue,
      purificationAmount: investmentValue * existingCalc.impermissibleIncomeRatio,
      breakdown: existingCalc.breakdown.map(b => ({
        ...b,
        amount: investmentValue * b.percentage
      }))
    };
  };
  
  const getPurificationForPortfolio = (holdings: any[]): PurificationCalculation[] => {
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
        calculationMethod: 'income-based' as 'income-based',
        lastUpdated: new Date(),
        breakdown: []
      };
    }).filter(calc => calc.purificationAmount > 0);
  };
  
  const getForecastForCompany = (symbol: string): ComplianceForecast | null => {
    return complianceForecasts.find(f => f.companySymbol === symbol) || null;
  };
  
  const getReportForCompany = (symbol: string): ComplianceReport | null => {
    return complianceReports.find(r => r.companySymbol === symbol) || null;
  };
  
  const analyzeNewInvestment = async (symbol: string): Promise<ComplianceReport> => {
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
          const newReport: ComplianceReport = {
            companySymbol: symbol,
            companyName: symbol + ' Inc.',
            overallRating: 'partially-compliant',
            financialRatios: {
              debtToAssets: 0.25,
              cashAndInterestBearing: 0.15,
              accountsReceivable: 0.10,
              nonCompliantIncome: 0.01
            },
            screeningMethodology: 'AAOIFI',
            lastUpdated: new Date(),
            detailedAnalysis: `${symbol} Inc. has been analyzed using our multi-modal AI system. The company has a debt-to-assets ratio of 25%, which is below the 33% threshold. Some interest income requires purification. Primary business activities appear to be permissible based on initial analysis.`
          };
          
          setComplianceReports(prev => [...prev, newReport]);
          setIsAnalyzing(false);
          resolve(newReport);
        }
      }, 2000);
    });
  };
  
  const analyzePortfolio = async (holdings: any[]): Promise<{
    overallCompliance: number;
    violationCount: number;
    purificationTotal: number;
    recommendations: string[];
  }> => {
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
        const recommendations: string[] = [];
        
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
  
  const analyzeNews = async (symbol: string): Promise<ComplianceViolation[]> => {
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
  
  const analyzeFinancialReport = async (symbol: string, reportUrl: string): Promise<ComplianceViolation[]> => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would use NLP to analyze the financial report
    // For demonstration, we'll return sample violations after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a sample violation for demonstration
        const newViolation: ComplianceViolation = {
          id: `v-${Date.now()}`,
          companySymbol: symbol,
          companyName: symbol + ' Inc.',
          violationType: 'excessive-debt',
          severity: 'medium',
          description: `NLP analysis of financial report at ${reportUrl} detected potential increase in debt financing above Shariah-compliant thresholds.`,
          detectionMethod: 'nlp-reports',
          detectedAt: new Date(),
          sourceUrl: reportUrl,
          confidence: 0.82
        };
        
        setViolations(prev => [...prev, newViolation]);
        setIsAnalyzing(false);
        resolve([newViolation]);
      }, 2500);
    });
  };
  
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
