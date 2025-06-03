import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, DollarSign, Calculator, FileText, HelpCircle, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MurabahaFinance: React.FC = () => {
  // State for calculator
  const [assetValue, setAssetValue] = useState<number>(100000);
  const [downPayment, setDownPayment] = useState<number>(20000);
  const [profitRate, setProfitRate] = useState<number>(5);
  const [term, setTerm] = useState<number>(36);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Calculate financing details
  const financedAmount = assetValue - downPayment;
  const totalProfit = financedAmount * (profitRate / 100);
  const totalAmount = financedAmount + totalProfit;
  const monthlyPayment = totalAmount / term;
  
  const handleCalculate = () => {
    setShowResults(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex items-center mb-8">
              <Link to="/islamic-finance" className="mr-4">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Finance Hub
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-black">Murabaha Financing</h1>
            </div>
            
            {/* Introduction Section */}
            <div className="mb-12 bg-gradient-to-r from-green-50 to-green-100/50 p-8 rounded-lg border border-green-200">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4 text-green-800">What is Murabaha Financing?</h2>
                  <p className="mb-4 text-black/80">
                    Murabaha is a Shariah-compliant financing arrangement where we purchase an asset on your behalf and 
                    sell it to you at a transparent marked-up price. The markup represents our profit, and you pay in 
                    fixed installments over an agreed period.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-700 mb-2">Key Features</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Transparent cost and profit margin</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Fixed payment schedule</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>No compounding interest</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-700 mb-2">Common Uses</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Home financing</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Vehicle purchases</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Business equipment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-md border border-green-200">
                    <DollarSign className="h-20 w-20 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Murabaha Tabs */}
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="calculator">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculator
                </TabsTrigger>
                <TabsTrigger value="process">
                  <FileText className="h-4 w-4 mr-2" />
                  Application Process
                </TabsTrigger>
                <TabsTrigger value="faq">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
              </TabsList>
              
              {/* Calculator Tab */}
              <TabsContent value="calculator">
                <Card className="border border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                    <CardTitle>Murabaha Calculator</CardTitle>
                    <CardDescription>
                      Calculate your potential Murabaha financing payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Asset Value */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="assetValue" className="text-base font-medium">
                            Asset Value
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center cursor-help">
                                  <HelpCircle className="h-3 w-3 text-green-600" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white p-3 shadow-lg border border-green-200">
                                <p className="max-w-xs text-sm">The total value of the asset you wish to purchase</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">$</span>
                          <Input
                            id="assetValue"
                            type="number"
                            value={assetValue}
                            onChange={(e) => setAssetValue(Number(e.target.value))}
                            className="pl-8 border-green-200 focus:border-green-400"
                          />
                        </div>
                      </div>
                      
                      {/* Down Payment */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="downPayment" className="text-base font-medium">
                            Down Payment
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center cursor-help">
                                  <HelpCircle className="h-3 w-3 text-green-600" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white p-3 shadow-lg border border-green-200">
                                <p className="max-w-xs text-sm">Initial payment you will make</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">$</span>
                          <Input
                            id="downPayment"
                            type="number"
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                            className="pl-8 border-green-200 focus:border-green-400"
                          />
                        </div>
                        <div className="text-xs text-right text-black/50">
                          {((downPayment / assetValue) * 100).toFixed(1)}% of asset value
                        </div>
                      </div>
                      
                      {/* Profit Rate */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="profitRate" className="text-base font-medium">
                            Profit Rate
                          </Label>
                          <span className="text-sm font-medium text-green-700">{profitRate}%</span>
                        </div>
                        <Slider
                          id="profitRate"
                          min={1}
                          max={15}
                          step={0.1}
                          value={[profitRate]}
                          onValueChange={(value) => setProfitRate(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-black/50">
                          <span>1%</span>
                          <span>15%</span>
                        </div>
                      </div>
                      
                      {/* Term */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="term" className="text-base font-medium">
                            Term (Months)
                          </Label>
                          <span className="text-sm font-medium text-green-700">{term} months</span>
                        </div>
                        <Slider
                          id="term"
                          min={12}
                          max={60}
                          step={1}
                          value={[term]}
                          onValueChange={(value) => setTerm(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-black/50">
                          <span>12 months</span>
                          <span>60 months</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Results */}
                    {showResults && (
                      <div className="mt-8 p-6 bg-white rounded-lg border border-green-200 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <h3 className="text-lg font-bold text-green-800 mb-4">Financing Summary</h3>
                        
                        {/* Basic Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 border-b border-green-100">
                              <span className="text-sm">Asset Value:</span>
                              <span className="font-medium">${assetValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-green-100">
                              <span className="text-sm">Down Payment:</span>
                              <span className="font-medium">${downPayment.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-green-100">
                              <span className="text-sm">Down Payment Percentage:</span>
                              <span className="font-medium">{((downPayment / assetValue) * 100).toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-green-100">
                              <span className="text-sm">Financed Amount:</span>
                              <span className="font-medium">${financedAmount.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 border-b border-green-100">
                              <span className="text-sm">Profit Rate:</span>
                              <span className="font-medium">{profitRate}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-green-100">
                              <span className="text-sm">Total Profit:</span>
                              <span className="font-medium">${totalProfit.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-green-100">
                              <span className="text-sm">Term:</span>
                              <span className="font-medium">{term} months ({(term/12).toFixed(1)} years)</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-green-100">
                              <span className="text-sm">Total Amount Payable:</span>
                              <span className="font-medium">${totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Payment Details */}
                        <div className="bg-green-50/50 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-green-800 mb-3">Payment Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-2 border-b border-green-100">
                                <span className="text-sm">Monthly Payment:</span>
                                <span className="font-medium">${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 border-b border-green-100">
                                <span className="text-sm">Monthly Profit Component:</span>
                                <span className="font-medium">${(totalProfit / term).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-2 border-b border-green-100">
                                <span className="text-sm">Monthly Principal Component:</span>
                                <span className="font-medium">${(financedAmount / term).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 border-b border-green-100">
                                <span className="text-sm">Profit-to-Principal Ratio:</span>
                                <span className="font-medium">{(totalProfit / financedAmount * 100).toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Cost Comparison */}
                        <div className="bg-blue-50/50 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-blue-800 mb-3">Cost Analysis</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 border-b border-blue-100">
                              <span className="text-sm">Total Cost of Ownership:</span>
                              <span className="font-medium">${(downPayment + totalAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-blue-100">
                              <span className="text-sm">Cost Above Asset Value:</span>
                              <span className="font-medium">${(downPayment + totalAmount - assetValue).toLocaleString()} ({((downPayment + totalAmount - assetValue) / assetValue * 100).toFixed(2)}%)</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-blue-100">
                              <span className="text-sm">Effective Annual Rate:</span>
                              <span className="font-medium">{(Math.pow(1 + (profitRate/100), 1/5) - 1).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Summary Box */}
                        <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                          <div className="text-sm text-green-700 mb-1">Monthly Payment</div>
                          <div className="text-3xl font-bold text-green-700">${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className="text-xs text-green-600 mt-1">Total Amount: ${totalAmount.toLocaleString()}</div>
                        </div>
                        
                        {/* Important Notes */}
                        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                          <h4 className="font-semibold text-amber-800 mb-2">Important Notes</h4>
                          <ul className="text-xs space-y-2 text-amber-700">
                            <li>• The profit rate is fixed for the entire term of the financing.</li>
                            <li>• Early settlement is allowed without penalty.</li>
                            <li>• Administrative fees may apply and are not included in this calculation.</li>
                            <li>• This calculation assumes equal monthly installments throughout the term.</li>
                            <li>• Actual terms may vary based on your financial profile and the specific asset.</li>
                          </ul>
                        </div>
                        
                        <div className="mt-4 text-xs text-black/50 text-center">
                          This is an estimate. Final terms will be determined during the application process.
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-green-100 pt-6">
                    <Button 
                      onClick={handleCalculate}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-8 py-6"
                    >
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate Payments
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Application Process Tab */}
              <TabsContent value="process">
                <Card className="border border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                    <CardTitle>Application Process</CardTitle>
                    <CardDescription>
                      Follow these steps to apply for Murabaha financing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-8">
                      {/* Step 1 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            1
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Initial Consultation</h3>
                          <p className="text-sm text-black/70 mb-3">
                            Meet with our Islamic finance advisor to discuss your needs and determine if Murabaha
                            is the right solution for you.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-green-100 text-sm">
                            <strong className="text-green-700">Required:</strong> Identification, proof of income, and details about the asset you wish to purchase.
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 2 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            2
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Application Submission</h3>
                          <p className="text-sm text-black/70 mb-3">
                            Complete the formal application with all required documentation and submit it for review.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-green-100 text-sm">
                            <strong className="text-green-700">Required:</strong> Completed application form, financial statements, and asset specifications.
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 3 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            3
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Asset Evaluation</h3>
                          <p className="text-sm text-black/70 mb-3">
                            We evaluate the asset to ensure it meets our Shariah compliance standards and determine its fair market value.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-green-100 text-sm">
                            <strong className="text-green-700">Timeline:</strong> Typically 3-5 business days depending on the asset type.
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 4 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            4
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Offer and Agreement</h3>
                          <p className="text-sm text-black/70 mb-3">
                            We present you with a formal offer detailing the cost, profit margin, and payment schedule.
                            Upon acceptance, we prepare the Murabaha agreement.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-green-100 text-sm">
                            <strong className="text-green-700">Note:</strong> All terms are fixed at this point and will not change during the financing period.
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 5 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            5
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Asset Purchase and Transfer</h3>
                          <p className="text-sm text-black/70 mb-3">
                            We purchase the asset and then sell it to you at the agreed-upon price. You begin making
                            payments according to the schedule.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-green-100 text-sm">
                            <strong className="text-green-700">Timeline:</strong> Asset transfer typically occurs within 7-10 business days after agreement signing.
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Alert className="bg-green-50 border-green-200">
                        <AlertTitle className="text-green-800 flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-600" />
                          Ready to Apply?
                        </AlertTitle>
                        <AlertDescription className="text-black/70">
                          Start your Murabaha financing application today by scheduling a consultation with our Islamic finance advisor.
                        </AlertDescription>
                        <div className="mt-4">
                          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white">
                            Schedule Consultation
                          </Button>
                        </div>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* FAQ Tab */}
              <TabsContent value="faq">
                <Card className="border border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Common questions about Murabaha financing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="p-4 bg-white rounded-lg border border-green-100">
                        <h3 className="font-semibold text-green-800 mb-2">How is Murabaha different from a conventional loan?</h3>
                        <p className="text-sm text-black/70">
                          Unlike conventional loans that charge interest, Murabaha is a sale transaction with a transparent profit margin.
                          The bank purchases the asset and sells it to you at a marked-up price. The markup is fixed and does not compound
                          over time. Additionally, the bank must genuinely own the asset before selling it to you, making it a real trade
                          transaction rather than a pure financing arrangement.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-green-100">
                        <h3 className="font-semibold text-green-800 mb-2">Can I pay off my Murabaha financing early?</h3>
                        <p className="text-sm text-black/70">
                          Yes, you can pay off your Murabaha financing early. In many cases, we may offer a discount on the remaining
                          profit amount as a gesture of goodwill (hibah), though this is not contractually guaranteed. The exact terms
                          for early settlement will be detailed in your Murabaha agreement.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-green-100">
                        <h3 className="font-semibold text-green-800 mb-2">What types of assets can be financed through Murabaha?</h3>
                        <p className="text-sm text-black/70">
                          Murabaha can be used to finance a wide range of tangible assets, including:
                        </p>
                        <ul className="text-sm text-black/70 mt-2 space-y-1 list-disc pl-5">
                          <li>Residential and commercial properties</li>
                          <li>Vehicles and transportation equipment</li>
                          <li>Business machinery and equipment</li>
                          <li>Construction materials</li>
                          <li>Inventory and raw materials</li>
                        </ul>
                        <p className="text-sm text-black/70 mt-2">
                          The asset must be halal (permissible under Islamic law) and have a clear, identifiable value.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-green-100">
                        <h3 className="font-semibold text-green-800 mb-2">What happens if I miss a payment?</h3>
                        <p className="text-sm text-black/70">
                          If you miss a payment, we will work with you to find a solution. Unlike conventional loans, we do not charge
                          compounding interest on late payments. However, to discourage late payments, we may require a donation to charity
                          as a form of compensation. This amount does not benefit the bank and is used solely for charitable purposes.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-green-100">
                        <h3 className="font-semibold text-green-800 mb-2">Is Murabaha suitable for all financing needs?</h3>
                        <p className="text-sm text-black/70">
                          Murabaha is best suited for financing specific asset purchases. It is not appropriate for general cash financing
                          or debt consolidation. For those needs, other Islamic financing structures like Tawarruq might be more suitable.
                          Our Islamic finance advisors can help determine the most appropriate financing solution for your specific situation.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-green-100">
                        <h3 className="font-semibold text-green-800 mb-2">How is the profit rate determined?</h3>
                        <p className="text-sm text-black/70">
                          The profit rate is determined based on several factors, including:
                        </p>
                        <ul className="text-sm text-black/70 mt-2 space-y-1 list-disc pl-5">
                          <li>Current market conditions</li>
                          <li>The type and value of the asset</li>
                          <li>The financing term</li>
                          <li>Your financial profile and history</li>
                        </ul>
                        <p className="text-sm text-black/70 mt-2">
                          The profit rate is fixed at the time of the agreement and does not change throughout the financing period.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MurabahaFinance;
