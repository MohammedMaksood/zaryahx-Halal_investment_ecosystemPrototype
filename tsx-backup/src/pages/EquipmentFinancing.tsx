import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Calculator, 
  FileText, 
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Settings,
  Clock,
  Building,
  Wrench,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EquipmentFinancing: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculator state
  const [equipmentValue, setEquipmentValue] = useState<number>(50000);
  const [downPayment, setDownPayment] = useState<number>(10000);
  const [financingTerm, setFinancingTerm] = useState<number>(36);
  const [financingType, setFinancingType] = useState<string>("ijara");
  const [equipmentType, setEquipmentType] = useState<string>("industrial");
  const [includesMaintenance, setIncludesMaintenance] = useState<boolean>(false);
  
  // Helper functions for calculations
  const calculateFinancingAmount = () => {
    return equipmentValue - downPayment;
  };
  
  const calculateMonthlyPayment = () => {
    const financingAmount = calculateFinancingAmount();
    let rate = 0;
    
    // Different rates based on financing type and equipment type
    if (financingType === "ijara") {
      rate = equipmentType === "industrial" ? 0.0055 : 
             equipmentType === "vehicle" ? 0.0060 : 
             equipmentType === "medical" ? 0.0050 : 
             equipmentType === "office" ? 0.0065 : 
             equipmentType === "construction" ? 0.0070 : 0.0060;
    } else if (financingType === "diminishing") {
      rate = equipmentType === "industrial" ? 0.0050 : 
             equipmentType === "vehicle" ? 0.0055 : 
             equipmentType === "medical" ? 0.0045 : 
             equipmentType === "office" ? 0.0060 : 
             equipmentType === "construction" ? 0.0065 : 0.0055;
    } else { // murabaha
      rate = equipmentType === "industrial" ? 0.0060 : 
             equipmentType === "vehicle" ? 0.0065 : 
             equipmentType === "medical" ? 0.0055 : 
             equipmentType === "office" ? 0.0070 : 
             equipmentType === "construction" ? 0.0075 : 0.0065;
    }
    
    // Add maintenance premium if selected
    if (includesMaintenance) {
      rate += 0.0015;
    }
    
    // Calculate monthly payment (simplified calculation)
    const monthlyRate = rate;
    const totalPayments = financingTerm;
    
    // For Ijara (simple division plus rental rate)
    if (financingType === "ijara") {
      return (financingAmount / totalPayments) + (financingAmount * monthlyRate);
    }
    // For Diminishing Musharaka (decreasing payment schedule approximation)
    else if (financingType === "diminishing") {
      return (financingAmount / totalPayments) + (financingAmount * monthlyRate * (1 - (totalPayments / (totalPayments * 2))));
    }
    // For Murabaha (fixed total cost divided by months)
    else {
      const totalProfit = financingAmount * monthlyRate * totalPayments;
      return (financingAmount + totalProfit) / totalPayments;
    }
  };
  
  const calculateTotalPayments = () => {
    return calculateMonthlyPayment() * financingTerm;
  };
  
  const calculateTotalCost = () => {
    return downPayment + calculateTotalPayments();
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <>
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
              <Truck className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-3xl font-bold">Equipment Financing</h1>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <h2 className="text-2xl font-semibold mb-4">Shariah-Compliant Equipment Financing</h2>
                  <p className="text-gray-700 mb-4">
                    Our Ijara-based equipment financing provides businesses with a Shariah-compliant way to acquire 
                    the machinery, vehicles, and technology needed for growth and operations, without compromising 
                    on Islamic principles.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Unlike conventional equipment loans that involve interest, our Ijara (leasing) structure ensures 
                    that your business can access essential equipment while maintaining adherence to Islamic finance 
                    principles of transparency, fairness, and ethical business practices.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 mt-6">Key Features of Equipment Financing</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>100% Shariah-compliant structure</li>
                    <li>Flexible lease terms from 1-7 years</li>
                    <li>Option to purchase at end of lease term</li>
                    <li>Wide range of equipment categories</li>
                    <li>Maintenance options available</li>
                    <li>Competitive rental rates</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-6 flex flex-col justify-center">
                  <div className="text-center mb-4">
                    <Settings className="h-16 w-16 text-amber-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-amber-800">Business Equipment Solutions</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>No interest or hidden fees</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Clear ownership structure</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Fast approval process</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Dedicated business support</span>
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
                    <TrendingUp className="h-5 w-5 mr-2 text-amber-600" />
                    Equipment Financing Solutions
                  </CardTitle>
                  <CardDescription>
                    Explore our range of Shariah-compliant equipment financing options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Ijara Equipment Leasing</h3>
                      <p className="text-gray-700">
                        Our core equipment financing product uses the Ijara (leasing) structure, where we purchase the equipment 
                        and lease it to your business for a fixed term. You make regular rental payments and have the option to 
                        purchase the equipment at the end of the lease term. This structure ensures full Shariah compliance while 
                        providing your business with the equipment it needs.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Diminishing Musharaka for Equipment</h3>
                      <p className="text-gray-700">
                        For businesses looking to gradually own their equipment, our Diminishing Musharaka structure creates a 
                        partnership where you progressively increase your ownership share through regular payments. This option 
                        combines the benefits of leasing with a clear path to ownership, all while maintaining Shariah compliance.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Murabaha Equipment Purchase</h3>
                      <p className="text-gray-700">
                        For businesses preferring immediate ownership, our Murabaha structure allows us to purchase the equipment 
                        and sell it to you at a transparent markup, with payments spread over time. This cost-plus financing approach 
                        provides a straightforward alternative to interest-based loans for equipment acquisition.
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Equipment Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-amber-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Industrial Machinery</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Manufacturing equipment, processing machinery, industrial robots, assembly line systems, and specialized production tools.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Commercial Vehicles</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Delivery trucks, vans, forklifts, tractors, construction vehicles, and specialized transport equipment.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Medical Equipment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Diagnostic devices, treatment equipment, laboratory instruments, and specialized medical technology.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Office Technology</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Computer systems, servers, networking equipment, telecommunications systems, and office automation.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Construction Equipment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Excavators, bulldozers, cranes, concrete mixers, compactors, and other heavy construction machinery.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-amber-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Specialized Equipment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Industry-specific tools and machinery for agriculture, hospitality, retail, education, and other sectors.
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
                    <Calculator className="h-5 w-5 mr-2 text-amber-600" />
                    Equipment Financing Calculator
                  </CardTitle>
                  <CardDescription>
                    Estimate monthly payments and total cost for your equipment financing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="financingType" className="flex items-center">
                          Financing Structure
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Select the type of Shariah-compliant financing structure you prefer.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={financingType}
                          onValueChange={(value) => setFinancingType(value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select financing type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ijara">Ijara Leasing</SelectItem>
                            <SelectItem value="diminishing">Diminishing Musharaka</SelectItem>
                            <SelectItem value="murabaha">Murabaha Purchase</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="equipmentValue" className="flex items-center">
                          Equipment Value
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The total cost of the equipment you want to finance.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1 relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="equipmentValue"
                            type="number"
                            className="pl-8"
                            value={equipmentValue}
                            onChange={(e) => setEquipmentValue(Number(e.target.value))}
                            min={1000}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="downPayment" className="flex items-center">
                          Down Payment
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The initial payment you'll make upfront.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1 relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="downPayment"
                            type="number"
                            className="pl-8"
                            value={downPayment}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value <= equipmentValue) {
                                setDownPayment(value);
                              }
                            }}
                            min={0}
                            max={equipmentValue}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {((downPayment / equipmentValue) * 100).toFixed(1)}% of equipment value
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="financingTerm" className="flex items-center">
                          Financing Term (months)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The duration of your financing in months.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={financingTerm.toString()}
                          onValueChange={(value) => setFinancingTerm(Number(value))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12 months (1 year)</SelectItem>
                            <SelectItem value="24">24 months (2 years)</SelectItem>
                            <SelectItem value="36">36 months (3 years)</SelectItem>
                            <SelectItem value="48">48 months (4 years)</SelectItem>
                            <SelectItem value="60">60 months (5 years)</SelectItem>
                            <SelectItem value="72">72 months (6 years)</SelectItem>
                            <SelectItem value="84">84 months (7 years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="equipmentType" className="flex items-center">
                          Equipment Type
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The category of equipment you're financing.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={equipmentType}
                          onValueChange={(value) => setEquipmentType(value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select equipment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="industrial">Industrial Machinery</SelectItem>
                            <SelectItem value="vehicle">Commercial Vehicles</SelectItem>
                            <SelectItem value="medical">Medical Equipment</SelectItem>
                            <SelectItem value="office">Office Technology</SelectItem>
                            <SelectItem value="construction">Construction Equipment</SelectItem>
                            <SelectItem value="other">Other Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="includesMaintenance"
                          checked={includesMaintenance}
                          onChange={(e) => setIncludesMaintenance(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <Label htmlFor="includesMaintenance" className="flex items-center">
                          Include Maintenance Package
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Includes regular maintenance and servicing for the equipment.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-amber-800">Financing Summary</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Financing Structure</h4>
                          <p className="text-lg font-medium">
                            {financingType === "ijara" ? "Ijara Leasing" : 
                             financingType === "diminishing" ? "Diminishing Musharaka" : 
                             "Murabaha Purchase"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {financingType === "ijara" ? "Lease with option to purchase" : 
                             financingType === "diminishing" ? "Gradual ownership transfer" : 
                             "Immediate ownership with deferred payment"}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Equipment Value</h4>
                            <p className="text-lg font-medium">{formatCurrency(equipmentValue)}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Financing Amount</h4>
                            <p className="text-lg font-medium">{formatCurrency(calculateFinancingAmount())}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-500">Monthly Payment</h4>
                            <p className="text-2xl font-semibold text-amber-700">
                              {formatCurrency(calculateMonthlyPayment())}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            For {financingTerm} months ({(financingTerm / 12).toFixed(1)} years)
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Down Payment</h4>
                            <p className="text-lg font-medium">{formatCurrency(downPayment)}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Total Payments</h4>
                            <p className="text-lg font-medium">{formatCurrency(calculateTotalPayments())}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Total Cost</h4>
                          <p className="text-xl font-semibold">{formatCurrency(calculateTotalCost())}</p>
                        </div>
                        
                        {includesMaintenance && (
                          <div className="bg-white rounded-md p-4 border border-amber-100">
                            <h4 className="font-medium mb-2 flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                              Maintenance Package Included
                            </h4>
                            <p className="text-sm text-gray-700">
                              Your monthly payment includes regular maintenance and servicing for the equipment 
                              throughout the financing term.
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700">
                            Apply for Financing
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    Note: This calculator provides estimates only. Actual terms and payments may vary based on equipment specifics, 
                    business qualifications, and other factors. Please contact our equipment financing team for a precise quote.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="process">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-amber-600" />
                    Equipment Financing Application Process
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to apply for Shariah-compliant equipment financing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-200 ml-3.5"></div>
                      
                      {/* Step 1 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-amber-600 text-white flex items-center justify-center h-7 w-7">
                          1
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Equipment Selection</h3>
                        <p className="text-gray-700 mb-4">
                          Identify the equipment your business needs and gather detailed specifications, pricing, and vendor information.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Preparation Checklist:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Equipment specifications and model information</li>
                            <li>Vendor quotes and contact details</li>
                            <li>Equipment purpose and business justification</li>
                            <li>Expected useful life and maintenance requirements</li>
                          </ul>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
                            Equipment Catalog
                          </Button>
                        </div>
                      </div>
                      
                      {/* Step 2 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-amber-600 text-white flex items-center justify-center h-7 w-7">
                          2
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Initial Consultation</h3>
                        <p className="text-gray-700 mb-4">
                          Meet with our equipment financing specialists to discuss your business needs, equipment requirements, and the most suitable Shariah-compliant financing structure.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Discussion Points:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Business operations and equipment usage</li>
                            <li>Financing structure options (Ijara, Diminishing Musharaka, Murabaha)</li>
                            <li>Term length and payment preferences</li>
                            <li>Maintenance and insurance requirements</li>
                            <li>End-of-term options</li>
                          </ul>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
                            Schedule Consultation
                          </Button>
                        </div>
                      </div>
                      
                      {/* Step 3 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-amber-600 text-white flex items-center justify-center h-7 w-7">
                          3
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Formal Application & Documentation</h3>
                        <p className="text-gray-700 mb-4">
                          Submit your formal application along with all required business and financial documentation for review.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Required Documentation:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Completed equipment financing application</li>
                            <li>Business registration and license documents</li>
                            <li>Financial statements (last 2-3 years)</li>
                            <li>Bank statements (last 6 months)</li>
                            <li>Tax returns (last 2 years)</li>
                            <li>Equipment purchase order or proforma invoice</li>
                            <li>Business plan (for new businesses)</li>
                          </ul>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
                            Download Application Form
                          </Button>
                          <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
                            Online Application
                          </Button>
                        </div>
                      </div>
                      
                      {/* Step 4 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-amber-600 text-white flex items-center justify-center h-7 w-7">
                          4
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Application Review & Shariah Approval</h3>
                        <p className="text-gray-700 mb-4">
                          Our team will review your application for financial eligibility and our Shariah board will ensure the equipment and financing structure comply with Islamic principles.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-amber-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Financial Review:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                              <li>Business financial health assessment</li>
                              <li>Cash flow analysis</li>
                              <li>Credit history evaluation</li>
                              <li>Equipment value verification</li>
                            </ul>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Shariah Compliance Review:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                              <li>Equipment usage verification (halal purposes)</li>
                              <li>Contract structure assessment</li>
                              <li>Ownership and risk distribution</li>
                              <li>Fee structure validation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 5 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-amber-600 text-white flex items-center justify-center h-7 w-7">
                          5
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Agreement & Documentation</h3>
                        <p className="text-gray-700 mb-4">
                          Upon approval, we'll prepare the Shariah-compliant financing agreement based on the selected structure (Ijara, Diminishing Musharaka, or Murabaha).
                        </p>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Agreement Components:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Equipment specifications and value</li>
                            <li>Financing structure and terms</li>
                            <li>Payment schedule and amounts</li>
                            <li>Maintenance responsibilities</li>
                            <li>Insurance requirements</li>
                            <li>End-of-term options</li>
                            <li>Early termination provisions</li>
                          </ul>
                        </div>
                      </div>
                      
                      {/* Step 6 */}
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 rounded-full bg-amber-600 text-white flex items-center justify-center h-7 w-7">
                          6
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Equipment Acquisition & Financing Activation</h3>
                        <p className="text-gray-700 mb-4">
                          We'll acquire the equipment from the vendor according to the agreed financing structure, and you'll begin using the equipment under the terms of the agreement.
                        </p>
                        <div className="bg-green-50 p-4 rounded-md border border-green-200">
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium mb-1">Ongoing Support</h4>
                              <p className="text-sm text-gray-700">
                                Throughout the financing term, our dedicated equipment financing team will provide support for any questions or needs that arise, including maintenance coordination if included in your agreement.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-amber-800">Application Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Initial Consultation</div>
                          <div className="w-2/3 text-sm">1-2 business days to schedule</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Application Review</div>
                          <div className="w-2/3 text-sm">3-5 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Shariah Approval</div>
                          <div className="w-2/3 text-sm">2-3 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Documentation</div>
                          <div className="w-2/3 text-sm">2-3 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Equipment Acquisition</div>
                          <div className="w-2/3 text-sm">Depends on vendor (typically 1-4 weeks)</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        * Timeline may vary based on equipment complexity, documentation completeness, and vendor availability.
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button className="bg-amber-600 hover:bg-amber-700">
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
                    <HelpCircle className="h-5 w-5 mr-2 text-amber-600" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Common questions about Shariah-compliant equipment financing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left font-medium">What makes equipment financing Shariah-compliant?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>Shariah-compliant equipment financing follows Islamic principles that prohibit interest (riba) and excessive uncertainty (gharar). Our equipment financing uses structures such as:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><span className="font-medium">Ijara (Leasing):</span> We purchase the equipment and lease it to you for a fixed term with agreed-upon payments.</li>
                            <li><span className="font-medium">Diminishing Musharaka:</span> We co-own the equipment with you initially, and you gradually purchase our share over time.</li>
                            <li><span className="font-medium">Murabaha:</span> We purchase the equipment and sell it to you at a transparent markup, with payments made over time.</li>
                          </ul>
                          <p className="mt-2">All our financing structures are reviewed and approved by our Shariah Board to ensure compliance with Islamic principles.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left font-medium">What types of equipment can be financed?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>We offer financing for a wide range of business equipment, including but not limited to:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Manufacturing machinery and production equipment</li>
                            <li>Construction equipment</li>
                            <li>Medical and healthcare equipment</li>
                            <li>Agricultural machinery</li>
                            <li>Transportation and logistics equipment</li>
                            <li>Restaurant and food service equipment</li>
                            <li>Office technology and IT infrastructure</li>
                            <li>Renewable energy equipment</li>
                          </ul>
                          <p className="mt-2">The equipment must be used for halal (permissible) business activities and have a useful life that aligns with the financing term.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left font-medium">What are the minimum and maximum financing amounts?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>Our equipment financing options are designed to accommodate businesses of various sizes:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><span className="font-medium">Minimum financing amount:</span> $10,000</li>
                            <li><span className="font-medium">Maximum financing amount:</span> $5,000,000</li>
                          </ul>
                          <p className="mt-2">Larger financing amounts may be considered on a case-by-case basis for established businesses with strong financial profiles. For smaller equipment needs under $10,000, we recommend exploring our Murabaha small business financing options.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger className="text-left font-medium">What are the typical financing terms?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>Our equipment financing terms are structured to align with the useful life of the equipment:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><span className="font-medium">Short-term:</span> 12-24 months</li>
                            <li><span className="font-medium">Medium-term:</span> 2-5 years</li>
                            <li><span className="font-medium">Long-term:</span> 5-7 years</li>
                          </ul>
                          <p className="mt-2">The appropriate term depends on several factors, including the type of equipment, its expected useful life, your business cash flow, and the financing structure selected. Our financing specialists will work with you to determine the most suitable term for your specific situation.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5">
                        <AccordionTrigger className="text-left font-medium">How is the profit rate determined?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>Instead of charging interest, our Shariah-compliant financing uses transparent profit rates. These rates are determined based on several factors:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Your business's financial strength and credit history</li>
                            <li>The equipment type and its expected depreciation</li>
                            <li>The financing term length</li>
                            <li>The financing structure selected (Ijara, Diminishing Musharaka, or Murabaha)</li>
                            <li>Current market conditions</li>
                          </ul>
                          <p className="mt-2">Our profit rates are competitive with conventional equipment financing but structured in a way that complies with Islamic principles. The profit rate is fixed for the duration of the financing term, providing you with payment certainty.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-6">
                        <AccordionTrigger className="text-left font-medium">What happens at the end of the financing term?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>End-of-term options vary based on the financing structure:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><span className="font-medium">Ijara (Leasing):</span> You typically have the option to:</li>
                            <ul className="list-circle pl-5 mt-1 mb-2 space-y-1">
                              <li>Receive the equipment as a gift (hibah) upon completion of all payments</li>
                              <li>Purchase the equipment at fair market value</li>
                              <li>Return the equipment (if specified in the agreement)</li>
                              <li>Renew the lease for an additional term at a reduced rate</li>
                            </ul>
                            <li><span className="font-medium">Diminishing Musharaka:</span> You will own 100% of the equipment after purchasing our share over the financing term.</li>
                            <li><span className="font-medium">Murabaha:</span> You already own the equipment, as Murabaha is a purchase arrangement with deferred payments.</li>
                          </ul>
                          <p className="mt-2">The specific end-of-term options will be clearly outlined in your financing agreement.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-7">
                        <AccordionTrigger className="text-left font-medium">Who is responsible for equipment maintenance and insurance?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>Responsibility for maintenance and insurance depends on the financing structure:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><span className="font-medium">Ijara (Leasing):</span> As the owner, we are technically responsible for major maintenance. However, most agreements include a service agency agreement where you handle maintenance on our behalf. Insurance is typically your responsibility, with us named as an additional insured party.</li>
                            <li><span className="font-medium">Diminishing Musharaka:</span> Maintenance and insurance responsibilities are shared proportionally based on ownership percentages, though you typically handle the practical aspects of both.</li>
                            <li><span className="font-medium">Murabaha:</span> Since you own the equipment after purchase, you are fully responsible for maintenance and insurance.</li>
                          </ul>
                          <p className="mt-2">We offer optional maintenance packages for certain equipment types, which can be included in your financing arrangement for convenience.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-8">
                        <AccordionTrigger className="text-left font-medium">Can I pay off my equipment financing early?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>Yes, early payoff options are available for all our financing structures:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><span className="font-medium">Ijara (Leasing):</span> You can terminate the lease early by purchasing the equipment at its fair market value or at a pre-agreed formula.</li>
                            <li><span className="font-medium">Diminishing Musharaka:</span> You can accelerate the purchase of our ownership share at any time.</li>
                            <li><span className="font-medium">Murabaha:</span> Since the total cost is fixed at the beginning, early payment does not reduce the overall cost. However, we may offer a discretionary rebate (hibah) for early payment, which cannot be contractually promised in advance (to maintain Shariah compliance).</li>
                          </ul>
                          <p className="mt-2">Details regarding early payoff options will be clearly outlined in your financing agreement.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-9">
                        <AccordionTrigger className="text-left font-medium">What documentation is required for equipment financing?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>Required documentation typically includes:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Completed equipment financing application</li>
                            <li>Business registration and license documents</li>
                            <li>Financial statements (last 2-3 years)</li>
                            <li>Bank statements (last 6 months)</li>
                            <li>Tax returns (last 2 years)</li>
                            <li>Equipment specifications and vendor quotes</li>
                            <li>Business plan (for newer businesses)</li>
                          </ul>
                          <p className="mt-2">Additional documentation may be required based on your business structure, financing amount, and the specific equipment being financed.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-10">
                        <AccordionTrigger className="text-left font-medium">How long does the approval process take?</AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          <p>Our approval process typically follows this timeline:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><span className="font-medium">Initial review:</span> 1-2 business days after receiving a complete application</li>
                            <li><span className="font-medium">Financial assessment:</span> 3-5 business days</li>
                            <li><span className="font-medium">Shariah compliance review:</span> 2-3 business days</li>
                            <li><span className="font-medium">Final approval and documentation:</span> 2-3 business days</li>
                          </ul>
                          <p className="mt-2">For straightforward applications with all documentation in order, the entire process from application to approval can take 7-10 business days. More complex financing arrangements or incomplete documentation may extend this timeline.</p>
                          <p className="mt-2">After approval, the equipment acquisition timeline depends on vendor availability and delivery schedules.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <div className="bg-amber-50 p-6 rounded-lg mt-8">
                      <div className="flex items-start">
                        <AlertCircle className="h-6 w-6 text-amber-600 mr-3 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
                          <p className="text-gray-700 mb-4">Our equipment financing specialists are available to answer any additional questions you may have about our Shariah-compliant financing options.</p>
                          <div className="flex space-x-4">
                            <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
                              Schedule a Consultation
                            </Button>
                            <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </>
  );
};

export default EquipmentFinancing;
