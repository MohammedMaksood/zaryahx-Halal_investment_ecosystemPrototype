import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, RefreshCw, FileText, TrendingUp, AlertTriangle, ExternalLink, Filter, DollarSign, Search, FileSearch, Database, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MultiModalComplianceAnalysisProps {
  holdings: any[];
  onPurificationCalculated?: (amount: number) => void;
}

interface ComplianceViolation {
  id: string;
  companySymbol: string;
  companyName: string;
  violationType: 'interest' | 'prohibited-business' | 'excessive-debt' | 'liquidity-ratio' | 'mixed-income' | 'governance';
  severity: 'high' | 'medium' | 'low';
  description: string;
  source: 'financial-statement' | 'news' | 'earnings-call' | 'social-media' | 'regulatory-filing';
  detectedAt: Date;
  confidence: number; // 0-100
  potentialImpact: string;
  recommendedAction?: string;
}

interface PurificationCalculation {
  companySymbol: string;
  companyName: string;
  purificationAmount: number;
  purificationReason: string;
  calculationMethod: string;
  lastUpdated: Date;
}

interface ComplianceForecast {
  companySymbol: string;
  companyName: string;
  currentComplianceScore: number; // 0-100
  forecastedComplianceScore: number; // 0-100
  forecastPeriod: '3-month' | '6-month' | '1-year';
  riskFactors: {
    factor: string;
    probability: number; // 0-1
    impact: 'high' | 'medium' | 'low';
  }[];
  recommendedActions: string[];
  generatedAt: Date;
}

const MultiModalComplianceAnalysis: React.FC<MultiModalComplianceAnalysisProps> = ({ 
  holdings,
  onPurificationCalculated
}) => {
  const [activeTab, setActiveTab] = useState<'multi-modal' | 'purification' | 'forecast'>('multi-modal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [violations, setViolations] = useState<ComplianceViolation[]>([]);
  const [purificationData, setPurificationData] = useState<PurificationCalculation[]>([]);
  const [complianceForecasts, setComplianceForecasts] = useState<ComplianceForecast[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['financial-statement', 'news', 'earnings-call', 'regulatory-filing']);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  
  // Placeholder for actual API call
  const analyzeHoldings = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data generation
      const mockViolations = generateMockViolations();
      const mockPurification = generateMockPurificationData();
      const mockForecasts = generateMockForecasts();
      
      setViolations(mockViolations);
      setPurificationData(mockPurification);
      setComplianceForecasts(mockForecasts);
      setLastUpdated(new Date());
      
      // Calculate total purification amount
      const totalPurification = mockPurification.reduce((total, item) => total + item.purificationAmount, 0);
      if (onPurificationCalculated) {
        onPurificationCalculated(totalPurification);
      }
    } catch (error) {
      console.error('Error analyzing holdings:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Initial analysis on component mount
  useEffect(() => {
    if (holdings.length > 0) {
      analyzeHoldings();
    }
  }, []);
  
  // Filter violations based on selected sources and confidence threshold
  const filteredViolations = violations.filter(v => 
    selectedSources.includes(v.source) && v.confidence >= confidenceThreshold
  );
  
  // Helper function to get violation type display text
  const getViolationTypeDisplay = (type: string): string => {
    switch(type) {
      case 'interest': return 'Interest (Riba)';
      case 'prohibited-business': return 'Prohibited Business Activity';
      case 'excessive-debt': return 'Excessive Debt Ratio';
      case 'liquidity-ratio': return 'Liquidity Ratio Issue';
      case 'mixed-income': return 'Mixed Income Sources';
      case 'governance': return 'Governance Concerns';
      default: return type;
    }
  };
  
  // Helper function to get source display text
  const getSourceDisplay = (source: string): string => {
    switch(source) {
      case 'financial-statement': return 'Financial Statement';
      case 'news': return 'News Article';
      case 'earnings-call': return 'Earnings Call';
      case 'social-media': return 'Social Media';
      case 'regulatory-filing': return 'Regulatory Filing';
      default: return source;
    }
  };
  
  // Helper function to get severity color
  const getSeverityColor = (severity: string): string => {
    switch(severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-white/20 text-white';
    }
  };
  
  // Helper function to get compliance color
  const getComplianceColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">Multi-Modal Compliance Analysis</CardTitle>
            <CardDescription>
              Advanced NLP analysis of company reports, news, and filings to detect potential Shariah violations
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={analyzeHoldings}
            disabled={isAnalyzing}
            className="h-9"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="multi-modal" className="text-xs sm:text-sm">
              <FileSearch className="h-4 w-4 mr-2" />
              Multi-Modal Analysis
            </TabsTrigger>
            <TabsTrigger value="purification" className="text-xs sm:text-sm">
              <DollarSign className="h-4 w-4 mr-2" />
              Dynamic Purification
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Compliance Forecast
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="multi-modal" className="space-y-4">
            {/* Source filter controls */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge 
                variant={selectedSources.includes('financial-statement') ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedSources.includes('financial-statement')) {
                    setSelectedSources(selectedSources.filter(s => s !== 'financial-statement'));
                  } else {
                    setSelectedSources([...selectedSources, 'financial-statement']);
                  }
                }}
              >
                <Database className="h-3 w-3 mr-1" />
                Financial Statements
              </Badge>
              
              <Badge 
                variant={selectedSources.includes('news') ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedSources.includes('news')) {
                    setSelectedSources(selectedSources.filter(s => s !== 'news'));
                  } else {
                    setSelectedSources([...selectedSources, 'news']);
                  }
                }}
              >
                <FileText className="h-3 w-3 mr-1" />
                News
              </Badge>
              
              <Badge 
                variant={selectedSources.includes('earnings-call') ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedSources.includes('earnings-call')) {
                    setSelectedSources(selectedSources.filter(s => s !== 'earnings-call'));
                  } else {
                    setSelectedSources([...selectedSources, 'earnings-call']);
                  }
                }}
              >
                <BarChart2 className="h-3 w-3 mr-1" />
                Earnings Calls
              </Badge>
              
              <Badge 
                variant={selectedSources.includes('regulatory-filing') ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedSources.includes('regulatory-filing')) {
                    setSelectedSources(selectedSources.filter(s => s !== 'regulatory-filing'));
                  } else {
                    setSelectedSources([...selectedSources, 'regulatory-filing']);
                  }
                }}
              >
                <FileSearch className="h-3 w-3 mr-1" />
                Regulatory Filings
              </Badge>
              
              <Badge 
                variant={selectedSources.includes('social-media') ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedSources.includes('social-media')) {
                    setSelectedSources(selectedSources.filter(s => s !== 'social-media'));
                  } else {
                    setSelectedSources([...selectedSources, 'social-media']);
                  }
                }}
              >
                <Search className="h-3 w-3 mr-1" />
                Social Media
              </Badge>
            </div>
            
            {/* Confidence threshold slider */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/70">Confidence Threshold: {confidenceThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="95" 
                step="5"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {isAnalyzing ? (
              // Loading state
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border border-white/10 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredViolations.length > 0 ? (
              // Violations list
              <div className="space-y-4">
                {filteredViolations.map((violation) => (
                  <div key={violation.id} className="p-4 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
                        <h3 className="font-medium">{violation.companyName} ({violation.companySymbol})</h3>
                      </div>
                      <Badge className={getSeverityColor(violation.severity)}>
                        {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)} Severity
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-white/80">{violation.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-white/60">Violation Type</span>
                        <p className="text-sm">{getViolationTypeDisplay(violation.violationType)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/60">Source</span>
                        <p className="text-sm">{getSourceDisplay(violation.source)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/60">Detected</span>
                        <p className="text-sm">{violation.detectedAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/60">Confidence</span>
                        <div className="flex items-center">
                          <Progress value={violation.confidence} className="h-2 mr-2" />
                          <span className="text-sm">{violation.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {violation.recommendedAction && (
                      <div className="mt-3 p-3 bg-lavender/10 rounded border border-lavender/20">
                        <h4 className="text-sm font-medium mb-1 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-lavender" />
                          Recommended Action
                        </h4>
                        <p className="text-sm text-white/80">{violation.recommendedAction}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Empty state
              <div className="p-8 text-center text-white/60">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No compliance violations detected with current filters.</p>
                <p className="text-sm mt-2">Try adjusting your filter settings or confidence threshold.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Dynamic Purification Calculator Tab */}
          <TabsContent value="purification" className="space-y-4">
            <div className="bg-lavender/10 rounded-lg p-4 border border-lavender/20">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-lavender" />
                Dynamic Purification Calculator
              </h3>
              <p className="text-sm text-white/80">
                Automatically calculates purification amounts needed for investments with mixed sources of income.
                Purification (تطهير) is the process of cleansing your investment returns from non-compliant income.
              </p>
            </div>
            
            {isAnalyzing ? (
              // Loading state
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border border-white/10 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : purificationData.length > 0 ? (
              <div className="space-y-4">
                {/* Summary card */}
                <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Total Purification Amount</h3>
                    <div className="text-xl font-semibold text-lavender">
                      ${purificationData.reduce((total, item) => total + item.purificationAmount, 0).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 rounded bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Holdings Requiring Purification</div>
                      <div className="text-lg font-medium">{purificationData.length} / {holdings.length}</div>
                    </div>
                    
                    <div className="p-3 rounded bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Primary Purification Reason</div>
                      <div className="text-lg font-medium">
                        {(() => {
                          const reasons = purificationData.map(p => p.purificationReason);
                          const mostCommon = reasons.sort((a, b) => 
                            reasons.filter(v => v === a).length - reasons.filter(v => v === b).length
                          ).pop();
                          return mostCommon?.split(' ').slice(0, 2).join(' ') || 'None';
                        })()}
                      </div>
                    </div>
                    
                    <div className="p-3 rounded bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Last Calculation</div>
                      <div className="text-lg font-medium">
                        {purificationData[0]?.lastUpdated.toLocaleDateString() || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="text-lavender border-lavender hover:bg-lavender/20">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Donate Purification Amount
                    </Button>
                  </div>
                </div>
                
                {/* Detailed breakdown */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Detailed Breakdown</h3>
                  <div className="space-y-3">
                    {purificationData.map((item, index) => (
                      <div key={index} className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{item.companyName} ({item.companySymbol})</h4>
                            <p className="text-sm text-white/60">{item.purificationReason}</p>
                          </div>
                          <div className="text-lg font-semibold text-lavender">
                            ${item.purificationAmount.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="bg-black/30 p-3 rounded text-sm">
                          <h5 className="font-medium mb-1">Calculation Method</h5>
                          <p className="text-white/80">{item.calculationMethod}</p>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center text-xs text-white/60">
                          <span>Last updated: {item.lastUpdated.toLocaleDateString()}</span>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <FileText className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Educational section */}
                <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5">
                  <h3 className="text-sm font-medium mb-2">Understanding Purification</h3>
                  <p className="text-sm text-white/80 mb-3">
                    In Islamic finance, purification (تطهير) is the process of cleansing investment returns from non-compliant income sources.
                    This typically involves calculating the portion of returns derived from interest or prohibited activities, then donating
                    that amount to charity.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded bg-black/30">
                      <h4 className="text-sm font-medium mb-1">Common Purification Methods</h4>
                      <ul className="text-xs text-white/80 space-y-1 list-disc pl-4">
                        <li>Dividend-based purification (based on non-compliant income percentage)</li>
                        <li>Revenue-based purification (for companies with mixed business activities)</li>
                        <li>Interest income purification (for companies with excess cash reserves)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 rounded bg-black/30">
                      <h4 className="text-sm font-medium mb-1">Purification Best Practices</h4>
                      <ul className="text-xs text-white/80 space-y-1 list-disc pl-4">
                        <li>Purify as soon as dividends or capital gains are realized</li>
                        <li>Use conservative estimates when exact figures are unavailable</li>
                        <li>Donate to legitimate charitable causes that benefit the community</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty state
              <div className="p-8 text-center text-white/60">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No purification calculations available for your current holdings.</p>
                <Button onClick={analyzeHoldings} className="mt-4">
                  Calculate Purification Amounts
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Compliance Forecasting Tab */}
          <TabsContent value="forecast" className="space-y-4">
            <div className="bg-lavender/10 rounded-lg p-4 border border-lavender/20">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-lavender" />
                Compliance Forecasting
              </h3>
              <p className="text-sm text-white/80">
                Predicts potential future compliance issues based on company trends, market conditions, and regulatory changes.
                Our AI analyzes patterns to help you make proactive investment decisions.
              </p>
            </div>
            
            {isAnalyzing ? (
              // Loading state
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border border-white/10 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : complianceForecasts.length > 0 ? (
              <div className="space-y-4">
                {/* Portfolio forecast summary */}
                <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                  <h3 className="font-medium mb-3">Portfolio Compliance Forecast</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 rounded bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Current Portfolio Compliance</div>
                      <div className="text-lg font-medium flex items-center">
                        <span className={getComplianceColor(85)}>85%</span>
                        <span className="text-white/60 mx-2">→</span>
                        <span className={getComplianceColor(82)}>82%</span>
                        <span className="text-xs text-white/60 ml-2">(3-month)</span>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Holdings at Risk</div>
                      <div className="text-lg font-medium">
                        {complianceForecasts.filter(f => f.forecastedComplianceScore < 75).length} / {complianceForecasts.length}
                      </div>
                    </div>
                    
                    <div className="p-3 rounded bg-white/5 border border-white/10">
                      <div className="text-sm text-white/60 mb-1">Top Risk Factor</div>
                      <div className="text-lg font-medium">
                        {(() => {
                          // Get all risk factors from all forecasts
                          const allFactors = complianceForecasts.flatMap(f => f.riskFactors);
                          // Sort by impact and probability
                          const topFactor = allFactors.sort((a, b) => {
                            const impactScore = { high: 3, medium: 2, low: 1 };
                            const aScore = impactScore[a.impact] * a.probability;
                            const bScore = impactScore[b.impact] * b.probability;
                            return bScore - aScore;
                          })[0];
                          return topFactor?.factor || 'None detected';
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded bg-black/30">
                    <h4 className="text-sm font-medium mb-2">Portfolio-Wide Recommendations</h4>
                    <ul className="text-sm text-white/80 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-lavender" />
                        <span>Consider reducing exposure to technology stocks with increasing debt ratios</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-lavender" />
                        <span>Increase allocation to Shariah-compliant ETFs to improve overall compliance score</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-lavender" />
                        <span>Set up compliance alerts for quarterly financial reports from Microsoft and Apple</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Individual holding forecasts */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Individual Holding Forecasts</h3>
                  <div className="space-y-4">
                    {complianceForecasts.map((forecast, index) => (
                      <div key={index} className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{forecast.companyName} ({forecast.companySymbol})</h4>
                            <p className="text-sm text-white/60">{forecast.forecastPeriod} forecast</p>
                          </div>
                          <div className="flex items-center">
                            <span className={getComplianceColor(forecast.currentComplianceScore)}>
                              {forecast.currentComplianceScore}%
                            </span>
                            <span className="text-white/60 mx-2">→</span>
                            <span className={getComplianceColor(forecast.forecastedComplianceScore)}>
                              {forecast.forecastedComplianceScore}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>Current</span>
                            <span>Forecasted</span>
                          </div>
                          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`absolute left-0 top-0 h-full rounded-full ${
                                forecast.currentComplianceScore >= 80 ? 'bg-green-500' : 
                                forecast.currentComplianceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${forecast.currentComplianceScore}%` }}
                            ></div>
                            <div 
                              className={`absolute left-0 top-0 h-full border-r-2 border-white ${
                                forecast.forecastedComplianceScore >= 80 ? 'border-green-500' : 
                                forecast.forecastedComplianceScore >= 60 ? 'border-yellow-500' : 'border-red-500'
                              }`}
                              style={{ width: `${forecast.forecastedComplianceScore}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="bg-black/30 p-3 rounded">
                            <h5 className="text-sm font-medium mb-2">Risk Factors</h5>
                            <div className="space-y-2">
                              {forecast.riskFactors.map((factor, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <div className="flex items-center">
                                    <AlertTriangle className={`h-3 w-3 mr-2 ${
                                      factor.impact === 'high' ? 'text-red-400' : 
                                      factor.impact === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                                    }`} />
                                    <span className="text-white/80">{factor.factor}</span>
                                  </div>
                                  <Badge className={`${
                                    factor.impact === 'high' ? 'bg-red-500/20 text-red-400' : 
                                    factor.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {Math.round(factor.probability * 100)}% Probability
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-black/30 p-3 rounded">
                            <h5 className="text-sm font-medium mb-2">Recommended Actions</h5>
                            {forecast.recommendedActions.length > 0 ? (
                              <ul className="space-y-2">
                                {forecast.recommendedActions.map((action, idx) => (
                                  <li key={idx} className="flex items-start text-sm">
                                    <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-lavender" />
                                    <span className="text-white/80">{action}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-white/60">No specific actions recommended at this time.</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-white/60 mt-2">
                          Forecast generated: {forecast.generatedAt.toLocaleDateString()} | 
                          <Button variant="link" className="h-auto p-0 text-xs text-lavender">
                            View detailed analysis
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Methodology explanation */}
                <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5">
                  <h3 className="text-sm font-medium mb-2">Forecasting Methodology</h3>
                  <p className="text-sm text-white/80 mb-3">
                    Our compliance forecasting uses a combination of historical compliance data, financial trend analysis,
                    news sentiment, and regulatory pattern recognition to predict future Shariah compliance status.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-2 rounded bg-black/30">
                      <h4 className="font-medium mb-1">Financial Indicators</h4>
                      <p className="text-white/70">Debt ratio trends, liquidity patterns, revenue source changes</p>
                    </div>
                    
                    <div className="p-2 rounded bg-black/30">
                      <h4 className="font-medium mb-1">Market Intelligence</h4>
                      <p className="text-white/70">Acquisition rumors, industry shifts, competitive landscape</p>
                    </div>
                    
                    <div className="p-2 rounded bg-black/30">
                      <h4 className="font-medium mb-1">Regulatory Analysis</h4>
                      <p className="text-white/70">Shariah board decisions, fatawa updates, governance changes</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty state
              <div className="p-8 text-center text-white/60">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No compliance forecasts available for your current holdings.</p>
                <Button onClick={analyzeHoldings} className="mt-4">
                  Generate Compliance Forecasts
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-white/10 pt-4">
        <div className="w-full text-center text-sm text-white/60">
          {lastUpdated ? (
            <>Last updated: {lastUpdated.toLocaleString()}</>
          ) : (
            <>Multi-modal analysis powered by advanced NLP and financial data processing</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Mock data generation functions
const generateMockViolations = (): ComplianceViolation[] => {
  return [
    {
      id: '1',
      companySymbol: 'AAPL',
      companyName: 'Apple Inc.',
      violationType: 'interest',
      severity: 'medium',
      description: 'Recent earnings call revealed increased interest income from cash reserves, potentially exceeding Shariah thresholds.',
      source: 'earnings-call',
      detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      confidence: 85,
      potentialImpact: 'May require increased purification of dividends',
      recommendedAction: 'Monitor interest income ratio in upcoming quarterly report and adjust purification calculations accordingly.'
    },
    {
      id: '2',
      companySymbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      violationType: 'excessive-debt',
      severity: 'high',
      description: 'Recent acquisition financing has pushed debt-to-asset ratio above 33% threshold according to latest financial filings.',
      source: 'financial-statement',
      detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      confidence: 92,
      potentialImpact: 'May require reclassification as non-compliant',
      recommendedAction: 'Consider reducing position until debt levels normalize below Shariah thresholds.'
    },
    {
      id: '3',
      companySymbol: 'TSLA',
      companyName: 'Tesla, Inc.',
      violationType: 'mixed-income',
      severity: 'low',
      description: 'News reports indicate new revenue stream from grid energy storage services may include interest-based components.',
      source: 'news',
      detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      confidence: 75,
      potentialImpact: 'May require purification of a portion of dividends',
      recommendedAction: 'Await official financial disclosures to confirm revenue structure before making portfolio changes.'
    },
    {
      id: '4',
      companySymbol: 'AMZN',
      companyName: 'Amazon.com, Inc.',
      violationType: 'prohibited-business',
      severity: 'medium',
      description: 'Regulatory filing reveals expansion of alcoholic beverage sales in certain markets, potentially increasing non-compliant revenue.',
      source: 'regulatory-filing',
      detectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      confidence: 88,
      potentialImpact: 'May increase purification requirements',
      recommendedAction: 'Monitor revenue breakdown in upcoming quarterly report to assess if prohibited activities exceed 5% threshold.'
    },
    {
      id: '5',
      companySymbol: 'GOOGL',
      companyName: 'Alphabet Inc.',
      violationType: 'governance',
      severity: 'low',
      description: 'Social media analysis indicates potential corporate governance concerns related to executive compensation structure.',
      source: 'social-media',
      detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      confidence: 65,
      potentialImpact: 'Minimal immediate impact on compliance status',
      recommendedAction: 'Continue monitoring but no immediate action required.'
    }
  ];
};

const generateMockPurificationData = (): PurificationCalculation[] => {
  return [
    {
      companySymbol: 'AAPL',
      companyName: 'Apple Inc.',
      purificationAmount: 12.75,
      purificationReason: 'Interest income from cash reserves',
      calculationMethod: 'Proportional interest income',
      lastUpdated: new Date()
    },
    {
      companySymbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      purificationAmount: 8.32,
      purificationReason: 'Mixed revenue sources',
      calculationMethod: 'Revenue-based calculation',
      lastUpdated: new Date()
    },
    {
      companySymbol: 'TSLA',
      companyName: 'Tesla, Inc.',
      purificationAmount: 3.45,
      purificationReason: 'Energy storage financing',
      calculationMethod: 'Conservative estimation',
      lastUpdated: new Date()
    }
  ];
};

const generateMockForecasts = (): ComplianceForecast[] => {
  return [
    {
      companySymbol: 'AAPL',
      companyName: 'Apple Inc.',
      currentComplianceScore: 85,
      forecastedComplianceScore: 82,
      forecastPeriod: '3-month',
      riskFactors: [
        {
          factor: 'Increasing interest income',
          probability: 0.7,
          impact: 'medium'
        },
        {
          factor: 'New financing structure',
          probability: 0.4,
          impact: 'low'
        }
      ],
      recommendedActions: [
        'Monitor quarterly interest income trends',
        'Consider partial position reduction if score drops below 80'
      ],
      generatedAt: new Date()
    },
    {
      companySymbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      currentComplianceScore: 75,
      forecastedComplianceScore: 68,
      forecastPeriod: '6-month',
      riskFactors: [
        {
          factor: 'Increasing debt ratio',
          probability: 0.8,
          impact: 'high'
        },
        {
          factor: 'Potential acquisition activity',
          probability: 0.6,
          impact: 'medium'
        }
      ],
      recommendedActions: [
        'Reduce position by 25% in next rebalancing',
        'Set compliance alert for quarterly debt ratio updates'
      ],
      generatedAt: new Date()
    }
  ];
};

export default MultiModalComplianceAnalysis;
