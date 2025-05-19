import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Bell, Calendar, TrendingUp, AlertCircle, ExternalLink, Filter, Briefcase } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

interface InvestmentAlertsProps {
  isLoading: boolean;
  userPreferences?: {
    sectors?: string[];
    regions?: string[];
    riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  };
  userPortfolio?: any[];
}

interface InvestmentOpportunity {
  id: string;
  type: 'ipo' | 'startup' | 'merger' | 'fund' | 'sukuk';
  name: string;
  description: string;
  sector: string;
  region: string;
  timeframe: string;
  shariahCompliance: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high';
  potentialReturn: 'low' | 'moderate' | 'high';
  highlights: string[];
  risks: string[];
  relatedStocks?: string[];
}

const InvestmentAlerts: React.FC<InvestmentAlertsProps> = ({ 
  isLoading, 
  userPreferences,
  userPortfolio = []
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);

  // Sample investment opportunities data
  const investmentOpportunities: InvestmentOpportunity[] = [
    {
      id: 'opp-1',
      type: 'ipo',
      name: 'NouriFoods Global',
      description: 'Leading halal food producer preparing for IPO on NASDAQ. The company specializes in plant-based halal alternatives and ready-to-eat meals distributed across North America, Europe, and the Middle East.',
      sector: 'Food & Beverage',
      region: 'North America',
      timeframe: 'Expected within 3 months',
      shariahCompliance: 92,
      riskLevel: 'moderate',
      potentialReturn: 'high',
      highlights: [
        '35% annual revenue growth over the past 3 years',
        'Strong presence in 27 countries with halal-certified supply chain',
        'Innovative product portfolio with 120+ SKUs',
        'Debt-to-asset ratio of only 12%, well below Shariah thresholds'
      ],
      risks: [
        'Competitive market with increasing conventional food company entry',
        'Potential supply chain disruptions affecting global distribution',
        'Regulatory variations across different markets'
      ],
      relatedStocks: ['NESTLE', 'TYSON', 'BYND']
    },
    {
      id: 'opp-2',
      type: 'startup',
      name: 'Sukuk Chain',
      description: 'Fintech startup revolutionizing Sukuk issuance and trading through blockchain technology. Their platform enables fractional ownership and improved liquidity while maintaining strict Shariah compliance.',
      sector: 'Islamic Fintech',
      region: 'GCC',
      timeframe: 'Series B funding round closing in 2 months',
      shariahCompliance: 97,
      riskLevel: 'high',
      potentialReturn: 'high',
      highlights: [
        'First mover in blockchain-based Sukuk marketplace',
        'Already facilitated $75M in Sukuk issuances',
        'Strong partnerships with 5 Islamic banks',
        'Fully Shariah-compliant business model verified by leading scholars'
      ],
      risks: [
        'Regulatory uncertainty in some jurisdictions',
        'Emerging technology adoption risks',
        'Competition from conventional blockchain finance platforms'
      ]
    },
    {
      id: 'opp-3',
      type: 'merger',
      name: 'Takaful United & Islamic Insurance Group',
      description: 'Proposed merger between two leading Islamic insurance providers to create the largest Takaful entity globally. The merger is expected to generate significant synergies and expand market reach.',
      sector: 'Islamic Insurance',
      region: 'Southeast Asia',
      timeframe: 'Merger announcement expected within 1 month',
      shariahCompliance: 95,
      riskLevel: 'moderate',
      potentialReturn: 'moderate',
      highlights: [
        'Combined entity would manage over $12B in Shariah-compliant assets',
        'Expected cost synergies of $120M annually',
        'Expanded product offerings across personal and commercial lines',
        'Strong regulatory approval prospects'
      ],
      risks: [
        'Integration challenges between different corporate cultures',
        'Potential regulatory hurdles in certain markets',
        'Short-term disruption to operations during transition'
      ],
      relatedStocks: ['TKFL', 'ISLM']
    },
    {
      id: 'opp-4',
      type: 'fund',
      name: 'Ethical Tech Growth Fund',
      description: 'New Shariah-compliant venture capital fund focusing on ethical technology startups. The fund targets early-stage companies in AI, healthcare tech, edtech, and sustainable technologies.',
      sector: 'Technology',
      region: 'Global',
      timeframe: 'Accepting limited partners now, closing in 45 days',
      shariahCompliance: 90,
      riskLevel: 'high',
      potentialReturn: 'high',
      highlights: [
        'Led by experienced team with 3 previous successful funds',
        'Strict ethical and Shariah screening methodology',
        'Focus on high-growth technology sectors',
        'Minimum investment of $100,000 with 7-year fund lifecycle'
      ],
      risks: [
        'Early-stage investment inherent risks',
        'Technology sector volatility',
        'Longer time horizon for returns'
      ]
    },
    {
      id: 'opp-5',
      type: 'sukuk',
      name: 'Green Sukuk - Renewable Energy',
      description: 'Upcoming green Sukuk issuance to fund solar and wind energy projects across the GCC and North Africa. The Sukuk uses an innovative Ijara structure with tangible asset backing.',
      sector: 'Renewable Energy',
      region: 'Middle East & North Africa',
      timeframe: 'Issuance in 2 months, 5-year term',
      shariahCompliance: 98,
      riskLevel: 'low',
      potentialReturn: 'moderate',
      highlights: [
        'Expected 4.5% annual return, paid semi-annually',
        'Fully asset-backed by renewable energy infrastructure',
        'Strong government backing and regulatory support',
        'Environmental and social impact alongside financial returns'
      ],
      risks: [
        'Project completion risks for new installations',
        'Regulatory changes in renewable energy policies',
        'Limited secondary market liquidity'
      ]
    },
    {
      id: 'opp-6',
      type: 'startup',
      name: 'Modest Moda',
      description: 'E-commerce platform specializing in modest fashion with innovative AR try-on technology. The company partners with both established and emerging modest fashion designers.',
      sector: 'Modest Fashion',
      region: 'Europe',
      timeframe: 'Series A funding round, closing in 1 month',
      shariahCompliance: 94,
      riskLevel: 'high',
      potentialReturn: 'high',
      highlights: [
        '250% year-over-year growth in active users',
        'Proprietary AR technology for virtual try-on',
        'Partnerships with 150+ modest fashion brands',
        'Zero-interest business model with revenue from commissions'
      ],
      risks: [
        'Competitive e-commerce landscape',
        'Technology implementation challenges',
        'Fashion industry cyclicality'
      ]
    }
  ];

  // Filter opportunities based on user preferences if available
  const filterOpportunities = (opportunities: InvestmentOpportunity[], filter: string) => {
    let filtered = opportunities;
    
    // Apply user preferences filter
    if (userPreferences?.sectors?.length || userPreferences?.regions?.length) {
      filtered = filtered.filter(opp => 
        (userPreferences.sectors?.some(sector => opp.sector.includes(sector)) ||
        userPreferences.regions?.some(region => opp.region.includes(region)))
      );
    }
    
    // Apply risk tolerance filter
    if (userPreferences?.riskTolerance) {
      filtered = filtered.filter(opp => {
        if (userPreferences.riskTolerance === 'conservative' && opp.riskLevel !== 'low') return false;
        if (userPreferences.riskTolerance === 'moderate' && opp.riskLevel === 'high') return false;
        return true;
      });
    }
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(opp => opp.type === filter);
    }
    
    return filtered;
  };

  const filteredOpportunities = filterOpportunities(investmentOpportunities, activeFilter);

  const getComplianceColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low':
        return 'bg-green-500/20 text-green-400';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-lavender/20 text-lavender';
    }
  };

  const getReturnColor = (returnLevel: string): string => {
    switch (returnLevel) {
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-lavender/20 text-lavender';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ipo':
        return <TrendingUp className="h-4 w-4" />;
      case 'startup':
        return <Sparkles className="h-4 w-4" />;
      case 'merger':
        return <Briefcase className="h-4 w-4" />;
      case 'fund':
        return <Briefcase className="h-4 w-4" />;
      case 'sukuk':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'ipo':
        return 'IPO';
      case 'startup':
        return 'Startup';
      case 'merger':
        return 'M&A';
      case 'fund':
        return 'Fund';
      case 'sukuk':
        return 'Sukuk';
      default:
        return type;
    }
  };

  if (isLoading) {
    return <LoadingAnimation text="Scanning for Shariah-compliant investment opportunities..." type="analysis" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-white/60" />
          <span className="text-sm text-white/60">Filter by type:</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Badge 
            onClick={() => setActiveFilter('all')} 
            className={`cursor-pointer ${activeFilter === 'all' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            All Opportunities
          </Badge>
          <Badge 
            onClick={() => setActiveFilter('ipo')} 
            className={`cursor-pointer ${activeFilter === 'ipo' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            IPOs
          </Badge>
          <Badge 
            onClick={() => setActiveFilter('startup')} 
            className={`cursor-pointer ${activeFilter === 'startup' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Startups
          </Badge>
          <Badge 
            onClick={() => setActiveFilter('merger')} 
            className={`cursor-pointer ${activeFilter === 'merger' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            M&A
          </Badge>
          <Badge 
            onClick={() => setActiveFilter('fund')} 
            className={`cursor-pointer ${activeFilter === 'fund' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Funds
          </Badge>
          <Badge 
            onClick={() => setActiveFilter('sukuk')} 
            className={`cursor-pointer ${activeFilter === 'sukuk' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Sukuk
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-secondary/30 border-white/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-lavender" />
              Investment Opportunity Alerts
            </h3>
            
            <div className="space-y-4">
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opportunity) => (
                  <div 
                    key={opportunity.id} 
                    className={`p-4 rounded-lg bg-background/40 border border-white/10 cursor-pointer hover:bg-background/60 transition-colors ${selectedOpportunity?.id === opportunity.id ? 'border-lavender/50' : ''}`}
                    onClick={() => setSelectedOpportunity(opportunity)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2 bg-lavender/10 text-lavender-light">
                          {getTypeIcon(opportunity.type)}
                          <span className="ml-1">{getTypeLabel(opportunity.type)}</span>
                        </Badge>
                        <h4 className="font-medium">{opportunity.name}</h4>
                      </div>
                      <Badge className={getComplianceColor(opportunity.shariahCompliance)}>
                        {opportunity.shariahCompliance}% Compliant
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-white/70 mb-3 line-clamp-2">{opportunity.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="bg-background/50">
                        {opportunity.sector}
                      </Badge>
                      <Badge variant="outline" className="bg-background/50">
                        {opportunity.region}
                      </Badge>
                      <Badge className={getRiskColor(opportunity.riskLevel)}>
                        {opportunity.riskLevel.charAt(0).toUpperCase() + opportunity.riskLevel.slice(1)} Risk
                      </Badge>
                      <Badge className={getReturnColor(opportunity.potentialReturn)}>
                        {opportunity.potentialReturn.charAt(0).toUpperCase() + opportunity.potentialReturn.slice(1)} Return
                      </Badge>
                    </div>
                    
                    <div className="mt-3 text-xs text-white/60">
                      {opportunity.timeframe}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-white/60">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No investment opportunities match your current filters</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveFilter('all')}>
                    View All Opportunities
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/30 border-white/10">
          <CardContent className="pt-6">
            {selectedOpportunity ? (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-2 bg-lavender/10 text-lavender-light">
                        {getTypeIcon(selectedOpportunity.type)}
                        <span className="ml-1">{getTypeLabel(selectedOpportunity.type)}</span>
                      </Badge>
                      <h3 className="text-lg font-medium">{selectedOpportunity.name}</h3>
                    </div>
                    <Badge className={getComplianceColor(selectedOpportunity.shariahCompliance)}>
                      {selectedOpportunity.shariahCompliance}% Shariah-Compliant
                    </Badge>
                  </div>
                  <p className="text-sm text-white/70 mt-2">{selectedOpportunity.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-background/50">
                    {selectedOpportunity.sector}
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    {selectedOpportunity.region}
                  </Badge>
                  <Badge className={getRiskColor(selectedOpportunity.riskLevel)}>
                    {selectedOpportunity.riskLevel.charAt(0).toUpperCase() + selectedOpportunity.riskLevel.slice(1)} Risk
                  </Badge>
                  <Badge className={getReturnColor(selectedOpportunity.potentialReturn)}>
                    {selectedOpportunity.potentialReturn.charAt(0).toUpperCase() + selectedOpportunity.potentialReturn.slice(1)} Return
                  </Badge>
                </div>
                
                <div className="p-3 bg-background/40 rounded-lg border border-white/10 mb-4">
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <p className="text-sm">{selectedOpportunity.timeframe}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-green-400" />
                      Key Highlights
                    </h4>
                    <div className="p-3 bg-background/40 rounded-lg border border-white/10">
                      <ul className="space-y-2 text-sm">
                        {selectedOpportunity.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                            </div>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                      Risk Factors
                    </h4>
                    <div className="p-3 bg-background/40 rounded-lg border border-white/10">
                      <ul className="space-y-2 text-sm">
                        {selectedOpportunity.risks.map((risk, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                            </div>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {selectedOpportunity.relatedStocks && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-3">Related Public Equities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.relatedStocks.map((stock, index) => (
                        <Badge key={index} variant="outline">
                          {stock}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button className="flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    Set Alert
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    More Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-white/60">
                <Bell className="h-16 w-16 mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">Select an Opportunity</h3>
                <p className="mb-4">Click on an investment opportunity from the list to view detailed information and analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-secondary/30 border-white/10">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">
            Investment Alert Methodology
          </h3>
          <p className="text-sm text-white/70 mb-4">
            Our AI system continuously monitors global markets, private equity flows, startup ecosystems, and financial news to identify promising Shariah-compliant investment opportunities before they become widely known. Each opportunity undergoes rigorous Shariah screening and risk assessment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Opportunity Sources</h4>
              <ul className="space-y-1 text-white/70">
                <li>• Pre-IPO company filings</li>
                <li>• Venture capital deal flows</li>
                <li>• M&A transaction intelligence</li>
                <li>• Sukuk issuance announcements</li>
                <li>• Fund formation activities</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Shariah Screening</h4>
              <ul className="space-y-1 text-white/70">
                <li>• Business activity analysis</li>
                <li>• Financial ratio evaluation</li>
                <li>• Debt structure assessment</li>
                <li>• Revenue source verification</li>
                <li>• Scholarly opinion alignment</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Risk Assessment</h4>
              <ul className="space-y-1 text-white/70">
                <li>• Market volatility factors</li>
                <li>• Liquidity considerations</li>
                <li>• Regulatory environment</li>
                <li>• Competitive landscape</li>
                <li>• Historical performance metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentAlerts;
