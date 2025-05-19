import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, RefreshCw, FileText, TrendingUp, AlertTriangle, ExternalLink, Filter, DollarSign } from "lucide-react";
import { useShariahCompliance } from "@/contexts/ShariahComplianceContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ShariahComplianceVerificationProps {
  holdings: any[];
  onPurificationCalculated?: (amount: number) => void;
}

const ShariahComplianceVerification: React.FC<ShariahComplianceVerificationProps> = ({ 
  holdings,
  onPurificationCalculated
}) => {
  const { 
    violations, 
    complianceReports, 
    complianceForecasts,
    analyzePortfolio,
    isAnalyzing,
    lastUpdated,
    getPurificationForPortfolio
  } = useShariahCompliance();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'violations' | 'purification' | 'forecast'>('overview');
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<{
    overallCompliance: number;
    violationCount: number;
    purificationTotal: number;
    recommendations: string[];
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Calculate purification amounts for the portfolio
  const purificationData = getPurificationForPortfolio(holdings);
  const totalPurificationAmount = purificationData.reduce((total, calc) => total + calc.purificationAmount, 0);
  
  // Notify parent component of purification amount if callback provided
  useEffect(() => {
    if (onPurificationCalculated && totalPurificationAmount > 0) {
      onPurificationCalculated(totalPurificationAmount);
    }
  }, [totalPurificationAmount, onPurificationCalculated]);
  
  // Get relevant violations for current holdings
  const holdingSymbols = holdings.map(h => h.symbol);
  const relevantViolations = violations.filter(v => holdingSymbols.includes(v.companySymbol));
  
  // Get compliance reports for current holdings
  const holdingReports = holdings.map(holding => {
    const report = complianceReports.find(r => r.companySymbol === holding.symbol);
    return {
      ...holding,
      report
    };
  });
  
  // Get forecasts for current holdings
  const holdingForecasts = holdings.map(holding => {
    const forecast = complianceForecasts.find(f => f.companySymbol === holding.symbol);
    return {
      ...holding,
      forecast
    };
  }).filter(h => h.forecast); // Only include holdings with forecasts
  
  // Function to refresh analysis
  const refreshAnalysis = async () => {
    setIsRefreshing(true);
    try {
      const analysis = await analyzePortfolio(holdings);
      setPortfolioAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Initial analysis
  useEffect(() => {
    if (holdings.length > 0 && !portfolioAnalysis && !isAnalyzing) {
      refreshAnalysis();
    }
  }, [holdings, portfolioAnalysis, isAnalyzing]);
  
  // Helper function to get compliance color
  const getComplianceColor = (rating: string | number): string => {
    if (typeof rating === 'string') {
      switch(rating) {
        case 'compliant': return 'text-green-400';
        case 'partially-compliant': return 'text-yellow-400';
        case 'non-compliant': return 'text-red-400';
        default: return 'text-white';
      }
    } else {
      // Numeric score
      if (rating >= 80) return 'text-green-400';
      if (rating >= 60) return 'text-yellow-400';
      return 'text-red-400';
    }
  };
  
  // Helper function to get violation severity color
  const getSeverityColor = (severity: string): string => {
    switch(severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-white/20 text-white';
    }
  };
  
  // Helper function to get violation type display text
  const getViolationTypeDisplay = (type: string): string => {
    switch(type) {
      case 'interest': return 'Interest (Riba)';
      case 'prohibited-business': return 'Prohibited Business';
      case 'excessive-debt': return 'Excessive Debt';
      case 'impermissible-income': return 'Impermissible Income';
      case 'uncertainty': return 'Excessive Uncertainty (Gharar)';
      default: return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };
  
  return (
    <Card className="bg-secondary/30 border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Shariah Compliance Verification</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshAnalysis} 
            disabled={isRefreshing || isAnalyzing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing || isAnalyzing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          AI-powered multi-modal analysis of your portfolio's Shariah compliance
          {lastUpdated && (
            <span className="block text-xs mt-1 text-white/60">
              Last updated: {lastUpdated.toLocaleString()}
            </span>
          )}
        </CardDescription>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <CheckCircle className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="violations">
              <AlertCircle className="h-4 w-4 mr-2" />
              Violations
            </TabsTrigger>
            <TabsTrigger value="purification">
              <DollarSign className="h-4 w-4 mr-2" />
              Purification
            </TabsTrigger>
            <TabsTrigger value="forecast">
              <TrendingUp className="h-4 w-4 mr-2" />
              Forecast
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsContent value="overview" className="mt-0">
            {isAnalyzing || isRefreshing ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-36 w-full" />
              </div>
            ) : portfolioAnalysis ? (
              <div className="space-y-6">
                {/* Overall Compliance Score */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Overall Compliance Score</h3>
                    <span className={`text-lg font-semibold ${getComplianceColor(portfolioAnalysis.overallCompliance)}`}>
                      {portfolioAnalysis.overallCompliance}/100
                    </span>
                  </div>
                  <Progress 
                    value={portfolioAnalysis.overallCompliance} 
                    className={`h-2 ${portfolioAnalysis.overallCompliance >= 80 ? '[&>div]:bg-green-500' : portfolioAnalysis.overallCompliance >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`}
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>Non-Compliant</span>
                    <span>Partially Compliant</span>
                    <span>Fully Compliant</span>
                  </div>
                </div>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <div className="text-2xl font-semibold mb-1">{relevantViolations.length}</div>
                    <div className="text-sm text-white/70">Compliance Violations</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <div className="text-2xl font-semibold mb-1">
                      ${totalPurificationAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-white/70">Purification Required</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                    <div className="text-2xl font-semibold mb-1">
                      {holdingReports.filter(h => h.report?.overallRating === 'compliant').length}/{holdings.length}
                    </div>
                    <div className="text-sm text-white/70">Fully Compliant Holdings</div>
                  </div>
                </div>
                
                {/* Recommendations */}
                {portfolioAnalysis.recommendations.length > 0 && (
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="font-medium mb-2">AI Recommendations</h3>
                    <ul className="space-y-2">
                      {portfolioAnalysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-400" />
                          <span className="text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Holdings Compliance Overview */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="font-medium mb-3">Holdings Compliance</h3>
                  <div className="space-y-3">
                    {holdingReports.map((holding) => (
                      <div key={holding.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium">{holding.symbol.substring(0, 4)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{holding.name}</div>
                            <div className="text-xs text-white/60">{holding.symbol}</div>
                          </div>
                        </div>
                        {holding.report ? (
                          <Badge className={`${getComplianceColor(holding.report.overallRating)} bg-white/10`}>
                            {holding.report.overallRating.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Analyzed</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-white/60">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No compliance data available. Click Refresh to analyze your portfolio.</p>
                <Button onClick={refreshAnalysis} className="mt-4">
                  Analyze Portfolio
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="violations" className="mt-0">
            <div className="space-y-6">
              {relevantViolations.length > 0 ? (
                <div className="space-y-4">
                  {relevantViolations.map((violation) => (
                    <div key={violation.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium">{violation.companySymbol.substring(0, 4)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{violation.companyName}</div>
                            <div className="text-xs text-white/60">{violation.companySymbol}</div>
                          </div>
                        </div>
                        <Badge className={getSeverityColor(violation.severity)}>
                          {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)} Severity
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <Badge variant="outline" className="mb-2">
                          {getViolationTypeDisplay(violation.violationType)}
                        </Badge>
                        <p className="text-sm mt-2">{violation.description}</p>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-white/60">
                        <div>
                          Detection method: {violation.detectionMethod.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                        <div>
                          Confidence: {Math.round(violation.confidence * 100)}%
                        </div>
                      </div>
                      
                      {violation.sourceUrl && (
                        <Button variant="link" size="sm" className="p-0 h-auto mt-2" asChild>
                          <a href={violation.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Source
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-white/60">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-400" />
                  <p>No compliance violations detected in your current holdings.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="purification" className="mt-0">
            <div className="space-y-6">
              {/* Purification Summary */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-medium mb-2">Purification Summary</h3>
                <p className="text-sm text-white/70 mb-3">
                  Islamic investors must purify their portfolios by donating the portion of returns derived from non-compliant sources. Our AI system automatically calculates these amounts based on detailed financial analysis.
                </p>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-md mb-3">
                  <span className="font-medium">Total Purification Required:</span>
                  <span className="text-lg font-semibold text-lavender">${totalPurificationAmount.toFixed(2)}</span>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Donate Purification Amount
                </Button>
              </div>
              
              {/* Purification Breakdown */}
              {purificationData.length > 0 ? (
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="font-medium mb-3">Purification Breakdown by Holding</h3>
                  <div className="space-y-4">
                    {purificationData.map((calculation) => (
                      <div key={calculation.companySymbol} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center mr-3">
                              <span className="text-xs font-medium">{calculation.companySymbol.substring(0, 4)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{calculation.companyName}</div>
                              <div className="text-xs text-white/60">{calculation.companySymbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">${calculation.purificationAmount.toFixed(2)}</div>
                            <div className="text-xs text-white/60">{(calculation.impermissibleIncomeRatio * 100).toFixed(2)}% of value</div>
                          </div>
                        </div>
                        
                        {calculation.breakdown.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs font-medium mb-1">Breakdown by Source:</div>
                            <div className="space-y-1">
                              {calculation.breakdown.map((item, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                  <span className="text-white/70">{item.category}:</span>
                                  <span>${item.amount.toFixed(2)} ({(item.percentage * 100).toFixed(2)}%)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-white/60">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-400" />
                  <p>No purification is required for your current holdings.</p>
                </div>
              )}
              
              {/* Purification Methodology */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-medium mb-2">Purification Methodology</h3>
                <p className="text-sm text-white/70 mb-3">
                  Our AI system uses a multi-modal approach to calculate purification amounts:
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <Filter className="h-4 w-4 mr-2 mt-0.5" />
                    <span>Analysis of financial statements to identify interest income and other non-compliant revenue sources</span>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 mt-0.5" />
                    <span>NLP processing of annual reports and earnings calls to detect undisclosed non-compliant activities</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                    <span>Calculation based on the proportion of non-compliant income to total income</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forecast" className="mt-0">
            <div className="space-y-6">
              {holdingForecasts.length > 0 ? (
                <div className="space-y-4">
                  {holdingForecasts.map((holding) => (
                    <div key={holding.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium">{holding.symbol.substring(0, 4)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{holding.name}</div>
                            <div className="text-xs text-white/60">{holding.symbol}</div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {holding.forecast.timeframe} Forecast
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Compliance Score Forecast</span>
                          <div className="flex items-center space-x-2">
                            <span className={getComplianceColor(holding.forecast.currentComplianceScore)}>
                              {holding.forecast.currentComplianceScore}
                            </span>
                            <span className="text-white/60">→</span>
                            <span className={getComplianceColor(holding.forecast.forecastedComplianceScore)}>
                              {holding.forecast.forecastedComplianceScore}
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={holding.forecast.forecastedComplianceScore} 
                          className={`h-2 ${holding.forecast.forecastedComplianceScore >= 80 ? '[&>div]:bg-green-500' : holding.forecast.forecastedComplianceScore >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2">Risk Factors:</h4>
                        <div className="space-y-2">
                          {holding.forecast.riskFactors.map((factor, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <div className="flex items-center">
                                <AlertTriangle className={`h-3 w-3 mr-2 ${factor.impact === 'high' ? 'text-red-400' : factor.impact === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`} />
                                <span>{factor.factor}</span>
                              </div>
                              <Badge className={`${factor.impact === 'high' ? 'bg-red-500/20 text-red-400' : factor.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {Math.round(factor.probability * 100)}% Probability
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {holding.forecast.recommendedActions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                          <ul className="text-sm space-y-1">
                            {holding.forecast.recommendedActions.map((action, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-lavender" />
                                <span className="text-white/80">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="text-xs text-white/60 mt-3">
                        Forecast generated: {holding.forecast.generatedAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-white/60">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No compliance forecasts available for your current holdings.</p>
                  <Button onClick={refreshAnalysis} className="mt-4">
                    Generate Forecasts
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-white/10 pt-4">
        <div className="w-full text-center text-sm text-white/60">
          Powered by advanced NLP and financial analysis to ensure your investments remain Shariah-compliant
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShariahComplianceVerification;
