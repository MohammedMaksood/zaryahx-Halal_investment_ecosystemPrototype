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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Home, Calculator, FileText, HelpCircle, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

const IjaraLeasing = () => {
  // State for calculator
  const [assetValue, setAssetValue] = useState(250000);
  const [assetType, setAssetType] = useState("property");
  const [leaseTerm, setLeaseTerm] = useState(60);
  const [rentalRate, setRentalRate] = useState(4.5);
  const [includesPurchaseOption, setIncludesPurchaseOption] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  // Calculate leasing details
  const monthlyRental = assetValue * (rentalRate / 100) / 12;
  const totalRentalPayments = monthlyRental * leaseTerm;
  const purchaseOptionPrice = includesPurchaseOption ? assetValue * 0.2 : 0;
  const totalCost = totalRentalPayments + purchaseOptionPrice;
  
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
              <h1 className="text-3xl font-bold text-black">Ijara Leasing</h1>
            </div>
            
            {/* Introduction Section */}
            <div className="mb-12 bg-gradient-to-r from-blue-50 to-blue-100/50 p-8 rounded-lg border border-blue-200">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4 text-blue-800">What is Ijara Leasing?</h2>
                  <p className="mb-4 text-black/80">
                    Ijara is a Shariah-compliant leasing arrangement where we purchase an asset and lease it to you 
                    for an agreed period. You make regular rental payments and may have the option to purchase the 
                    asset at the end of the lease term.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/70 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-700 mb-2">Key Features</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                          <span>Clear ownership structure</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                          <span>Fixed rental payments</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                          <span>Option to purchase at end of term</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-700 mb-2">Common Uses</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                          <span>Home financing</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                          <span>Commercial property</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                          <span>Equipment and machinery</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-md border border-blue-200">
                    <Home className="h-20 w-20 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ijara Tabs */}
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
                <Card className="border border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                    <CardTitle>Ijara Calculator</CardTitle>
                    <CardDescription>
                      Calculate your potential Ijara leasing payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Asset Type */}
                      <div className="space-y-2">
                        <Label htmlFor="assetType" className="text-base font-medium">
                          Asset Type
                        </Label>
                        <Select value={assetType} onValueChange={setAssetType}>
                          <SelectTrigger id="assetType" className="border-blue-200 focus:border-blue-400">
                            <SelectValue placeholder="Select asset type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="property">Residential Property</SelectItem>
                            <SelectItem value="commercial">Commercial Property</SelectItem>
                            <SelectItem value="vehicle">Vehicle</SelectItem>
                            <SelectItem value="equipment">Business Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Asset Value */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="assetValue" className="text-base font-medium">
                            Asset Value
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center cursor-help">
                                  <HelpCircle className="h-3 w-3 text-blue-600" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white p-3 shadow-lg border border-blue-200">
                                <p className="max-w-xs text-sm">The total value of the asset you wish to lease</p>
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
                            className="pl-8 border-blue-200 focus:border-blue-400"
                          />
                        </div>
                      </div>
                      
                      {/* Lease Term */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="leaseTerm" className="text-base font-medium">
                            Lease Term (Months)
                          </Label>
                          <span className="text-sm font-medium text-blue-700">{leaseTerm} months</span>
                        </div>
                        <Slider
                          id="leaseTerm"
                          min={12}
                          max={120}
                          step={12}
                          value={[leaseTerm]}
                          onValueChange={(value) => setLeaseTerm(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-black/50">
                          <span>1 year</span>
                          <span>10 years</span>
                        </div>
                      </div>
                      
                      {/* Rental Rate */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="rentalRate" className="text-base font-medium">
                            Annual Rental Rate
                          </Label>
                          <span className="text-sm font-medium text-blue-700">{rentalRate}%</span>
                        </div>
                        <Slider
                          id="rentalRate"
                          min={2}
                          max={10}
                          step={0.1}
                          value={[rentalRate]}
                          onValueChange={(value) => setRentalRate(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-black/50">
                          <span>2%</span>
                          <span>10%</span>
                        </div>
                      </div>
                      
                      {/* Purchase Option */}
                      <div className="space-y-2 col-span-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="purchaseOption" className="text-base font-medium">
                            Include Purchase Option
                          </Label>
                          <Switch
                            id="purchaseOption"
                            checked={includesPurchaseOption}
                            onCheckedChange={setIncludesPurchaseOption}
                          />
                        </div>
                        <p className="text-xs text-black/60">
                          {includesPurchaseOption 
                            ? "You will have the option to purchase the asset at the end of the lease term."
                            : "Pure leasing arrangement without purchase option at the end."}
                        </p>
                      </div>
                    </div>
                    
                    {/* Results */}
                    {showResults && (
                      <div className="mt-8 p-6 bg-white rounded-lg border border-blue-200 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <h3 className="text-lg font-bold text-blue-800 mb-4">Ijara Leasing Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 border-b border-blue-100">
                              <span className="text-sm">Asset Type:</span>
                              <span className="font-medium capitalize">{assetType}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-blue-100">
                              <span className="text-sm">Asset Value:</span>
                              <span className="font-medium">${assetValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-blue-100">
                              <span className="text-sm">Lease Term:</span>
                              <span className="font-medium">{leaseTerm} months</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 border-b border-blue-100">
                              <span className="text-sm">Annual Rental Rate:</span>
                              <span className="font-medium">{rentalRate}%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 border-b border-blue-100">
                              <span className="text-sm">Purchase Option:</span>
                              <span className="font-medium">{includesPurchaseOption ? 'Yes' : 'No'}</span>
                            </div>
                            {includesPurchaseOption && (
                              <div className="flex justify-between items-center p-2 border-b border-blue-100">
                                <span className="text-sm">Purchase Option Price:</span>
                                <span className="font-medium">${purchaseOptionPrice.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                          <div className="text-sm text-blue-700 mb-1">Monthly Rental Payment</div>
                          <div className="text-3xl font-bold text-blue-700">${monthlyRental.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits: 2 })}</div>
                          <div className="text-xs text-blue-600 mt-1">Total Payments: ${totalRentalPayments.toLocaleString()}</div>
                          {includesPurchaseOption && (
                            <div className="text-xs text-blue-600 mt-1">Total Cost (including purchase option): ${totalCost.toLocaleString()}</div>
                          )}
                        </div>
                        <div className="mt-4 text-xs text-black/50 text-center">
                          This is an estimate. Final terms will be determined during the application process.
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-blue-100 pt-6">
                    <Button 
                      onClick={handleCalculate}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-8 py-6"
                    >
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate Payments
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Application Process Tab */}
              <TabsContent value="process">
                <Card className="border border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                    <CardTitle>Application Process</CardTitle>
                    <CardDescription>
                      Follow these steps to apply for Ijara leasing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-8">
                      {/* Step 1 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            1
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Initial Consultation</h3>
                          <p className="text-sm text-black/70 mb-3">
                            Meet with our Islamic finance advisor to discuss your leasing needs and determine if Ijara
                            is the right solution for you.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm">
                            <strong className="text-blue-700">Required:</strong> Identification, proof of income, and details about the asset you wish to lease.
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 2 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            2
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Application Submission</h3>
                          <p className="text-sm text-black/70 mb-3">
                            Complete the formal application with all required documentation and submit it for review.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm">
                            <strong className="text-blue-700">Required:</strong> Completed application form, financial statements, and asset specifications.
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 3 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            3
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Asset Evaluation</h3>
                          <p className="text-sm text-black/70 mb-3">
                            We evaluate the asset to ensure it meets our Shariah compliance standards and determine its fair market value.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm">
                            <strong className="text-blue-700">Timeline:</strong> Typically 3-5 business days depending on the asset type.
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 4 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            4
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Lease Agreement</h3>
                          <p className="text-sm text-black/70 mb-3">
                            We present you with a formal lease agreement detailing the rental payments, term, and conditions.
                            If a purchase option is included, this will also be specified.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm">
                            <strong className="text-blue-700">Note:</strong> All terms are fixed at this point and will not change during the lease period.
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 5 */}
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            5
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Asset Purchase and Lease Commencement</h3>
                          <p className="text-sm text-black/70 mb-3">
                            We purchase the asset and lease it to you. You begin making rental payments according to the schedule.
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm">
                            <strong className="text-blue-700">Timeline:</strong> Lease typically commences within 7-10 business days after agreement signing.
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertTitle className="text-blue-800 flex items-center gap-2">
                          <Check className="h-5 w-5 text-blue-600" />
                          Ready to Apply?
                        </AlertTitle>
                        <AlertDescription className="text-black/70">
                          Start your Ijara leasing application today by scheduling a consultation with our Islamic finance advisor.
                        </AlertDescription>
                        <div className="mt-4">
                          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white">
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
                <Card className="border border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Common questions about Ijara leasing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="p-4 bg-white rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-800 mb-2">How is Ijara different from conventional leasing?</h3>
                        <p className="text-sm text-black/70">
                          Unlike conventional leasing, Ijara follows specific Shariah principles. The key differences include:
                          the lessor (bank) must own the asset before leasing it, maintenance responsibilities are clearly defined,
                          and the contract must avoid prohibited elements like interest (riba) and excessive uncertainty (gharar).
                          Additionally, Ijara often includes a separate agreement for the option to purchase the asset at the end of the term.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-800 mb-2">Who is responsible for maintenance in an Ijara arrangement?</h3>
                        <p className="text-sm text-black/70">
                          In a traditional Ijara, the lessor (bank) is responsible for major structural maintenance since they own the asset.
                          The lessee (you) is typically responsible for routine maintenance related to the use of the asset.
                          However, many modern Ijara agreements include service agency agreements where the lessee handles all maintenance
                          on behalf of the lessor for a fee or  of the rental payments. The specific responsibilities will be
                          clearly outlined in your Ijara agreement.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-800 mb-2">What happens at the end of the Ijara term?</h3>
                        <p className="text-sm text-black/70">
                          At the end of the Ijara term, you have several options depending on your agreement:
                        </p>
                        <ul className="text-sm text-black/70 mt-2 space-y-1 list-disc pl-5">
                          <li>If your agreement includes a purchase option (Ijara wa Iqtina), you can exercise this option to buy the asset.</li>
                          <li>You may return the asset to the bank, ending all obligations.</li>
                          <li>In some cases, you may be able to renew the lease for an additional term.</li>
                          <li>Some agreements include a gift (Hiba) clause where ownership transfers to you at the end of the term.</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-800 mb-2">Can I terminate an Ijara lease early?</h3>
                        <p className="text-sm text-black/70">
                          Yes, you can typically terminate an Ijara lease early, but the specific terms will depend on your agreement.
                          Early termination may involve:
                        </p>
                        <ul className="text-sm text-black/70 mt-2 space-y-1 list-disc pl-5">
                          <li>Paying the remaining lease payments (or a portion thereof)</li>
                          <li>Purchasing the asset at an agreed-upon price</li>
                          <li>Finding another lessee to take over the lease (subject to approval)</li>
                        </ul>
                        <p className="text-sm text-black/70 mt-2">
                          The exact terms for early termination will be detailed in your Ijara agreement.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-800 mb-2">What types of assets can be financed through Ijara?</h3>
                        <p className="text-sm text-black/70">
                          Ijara can be used to finance a wide range of tangible assets, including:
                        </p>
                        <ul className="text-sm text-black/70 mt-2 space-y-1 list-disc pl-5">
                          <li>Residential and commercial properties</li>
                          <li>Vehicles and transportation equipment</li>
                          <li>Manufacturing machinery and equipment</li>
                          <li>Medical equipment</li>
                          <li>Office equipment and furniture</li>
                          <li>Agricultural equipment</li>
                        </ul>
                        <p className="text-sm text-black/70 mt-2">
                          The asset must be halal (permissible under Islamic law), have a useful life longer than the lease term,
                          and have a clear, identifiable value.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-blue-800 mb-2">How are rental rates determined in Ijara?</h3>
                        <p className="text-sm text-black/70">
                          Rental rates in Ijara are determined based on several factors, including:
                        </p>
                        <ul className="text-sm text-black/70 mt-2 space-y-1 list-disc pl-5">
                          <li>Current market rental rates for similar assets</li>
                          <li>The value and type of the asset</li>
                          <li>The lease term</li>
                          <li>Your financial profile and history</li>
                          <li>Maintenance responsibilities allocation</li>
                        </ul>
                        <p className="text-sm text-black/70 mt-2">
                          The rental rate is fixed at the time of the agreement for the entire lease period, providing certainty in your payments.
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

export default IjaraLeasing;
