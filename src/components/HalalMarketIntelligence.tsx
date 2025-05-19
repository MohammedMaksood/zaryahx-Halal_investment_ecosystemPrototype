import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertCircle, BarChart2, LineChart, Sparkles, Globe, Search, Briefcase } from "lucide-react";
import EmergingTrends from "@/components/market-intelligence/EmergingTrends";
import ComplianceForecasting from "@/components/market-intelligence/ComplianceForecasting";
import SectorGrowth from "@/components/market-intelligence/SectorGrowth";
import InvestmentAlerts from "@/components/market-intelligence/InvestmentAlerts";

interface HalalMarketIntelligenceProps {
  userPortfolio?: any[];
  userPreferences?: {
    sectors?: string[];
    regions?: string[];
    riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  };
}

const HalalMarketIntelligence: React.FC<HalalMarketIntelligenceProps> = ({
  userPortfolio = [],
  userPreferences = {
    sectors: ['Technology', 'Healthcare', 'Consumer Goods'],
    regions: ['GCC', 'Southeast Asia', 'North America'],
    riskTolerance: 'moderate'
  }
}) => {
  const [activeTab, setActiveTab] = useState<string>('trends');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  return (
    <Card className="w-full bg-background border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-lavender" />
              Predictive Halal Market Intelligence
            </CardTitle>
            <CardDescription>
              AI-powered insights into emerging trends, compliance forecasts, and investment opportunities in the global Halal economy
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            {isLoading ? 'Updating...' : 'Refresh'}
            <TrendingUp className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="trends" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Emerging Trends
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Compliance Forecast
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              Sector Growth
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Investment Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <EmergingTrends isLoading={isLoading} userPreferences={userPreferences} />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceForecasting isLoading={isLoading} userPortfolio={userPortfolio} />
          </TabsContent>

          <TabsContent value="sectors">
            <SectorGrowth isLoading={isLoading} userPreferences={userPreferences} />
          </TabsContent>

          <TabsContent value="opportunities">
            <InvestmentAlerts isLoading={isLoading} userPreferences={userPreferences} userPortfolio={userPortfolio} />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t border-white/10 pt-4">
        <div className="w-full text-center text-sm text-white/60">
          Last updated: {lastUpdated.toLocaleString()} • Powered by advanced AI analysis of global Halal markets
        </div>
      </CardFooter>
    </Card>
  );
};

export default HalalMarketIntelligence;
