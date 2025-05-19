import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, TrendingDown, BarChart2, Shield, RefreshCw, Settings, Calendar, Target, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useCopilot } from "@/contexts/CopilotContext";
import CopilotSettingsDialog from "./CopilotSettingsDialog";

interface CopilotInsight {
  id: string;
  type: 'alert' | 'opportunity' | 'rebalance' | 'compliance' | 'goal';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  urgency: 'high' | 'medium' | 'low';
  timestamp: Date;
  actionText?: string;
  actionHandler?: () => void;
}

interface InvestmentCopilotProps {
  holdings: any[];
  marketTrends?: any[];
}

const InvestmentCopilot: React.FC<InvestmentCopilotProps> = ({ 
  holdings, 
  marketTrends = []
}) => {
  const { user } = useAuth();
  const { balance } = useWallet();
  const { userPreferences, recordFeedback, learningData, recordRecommendationAction } = useCopilot();
  const [insights, setInsights] = useState<CopilotInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userFeedback, setUserFeedback] = useState<Record<string, boolean>>({});
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'goals' | 'zakat' | 'rebalance'>('insights');
  
  // Generate insights based on portfolio, market trends, and user preferences
  useEffect(() => {
    // Initial load of insights when component mounts
    setIsLoading(true);
    
    // Simulate AI analysis delay
    const timer = setTimeout(() => {
      const generatedInsights = generateAIInsights();
      setInsights(generatedInsights);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once on mount
  
  // This function simulates AI-generated insights
  // In a real implementation, this would call an API endpoint
  const generateAIInsights = (): CopilotInsight[] => {
    const currentDate = new Date();
    
    // Sample insights based on portfolio composition
    const portfolioInsights: CopilotInsight[] = [];
    
    // Always add at least one insight for new users or empty portfolios
    if (!holdings.length) {
      portfolioInsights.push({
        id: 'welcome-insight-' + Date.now(),
        type: 'opportunity',
        title: 'Welcome to Your Investment Copilot',
        description: 'Your AI Investment Copilot is ready to provide personalized Shariah-compliant guidance. Start by adding securities to your portfolio to receive tailored insights and recommendations.',
        impact: 'positive',
        urgency: 'low',
        timestamp: currentDate,
        actionText: 'Explore Investment Options',
        actionHandler: () => console.log('Navigate to stocks page')
      });
      
      // Add a second insight about Shariah compliance
      portfolioInsights.push({
        id: 'shariah-education-' + Date.now(),
        type: 'compliance',
        title: 'Understanding Shariah Compliance',
        description: 'Islamic investing follows key principles: avoiding interest (riba), excessive uncertainty (gharar), and prohibited industries. Your copilot ensures all recommendations adhere to these guidelines.',
        impact: 'positive',
        urgency: 'low',
        timestamp: currentDate,
        actionText: 'Learn More About Islamic Finance',
        actionHandler: () => console.log('Show Islamic finance education')
      });
      
      return portfolioInsights;
    }
    
    // Portfolio analysis for users with holdings
    
    const techStocks = holdings.filter(stock => 
      ['AAPL', 'MSFT', 'GOOGL'].includes(stock.symbol)
    );
    
    const techValue = techStocks.reduce((sum, stock) => sum + stock.value, 0);
    const totalValue = holdings.reduce((sum, stock) => sum + stock.value, 0);
    const techPercentage = (techValue / totalValue) * 100;
    
    if (techPercentage > 60) {
      portfolioInsights.push({
        id: 'diversify-tech-' + Date.now(),
        type: 'rebalance',
        title: 'Technology Sector Overweight',
        description: `Your portfolio has ${techPercentage.toFixed(1)}% in technology stocks, which exceeds recommended diversification guidelines. Consider rebalancing to reduce concentration risk while maintaining Shariah compliance.`,
        impact: 'negative',
        urgency: 'medium',
        timestamp: currentDate,
        actionText: 'View Rebalance Plan',
        actionHandler: () => console.log('Show rebalance plan')
      });
    }
    
    // Cash allocation insight removed as requested
    
    // Add insight about a specific holding if applicable
    const appleHolding = holdings.find(stock => stock.symbol === 'AAPL');
    if (appleHolding && appleHolding.profitLoss < 0) {
      portfolioInsights.push({
        id: 'apple-analysis-' + Date.now(),
        type: 'alert',
        title: 'Apple Inc. Performance Alert',
        description: `Your Apple Inc. position is down ${Math.abs(appleHolding.profitLossPercentage).toFixed(1)}%. Recent analysis suggests potential growth in the coming quarter due to new product launches. Consider holding your position if it aligns with your investment strategy.`,
        impact: 'neutral',
        urgency: 'medium',
        timestamp: currentDate,
        actionText: 'View Detailed Analysis',
        actionHandler: () => console.log('Show Apple analysis')
      });
    }
    
    // Add Shariah compliance insight
    const potentialNonCompliantHolding = holdings.find(stock => ['MSFT', 'GOOGL'].includes(stock.symbol));
    if (potentialNonCompliantHolding) {
      portfolioInsights.push({
        id: 'compliance-check-' + Date.now(),
        type: 'compliance',
        title: 'Shariah Compliance Update',
        description: `${potentialNonCompliantHolding.name} has recently increased its cash reserves, which may generate interest income. While still compliant, you may need to purify a small portion (approximately 0.02%) of dividends or capital gains.`,
        impact: 'neutral',
        urgency: 'low',
        timestamp: currentDate,
        actionText: 'View Purification Calculator',
        actionHandler: () => setActiveTab('zakat')
      });
    }
    
    // Add a market trend insight
    portfolioInsights.push({
      id: 'market-trend-' + Date.now(),
      type: 'opportunity',
      title: 'Shariah-Compliant ETF Opportunity',
      description: 'Islamic ETFs have shown strong performance in the current market environment. Consider adding exposure to diversified Shariah-compliant ETFs like SPUS or HLAL to enhance portfolio stability.',
      impact: 'positive',
      urgency: 'low',
      timestamp: currentDate,
      actionText: 'Explore Islamic ETFs',
      actionHandler: () => console.log('Navigate to Islamic ETFs')
    });
    
    return portfolioInsights;
  };
  
  // Handle user feedback on insights
  const handleFeedback = (insightId: string, insightType: string, isHelpful: boolean) => {
    // Record feedback in state
    setUserFeedback(prev => ({
      ...prev,
      [insightId]: isHelpful
    }));
    
    // Record feedback in context for learning
    recordFeedback({
      insightId,
      insightType,
      wasHelpful: isHelpful
    });
    
    // Show toast or feedback message
    console.log(`Feedback recorded: ${insightType} insight was ${isHelpful ? 'helpful' : 'not helpful'}`);
  };
  
  // Helper function to get the appropriate icon for each insight type
  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'alert': return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'rebalance': return <RefreshCw className="h-5 w-5 text-yellow-400" />;
      case 'compliance': return <Shield className="h-5 w-5 text-lavender" />;
      case 'goal': return <Target className="h-5 w-5 text-blue-400" />;
      default: return <BarChart2 className="h-5 w-5" />;
    }
  };
  
  // Helper function to get the appropriate badge color based on urgency
  const getInsightBadgeColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-white/20 text-white';
    }
  };
  
  return (
    <Card className="bg-secondary/30 border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>AI Investment Copilot</CardTitle>
            <CardDescription>Personalized Shariah-compliant investment guidance</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={() => setSettingsDialogOpen(true)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'insights' | 'goals' | 'zakat' | 'rebalance')} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="insights">
              <Shield className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="goals">
              <Target className="h-4 w-4 mr-2" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="rebalance">
              <RefreshCw className="h-4 w-4 mr-2" />
              Rebalance
            </TabsTrigger>
            <TabsTrigger value="zakat">
              <Calendar className="h-4 w-4 mr-2" />
              Zakat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-lavender/20 rounded-full mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-32"></div>
                </div>
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map(insight => (
                  <div key={insight.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        {getInsightIcon(insight.type)}
                        <span className="font-medium ml-2">{insight.title}</span>
                      </div>
                      <Badge className={getInsightBadgeColor(insight.urgency)}>
                        {insight.urgency.charAt(0).toUpperCase() + insight.urgency.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-white/70 mb-3">{insight.description}</p>
                    
                    <div className="flex justify-between items-center">
                      {insight.actionText && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            if (insight.actionHandler) {
                              insight.actionHandler();
                              // Record this action for learning
                              recordRecommendationAction(insight.type, true);
                            }
                          }}
                        >
                          {insight.actionText}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                      
                      <div className="flex space-x-2 ml-auto">
                        {userFeedback[insight.id] === undefined && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs hover:text-green-400 hover:bg-green-400/10"
                              onClick={() => handleFeedback(insight.id, insight.type, true)}
                            >
                              Helpful
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs hover:text-red-400 hover:bg-red-400/10"
                              onClick={() => handleFeedback(insight.id, insight.type, false)}
                            >
                              Not Helpful
                            </Button>
                          </>
                        )}
                        
                        {userFeedback[insight.id] !== undefined && (
                          <span className="text-xs text-white/40">
                            Thank you for your feedback
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No insights available at this time.</p>
                <p className="text-sm mt-2">Add more holdings to receive personalized recommendations.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="goals" className="mt-0">
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-medium mb-2">Hajj Savings Goal</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Target Amount:</span>
                    <span className="font-medium">$15,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Current Savings:</span>
                    <span className="font-medium">$3,750.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Timeline:</span>
                    <span>2027 (2 years remaining)</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>25% Complete</span>
                      <span>$3,750 / $15,000</span>
                    </div>
                    <Progress value={25} className="h-2 [&>div]:bg-lavender" />
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white/5 rounded-md">
                  <h3 className="font-medium mb-2">AI Recommendation</h3>
                  <p className="text-sm text-white/70 mb-3">
                    To reach your Hajj savings goal by 2027, consider increasing your monthly contribution by $75 or reallocating 5% from your technology sector to the SPUS ETF which has shown more consistent growth with lower volatility.
                  </p>
                  <Button variant="outline" size="sm">
                    View Detailed Plan
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="zakat" className="mt-0">
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-medium mb-2">Zakat Calculation</h3>
                <p className="text-sm text-white/70 mb-3">
                  Based on your current holdings and the lunar calendar, your estimated Zakat obligation is calculated below. This uses the standard 2.5% rate on eligible assets held for a full lunar year.
                </p>
                
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Zakatable Assets:</span>
                    <span className="font-medium">$4,630.40</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Zakat Rate:</span>
                    <span>2.5%</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-2 border-t border-white/10">
                    <span>Estimated Zakat Due:</span>
                    <span className="text-lavender">$115.76</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Next Zakat Due Date:</span>
                    <span>Ramadan 15, 1447 (March 5, 2026)</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Detailed Calculation
                  </Button>
                  <Button variant="outline" size="sm">
                    Set Reminder
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-medium mb-2">Purification Calculator</h3>
                <p className="text-sm text-white/70 mb-3">
                  Some of your investments may generate small amounts of impermissible income that needs to be purified by donating it to charity.
                </p>
                
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Impure Income (YTD):</span>
                    <span className="font-medium">$23.15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Source:</span>
                    <span>AAPL (0.2% interest income)</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="mt-4">
                  Donate for Purification
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rebalance" className="mt-0">
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Portfolio Rebalance Analysis</h3>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
                
                <p className="text-sm text-white/70 mb-4">
                  Based on your risk profile, investment goals, and Shariah compliance requirements, the following rebalancing is recommended to optimize your portfolio.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Current Allocation</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded bg-white/5">
                        <div className="text-xs text-white/60 mb-1">Sector Allocation</div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Technology</span>
                              <span>42%</span>
                            </div>
                            <Progress value={42} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Healthcare</span>
                              <span>18%</span>
                            </div>
                            <Progress value={18} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Consumer Goods</span>
                              <span>15%</span>
                            </div>
                            <Progress value={15} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Islamic ETFs</span>
                              <span>25%</span>
                            </div>
                            <Progress value={25} className="h-1" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded bg-white/5">
                        <div className="text-xs text-white/60 mb-1">Risk Profile</div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Volatility</span>
                              <span>High</span>
                            </div>
                            <Progress value={75} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Shariah Compliance</span>
                              <span>98%</span>
                            </div>
                            <Progress value={98} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Diversification</span>
                              <span>Medium</span>
                            </div>
                            <Progress value={50} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Goal Alignment</span>
                              <span>Medium</span>
                            </div>
                            <Progress value={60} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-white/10">
                    <h4 className="text-sm font-medium mb-2">Recommended Changes</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
                          <div>
                            <div className="text-sm">Reduce AAPL</div>
                            <div className="text-xs text-white/60">Current: 15% → Target: 10%</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-red-400">-5%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
                          <div>
                            <div className="text-sm">Reduce MSFT</div>
                            <div className="text-xs text-white/60">Current: 12% → Target: 8%</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-red-400">-4%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                          <div>
                            <div className="text-sm">Increase SPUS (S&P 500 Shariah ETF)</div>
                            <div className="text-xs text-white/60">Current: 10% → Target: 15%</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-400">+5%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                          <div>
                            <div className="text-sm">Add HLAL (Wahed FTSE USA Shariah ETF)</div>
                            <div className="text-xs text-white/60">Current: 0% → Target: 4%</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-400">+4%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 rounded bg-lavender/10 border border-lavender/20">
                  <h4 className="text-sm font-medium flex items-center mb-2">
                    <Shield className="h-4 w-4 mr-2 text-lavender" />
                    Shariah Compliance Impact
                  </h4>
                  <p className="text-xs text-white/70">
                    This rebalance will increase your portfolio's overall Shariah compliance score from 98% to 99.5% by reducing exposure to companies with higher debt ratios and increasing allocation to fully Shariah-compliant ETFs.
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button>
                    View Rebalance Plan
                  </Button>
                  <Button variant="outline">
                    Execute Rebalance
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-medium mb-2">Rebalance History</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <div>
                      <div className="text-sm">Quarterly Rebalance</div>
                      <div className="text-xs text-white/60">March 15, 2025</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      View Details
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <div>
                      <div className="text-sm">Special Rebalance (Market Correction)</div>
                      <div className="text-xs text-white/60">January 22, 2025</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      View Details
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <div className="text-sm">Initial Portfolio Setup</div>
                      <div className="text-xs text-white/60">December 10, 2024</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t border-white/10 pt-4">
        <div className="w-full text-center text-sm text-white/60">
          Your AI Investment Copilot learns from your feedback to provide better recommendations
        </div>
      </CardFooter>
      
      {/* Settings Dialog */}
      <CopilotSettingsDialog 
        open={settingsDialogOpen} 
        onOpenChange={setSettingsDialogOpen} 
      />
    </Card>
  );
};

export default InvestmentCopilot;