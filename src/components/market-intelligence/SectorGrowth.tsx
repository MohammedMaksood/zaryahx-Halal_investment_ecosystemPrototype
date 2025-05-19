import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart2, TrendingUp, Filter, Globe, Calendar } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

interface SectorGrowthProps {
  isLoading: boolean;
  userPreferences?: {
    sectors?: string[];
    regions?: string[];
    riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  };
}

interface SectorForecast {
  sector: string;
  growthRate: number;
  confidence: number;
  timeframe: '3 months' | '6 months' | '12 months';
  driverFactors: string[];
  riskFactors: string[];
  regions: {
    name: string;
    growthRate: number;
  }[];
  investmentVehicles: {
    type: string;
    examples: string[];
    suitability: 'high' | 'medium' | 'low';
  }[];
}

const SectorGrowth: React.FC<SectorGrowthProps> = ({ isLoading, userPreferences }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'3 months' | '6 months' | '12 months'>('6 months');
  const [selectedSector, setSelectedSector] = useState<SectorForecast | null>(null);

  // Create sector forecasts for all timeframes
  const createForecasts = (baseForecasts: any[]) => {
    const allForecasts: SectorForecast[] = [];
    
    // For each base forecast, create variants for each timeframe
    baseForecasts.forEach(base => {
      // 3-month forecast (typically lower growth rate, higher confidence)
      allForecasts.push({
        ...base,
        growthRate: +(base.growthRate * 0.6).toFixed(1),
        confidence: Math.min(base.confidence + 5, 95),
        timeframe: '3 months'
      });
      
      // 6-month forecast (base values)
      allForecasts.push({
        ...base,
        timeframe: '6 months'
      });
      
      // 12-month forecast (typically higher growth rate, lower confidence)
      allForecasts.push({
        ...base,
        growthRate: +(base.growthRate * 1.5).toFixed(1),
        confidence: Math.max(base.confidence - 8, 70),
        timeframe: '12 months'
      });
    });
    
    return allForecasts;
  };
  
  // Base sector data (for 6-month timeframe)
  const baseSectorData = [
    {
      sector: 'Halal Food & Beverage',
      growthRate: 8.7,
      confidence: 92,
      timeframe: '6 months',
      driverFactors: [
        'Growing demand for halal-certified convenience foods',
        'Expansion of halal food delivery services',
        'Increasing adoption in non-Muslim majority countries',
        'Innovation in plant-based halal alternatives'
      ],
      riskFactors: [
        'Supply chain disruptions affecting certification',
        'Increasing competition from conventional food companies',
        'Varying halal certification standards across regions'
      ],
      regions: [
        { name: 'Southeast Asia', growthRate: 12.3 },
        { name: 'Middle East', growthRate: 7.8 },
        { name: 'Europe', growthRate: 6.5 },
        { name: 'North America', growthRate: 9.2 }
      ],
      investmentVehicles: [
        {
          type: 'ETFs',
          examples: ['HLAL', 'SPUS', 'ISDU'],
          suitability: 'high'
        },
        {
          type: 'Individual Stocks',
          examples: ['NESTLE', 'SAVOLA', 'BRF SA'],
          suitability: 'medium'
        },
        {
          type: 'Private Equity',
          examples: ['Halal food startups', 'Distribution networks'],
          suitability: 'medium'
        }
      ]
    },
    {
      sector: 'Islamic Fintech',
      growthRate: 15.3,
      confidence: 88,
      timeframe: '6 months',
      driverFactors: [
        'Digital transformation of Islamic financial services',
        'Growing adoption of blockchain for Sukuk issuance',
        'Expansion of mobile payment solutions',
        'Regulatory support in key markets'
      ],
      riskFactors: [
        'Regulatory uncertainty in some jurisdictions',
        'Competition from conventional fintech firms',
        'Cybersecurity concerns'
      ],
      regions: [
        { name: 'GCC', growthRate: 17.5 },
        { name: 'Malaysia', growthRate: 16.8 },
        { name: 'UK', growthRate: 12.4 },
        { name: 'Indonesia', growthRate: 14.2 }
      ],
      investmentVehicles: [
        {
          type: 'Venture Capital',
          examples: ['Islamic fintech startups', 'Shariah-compliant payment platforms'],
          suitability: 'high'
        },
        {
          type: 'Sukuk',
          examples: ['Fintech-focused Sukuk', 'Digital platform Sukuk'],
          suitability: 'medium'
        },
        {
          type: 'Public Equities',
          examples: ['AEON Credit', 'Path Solutions', 'Wahed Invest'],
          suitability: 'medium'
        }
      ]
    },
    {
      sector: 'Modest Fashion',
      growthRate: 11.2,
      confidence: 85,
      timeframe: '6 months',
      driverFactors: [
        'Growing e-commerce platforms specializing in modest fashion',
        'Mainstream fashion brands launching modest collections',
        'Increasing social media influence of modest fashion influencers',
        'Rising demand for sustainable and ethical clothing'
      ],
      riskFactors: [
        'Fast fashion competition',
        'Supply chain sustainability challenges',
        'Varying cultural interpretations of modesty'
      ],
      regions: [
        { name: 'Middle East', growthRate: 13.5 },
        { name: 'Southeast Asia', growthRate: 12.7 },
        { name: 'Europe', growthRate: 8.9 },
        { name: 'North America', growthRate: 9.5 }
      ],
      investmentVehicles: [
        {
          type: 'Private Equity',
          examples: ['Modest fashion startups', 'E-commerce platforms'],
          suitability: 'high'
        },
        {
          type: 'Public Equities',
          examples: ['SHEIN', 'ASOS', 'Inditex (Zara)'],
          suitability: 'medium'
        },
        {
          type: 'Retail Funds',
          examples: ['Consumer goods funds', 'Retail sector ETFs'],
          suitability: 'medium'
        }
      ]
    },
    {
      sector: 'Halal Pharmaceuticals',
      growthRate: 7.8,
      confidence: 82,
      timeframe: '6 months',
      driverFactors: [
        'Increasing demand for halal-certified medications',
        'Government initiatives promoting halal pharmaceuticals',
        'R&D investments in halal alternatives to gelatin-based products',
        'Growing awareness of ingredient sources in medications'
      ],
      riskFactors: [
        'Complex certification processes',
        'Limited availability of halal alternatives for some medications',
        'Higher production costs affecting market adoption'
      ],
      regions: [
        { name: 'Malaysia', growthRate: 9.6 },
        { name: 'Indonesia', growthRate: 8.7 },
        { name: 'GCC', growthRate: 7.2 },
        { name: 'Europe', growthRate: 5.4 }
      ],
      investmentVehicles: [
        {
          type: 'Public Equities',
          examples: ['CCM Duopharma', 'Pharmaniaga', 'Chemical Company of Malaysia'],
          suitability: 'high'
        },
        {
          type: 'Healthcare ETFs',
          examples: ['Shariah-compliant healthcare ETFs'],
          suitability: 'medium'
        },
        {
          type: 'Venture Capital',
          examples: ['Halal pharma startups', 'R&D initiatives'],
          suitability: 'medium'
        }
      ]
    },
    {
      sector: 'Halal Travel & Tourism',
      growthRate: 6.5,
      confidence: 78,
      timeframe: '6 months',
      driverFactors: [
        'Post-pandemic recovery of Muslim-friendly tourism',
        'Digital platforms specializing in halal travel experiences',
        'Hotel chains developing Muslim-friendly amenities',
        'Growing middle class in Muslim-majority countries'
      ],
      riskFactors: [
        'Geopolitical tensions affecting travel patterns',
        'Varying interpretations of halal-friendly accommodations',
        'Economic uncertainties affecting discretionary spending'
      ],
      regions: [
        { name: 'Southeast Asia', growthRate: 8.3 },
        { name: 'Middle East', growthRate: 7.5 },
        { name: 'Turkey', growthRate: 9.2 },
        { name: 'Europe', growthRate: 4.8 }
      ],
      investmentVehicles: [
        {
          type: 'Public Equities',
          examples: ['Hotel chains', 'Travel booking platforms', 'Airlines'],
          suitability: 'medium'
        },
        {
          type: 'Real Estate',
          examples: ['Muslim-friendly resorts', 'Halal hotel developments'],
          suitability: 'high'
        },
        {
          type: 'Private Equity',
          examples: ['Halal travel startups', 'Muslim-friendly tour operators'],
          suitability: 'medium'
        }
      ]
    },
    {
      sector: 'Islamic Education Technology',
      growthRate: 13.7,
      confidence: 84,
      timeframe: '6 months',
      driverFactors: [
        'Growing demand for online Islamic education',
        'Digital transformation of traditional Islamic education',
        'Mobile apps for Quran learning and Islamic studies',
        'Integration of AI in personalized Islamic learning'
      ],
      riskFactors: [
        'Competition from free content providers',
        'Quality control challenges',
        'Varying acceptance of digital learning methods'
      ],
      regions: [
        { name: 'Global', growthRate: 13.7 },
        { name: 'Middle East', growthRate: 15.2 },
        { name: 'Southeast Asia', growthRate: 14.8 },
        { name: 'Western Markets', growthRate: 12.5 }
      ],
      investmentVehicles: [
        {
          type: 'Venture Capital',
          examples: ['Islamic EdTech startups', 'Learning platforms'],
          suitability: 'high'
        },
        {
          type: 'Public Equities',
          examples: ['Education technology companies with Islamic offerings'],
          suitability: 'medium'
        },
        {
          type: 'Impact Investing',
          examples: ['Educational access initiatives', 'Digital literacy programs'],
          suitability: 'medium'
        }
      ]
    }
  ];

  // Generate forecasts for all timeframes
  const sectorForecasts = createForecasts(baseSectorData);
  
  // Filter sectors based on user preferences if available
  const filteredSectors = userPreferences?.sectors?.length
    ? sectorForecasts.filter(forecast => 
        userPreferences.sectors?.some(sector => forecast.sector.includes(sector)) ||
        userPreferences.regions?.some(region => 
          forecast.regions.some(r => r.name.includes(region))
        )
      )
    : sectorForecasts;

  // Filter by selected timeframe
  const timeframeFilteredSectors = filteredSectors.filter(sector => 
    sector.timeframe === activeTimeframe
  );

  // Sort sectors by growth rate (descending)
  const sortedSectors = [...timeframeFilteredSectors].sort((a, b) => 
    b.growthRate - a.growthRate
  );

  const getGrowthColor = (growth: number): string => {
    if (growth >= 10) return 'text-green-400';
    if (growth >= 5) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const getProgressColor = (growth: number): string => {
    if (growth >= 10) return '[&>div]:bg-green-500';
    if (growth >= 5) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-blue-500';
  };

  const getSuitabilityColor = (suitability: string): string => {
    switch (suitability) {
      case 'high':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-lavender/20 text-lavender';
    }
  };

  if (isLoading) {
    return <LoadingAnimation text="Analyzing halal sector growth trends..." type="analysis" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-white/60" />
          <span className="text-sm text-white/60">Timeframe:</span>
        </div>
        <div className="flex space-x-2">
          <Badge 
            onClick={() => setActiveTimeframe('3 months')} 
            className={`cursor-pointer ${activeTimeframe === '3 months' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            <Calendar className="h-3 w-3 mr-1" />
            3 Months
          </Badge>
          <Badge 
            onClick={() => setActiveTimeframe('6 months')} 
            className={`cursor-pointer ${activeTimeframe === '6 months' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            <Calendar className="h-3 w-3 mr-1" />
            6 Months
          </Badge>
          <Badge 
            onClick={() => setActiveTimeframe('12 months')} 
            className={`cursor-pointer ${activeTimeframe === '12 months' ? 'bg-lavender text-white' : 'bg-background text-white/60'}`}
          >
            <Calendar className="h-3 w-3 mr-1" />
            12 Months
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-secondary/30 border-white/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-lavender" />
              Halal Sector Growth Forecast
            </h3>
            
            <div className="space-y-4">
              {sortedSectors.length > 0 ? (
                sortedSectors.map((sector) => (
                  <div 
                    key={sector.sector} 
                    className={`p-4 rounded-lg bg-background/40 border border-white/10 cursor-pointer hover:bg-background/60 transition-colors ${selectedSector?.sector === sector.sector ? 'border-lavender/50' : ''}`}
                    onClick={() => setSelectedSector(sector)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{sector.sector}</h4>
                      <Badge className={`${getGrowthColor(sector.growthRate)} bg-background`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {sector.growthRate.toFixed(1)}% Growth
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Projected Growth Rate</span>
                        <span className={getGrowthColor(sector.growthRate)}>{sector.growthRate.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={sector.growthRate * 5} // Scale for better visualization (0-100)
                        className={`h-1.5 ${getProgressColor(sector.growthRate)}`} 
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {sector.regions.slice(0, 3).map((region) => (
                        <Badge key={region.name} variant="outline" className="bg-background/50">
                          <Globe className="h-3 w-3 mr-1" />
                          {region.name}
                        </Badge>
                      ))}
                      {sector.regions.length > 3 && (
                        <Badge variant="outline" className="bg-background/50">
                          +{sector.regions.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 text-xs text-white/60">
                      <span>Confidence: {sector.confidence}%</span>
                      <span>{sector.timeframe} forecast</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-white/60">
                  <BarChart2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No sector forecasts available for the selected timeframe</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/30 border-white/10">
          <CardContent className="pt-6">
            {selectedSector ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium">{selectedSector.sector}</h3>
                  <div className="flex items-center mt-1">
                    <Badge className={`${getGrowthColor(selectedSector.growthRate)} mr-2`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {selectedSector.growthRate.toFixed(1)}% Growth
                    </Badge>
                    <span className="text-sm text-white/60">
                      {selectedSector.timeframe} forecast u2022 {selectedSector.confidence}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Regional Growth Breakdown</h4>
                  <div className="space-y-3">
                    {selectedSector.regions.map((region) => (
                      <div key={region.name} className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{region.name}</span>
                          <span className={getGrowthColor(region.growthRate)}>{region.growthRate.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={region.growthRate * 5} // Scale for better visualization
                          className={`h-1.5 ${getProgressColor(region.growthRate)}`} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium mb-3">Growth Drivers</h4>
                    <div className="p-3 bg-background/40 rounded-lg border border-white/10">
                      <ul className="space-y-2 text-sm">
                        {selectedSector.driverFactors.map((factor, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                            </div>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Risk Factors</h4>
                    <div className="p-3 bg-background/40 rounded-lg border border-white/10">
                      <ul className="space-y-2 text-sm">
                        {selectedSector.riskFactors.map((factor, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                            </div>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-3">Investment Vehicles</h4>
                  <div className="space-y-3">
                    {selectedSector.investmentVehicles.map((vehicle, index) => (
                      <div key={index} className="p-3 bg-background/40 rounded-lg border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{vehicle.type}</h5>
                          <Badge className={getSuitabilityColor(vehicle.suitability)}>
                            {vehicle.suitability.charAt(0).toUpperCase() + vehicle.suitability.slice(1)} Suitability
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.examples.map((example, i) => (
                            <Badge key={i} variant="outline">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-white/60">
                <BarChart2 className="h-16 w-16 mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">Select a Sector</h3>
                <p className="mb-4">Click on a sector from the list to view detailed growth analysis and investment opportunities.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-secondary/30 border-white/10">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">
            Sector Growth Forecast Methodology
          </h3>
          <p className="text-sm text-white/70 mb-4">
            Our AI-powered sector growth forecasting analyzes economic indicators, investment flows, consumer trends, and regulatory developments to predict which segments of the halal economy will experience the strongest growth in the coming months.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Data Sources</h4>
              <ul className="space-y-1 text-white/70">
                <li>u2022 Government economic data</li>
                <li>u2022 Industry association reports</li>
                <li>u2022 Venture capital investment flows</li>
                <li>u2022 Consumer spending patterns</li>
                <li>u2022 Regulatory announcements</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Growth Indicators</h4>
              <ul className="space-y-1 text-white/70">
                <li>u2022 Year-over-year revenue growth</li>
                <li>u2022 New business formations</li>
                <li>u2022 Employment trends</li>
                <li>u2022 Product innovation metrics</li>
                <li>u2022 Market expansion activities</li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-background/40 border border-white/10">
              <h4 className="font-medium mb-2">Regional Analysis</h4>
              <ul className="space-y-1 text-white/70">
                <li>u2022 Market maturity assessment</li>
                <li>u2022 Regulatory environment</li>
                <li>u2022 Muslim population demographics</li>
                <li>u2022 Infrastructure development</li>
                <li>u2022 Cultural adoption factors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorGrowth;
