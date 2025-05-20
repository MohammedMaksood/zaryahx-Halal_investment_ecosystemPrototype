import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopilot } from '@/contexts/CopilotContext';

interface CopilotSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CopilotSettingsDialog: React.FC<CopilotSettingsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { userPreferences, updatePreferences, resetLearningData } = useCopilot();
  
  const handleRiskToleranceChange = (value: string) => {
    updatePreferences({ 
      riskTolerance: value as 'conservative' | 'moderate' | 'aggressive' 
    });
  };
  
  const handleShariahStrictnessChange = (value: string) => {
    updatePreferences({ 
      shariahStrictness: value as 'standard' | 'strict' | 'very-strict' 
    });
  };
  
  const handleInvestmentGoalChange = (id: string, checked: boolean) => {
    const currentGoals = [...userPreferences.investmentGoals];
    
    if (checked && !currentGoals.includes(id)) {
      updatePreferences({ investmentGoals: [...currentGoals, id] });
    } else if (!checked && currentGoals.includes(id)) {
      updatePreferences({ 
        investmentGoals: currentGoals.filter(goal => goal !== id) 
      });
    }
  };
  
  const handleSectorChange = (id: string, checked: boolean) => {
    const currentSectors = [...userPreferences.preferredSectors];
    
    if (checked && !currentSectors.includes(id)) {
      updatePreferences({ preferredSectors: [...currentSectors, id] });
    } else if (!checked && currentSectors.includes(id)) {
      updatePreferences({ 
        preferredSectors: currentSectors.filter(sector => sector !== id) 
      });
    }
  };
  
  const handleInvestmentTypeChange = (id: string, checked: boolean) => {
    const currentTypes = [...userPreferences.preferredInvestmentTypes];
    
    if (checked && !currentTypes.includes(id)) {
      updatePreferences({ preferredInvestmentTypes: [...currentTypes, id] });
    } else if (!checked && currentTypes.includes(id)) {
      updatePreferences({ 
        preferredInvestmentTypes: currentTypes.filter(type => type !== id) 
      });
    }
  };
  
  const handleRebalanceFrequencyChange = (value: string) => {
    updatePreferences({ 
      rebalanceFrequency: value as 'monthly' | 'quarterly' | 'semi-annually' | 'annually' 
    });
  };
  
  const handleNotificationChange = (id: keyof typeof userPreferences.notificationPreferences, checked: boolean) => {
    updatePreferences({
      notificationPreferences: {
        ...userPreferences.notificationPreferences,
        [id]: checked
      }
    });
  };
  
  const handleReset = () => {
    if (confirm('Are you sure you want to reset your AI Copilot learning data? This will not affect your preference settings.')) {
      resetLearningData();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-secondary/30 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl">AI Investment Copilot Settings</DialogTitle>
          <DialogDescription>
            Customize how your AI Copilot provides Shariah-compliant investment guidance.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="shariah">Shariah Settings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Risk Tolerance</h3>
                <RadioGroup 
                  value={userPreferences.riskTolerance} 
                  onValueChange={handleRiskToleranceChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conservative" id="conservative" />
                    <Label htmlFor="conservative">Conservative (Lower risk, stable returns)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate (Balanced risk and return)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aggressive" id="aggressive" />
                    <Label htmlFor="aggressive">Growth (Higher risk, potential for higher returns)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Investment Goals</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="long-term-growth" 
                      checked={userPreferences.investmentGoals.includes('long-term growth')}
                      onCheckedChange={(checked) => 
                        handleInvestmentGoalChange('long-term growth', checked as boolean)
                      }
                    />
                    <Label htmlFor="long-term-growth">Long-term Growth</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="income" 
                      checked={userPreferences.investmentGoals.includes('income')}
                      onCheckedChange={(checked) => 
                        handleInvestmentGoalChange('income', checked as boolean)
                      }
                    />
                    <Label htmlFor="income">Income Generation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="retirement" 
                      checked={userPreferences.investmentGoals.includes('retirement')}
                      onCheckedChange={(checked) => 
                        handleInvestmentGoalChange('retirement', checked as boolean)
                      }
                    />
                    <Label htmlFor="retirement">Retirement Planning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hajj-savings" 
                      checked={userPreferences.investmentGoals.includes('hajj-savings')}
                      onCheckedChange={(checked) => 
                        handleInvestmentGoalChange('hajj-savings', checked as boolean)
                      }
                    />
                    <Label htmlFor="hajj-savings">Hajj/Umrah Savings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="education" 
                      checked={userPreferences.investmentGoals.includes('education')}
                      onCheckedChange={(checked) => 
                        handleInvestmentGoalChange('education', checked as boolean)
                      }
                    />
                    <Label htmlFor="education">Education Funding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wealth-preservation" 
                      checked={userPreferences.investmentGoals.includes('wealth-preservation')}
                      onCheckedChange={(checked) => 
                        handleInvestmentGoalChange('wealth-preservation', checked as boolean)
                      }
                    />
                    <Label htmlFor="wealth-preservation">Wealth Preservation</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Preferred Sectors</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="technology" 
                      checked={userPreferences.preferredSectors.includes('technology')}
                      onCheckedChange={(checked) => 
                        handleSectorChange('technology', checked as boolean)
                      }
                    />
                    <Label htmlFor="technology">Technology</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="healthcare" 
                      checked={userPreferences.preferredSectors.includes('healthcare')}
                      onCheckedChange={(checked) => 
                        handleSectorChange('healthcare', checked as boolean)
                      }
                    />
                    <Label htmlFor="healthcare">Healthcare</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="consumer" 
                      checked={userPreferences.preferredSectors.includes('consumer')}
                      onCheckedChange={(checked) => 
                        handleSectorChange('consumer', checked as boolean)
                      }
                    />
                    <Label htmlFor="consumer">Consumer Goods</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="industrial" 
                      checked={userPreferences.preferredSectors.includes('industrial')}
                      onCheckedChange={(checked) => 
                        handleSectorChange('industrial', checked as boolean)
                      }
                    />
                    <Label htmlFor="industrial">Industrial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="real-estate" 
                      checked={userPreferences.preferredSectors.includes('real-estate')}
                      onCheckedChange={(checked) => 
                        handleSectorChange('real-estate', checked as boolean)
                      }
                    />
                    <Label htmlFor="real-estate">Real Estate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="energy" 
                      checked={userPreferences.preferredSectors.includes('energy')}
                      onCheckedChange={(checked) => 
                        handleSectorChange('energy', checked as boolean)
                      }
                    />
                    <Label htmlFor="energy">Clean Energy</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Rebalancing Frequency</h3>
                <RadioGroup 
                  value={userPreferences.rebalanceFrequency} 
                  onValueChange={handleRebalanceFrequencyChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <Label htmlFor="quarterly">Quarterly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semi-annually" id="semi-annually" />
                    <Label htmlFor="semi-annually">Semi-Annually</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="annually" id="annually" />
                    <Label htmlFor="annually">Annually</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="shariah" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Shariah Compliance Level</h3>
                <RadioGroup 
                  value={userPreferences.shariahStrictness} 
                  onValueChange={handleShariahStrictnessChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Standard (AAOIFI Compliance)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strict" id="strict" />
                    <Label htmlFor="strict">Strict (Enhanced Screening)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-strict" id="very-strict" />
                    <Label htmlFor="very-strict">Very Strict (Most Conservative Standards)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Preferred Investment Types</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="stocks" 
                      checked={userPreferences.preferredInvestmentTypes.includes('stocks')}
                      onCheckedChange={(checked) => 
                        handleInvestmentTypeChange('stocks', checked as boolean)
                      }
                    />
                    <Label htmlFor="stocks">Shariah-Compliant Stocks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sukuk" 
                      checked={userPreferences.preferredInvestmentTypes.includes('sukuk')}
                      onCheckedChange={(checked) => 
                        handleInvestmentTypeChange('sukuk', checked as boolean)
                      }
                    />
                    <Label htmlFor="sukuk">Sukuk (Islamic Bonds)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="etfs" 
                      checked={userPreferences.preferredInvestmentTypes.includes('etfs')}
                      onCheckedChange={(checked) => 
                        handleInvestmentTypeChange('etfs', checked as boolean)
                      }
                    />
                    <Label htmlFor="etfs">Islamic ETFs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mutual-funds" 
                      checked={userPreferences.preferredInvestmentTypes.includes('mutual-funds')}
                      onCheckedChange={(checked) => 
                        handleInvestmentTypeChange('mutual-funds', checked as boolean)
                      }
                    />
                    <Label htmlFor="mutual-funds">Islamic Mutual Funds</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="reits" 
                      checked={userPreferences.preferredInvestmentTypes.includes('reits')}
                      onCheckedChange={(checked) => 
                        handleInvestmentTypeChange('reits', checked as boolean)
                      }
                    />
                    <Label htmlFor="reits">Islamic REITs</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Notification Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="marketAlerts" 
                      checked={userPreferences.notificationPreferences.marketAlerts}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('marketAlerts', checked as boolean)
                      }
                    />
                    <Label htmlFor="marketAlerts">Market Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="complianceAlerts" 
                      checked={userPreferences.notificationPreferences.complianceAlerts}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('complianceAlerts', checked as boolean)
                      }
                    />
                    <Label htmlFor="complianceAlerts">Shariah Compliance Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="opportunityAlerts" 
                      checked={userPreferences.notificationPreferences.opportunityAlerts}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('opportunityAlerts', checked as boolean)
                      }
                    />
                    <Label htmlFor="opportunityAlerts">Investment Opportunities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="portfolioUpdates" 
                      checked={userPreferences.notificationPreferences.portfolioUpdates}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('portfolioUpdates', checked as boolean)
                      }
                    />
                    <Label htmlFor="portfolioUpdates">Portfolio Updates</Label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium mb-3">AI Learning Data</h3>
                <p className="text-sm text-white/70 mb-3">
                  Your AI Copilot learns from your interactions to provide better recommendations.
                  You can reset this learning data at any time.
                </p>
                <Button variant="destructive" size="sm" onClick={handleReset}>
                  Reset Learning Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CopilotSettingsDialog;
