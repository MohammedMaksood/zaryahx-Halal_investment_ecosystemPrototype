import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface LearnMoreButtonProps {
  stockSymbol?: string;
  stockName?: string;
}

const LearnMoreButton: React.FC<LearnMoreButtonProps> = ({
  stockSymbol,
  stockName
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button 
          variant="outline" 
          className="border-lavender text-lavender hover:bg-lavender/10"
          onClick={() => setOpen(true)}
        >
          Learn More
        </Button>
        
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {stockSymbol ? `${stockName} (${stockSymbol})` : 'Islamic Investment Principles'}
            </DialogTitle>
            <DialogDescription>
              Learn more about Islamic finance and investment guidelines
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="principles">Principles</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-secondary/30 border-white/10">
                <CardContent className="pt-6">
                  <p>
                    Islamic investing follows Shariah principles that prohibit interest (riba), 
                    excessive uncertainty (gharar), and investments in prohibited industries like 
                    alcohol, gambling, and conventional financial services.
                  </p>
                  <p className="mt-4">
                    Investments are screened for business activities and financial ratios to ensure compliance.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="principles" className="space-y-4">
              <Card className="bg-secondary/30 border-white/10">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Key Islamic Finance Principles:</h3>
                  <ul className="space-y-2">
                    <li>• Prohibition of interest (riba)</li>
                    <li>• Avoidance of excessive uncertainty (gharar)</li>
                    <li>• Prohibition of gambling (maysir)</li>
                    <li>• Investment only in permissible (halal) activities</li>
                    <li>• Sharing of profits and losses</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4">
              <Card className="bg-secondary/30 border-white/10">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Financial Screening Criteria:</h3>
                  <ul className="space-y-2">
                    <li>• Debt to total assets ratio must be less than 33%</li>
                    <li>• Interest income must be less than 5% of total revenue</li>
                    <li>• Illiquid assets must be more than 51% of total assets</li>
                    <li>• Revenue from non-permissible activities must be less than 5%</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LearnMoreButton;
