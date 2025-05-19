import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, Search, Shield, Info } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

interface ComplianceForecastingProps {
  isLoading: boolean;
  userPortfolio?: any[];
}

interface ComplianceForecast {
  symbol: string;
  name: string;
  currentScore: number;
  forecastedScore: number;
  trend: 'improving' | 'declining' | 'stable';
  riskFactors: {
    factor: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
  timeframe: string;
  confidence: number;
}

const ComplianceForecasting: React.FC<ComplianceForecastingProps> = ({ isLoading, userPortfolio = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<ComplianceForecast | null>(null);

  // Sample compliance forecast data
  const complianceForecasts: ComplianceForecast[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentScore: 82,
      forecastedScore: 78,
      trend: 'declining',
      riskFactors: [
        {
          factor: 'Increasing Debt Ratio',
          severity: 'medium',
          description: 'Recent bond issuance may push debt-to-asset ratio closer to Shariah thresholds in the next quarter.'
        },
        {
          factor: 'Interest Income Growth',
          severity: 'low',
          description: 'Cash reserves generating slightly higher interest income, though still within acceptable limits.'
        }
      ],
      timeframe: 'Next 6 months',
      confidence: 85
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      currentScore: 76,
      forecastedScore: 73,
      trend: 'declining',
      riskFactors: [
        {
          factor: 'Acquisition Financing',
          severity: 'medium',
          description: 'Recent acquisitions financed partially through interest-bearing debt instruments.'
        },
        {
          factor: 'Treasury Management',
          severity: 'medium',
          description: 'Increasing allocation to interest-bearing securities in treasury operations.'
        }
      ],
      timeframe: 'Next 6 months',
      confidence: 82
    },
    {
      symbol: 'ADPT',
      name: 'Adeptus Health',
      currentScore: 68,
      forecastedScore: 75,
      trend: 'improving',
      riskFactors: [
        {
          factor: 'Debt Restructuring',
          severity: 'low',
          description: 'Ongoing debt restructuring expected to reduce interest-bearing debt ratio.'
        }
      ],
      timeframe: 'Next 6 months',
      confidence: 78
    },
    {
      symbol: 'SBUX',
      name: 'Starbucks Corporation',
      currentScore: 71,
      forecastedScore: 69,
      trend: 'stable',
      riskFactors: [
        {
          factor: 'Expansion Financing',
          severity: 'low',
          description: 'New store expansion partially funded through conventional financing.'
        },
        {
          factor: 'Non-Compliant Revenue',
          severity: 'low',
          description: 'Slight increase in alcohol-related products in certain markets.'
        }
      ],
      timeframe: 'Next 6 months',
      confidence: 80
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      currentScore: 79,
      forecastedScore: 84,
      trend: 'improving',
      riskFactors: [
        {
          factor: 'Debt Reduction',
          severity: 'low',
          description: 'Strong cash flow allowing for debt reduction, improving financial ratios.'
        }
      ],
      timeframe: 'Next 6 months',
      confidence: 76
    }
  ];

  // Filter forecasts based on search query
  const filteredForecasts = searchQuery
    ? complianceForecasts.filter(forecast => 
        forecast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forecast.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : complianceForecasts;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number): string => {
    if (score >= 80) return '[&>div]:bg-green-500';
    if (score >= 70) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-red-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <TrendingUp className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-lavender/20 text-lavender';
    }
  };

  if (isLoading) {
    return <LoadingAnimation text="Analyzing Shariah compliance trends..." type="analysis" />;
  }

  return (
    <div className="space-y-6">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          type="text"
          placeholder="Search companies..."
          className="w-full pl-10 pr-4 py-2 bg-secondary/30 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-lavender/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-secondary/30 border-white/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-lavender" />
              Shariah Compliance Forecasts
            </h3>
            
            <div className="space-y-4">
              {filteredForecasts.length > 0 ? (
                filteredForecasts.map((forecast) => (
                  <div 
                    key={forecast.symbol} 
                    className="p-4 rounded-lg bg-background/40 border border-white/10 cursor-pointer hover:bg-background/60 transition-colors"
                    onClick={() => setSelectedCompany(forecast)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{forecast.name}</h4>
                        <div className="text-sm text-white/60">{forecast.symbol}</div>
                      </div>
                      <div className="flex items-center">
                        {getTrendIcon(forecast.trend)}
                        <span className="ml-1 text-sm">
                          {forecast.trend === 'improving' ? 'Improving' : 
                           forecast.trend === 'declining' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Current Compliance Score</span>
                        <span className={getScoreColor(forecast.currentScore)}>{forecast.currentScore}/100</span>
                      </div>
                      <Progress value={forecast.currentScore} className={`h-1.5 ${getProgressColor(forecast.currentScore)}`} />
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Forecasted Compliance Score</span>
                        <span className={getScoreColor(forecast.forecastedScore)}>{forecast.forecastedScore}/100</span>
                      </div>
                      <Progress value={forecast.forecastedScore} className={`h-1.5 ${getProgressColor(forecast.forecastedScore)}`} />
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 text-xs text-white/60">
                      <span>Forecast Confidence: {forecast.confidence}%</span>
                      <span>{forecast.timeframe}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-white/60">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No companies match your search criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/30 border-white/10">
          <CardContent className="pt-6">
            {selectedCompany ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedCompany.name}</h3>
                    <div className="text-sm text-white/60">{selectedCompany.symbol}</div>
                  </div>
                  <Badge 
                    className={`${selectedCompany.trend === 'improving' ? 'bg-green-500/20 text-green-400' : 
                      selectedCompany.trend === 'declining' ? 'bg-red-500/20 text-red-400' : 
                      'bg-yellow-500/20 text-yellow-400'}`}
                  >
                    {selectedCompany.trend === 'improving' ? 'Improving' : 
                     selectedCompany.trend === 'declining' ? 'Declining' : 'Stable'}
                  </Badge>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Compliance Score Trend</span>
                    <span className="text-sm text-white/60">{selectedCompany.timeframe}</span>
                  </div>
                  <div className="p-4 bg-background/40 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm">Current</div>
                        <div className={`text-xl font-medium ${getScoreColor(selectedCompany.currentScore)}`}>
                          {selectedCompany.currentScore}/100
                        </div>
                      </div>
                      <div className="text-2xl text-white/20">
                        →
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Forecasted</div>
                        <div className={`text-xl font-medium ${getScoreColor(selectedCompany.forecastedScore)}`}>
                          {selectedCompany.forecastedScore}/100
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={selectedCompany.forecastedScore} 
                      className={`h-2 ${getProgressColor(selectedCompany.forecastedScore)}`} 
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-lavender" />
                    Compliance Risk Factors
                  </h4>
                  <div className="space-y-3">
                    {selectedCompany.riskFactors.map((risk, index) => (
                      <div key={index} className="p-3 bg-background/40 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium">{risk.factor}</h5>
                          <Badge className={getSeverityColor(risk.severity)}>
                            {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-white/70">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-lavender" />
                    Compliance Recommendations
                  </h4>
                  <div className="p-3 bg-background/40 rounded-lg border border-white/10 text-sm">
                    {selectedCompany.trend === 'declining' ? (
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                          </div>
                          <span>Consider reducing position size if score drops below 70.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                          </div>
                          <span>Monitor quarterly reports for changes in debt structure.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                          </div>
                          <span>Increase purification percentage to account for rising non-compliant income.</span>
                        </li>
                      </ul>
                    ) : selectedCompany.trend === 'improving' ? (
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                          </div>
                          <span>Consider increasing position as compliance metrics improve.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                          </div>
                          <span>Maintain current purification percentage until next review.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                          </div>
                          <span>Review again after next earnings announcement.</span>
                        </li>
                      </ul>
                    ) : (
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400"></div>
                          </div>
                          <span>Maintain current position with regular monitoring.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400"></div>
                          </div>
                          <span>Review compliance status after next quarterly report.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400"></div>
                          </div>
                          <span>Consider balancing with more highly compliant securities.</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-white/60 mt-4">
                  Forecast confidence: {selectedCompany.confidence}% • Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-white/60">
                <Info className="h-16 w-16 mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">Select a Company</h3>
                <p className="mb-4">Click on a company from the list to view detailed compliance forecasts and risk analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-secondary/30 border-white/10">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">
            Understanding Compliance Forecasting
          </h3>
          <p className="text-sm text-white/70 mb-4">
            Our AI-powered compliance forecasting system analyzes financial statements, business activities, and market trends to predict how a company's Shariah compliance status may change over time. This helps investors make proactive decisions before compliance issues arise.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Compliance Scoring</h4>
              <p className="text-white/70 mb-2">Our scoring system evaluates:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Debt-to-assets ratio</li>
                <li>• Interest income percentage</li>
                <li>• Non-permissible revenue</li>
                <li>• Liquid assets to total assets</li>
                <li>• Business activities alignment</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Forecast Methodology</h4>
              <p className="text-white/70 mb-2">Our predictions are based on:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Financial trend analysis</li>
                <li>• Announced business changes</li>
                <li>• Debt structure evolution</li>
                <li>• Acquisition & divestiture plans</li>
                <li>• Industry-specific factors</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Confidence Rating</h4>
              <p className="text-white/70 mb-2">Confidence scores reflect:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Data completeness</li>
                <li>• Historical prediction accuracy</li>
                <li>• Company disclosure quality</li>
                <li>• Market volatility factors</li>
                <li>• Time horizon length</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceForecasting;
