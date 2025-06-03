import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { StockHolding } from "@/hooks/usePortfolio";

interface InvestmentCopilotProps {
  holdings: StockHolding[];
}

const InvestmentCopilot: React.FC<InvestmentCopilotProps> = ({ holdings }) => {
  return (
    <Card className="bg-secondary/30 border-black h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-lavender" />
          AI Investment Copilot
        </CardTitle>
        <CardDescription>Get personalized investment advice</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-lavender opacity-50" />
          <h3 className="text-lg font-medium mb-2">AI Copilot Coming Soon</h3>
          <p className="text-black max-w-md mx-auto">
            Our AI Investment Copilot will provide personalized investment advice based on your portfolio, risk tolerance, and Shariah compliance requirements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCopilot;
