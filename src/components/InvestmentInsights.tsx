import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, LineChart, AlertCircle, Check } from 'lucide-react';

interface InvestmentInsightsProps {
  stockSymbol?: string;
  stockName?: string;
  isCompliant?: boolean;
  complianceScore?: number;
  financialRatios?: {
    debtRatio: number;
    interestIncome: number;
    illiquidAssets: number;
    haramRevenue: number;
  };
}

const InvestmentInsights: React.FC<InvestmentInsightsProps> = ({
  stockSymbol = '',
  stockName = '',
  isCompliant = true,
  complianceScore = 85,
  financialRatios = {
    debtRatio: 15.2,
    interestIncome: 2.3,
    illiquidAssets: 65.8,
    haramRevenue: 1.2
  }
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shariah');

  // AI-generated insights based on the stock and compliance data
  const generateAIInsights = () => {
    if (!stockSymbol) {
      return {
        summary: "Islamic investment principles focus on ethical, socially responsible investing that avoids interest (riba), excessive uncertainty (gharar), and prohibited industries.",
        strengths: [
          "Promotes ethical and socially responsible investing",
          "Avoids excessive debt and interest-based transactions",
          "Focuses on real asset ownership and tangible value",
          "Encourages long-term investment rather than speculation"
        ],
        considerations: [
          "Requires careful screening of investments for Shariah compliance",
          "May limit diversification opportunities in certain sectors",
          "Compliance standards can vary between different scholars and regions",
          "Regular purification of returns may be necessary for partial compliance"
        ]
      };
    }

    // Stock-specific insights
    if (isCompliant) {
      return {
        summary: `${stockName} (${stockSymbol}) demonstrates strong Shariah compliance with a score of ${complianceScore}/100, making it suitable for Islamic investment portfolios.`,
        strengths: [
          `Low debt ratio of ${financialRatios.debtRatio.toFixed(1)}%, well below the 33% threshold`,
          `Minimal interest income at ${financialRatios.interestIncome.toFixed(1)}% of revenue`,
          `Strong asset backing with ${financialRatios.illiquidAssets.toFixed(1)}% in illiquid assets`,
          `Very low exposure to non-permissible activities (${financialRatios.haramRevenue.toFixed(1)}%)`
        ],
        considerations: [
          "Regular monitoring recommended as financial ratios may change quarterly",
          "Consider purification of the small portion of non-compliant income",
          "Diversify your portfolio with other compliant stocks to reduce sector risk",
          "Review compliance status after major corporate events or acquisitions"
        ]
      };
    } else {
      return {
        summary: `${stockName} (${stockSymbol}) does not meet Shariah compliance standards with a score of ${complianceScore}/100, making it unsuitable for Islamic investment portfolios.`,
        strengths: [
          "The company may have other positive attributes from a business perspective",
          "Some investors may consider limited investment with income purification",
          "The company could improve compliance through debt restructuring",
          "Engagement with management could encourage more Shariah-friendly practices"
        ],
        considerations: [
          `High debt ratio of ${financialRatios.debtRatio.toFixed(1)}% exceeds the 33% threshold`,
          `Significant interest income at ${financialRatios.interestIncome.toFixed(1)}% of revenue`,
          `Insufficient asset backing with only ${financialRatios.illiquidAssets.toFixed(1)}% in illiquid assets`,
          `Excessive exposure to non-permissible activities (${financialRatios.haramRevenue.toFixed(1)}%)`
        ]
      };
    }
  };

  const insights = generateAIInsights();

  // Educational content about Islamic finance principles
  const educationalContent = {
    shariahPrinciples: [
      {
        title: "Prohibition of Riba (Interest)",
        description: "Islamic finance prohibits the charging or paying of interest, considering it exploitative. Instead, it promotes profit-and-loss sharing arrangements.",
        examples: "Avoiding bonds, traditional banking interest, and companies with high interest-based debt."
      },
      {
        title: "Avoidance of Gharar (Excessive Uncertainty)",
        description: "Transactions should have transparency and certainty in their terms. Excessive risk or uncertainty is prohibited.",
        examples: "Avoiding derivatives, futures contracts without underlying assets, and speculative investments."
      },
      {
        title: "Prohibition of Maysir (Gambling)",
        description: "Gambling and games of chance are prohibited as they involve unearned wealth transfer and promote risk-taking behavior.",
        examples: "Avoiding casino stocks, lottery companies, and highly speculative investments."
      },
      {
        title: "Ethical Business Activities",
        description: "Investments must avoid businesses involved in prohibited goods or services.",
        examples: "Avoiding alcohol, tobacco, pork-related products, conventional financial services, weapons, and adult entertainment."
      }
    ],
    screeningMethodology: [
      {
        title: "Business Activity Screening",
        description: "Companies are screened based on their primary business activities to ensure they don't engage in prohibited industries.",
        threshold: "Most standards require that revenue from prohibited activities be less than 5% of total revenue."
      },
      {
        title: "Financial Ratio Screening",
        description: "Companies are evaluated based on their debt levels, interest income, and liquidity to ensure compliance with Shariah principles.",
        ratios: [
          "Debt to Total Assets < 33%",
          "Interest Income to Total Revenue < 5%",
          "Illiquid Assets to Total Assets > 51%",
          "Non-Permissible Income < 5% of Total Revenue"
        ]
      },
      {
        title: "Purification Process",
        description: "For companies with minor non-compliant income, investors must 'purify' their returns by donating the portion of dividends that came from non-compliant sources.",
        calculation: "Purification Amount = (Non-Compliant Revenue ÷ Total Revenue) × Dividend Amount"
      }
    ],
    investmentStrategies: [
      {
        title: "Diversification Within Compliance",
        description: "Building a diversified portfolio while staying within Shariah-compliant options across different sectors and regions.",
        tip: "Focus on technology, healthcare, consumer goods, and real estate sectors which often have higher compliance rates."
      },
      {
        title: "Regular Compliance Monitoring",
        description: "Companies can move in and out of compliance as their financial situations change. Regular monitoring is essential.",
        frequency: "Quarterly review recommended, especially after earnings reports and major corporate events."
      },
      {
        title: "Sukuk (Islamic Bonds) for Fixed Income",
        description: "Instead of conventional bonds, Sukuk certificates represent ownership in tangible assets, projects, or services.",
        advantage: "Provides stable returns similar to bonds but structured to comply with Islamic principles."
      },
      {
        title: "Value Investing Approach",
        description: "Focus on intrinsic value and long-term investment, which aligns well with Islamic principles of avoiding speculation.",
        methodology: "Analyze fundamentals, competitive advantages, and fair valuation rather than short-term price movements."
      }
    ]
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-lavender text-lavender hover:bg-lavender/10">
            Learn More
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] bg-background/95 backdrop-blur-md border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-lavender" />
              {stockSymbol ? `AI Insights: ${stockName} (${stockSymbol})` : 'Islamic Investment Intelligence'}
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis and educational content about Islamic finance principles
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="shariah">Shariah Analysis</TabsTrigger>
              <TabsTrigger value="education">Educational Content</TabsTrigger>
              <TabsTrigger value="strategy">Investment Strategy</TabsTrigger>
            </TabsList>
            
            {/* Shariah Analysis Tab */}
            <TabsContent value="shariah" className="space-y-4">
              <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isCompliant ? 
                      <Check className="h-5 w-5 text-green-400" /> : 
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    }
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{insights.summary}</p>
                  
                  {stockSymbol && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-lavender">Compliance Strengths</h4>
                        <ul className="space-y-2">
                          {insights.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-lavender">Considerations</h4>
                        <ul className="space-y-2">
                          {insights.considerations.map((consideration, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-400 mt-1 flex-shrink-0" />
                              <span>{consideration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {stockSymbol && (
                    <div className="mt-8">
                      <h4 className="font-medium text-lavender mb-4">Financial Ratio Analysis</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Debt Ratio</span>
                              <span className={`text-sm ${financialRatios.debtRatio < 33 ? 'text-green-400' : 'text-red-400'}`}>
                                {financialRatios.debtRatio.toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${financialRatios.debtRatio < 33 ? 'bg-green-400' : 'bg-red-400'}`} 
                                style={{width: `${Math.min(financialRatios.debtRatio * 3, 100)}%`}}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-white/60">0%</span>
                              <span className="text-xs text-white/60">Threshold: 33%</span>
                              <span className="text-xs text-white/60">100%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Interest Income</span>
                              <span className={`text-sm ${financialRatios.interestIncome < 5 ? 'text-green-400' : 'text-red-400'}`}>
                                {financialRatios.interestIncome.toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${financialRatios.interestIncome < 5 ? 'bg-green-400' : 'bg-red-400'}`} 
                                style={{width: `${Math.min(financialRatios.interestIncome * 20, 100)}%`}}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-white/60">0%</span>
                              <span className="text-xs text-white/60">Threshold: 5%</span>
                              <span className="text-xs text-white/60">25%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Illiquid Assets</span>
                              <span className={`text-sm ${financialRatios.illiquidAssets > 51 ? 'text-green-400' : 'text-red-400'}`}>
                                {financialRatios.illiquidAssets.toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${financialRatios.illiquidAssets > 51 ? 'bg-green-400' : 'bg-red-400'}`} 
                                style={{width: `${Math.min(financialRatios.illiquidAssets, 100)}%`}}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-white/60">0%</span>
                              <span className="text-xs text-white/60">Threshold: 51%</span>
                              <span className="text-xs text-white/60">100%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Non-Permissible Revenue</span>
                              <span className={`text-sm ${financialRatios.haramRevenue < 5 ? 'text-green-400' : 'text-red-400'}`}>
                                {financialRatios.haramRevenue.toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${financialRatios.haramRevenue < 5 ? 'bg-green-400' : 'bg-red-400'}`} 
                                style={{width: `${Math.min(financialRatios.haramRevenue * 20, 100)}%`}}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-white/60">0%</span>
                              <span className="text-xs text-white/60">Threshold: 5%</span>
                              <span className="text-xs text-white/60">25%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Educational Content Tab */}
            <TabsContent value="education" className="space-y-4">
              <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-lavender" />
                    Shariah Investment Principles
                  </CardTitle>
                  <CardDescription>
                    Core principles that guide Islamic finance and investment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {educationalContent.shariahPrinciples.map((principle, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-lavender">{principle.title}</h4>
                        <p>{principle.description}</p>
                        <div className="text-sm text-white/60">
                          <strong>Examples:</strong> {principle.examples}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-lavender" />
                    Shariah Screening Methodology
                  </CardTitle>
                  <CardDescription>
                    How stocks are evaluated for Shariah compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {educationalContent.screeningMethodology.map((method, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-lavender">{method.title}</h4>
                        <p>{method.description}</p>
                        
                        {method.threshold && (
                          <div className="text-sm text-white/60">
                            <strong>Threshold:</strong> {method.threshold}
                          </div>
                        )}
                        
                        {method.ratios && (
                          <div className="mt-2">
                            <strong className="text-sm">Key Ratios:</strong>
                            <ul className="mt-1 space-y-1">
                              {method.ratios.map((ratio, idx) => (
                                <li key={idx} className="text-sm flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-lavender"></div>
                                  {ratio}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {method.calculation && (
                          <div className="text-sm text-white/60">
                            <strong>Calculation:</strong> {method.calculation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Investment Strategy Tab */}
            <TabsContent value="strategy" className="space-y-4">
              <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-lavender" />
                    Islamic Investment Strategies
                  </CardTitle>
                  <CardDescription>
                    Practical approaches to building a Shariah-compliant portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {educationalContent.investmentStrategies.map((strategy, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-lavender">{strategy.title}</h4>
                        <p>{strategy.description}</p>
                        
                        {strategy.tip && (
                          <div className="text-sm text-white/60">
                            <strong>Tip:</strong> {strategy.tip}
                          </div>
                        )}
                        
                        {strategy.frequency && (
                          <div className="text-sm text-white/60">
                            <strong>Recommended Frequency:</strong> {strategy.frequency}
                          </div>
                        )}
                        
                        {strategy.advantage && (
                          <div className="text-sm text-white/60">
                            <strong>Advantage:</strong> {strategy.advantage}
                          </div>
                        )}
                        
                        {strategy.methodology && (
                          <div className="text-sm text-white/60">
                            <strong>Methodology:</strong> {strategy.methodology}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {stockSymbol && (
                <Card className="bg-secondary/30 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-lavender" />
                      AI-Powered Investment Recommendations
                    </CardTitle>
                    <CardDescription>
                      Personalized suggestions for {stockName} ({stockSymbol})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-lavender mb-2">Investment Horizon</h4>
                        <p>
                          {isCompliant 
                            ? `Based on the strong Shariah compliance and financial metrics, ${stockSymbol} appears suitable for a long-term investment horizon (3+ years). The company's stable financial ratios indicate good management of debt and interest exposure.`
                            : `Due to Shariah compliance concerns, ${stockSymbol} is not recommended for Islamic investors without significant purification. If considering for conventional portfolios, a medium-term horizon with close monitoring of debt levels would be prudent.`
                          }
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-lavender mb-2">Portfolio Allocation</h4>
                        <p>
                          {isCompliant
                            ? `For Shariah-compliant portfolios, ${stockSymbol} could represent a core holding with an allocation of 2-5% depending on your risk tolerance and overall portfolio size. Consider balancing with other compliant stocks across different sectors.`
                            : `For Shariah-compliant portfolios, ${stockSymbol} should be avoided. For conventional portfolios, limit exposure to no more than 1-2% of total portfolio value due to the identified financial concerns.`
                          }
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-lavender mb-2">Risk Management</h4>
                        <p>
                          {isCompliant
                            ? `Set a stop-loss at 15-20% below purchase price to manage downside risk. Review compliance status quarterly, especially after earnings reports, as financial ratios may change.`
                            : `If investing despite compliance concerns, implement a strict stop-loss at 10-15% below purchase price and review financial ratios monthly for any improvements in debt levels or interest exposure.`
                          }
                        </p>
                      </div>
                      
                      <div className="mt-4 p-3 bg-lavender/10 rounded-md">
                        <p className="text-sm italic">
                          <strong>Disclaimer:</strong> These recommendations are generated by AI based on available data and Islamic finance principles. Always consult with a qualified financial advisor and Islamic scholar before making investment decisions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvestmentInsights;
