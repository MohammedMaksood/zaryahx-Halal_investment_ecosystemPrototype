import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingAnimation from "@/components/LoadingAnimation";
import HalalBadge from "@/components/HalalBadge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Analysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<'halal' | 'haram' | null>(null);
  const [stockInfo, setStockInfo] = useState<{
    name: string;
    symbol: string;
    price: number;
    change: number;
    sector: string;
    description: string;
    complianceScore: number;
    debtRatio: number;
    interestIncome: number;
    illiquidAssets: number;
    haramRevenue: number;
  } | null>(null);

  // List of terms that should always be classified as haram
  const haramTerms = [
    'pork', 'alcohol', 'beer', 'wine', 'liquor', 'gambling', 'casino', 'tobacco', 'cigarette',
    'interest', 'riba', 'usury', 'bank', 'conventional banking', 'adult', 'entertainment', 'pig',
    'mortgage', 'loan', 'insurance', 'lending', 'brewery', 'distillery', 'nightclub', 'weapon'
  ];

  // List of industries that are typically haram
  const haramIndustries = [
    'Banking', 'Conventional Finance', 'Alcohol', 'Tobacco', 'Gambling', 
    'Weapons Manufacturing', 'Adult Entertainment', 'Pork Processing'
  ];

  // More thorough Shariah compliance check
  const evaluateShariah = (query: string) => {
    query = query.toLowerCase();
    
    // Direct match with haram terms - automatic fail
    if (haramTerms.some(term => query.includes(term))) {
      return {
        result: 'haram',
        reasons: {
          debtRatio: Math.random() * 30 + 40, // Above 33% (non-compliant)
          interestIncome: Math.random() * 10 + 5, // Above 5% (non-compliant)
          illiquidAssets: Math.random() * 20 + 30, // Below 51% (non-compliant)
          haramRevenue: Math.random() * 15 + 10, // Above 5% (non-compliant)
          complianceScore: Math.floor(Math.random() * 30 + 10),
          industry: haramIndustries[Math.floor(Math.random() * haramIndustries.length)]
        }
      };
    }
    
    // For tech companies, more likely to be halal
    if (['apple', 'msft', 'microsoft', 'googl', 'google', 'tech', 'software', 'hardware'].some(term => query.includes(term))) {
      return {
        result: 'halal',
        reasons: {
          debtRatio: Math.random() * 20 + 5, // Below 33% (compliant)
          interestIncome: Math.random() * 3 + 1, // Below 5% (compliant)
          illiquidAssets: Math.random() * 20 + 60, // Above 51% (compliant)
          haramRevenue: Math.random() * 2 + 0.5, // Below 5% (compliant)
          complianceScore: Math.floor(Math.random() * 15 + 75),
          industry: 'Technology'
        }
      };
    }
    
    // For other companies, randomize but with higher chance of haram for financial terms
    const hasFinancialTerms = ['financial', 'finance', 'invest', 'capital', 'asset', 'fund'].some(term => query.includes(term));
    
    if (hasFinancialTerms) {
      // Higher chance of being haram for financial companies
      const isHaram = Math.random() > 0.3;
      
      if (isHaram) {
        return {
          result: 'haram',
          reasons: {
            debtRatio: Math.random() * 20 + 33, // Above 33% (non-compliant)
            interestIncome: Math.random() * 10 + 5, // Above 5% (non-compliant)
            illiquidAssets: Math.random() * 20 + 20, // Below 51% (non-compliant)
            haramRevenue: Math.random() * 10 + 5, // Above 5% (non-compliant)
            complianceScore: Math.floor(Math.random() * 20 + 30),
            industry: 'Financial Services'
          }
        };
      }
    }
    
    // Default case - random with bias toward halal
    const isHalal = Math.random() > 0.4;
    
    if (isHalal) {
      return {
        result: 'halal',
        reasons: {
          debtRatio: Math.random() * 20 + 5, // Below 33% (compliant)
          interestIncome: Math.random() * 3 + 1, // Below 5% (compliant)
          illiquidAssets: Math.random() * 20 + 60, // Above 51% (compliant)
          haramRevenue: Math.random() * 3 + 0.5, // Below 5% (compliant)
          complianceScore: Math.floor(Math.random() * 15 + 75),
          industry: ['Healthcare', 'Consumer Goods', 'Manufacturing', 'Technology', 'Energy'][Math.floor(Math.random() * 5)]
        }
      };
    } else {
      return {
        result: 'haram',
        reasons: {
          debtRatio: Math.random() * 20 + 33, // Above 33% (non-compliant)
          interestIncome: Math.random() * 10 + 5, // Above 5% (non-compliant)
          illiquidAssets: Math.random() * 20 + 20, // Below 51% (non-compliant)
          haramRevenue: Math.random() * 10 + 5, // Above 5% (non-compliant)
          complianceScore: Math.floor(Math.random() * 20 + 30),
          industry: ['Mixed Business', 'Entertainment', 'Retail', 'Hospitality'][Math.floor(Math.random() * 4)]
        }
      };
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Reset states
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisResult(null);
    setStockInfo(null);
    
    // Simulate API call
    setTimeout(() => {
      const evaluation = evaluateShariah(searchQuery);
      
      const mockResponse = {
        result: evaluation.result,
        stockInfo: {
          name: searchQuery.toUpperCase().includes('APPLE') ? 'Apple Inc.' : 
                searchQuery.toUpperCase().includes('MSFT') ? 'Microsoft Corporation' : 
                searchQuery.toUpperCase().includes('GOOGL') ? 'Alphabet Inc.' : 
                `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}`,
          symbol: searchQuery.toUpperCase().includes('APPLE') ? 'AAPL' : 
                 searchQuery.toUpperCase().includes('MSFT') ? 'MSFT' : 
                 searchQuery.toUpperCase().includes('GOOGL') ? 'GOOGL' : 
                 searchQuery.toUpperCase().slice(0, 4),
          price: Number((Math.random() * 500 + 50).toFixed(2)),
          change: Number((Math.random() * 5 - 2.5).toFixed(2)),
          sector: evaluation.reasons.industry,
          description: evaluation.result === 'halal' ? 
                      'This company passes Shariah screening criteria based on its financial metrics and business activities. The debt ratio, interest income, and involvement in prohibited activities are all within acceptable limits.' :
                      'This company does not meet one or more key Shariah compliance requirements. Investment in this company is not recommended for those following Islamic principles.',
          complianceScore: evaluation.reasons.complianceScore,
          debtRatio: evaluation.reasons.debtRatio,
          interestIncome: evaluation.reasons.interestIncome,
          illiquidAssets: evaluation.reasons.illiquidAssets,
          haramRevenue: evaluation.reasons.haramRevenue
        }
      };
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setAnalysisResult(mockResponse.result as 'halal' | 'haram');
      setStockInfo(mockResponse.stockInfo);
    }, 3000);
  };

  const getReasonsList = (isHalal: boolean, stockInfo: any) => {
    if (!stockInfo) return [];
    
    if (isHalal) {
      return [
        `Debt-to-asset ratio is ${stockInfo.debtRatio.toFixed(2)}% (below 33% threshold)`,
        `Interest income is ${stockInfo.interestIncome.toFixed(2)}% of revenue (below 5% threshold)`,
        `Illiquid assets ratio is ${stockInfo.illiquidAssets.toFixed(2)}% (above 51% threshold)`,
        `Non-permissible income is ${stockInfo.haramRevenue.toFixed(2)}% (below 5% threshold)`,
        "Business activities align with Shariah principles"
      ];
    } else {
      const reasons = [];
      
      if (stockInfo.debtRatio > 33) {
        reasons.push(`Debt-to-asset ratio is ${stockInfo.debtRatio.toFixed(2)}% (exceeds 33% threshold)`);
      }
      
      if (stockInfo.interestIncome > 5) {
        reasons.push(`Interest income is ${stockInfo.interestIncome.toFixed(2)}% of revenue (exceeds 5% threshold)`);
      }
      
      if (stockInfo.illiquidAssets < 51) {
        reasons.push(`Illiquid assets ratio is ${stockInfo.illiquidAssets.toFixed(2)}% (below 51% threshold)`);
      }
      
      if (stockInfo.haramRevenue > 5) {
        reasons.push(`Non-permissible income is ${stockInfo.haramRevenue.toFixed(2)}% (exceeds 5% threshold)`);
      }
      
      reasons.push("Business activities include impermissible elements");
      
      return reasons;
    }
  };

  const renderSearchSection = () => (
    <section className="py-12 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Halal Stock Analysis
          </h1>
          <p className="text-white/70 mb-8">
            Enter any stock ticker or company name to analyze its Shariah compliance status. Our AI-powered system will evaluate financial metrics and business activities.
          </p>
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="pr-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-12 w-12"
              disabled={isAnalyzing}
            >
              <Search className="h-5 w-5 text-lavender" />
            </Button>
          </form>
          
          <div className="mt-4 text-xs text-white/50">
            Try: AAPL (Apple), MSFT (Microsoft), GOOGL (Google)
          </div>
        </div>
      </div>
    </section>
  );

  const renderAnalyzingSection = () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl glassy-card p-8">
            <div className="text-center py-12">
              <LoadingAnimation type="analysis" size="lg" text="Analyzing Shariah compliance..." />
              
              <div className="max-w-md mx-auto mt-12">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-lavender animate-shimmer bg-shimmer" style={{width: '60%'}}></div>
                </div>
                <div className="mt-4 text-center text-sm text-white/70">
                  Checking financial ratios and business activities...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderResultSection = () => (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl glassy-card p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{stockInfo?.name}</h2>
                  <HalalBadge type={analysisResult as 'halal' | 'haram'} />
                </div>
                <div className="text-white/60 text-sm mb-4">{stockInfo?.symbol} • {stockInfo?.sector}</div>
              </div>
              
              <div className="mt-4 lg:mt-0">
                <div className="text-2xl font-semibold">${stockInfo?.price}</div>
                <div 
                  className={`text-sm ${Number(stockInfo?.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {Number(stockInfo?.change) >= 0 ? '+' : ''}{stockInfo?.change}%
                </div>
              </div>
            </div>
            
            <div className="my-6 border-t border-b border-white/10 py-6">
              <h3 className="text-lg font-semibold mb-4">Shariah Compliance Analysis</h3>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Shariah Compliance Score</span>
                  <span className="font-semibold">{stockInfo?.complianceScore}/100</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${analysisResult === 'halal' ? 'bg-halal' : 'bg-haram'} rounded-full`} 
                    style={{width: `${stockInfo?.complianceScore}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div>
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${stockInfo?.debtRatio <= 33 ? 'bg-halal' : 'bg-haram'}`}></span>
                    Debt to Asset Ratio
                  </h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Current</span>
                    <span className={`font-medium ${stockInfo?.debtRatio <= 33 ? 'text-halal' : 'text-haram'}`}>
                      {stockInfo?.debtRatio.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/70">Threshold</span>
                    <span className="font-medium">33%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stockInfo?.debtRatio <= 33 ? 'bg-halal' : 'bg-haram'}`} 
                      style={{width: `${(stockInfo?.debtRatio / 100) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${stockInfo?.interestIncome <= 5 ? 'bg-halal' : 'bg-haram'}`}></span>
                    Interest Income
                  </h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Current</span>
                    <span className={`font-medium ${stockInfo?.interestIncome <= 5 ? 'text-halal' : 'text-haram'}`}>
                      {stockInfo?.interestIncome.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/70">Threshold</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stockInfo?.interestIncome <= 5 ? 'bg-halal' : 'bg-haram'}`} 
                      style={{width: `${(stockInfo?.interestIncome / 10) * 100}%`}}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${stockInfo?.illiquidAssets >= 51 ? 'bg-halal' : 'bg-haram'}`}></span>
                    Illiquid Assets Ratio
                  </h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Current</span>
                    <span className={`font-medium ${stockInfo?.illiquidAssets >= 51 ? 'text-halal' : 'text-haram'}`}>
                      {stockInfo?.illiquidAssets.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/70">Threshold</span>
                    <span className="font-medium">51%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stockInfo?.illiquidAssets >= 51 ? 'bg-halal' : 'bg-haram'}`} 
                      style={{width: `${stockInfo?.illiquidAssets}%`}}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-3 flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${stockInfo?.haramRevenue <= 5 ? 'bg-halal' : 'bg-haram'}`}></span>
                    Non-Permissible Revenue
                  </h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Current</span>
                    <span className={`font-medium ${stockInfo?.haramRevenue <= 5 ? 'text-halal' : 'text-haram'}`}>
                      {stockInfo?.haramRevenue.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/70">Threshold</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stockInfo?.haramRevenue <= 5 ? 'bg-halal' : 'bg-haram'}`} 
                      style={{width: `${(stockInfo?.haramRevenue / 10) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
              
              <h4 className="text-md font-medium mb-3">
                {analysisResult === 'halal' ? 'Why this stock is Halal:' : 'Why this stock is not Halal:'}
              </h4>
              <ul className="space-y-2 ml-6 list-disc text-white/80">
                {stockInfo && getReasonsList(analysisResult === 'halal', stockInfo).map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className={analysisResult === 'halal' ? "bg-halal hover:bg-halal/80 flex-1" : "bg-haram hover:bg-haram/80 flex-1"}
                disabled={analysisResult === 'haram'}
                onClick={() => {
                  if (analysisResult === 'halal' && stockInfo) {
                    if (!isAuthenticated) {
                      toast({
                        title: "Authentication Required",
                        description: "Please sign in to invest in stocks",
                      });
                      navigate('/signin?redirect=/stocks/' + stockInfo.symbol);
                      return;
                    }
                    
                    // Navigate to stock details with invest tab active
                    navigate(`/stocks/${stockInfo.symbol}?tab=invest`);
                  }
                }}
              >
                {analysisResult === 'halal' ? 'Invest Now' : 'Not Halal for Investment'}
              </Button>
              <Button 
                variant="outline" 
                className="border-lavender text-lavender hover:bg-lavender/20"
                onClick={() => {
                  setSearchQuery('');
                  setAnalysisComplete(false);
                }}
              >
                Analyze Another Stock
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {!isAnalyzing && !analysisComplete && renderSearchSection()}
        {isAnalyzing && renderAnalyzingSection()}
        {!isAnalyzing && analysisComplete && renderResultSection()}
        
        {/* Educational Section */}
        <section className={`py-16 bg-secondary/30 ${isAnalyzing ? 'hidden' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gradient text-center">
                Understanding Islamic Stock Screening
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glassy-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3">Financial Screening</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-xs text-lavender">1</span>
                      </div>
                      <p className="text-white/80">Total debt divided by total assets must be less than 33%</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-xs text-lavender">2</span>
                      </div>
                      <p className="text-white/80">Total interest-bearing securities divided by market cap must be less than 33%</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-xs text-lavender">3</span>
                      </div>
                      <p className="text-white/80">Accounts receivable divided by total assets must be less than 33%</p>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-lavender/20 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-xs text-lavender">4</span>
                      </div>
                      <p className="text-white/80">Non-permissible income must be less than 5% of total revenue</p>
                    </li>
                  </ul>
                </div>
                
                <div className="glassy-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3">Business Activity Screening</h3>
                  <p className="mb-4 text-white/80">Companies are excluded if they are involved in:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-haram"></div>
                      <span className="text-sm text-white/80">Alcohol</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-haram"></div>
                      <span className="text-sm text-white/80">Tobacco</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-haram"></div>
                      <span className="text-sm text-white/80">Gambling</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-haram"></div>
                      <span className="text-sm text-white/80">Adult Entertainment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-haram"></div>
                      <span className="text-sm text-white/80">Pork Products</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-haram"></div>
                      <span className="text-sm text-white/80">Weapons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-haram"></div>
                      <span className="text-sm text-white/80">Conventional Banking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-haram"></div>
                      <span className="text-sm text-white/80">Conventional Insurance</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-white/70 mb-4">
                  Our analysis provides a comprehensive evaluation based on these criteria and more.
                </p>
                <Button 
                  className="bg-lavender hover:bg-lavender-dark"
                >
                  Learn More About Islamic Finance
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Analysis;
