import React, { useState } from 'react';
// Using title component from ui instead of react-helmet
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calculator, 
  FileText, 
  HelpCircle,
  PieChart,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const MusharakaPartnership: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculator state
  const [totalCapital, setTotalCapital] = useState<number>(1000000);
  const [yourContribution, setYourContribution] = useState<number>(400000);
  const [bankContribution, setBankContribution] = useState<number>(600000);
  const [profitSharingRatio, setProfitSharingRatio] = useState<number>(40);
  const [projectDuration, setProjectDuration] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(15);
  const [diminishing, setDiminishing] = useState<boolean>(false);

  return (
    <>
      {/* Page title set in the document */}
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Link to="/islamic-finance" className="mr-4">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Finance Hub
                </Button>
              </Link>
            </div>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold">Musharaka Partnership Financing</h1>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <h2 className="text-2xl font-semibold mb-4">What is Musharaka?</h2>
                  <p className="text-gray-700 mb-4">
                    Musharaka is an Islamic financing structure where two or more parties contribute capital to a partnership, sharing profits according to a pre-agreed ratio and losses in proportion to their capital contributions. This equity-based arrangement aligns perfectly with Islamic principles of risk-sharing and prohibition of interest.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Unlike conventional loans, Musharaka creates a genuine partnership where both the financial institution and the client have a stake in the success of the venture, promoting transparency, fairness, and mutual benefit.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 mt-6">Key Features of Musharaka</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Profit sharing based on pre-agreed ratios</li>
                    <li>Loss sharing strictly proportional to capital contribution</li>
                    <li>Joint ownership and management of the venture</li>
                    <li>Gradual ownership transfer options (Diminishing Musharaka)</li>
                    <li>Fully Shariah-compliant structure</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 flex flex-col justify-center">
                  <div className="text-center mb-4">
                    <PieChart className="h-16 w-16 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-purple-800">Partnership Structure</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Equitable profit distribution</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Transparent risk sharing</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Active participation rights</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Flexible exit strategies</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="process">Application Process</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Types of Musharaka Partnerships
                  </CardTitle>
                  <CardDescription>
                    Explore the different types of Musharaka partnerships available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Permanent Musharaka</h3>
                      <p className="text-gray-700">
                        A long-term partnership where both parties contribute capital and share profits and losses for the duration of the business venture. Neither party intends to exit the partnership in the foreseeable future.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Diminishing Musharaka</h3>
                      <p className="text-gray-700">
                        A partnership where one partner (typically the financial institution) gradually transfers their ownership share to the other partner through periodic payments. This is commonly used for home financing, where the client eventually becomes the sole owner.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Project-Specific Musharaka</h3>
                      <p className="text-gray-700">
                        A partnership created for a specific project or transaction with a defined timeline. Once the project is completed and profits are distributed, the partnership is dissolved.
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ideal Use Cases for Musharaka</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-purple-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Real Estate Development</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Joint ventures for property development, construction projects, and commercial real estate investments.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Business Expansion</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Capital injection for growing businesses seeking to expand operations, enter new markets, or develop new product lines.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Start-up Funding</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Equity financing for new ventures with promising business models and growth potential.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Asset Acquisition</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Joint purchase of high-value assets like machinery, equipment, or commercial properties.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calculator">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                    Musharaka Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate profit sharing, capital contributions, and returns for your Musharaka partnership
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="totalCapital" className="flex items-center">
                          Total Project Capital
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The total amount of capital required for the project or venture.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1 relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="totalCapital"
                            type="number"
                            className="pl-8"
                            value={totalCapital}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setTotalCapital(value);
                              // Adjust bank contribution to maintain the total
                              setBankContribution(value - yourContribution);
                            }}
                            min={0}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="yourContribution" className="flex items-center">
                          Your Capital Contribution
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Your investment in the partnership.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1 relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="yourContribution"
                            type="number"
                            className="pl-8"
                            value={yourContribution}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setYourContribution(value);
                              // Adjust bank contribution to maintain the total
                              setBankContribution(totalCapital - value);
                            }}
                            min={0}
                            max={totalCapital}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bankContribution" className="flex items-center">
                          Bank's Capital Contribution
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The financial institution's investment in the partnership.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1 relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="bankContribution"
                            type="number"
                            className="pl-8"
                            value={bankContribution}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setBankContribution(value);
                              // Adjust your contribution to maintain the total
                              setYourContribution(totalCapital - value);
                            }}
                            min={0}
                            max={totalCapital}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="profitSharingRatio" className="flex items-center">
                          Your Profit Sharing Ratio (%)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Your percentage share of the profits. This can differ from capital ratio based on agreement.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1">
                          <Input
                            id="profitSharingRatio"
                            type="number"
                            value={profitSharingRatio}
                            onChange={(e) => setProfitSharingRatio(Number(e.target.value))}
                            min={0}
                            max={100}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="projectDuration" className="flex items-center">
                          Project Duration (years)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Expected duration of the partnership or project.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1">
                          <Input
                            id="projectDuration"
                            type="number"
                            value={projectDuration}
                            onChange={(e) => setProjectDuration(Number(e.target.value))}
                            min={1}
                            max={30}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="expectedReturn" className="flex items-center">
                          Expected Annual Return (%)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Projected annual return on investment for the partnership.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1">
                          <Input
                            id="expectedReturn"
                            type="number"
                            value={expectedReturn}
                            onChange={(e) => setExpectedReturn(Number(e.target.value))}
                            min={0}
                            max={100}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="diminishing"
                          checked={diminishing}
                          onChange={(e) => setDiminishing(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <Label htmlFor="diminishing" className="flex items-center">
                          Diminishing Musharaka
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">In diminishing Musharaka, you gradually buy out the bank's share over time.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-purple-800">Partnership Summary</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Capital Contribution Ratio</h4>
                          <div className="flex items-center mt-1">
                            <div 
                              className="h-4 bg-purple-600 rounded-l" 
                              style={{ width: `${(yourContribution / totalCapital) * 100}%` }}
                            ></div>
                            <div 
                              className="h-4 bg-purple-300 rounded-r" 
                              style={{ width: `${(bankContribution / totalCapital) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>You: {((yourContribution / totalCapital) * 100).toFixed(1)}%</span>
                            <span>Bank: {((bankContribution / totalCapital) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Profit Sharing Ratio</h4>
                          <div className="flex items-center mt-1">
                            <div 
                              className="h-4 bg-green-600 rounded-l" 
                              style={{ width: `${profitSharingRatio}%` }}
                            ></div>
                            <div 
                              className="h-4 bg-green-300 rounded-r" 
                              style={{ width: `${100 - profitSharingRatio}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>You: {profitSharingRatio}%</span>
                            <span>Bank: {100 - profitSharingRatio}%</span>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Annual Project Profit (Estimated)</h4>
                          <p className="text-2xl font-semibold text-purple-800">
                            ${(totalCapital * (expectedReturn / 100)).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Your Annual Profit</h4>
                            <p className="text-xl font-semibold text-green-600">
                              ${(totalCapital * (expectedReturn / 100) * (profitSharingRatio / 100)).toLocaleString()}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Bank's Annual Profit</h4>
                            <p className="text-xl font-semibold text-green-600">
                              ${(totalCapital * (expectedReturn / 100) * ((100 - profitSharingRatio) / 100)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        {diminishing && (
                          <>
                            <Separator className="my-4" />
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Diminishing Musharaka</h4>
                              <p className="text-sm text-gray-700 mt-1">
                                To fully own the asset over {projectDuration} years, you would need to purchase approximately ${(bankContribution / projectDuration).toLocaleString()} of the bank's share each year.
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Estimated Monthly Payment</h4>
                              <p className="text-xl font-semibold text-purple-800">
                                ${((bankContribution / projectDuration) / 12).toLocaleString(undefined, {maximumFractionDigits: 2})}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                *Plus profit share payments based on remaining bank ownership
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    Note: This calculator provides estimates only. Actual terms and profit distributions will be determined in the partnership agreement.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="process">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Musharaka Application Process
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to apply for a Musharaka partnership
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-200 ml-3.5"></div>
                      
                      {/* Step 1 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-purple-600 text-white flex items-center justify-center h-7 w-7">
                          1
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Initial Consultation</h3>
                        <p className="text-gray-700 mb-4">
                          Schedule a meeting with our Shariah finance advisors to discuss your business needs, project details, and financing requirements.
                        </p>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Required for Consultation:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Brief business plan or project overview</li>
                            <li>Estimated capital requirements</li>
                            <li>Proposed partnership structure</li>
                          </ul>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                            Schedule Consultation
                          </Button>
                        </div>
                      </div>
                      
                      {/* Step 2 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-purple-600 text-white flex items-center justify-center h-7 w-7">
                          2
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Formal Application</h3>
                        <p className="text-gray-700 mb-4">
                          Submit a comprehensive application with detailed business information, financial projections, and proposed partnership terms.
                        </p>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Required Documentation:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Detailed business plan with 3-5 year projections</li>
                            <li>Financial statements (if existing business)</li>
                            <li>Personal financial information</li>
                            <li>Legal documents (business registration, licenses, etc.)</li>
                            <li>Collateral information (if applicable)</li>
                          </ul>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                            Download Application Form
                          </Button>
                          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                            Online Application
                          </Button>
                        </div>
                      </div>
                      
                      {/* Step 3 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-purple-600 text-white flex items-center justify-center h-7 w-7">
                          3
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Shariah Review & Due Diligence</h3>
                        <p className="text-gray-700 mb-4">
                          Our Shariah board and financial analysts will review your application to ensure compliance with Islamic principles and assess business viability.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-purple-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Shariah Review:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                              <li>Business activity compliance</li>
                              <li>Partnership structure assessment</li>
                              <li>Profit-sharing mechanism review</li>
                            </ul>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Financial Due Diligence:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                              <li>Business viability assessment</li>
                              <li>Risk analysis</li>
                              <li>Market potential evaluation</li>
                              <li>Return projections verification</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 4 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-purple-600 text-white flex items-center justify-center h-7 w-7">
                          4
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Partnership Agreement Negotiation</h3>
                        <p className="text-gray-700 mb-4">
                          Work with our team to finalize the terms of the Musharaka agreement, including capital contributions, profit-sharing ratios, management responsibilities, and exit strategies.
                        </p>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Key Agreement Components:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Capital contribution amounts and schedule</li>
                            <li>Profit and loss sharing ratios</li>
                            <li>Management rights and responsibilities</li>
                            <li>Reporting and transparency requirements</li>
                            <li>Exit mechanisms and conditions</li>
                            <li>Dispute resolution procedures</li>
                          </ul>
                        </div>
                      </div>
                      
                      {/* Step 5 */}
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 rounded-full bg-purple-600 text-white flex items-center justify-center h-7 w-7">
                          5
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Execution and Funding</h3>
                        <p className="text-gray-700 mb-4">
                          Once all parties approve the agreement, legal documentation is finalized, capital contributions are made, and the partnership officially begins.
                        </p>
                        <div className="bg-green-50 p-4 rounded-md border border-green-200">
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium mb-1">Partnership Launch</h4>
                              <p className="text-sm text-gray-700">
                                After funding, you'll be assigned a dedicated relationship manager who will provide ongoing support and ensure smooth operation of the partnership.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-purple-800">Application Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Initial Consultation</div>
                          <div className="w-2/3 text-sm">1-2 business days to schedule</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Application Review</div>
                          <div className="w-2/3 text-sm">7-14 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Shariah & Due Diligence</div>
                          <div className="w-2/3 text-sm">14-21 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Agreement Negotiation</div>
                          <div className="w-2/3 text-sm">7-14 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Execution & Funding</div>
                          <div className="w-2/3 text-sm">3-5 business days after agreement signing</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        * Timeline may vary based on project complexity, documentation completeness, and other factors.
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Start Your Application
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-purple-600" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Common questions about Musharaka partnerships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left">
                        What is the main difference between Musharaka and conventional business partnerships?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Unlike conventional partnerships, Musharaka is structured to comply with Islamic finance principles. The key differences include:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Prohibition of interest (riba) in all transactions</li>
                          <li>Profit sharing based on pre-agreed ratios rather than fixed returns</li>
                          <li>Loss sharing strictly proportional to capital contribution</li>
                          <li>Restrictions on investing in non-Shariah compliant businesses</li>
                          <li>Greater emphasis on ethical business practices and transparency</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left">
                        How are profits and losses distributed in a Musharaka?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          In a Musharaka partnership:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li><strong>Profits:</strong> Distributed according to a pre-agreed ratio that can differ from the capital contribution ratio. This allows flexibility based on factors like management effort and expertise.</li>
                          <li><strong>Losses:</strong> Must be shared strictly in proportion to each partner's capital contribution. This is a non-negotiable principle in Islamic finance.</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          For example, if you contribute 40% of the capital and the bank contributes 60%, any losses must be shared 40:60. However, profits could potentially be shared 50:50 or another agreed ratio if both parties consent.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left">
                        What types of businesses or projects are suitable for Musharaka financing?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Musharaka is versatile and can be used for many business types, but is particularly well-suited for:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Real estate development and investment</li>
                          <li>Manufacturing ventures</li>
                          <li>Import/export businesses</li>
                          <li>Technology startups with clear business models</li>
                          <li>Infrastructure projects</li>
                          <li>Service-based businesses with scalable models</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          The business must be Shariah-compliant, meaning it cannot involve prohibited activities such as interest-based financial services, alcohol, pork products, gambling, or adult entertainment.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left">
                        What is Diminishing Musharaka and how does it work?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Diminishing Musharaka (Musharaka Mutanaqisah) is a structure where one partner (typically the client) gradually purchases the other partner's (typically the bank's) share over time, eventually becoming the sole owner.
                        </p>
                        <p className="text-gray-700 mt-2">
                          How it works:
                        </p>
                        <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Both parties contribute capital to jointly purchase an asset (e.g., property)</li>
                          <li>The client uses the asset and pays rent to the partnership based on ownership percentages</li>
                          <li>The client makes additional periodic payments to purchase the bank's share in installments</li>
                          <li>As the client's ownership increases, the rent portion decreases proportionally</li>
                          <li>Eventually, the client owns 100% of the asset and the partnership ends</li>
                        </ol>
                        <p className="text-gray-700 mt-2">
                          This structure is commonly used for home financing and large asset acquisitions.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-left">
                        What are the minimum and maximum financing amounts available?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Our Musharaka financing options are flexible and can accommodate various project sizes:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li><strong>Minimum financing:</strong> $100,000</li>
                          <li><strong>Maximum financing:</strong> Up to $10 million for qualified projects</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          Larger projects may be considered on a case-by-case basis through syndicated partnerships involving multiple financial institutions. The exact amount depends on the project's viability, your financial position, and the bank's risk assessment.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-left">
                        What is the typical duration of a Musharaka partnership?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Musharaka partnerships can have various durations based on the nature of the project:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li><strong>Short-term:</strong> 1-3 years (typically for specific transactions or projects)</li>
                          <li><strong>Medium-term:</strong> 3-7 years (common for business expansion or equipment financing)</li>
                          <li><strong>Long-term:</strong> 7-15 years (typically for real estate development or major infrastructure)</li>
                          <li><strong>Permanent:</strong> Ongoing partnerships with no defined end date</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          For Diminishing Musharaka, terms typically range from 5-25 years, similar to conventional mortgage timeframes.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-7">
                      <AccordionTrigger className="text-left">
                        How is the profit-sharing ratio determined?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          The profit-sharing ratio is negotiated between partners and can differ from the capital contribution ratio. Factors that influence the ratio include:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Capital contribution percentages</li>
                          <li>Management responsibilities and time commitment</li>
                          <li>Expertise and experience brought to the partnership</li>
                          <li>Market conditions and competitive rates</li>
                          <li>Risk profile of the project</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          For example, if you contribute less capital but will manage the business full-time, you might negotiate a higher profit share to compensate for your labor and expertise.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-8">
                      <AccordionTrigger className="text-left">
                        What happens if the business incurs losses?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          In a Musharaka partnership, losses are shared strictly in proportion to each partner's capital contribution. This is a fundamental principle of Islamic finance that cannot be altered in the agreement.
                        </p>
                        <p className="text-gray-700 mt-2">
                          For example, if you contributed 40% of the capital and the bank contributed 60%, you would bear 40% of any losses and the bank would bear 60%.
                        </p>
                        <p className="text-gray-700 mt-2">
                          However, if losses occur due to negligence, misconduct, or breach of contract by one partner, that partner may be held liable for the losses regardless of their capital contribution ratio.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-9">
                      <AccordionTrigger className="text-left">
                        Can I exit a Musharaka partnership early?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Yes, Musharaka agreements typically include exit provisions. Common exit mechanisms include:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li><strong>Buyout:</strong> One partner purchases the other's share at an agreed price or valuation method</li>
                          <li><strong>Sale to third party:</strong> Both partners sell their interests to an outside buyer</li>
                          <li><strong>Liquidation:</strong> Partnership assets are sold and proceeds distributed according to ownership percentages</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          Early exit terms should be clearly defined in the partnership agreement, including notice periods, valuation methods, and any potential penalties or adjustments.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-10">
                      <AccordionTrigger className="text-left">
                        How is Musharaka different from Mudaraba financing?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          While both are profit-sharing arrangements in Islamic finance, they differ in several key ways:
                        </p>
                        <div className="mt-3 border rounded-md overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-purple-50">
                              <tr>
                                <th className="p-2 text-left">Feature</th>
                                <th className="p-2 text-left">Musharaka</th>
                                <th className="p-2 text-left">Mudaraba</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="p-2 font-medium">Capital</td>
                                <td className="p-2">Both partners contribute</td>
                                <td className="p-2">Only one partner (Rab-ul-Mal) provides capital</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Management</td>
                                <td className="p-2">Both partners can participate</td>
                                <td className="p-2">Only Mudarib (entrepreneur) manages</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Profit sharing</td>
                                <td className="p-2">Based on agreed ratio</td>
                                <td className="p-2">Based on agreed ratio</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Loss bearing</td>
                                <td className="p-2">Proportional to capital</td>
                                <td className="p-2">Capital provider bears financial loss; Mudarib loses time/effort</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-medium">Liability</td>
                                <td className="p-2">Typically unlimited</td>
                                <td className="p-2">Limited to capital for investor</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Have more questions? Our Shariah finance advisors are here to help.
                  </p>
                  <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                    Contact an Advisor
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </>
  );
};

export default MusharakaPartnership;
