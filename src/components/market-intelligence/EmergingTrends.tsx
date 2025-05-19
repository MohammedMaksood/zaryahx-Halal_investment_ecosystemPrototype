import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Globe, ArrowUpRight, ArrowRight } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

interface EmergingTrendsProps {
  isLoading: boolean;
  userPreferences?: {
    sectors?: string[];
    regions?: string[];
    riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  };
}

interface TrendItem {
  id: string;
  category: string;
  title: string;
  description: string;
  momentum: number; // 0-100
  confidence: number; // 0-100
  regions: string[];
  timeframe: string;
  sources: string[];
}

const EmergingTrends: React.FC<EmergingTrendsProps> = ({ isLoading, userPreferences }) => {
  // Simulated emerging trends data
  const trendData: TrendItem[] = [
    {
      id: 'trend-1',
      category: 'Food & Beverage',
      title: 'Plant-Based Halal Alternatives',
      description: 'Rising demand for plant-based alternatives to meat products that are certified halal, particularly in Western markets and among younger Muslim consumers.',
      momentum: 87,
      confidence: 92,
      regions: ['North America', 'Europe', 'Southeast Asia'],
      timeframe: '3-6 months',
      sources: ['Consumer sentiment analysis', 'Product launch data', 'Social media trends']
    },
    {
      id: 'trend-2',
      category: 'Finance',
      title: 'Tokenized Sukuk Offerings',
      description: 'Blockchain-based tokenization of Sukuk (Islamic bonds) is gaining traction, allowing for fractional ownership and improved liquidity while maintaining Shariah compliance.',
      momentum: 76,
      confidence: 85,
      regions: ['GCC', 'Malaysia', 'UK'],
      timeframe: '6-9 months',
      sources: ['Financial innovation reports', 'Regulatory filings', 'Industry conferences']
    },
    {
      id: 'trend-3',
      category: 'Technology',
      title: 'AI-Powered Shariah Screening Tools',
      description: 'Advanced AI systems for real-time Shariah screening of investments and financial products, using NLP to analyze company activities beyond traditional ratio screening.',
      momentum: 92,
      confidence: 88,
      regions: ['Global'],
      timeframe: '0-3 months',
      sources: ['FinTech investment data', 'Patent filings', 'Expert interviews']
    },
    {
      id: 'trend-4',
      category: 'Retail',
      title: 'Modest Fashion E-Commerce Platforms',
      description: 'Specialized e-commerce platforms focusing exclusively on modest fashion are seeing rapid growth, with integrated AR/VR try-on features.',
      momentum: 83,
      confidence: 90,
      regions: ['Middle East', 'Southeast Asia', 'Europe'],
      timeframe: '3-6 months',
      sources: ['Retail analytics', 'Venture funding data', 'Social media engagement']
    },
    {
      id: 'trend-5',
      category: 'Travel',
      title: 'Halal Travel Experience Apps',
      description: 'Mobile applications that curate comprehensive halal travel experiences, including prayer times, qibla direction, halal food locators, and Muslim-friendly accommodations.',
      momentum: 79,
      confidence: 86,
      regions: ['Southeast Asia', 'Europe', 'GCC'],
      timeframe: '3-6 months',
      sources: ['App download analytics', 'Tourism industry reports', 'User review analysis']
    }
  ];

  // Filter trends based on user preferences if available
  const filteredTrends = userPreferences?.sectors?.length
    ? trendData.filter(trend => 
        userPreferences.sectors?.some(sector => trend.category.includes(sector)) ||
        userPreferences.regions?.some(region => trend.regions.includes(region))
      )
    : trendData;

  const getMomentumColor = (momentum: number): string => {
    if (momentum >= 80) return 'text-green-400';
    if (momentum >= 60) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const getProgressColor = (momentum: number): string => {
    if (momentum >= 80) return '[&>div]:bg-green-500';
    if (momentum >= 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-blue-500';
  };

  if (isLoading) {
    return <LoadingAnimation text="Analyzing global halal market trends..." type="analysis" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-secondary/30 border-white/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-lavender" />
              Emerging Halal Market Trends
            </h3>
            
            <div className="space-y-5">
              {filteredTrends.map((trend) => (
                <div key={trend.id} className="pb-4 border-b border-white/10 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="outline" className="mb-2 bg-lavender/10 text-lavender-light">
                        {trend.category}
                      </Badge>
                      <h4 className="font-medium">{trend.title}</h4>
                    </div>
                    <Badge className={`${getMomentumColor(trend.momentum)} bg-background`}>
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {trend.momentum}% Momentum
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-3">{trend.description}</p>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Trend Momentum</span>
                      <span className={getMomentumColor(trend.momentum)}>{trend.momentum}%</span>
                    </div>
                    <Progress value={trend.momentum} className={`h-1.5 ${getProgressColor(trend.momentum)}`} />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {trend.regions.map((region) => (
                      <Badge key={region} variant="outline" className="bg-background/50">
                        <Globe className="h-3 w-3 mr-1" />
                        {region}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="bg-background/50">
                      {trend.timeframe}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/30 border-white/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">
              Consumer Behavior Shifts
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/40 border border-white/10">
                <h4 className="font-medium mb-2 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-2 text-green-400" />
                  Ethical Sourcing Demand
                </h4>
                <p className="text-sm text-white/70 mb-2">
                  92% increase in consumer searches for ethically-sourced halal products in the last quarter, with emphasis on fair trade and sustainable practices.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400">
                    High Impact
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    Global Trend
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-background/40 border border-white/10">
                <h4 className="font-medium mb-2 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-2 text-yellow-400" />
                  Mobile-First Halal Verification
                </h4>
                <p className="text-sm text-white/70 mb-2">
                  78% of Muslim consumers now check halal certification via mobile apps before purchasing, driving demand for QR-based verification systems.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                    Medium Impact
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    Urban Markets
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-background/40 border border-white/10">
                <h4 className="font-medium mb-2 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-2 text-green-400" />
                  Halal Subscription Services
                </h4>
                <p className="text-sm text-white/70 mb-2">
                  Subscription-based halal meal kits and personal care products growing at 64% YoY, particularly among millennial Muslim consumers in Western markets.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400">
                    High Impact
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    North America & Europe
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-secondary/30 border-white/10">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">
            Trend Analysis Methodology
          </h3>
          <p className="text-sm text-white/70 mb-4">
            Our AI system analyzes over 50,000 data points daily from news sources, social media, financial reports, and consumer behavior to identify emerging trends in the halal economy before they become mainstream. Trends are scored based on momentum (rate of growth), confidence (reliability of data), and potential market impact.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Data Sources</h4>
              <ul className="space-y-1 text-white/70">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Financial news & reports
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Social media sentiment
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Consumer purchase patterns
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Industry conference topics
                </li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Analysis Methods</h4>
              <ul className="space-y-1 text-white/70">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Natural language processing
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Time series forecasting
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Sentiment analysis
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Pattern recognition
                </li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Confidence Scoring</h4>
              <ul className="space-y-1 text-white/70">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Data volume assessment
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Source credibility weighting
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Cross-validation checks
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-lavender" />
                  Historical accuracy rating
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergingTrends;
