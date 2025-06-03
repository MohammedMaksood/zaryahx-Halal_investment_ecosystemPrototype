import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Calculator, 
  FileText, 
  HelpCircle,
  TrendingUp,
  Ship,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Briefcase,
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

// Helper functions for fee calculation
const calculateIssuanceFee = (amount: number, product: string, currency: string): string => {
  let fee = 0;
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
  
  switch (product) {
    case "letter_of_credit":
      fee = Math.max(200, amount * 0.0025); // 0.25% with minimum $200
      break;
    case "import_finance":
      fee = Math.max(250, amount * 0.002); // 0.2% with minimum $250
      break;
    case "export_finance":
      fee = Math.max(200, amount * 0.0015); // 0.15% with minimum $200
      break;
    case "shipping_guarantee":
      fee = Math.max(150, amount * 0.001); // 0.1% with minimum $150
      break;
    case "bank_guarantee":
      fee = Math.max(300, amount * 0.003); // 0.3% with minimum $300
      break;
    default:
      fee = 200;
  }
  
  return `${currencySymbol}${fee.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const calculateProcessingFee = (amount: number, product: string, currency: string): string => {
  let fee = 0;
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
  
  switch (product) {
    case "letter_of_credit":
      fee = Math.min(500, Math.max(100, amount * 0.001)); // 0.1% with min $100, max $500
      break;
    case "import_finance":
      fee = Math.min(600, Math.max(150, amount * 0.0012)); // 0.12% with min $150, max $600
      break;
    case "export_finance":
      fee = Math.min(400, Math.max(100, amount * 0.0008)); // 0.08% with min $100, max $400
      break;
    case "shipping_guarantee":
      fee = 100; // Flat fee
      break;
    case "bank_guarantee":
      fee = Math.min(450, Math.max(150, amount * 0.001)); // 0.1% with min $150, max $450
      break;
    default:
      fee = 100;
  }
  
  return `${currencySymbol}${fee.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const calculateCommissionRate = (product: string, tenor: number): number => {
  let baseRate = 0;
  
  switch (product) {
    case "letter_of_credit":
      baseRate = 0.25;
      break;
    case "import_finance":
      baseRate = 0.3;
      break;
    case "export_finance":
      baseRate = 0.2;
      break;
    case "shipping_guarantee":
      baseRate = 0.15;
      break;
    case "bank_guarantee":
      baseRate = 0.35;
      break;
    default:
      baseRate = 0.25;
  }
  
  // Adjust rate based on tenor
  if (tenor <= 30) {
    return baseRate;
  } else if (tenor <= 90) {
    return baseRate + 0.1;
  } else if (tenor <= 180) {
    return baseRate + 0.2;
  } else {
    return baseRate + 0.3;
  }
};

const calculateCommission = (amount: number, product: string, tenor: number, currency: string): string => {
  const rate = calculateCommissionRate(product, tenor);
  const commission = amount * (rate / 100);
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
  
  return `${currencySymbol}${commission.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const calculateTotalFees = (amount: number, product: string, tenor: number, currency: string): string => {
  let issuanceFee = 0;
  switch (product) {
    case "letter_of_credit":
      issuanceFee = Math.max(200, amount * 0.0025);
      break;
    case "import_finance":
      issuanceFee = Math.max(250, amount * 0.002);
      break;
    case "export_finance":
      issuanceFee = Math.max(200, amount * 0.0015);
      break;
    case "shipping_guarantee":
      issuanceFee = Math.max(150, amount * 0.001);
      break;
    case "bank_guarantee":
      issuanceFee = Math.max(300, amount * 0.003);
      break;
    default:
      issuanceFee = 200;
  }
  
  let processingFee = 0;
  switch (product) {
    case "letter_of_credit":
      processingFee = Math.min(500, Math.max(100, amount * 0.001));
      break;
    case "import_finance":
      processingFee = Math.min(600, Math.max(150, amount * 0.0012));
      break;
    case "export_finance":
      processingFee = Math.min(400, Math.max(100, amount * 0.0008));
      break;
    case "shipping_guarantee":
      processingFee = 100;
      break;
    case "bank_guarantee":
      processingFee = Math.min(450, Math.max(150, amount * 0.001));
      break;
    default:
      processingFee = 100;
  }
  
  const rate = calculateCommissionRate(product, tenor);
  const commission = amount * (rate / 100);
  
  const swiftFee = currency === "USD" ? 50 : currency === "EUR" ? 45 : 40;
  const amendmentFee = product === "letter_of_credit" ? (currency === "USD" ? 100 : currency === "EUR" ? 90 : 80) : 0;
  
  const totalFee = issuanceFee + processingFee + commission + swiftFee + amendmentFee;
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
  
  return `${currencySymbol}${totalFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const calculateFeesPercentage = (amount: number, product: string, tenor: number): string => {
  let issuanceFee = 0;
  switch (product) {
    case "letter_of_credit":
      issuanceFee = Math.max(200, amount * 0.0025);
      break;
    case "import_finance":
      issuanceFee = Math.max(250, amount * 0.002);
      break;
    case "export_finance":
      issuanceFee = Math.max(200, amount * 0.0015);
      break;
    case "shipping_guarantee":
      issuanceFee = Math.max(150, amount * 0.001);
      break;
    case "bank_guarantee":
      issuanceFee = Math.max(300, amount * 0.003);
      break;
    default:
      issuanceFee = 200;
  }
  
  let processingFee = 0;
  switch (product) {
    case "letter_of_credit":
      processingFee = Math.min(500, Math.max(100, amount * 0.001));
      break;
    case "import_finance":
      processingFee = Math.min(600, Math.max(150, amount * 0.0012));
      break;
    case "export_finance":
      processingFee = Math.min(400, Math.max(100, amount * 0.0008));
      break;
    case "shipping_guarantee":
      processingFee = 100;
      break;
    case "bank_guarantee":
      processingFee = Math.min(450, Math.max(150, amount * 0.001));
      break;
    default:
      processingFee = 100;
  }
  
  const rate = calculateCommissionRate(product, tenor);
  const commission = amount * (rate / 100);
  
  const swiftFee = 50; // Using USD as base
  const amendmentFee = product === "letter_of_credit" ? 100 : 0;
  
  const totalFee = issuanceFee + processingFee + commission + swiftFee + amendmentFee;
  const percentage = (totalFee / amount) * 100;
  
  return percentage.toFixed(2);
};

const TradeFinance: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculator state
  const [transactionAmount, setTransactionAmount] = useState<number>(100000);
  const [transactionCurrency, setTransactionCurrency] = useState<string>("USD");
  const [productType, setProductType] = useState<string>("letter_of_credit");
  const [tenor, setTenor] = useState<number>(90);
  const [importerCountry, setImporterCountry] = useState<string>("UAE");
  const [exporterCountry, setExporterCountry] = useState<string>("Malaysia");
  const [commodityType, setCommodityType] = useState<string>("consumer_goods");

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
              <Globe className="h-8 w-8 text-teal-600 mr-3" />
              <h1 className="text-3xl font-bold">Islamic Trade Finance</h1>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <h2 className="text-2xl font-semibold mb-4">Shariah-Compliant Trade Finance</h2>
                  <p className="text-gray-700 mb-4">
                    Islamic Trade Finance provides Shariah-compliant solutions for businesses engaged in international trade, 
                    ensuring that all transactions adhere to Islamic principles while facilitating global commerce.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Our trade finance solutions replace interest-based conventional letters of credit with 
                    structures based on Islamic contracts such as Murabaha (cost-plus), Wakala (agency), and Musharaka (partnership),
                    enabling businesses to conduct international trade in accordance with their faith.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 mt-6">Key Features of Islamic Trade Finance</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Shariah-compliant letters of credit</li>
                    <li>Import and export financing</li>
                    <li>Trade guarantees and documentary collections</li>
                    <li>Supply chain financing</li>
                    <li>Commodity Murabaha structures</li>
                    <li>International payment solutions</li>
                  </ul>
                </div>
                
                <div className="bg-teal-50 rounded-lg p-6 flex flex-col justify-center">
                  <div className="text-center mb-4">
                    <Ship className="h-16 w-16 text-teal-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-teal-800">Global Trade Solutions</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>100% Shariah-compliant structures</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Global network of correspondent banks</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Competitive fee structure</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span>Fast processing and issuance</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calculator">Fee Calculator</TabsTrigger>
              <TabsTrigger value="process">Application Process</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-teal-600" />
                    Islamic Trade Finance Solutions
                  </CardTitle>
                  <CardDescription>
                    Explore our range of Shariah-compliant trade finance products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Letters of Credit (LC)</h3>
                      <p className="text-gray-700">
                        Our Shariah-compliant Letters of Credit provide security for both importers and exporters in international trade transactions. 
                        Unlike conventional LCs which involve interest, our Islamic LCs are structured using permissible contracts such as Wakala (agency) 
                        and Murabaha (cost-plus), ensuring that all parties can trade with confidence while adhering to Islamic principles.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Import Financing</h3>
                      <p className="text-gray-700">
                        Our import financing solutions use Murabaha (cost-plus) structures to help businesses purchase goods from international suppliers. 
                        We purchase the goods on your behalf and sell them to you at a transparent markup, with payment deferred for an agreed period, 
                        providing you with the working capital needed without resorting to interest-based loans.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Export Financing</h3>
                      <p className="text-gray-700">
                        For exporters, we offer pre-shipment and post-shipment financing based on Islamic principles. 
                        These solutions provide working capital to fulfill export orders and bridge the gap between shipment and payment receipt, 
                        using structures like Salam (advance payment) and Musharaka (partnership) to ensure Shariah compliance.
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Trade Finance Structures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-teal-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Murabaha LC</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            The bank purchases goods from the supplier and sells them to the importer at a marked-up price, 
                            with payment deferred for an agreed period. This replaces interest with a transparent profit margin.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-teal-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Wakala LC</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            The bank acts as an agent (Wakil) for the importer, handling the LC process for a fixed agency fee 
                            rather than charging interest. This agency relationship ensures Shariah compliance.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-teal-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Musharaka Trade Financing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            A partnership structure where the bank and business share the ownership of goods being traded, 
                            with profits distributed according to a pre-agreed ratio, replacing interest with profit-sharing.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-teal-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">Salam-based Export Financing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Advance payment for future delivery of goods, providing exporters with immediate working capital 
                            while giving the bank ownership of future goods, eliminating the need for interest.
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
                    <Calculator className="h-5 w-5 mr-2 text-teal-600" />
                    Trade Finance Fee Calculator
                  </CardTitle>
                  <CardDescription>
                    Estimate fees for various Islamic trade finance products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="productType" className="flex items-center">
                          Trade Finance Product
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Select the type of trade finance product you need.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={productType}
                          onValueChange={(value) => setProductType(value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="letter_of_credit">Letter of Credit (LC)</SelectItem>
                            <SelectItem value="import_finance">Import Finance (Murabaha)</SelectItem>
                            <SelectItem value="export_finance">Export Finance</SelectItem>
                            <SelectItem value="shipping_guarantee">Shipping Guarantee</SelectItem>
                            <SelectItem value="bank_guarantee">Bank Guarantee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="transactionAmount" className="flex items-center">
                          Transaction Amount
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The total value of the trade transaction.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="flex space-x-2 mt-1">
                          <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              {transactionCurrency === "USD" ? "$" : transactionCurrency === "EUR" ? "€" : "£"}
                            </span>
                            <Input
                              id="transactionAmount"
                              type="number"
                              className="pl-8"
                              value={transactionAmount}
                              onChange={(e) => setTransactionAmount(Number(e.target.value))}
                              min={1000}
                            />
                          </div>
                          <Select
                            value={transactionCurrency}
                            onValueChange={(value) => setTransactionCurrency(value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="tenor" className="flex items-center">
                          Tenor (Days)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The duration of the trade finance facility.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="mt-1">
                          <Input
                            id="tenor"
                            type="number"
                            value={tenor}
                            onChange={(e) => setTenor(Number(e.target.value))}
                            min={30}
                            max={360}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="importerCountry" className="flex items-center">
                            Importer Country
                          </Label>
                          <Select
                            value={importerCountry}
                            onValueChange={(value) => setImporterCountry(value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UAE">UAE</SelectItem>
                              <SelectItem value="Saudi">Saudi Arabia</SelectItem>
                              <SelectItem value="Qatar">Qatar</SelectItem>
                              <SelectItem value="Malaysia">Malaysia</SelectItem>
                              <SelectItem value="Indonesia">Indonesia</SelectItem>
                              <SelectItem value="Turkey">Turkey</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="exporterCountry" className="flex items-center">
                            Exporter Country
                          </Label>
                          <Select
                            value={exporterCountry}
                            onValueChange={(value) => setExporterCountry(value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UAE">UAE</SelectItem>
                              <SelectItem value="Saudi">Saudi Arabia</SelectItem>
                              <SelectItem value="Qatar">Qatar</SelectItem>
                              <SelectItem value="Malaysia">Malaysia</SelectItem>
                              <SelectItem value="Indonesia">Indonesia</SelectItem>
                              <SelectItem value="Turkey">Turkey</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="commodityType" className="flex items-center">
                          Commodity Type
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">The type of goods being traded.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={commodityType}
                          onValueChange={(value) => setCommodityType(value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select commodity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consumer_goods">Consumer Goods</SelectItem>
                            <SelectItem value="raw_materials">Raw Materials</SelectItem>
                            <SelectItem value="machinery">Machinery & Equipment</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="textiles">Textiles & Clothing</SelectItem>
                            <SelectItem value="food">Food & Agricultural Products</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="bg-teal-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-teal-800">Fee Estimate</h3>
                      
                      <div className="space-y-6">
                        {/* Fee breakdown */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Fee Breakdown</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-700">Issuance Fee</span>
                              <span className="font-medium">
                                {calculateIssuanceFee(transactionAmount, productType, transactionCurrency)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Processing Fee</span>
                              <span className="font-medium">
                                {calculateProcessingFee(transactionAmount, productType, transactionCurrency)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Commission ({calculateCommissionRate(productType, tenor)}%)</span>
                              <span className="font-medium">
                                {calculateCommission(transactionAmount, productType, tenor, transactionCurrency)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Swift/Communication</span>
                              <span className="font-medium">
                                {transactionCurrency === "USD" ? "$50" : transactionCurrency === "EUR" ? "€45" : "£40"}
                              </span>
                            </div>
                            {productType === "letter_of_credit" && (
                              <div className="flex justify-between">
                                <span className="text-gray-700">Amendment Fee (if needed)</span>
                                <span className="font-medium">
                                  {transactionCurrency === "USD" ? "$100" : transactionCurrency === "EUR" ? "€90" : "£80"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Total fees */}
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">Total Estimated Fees</span>
                            <span className="text-xl font-semibold text-teal-700">
                              {calculateTotalFees(transactionAmount, productType, tenor, transactionCurrency)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Approximately {calculateFeesPercentage(transactionAmount, productType, tenor)}% of transaction value
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-md p-4 border border-teal-100">
                          <h4 className="font-medium mb-2 flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                            Shariah Compliance
                          </h4>
                          <p className="text-sm text-gray-700">
                            All fees are structured as fixed service charges rather than interest-based fees, ensuring full Shariah compliance. 
                            There are no hidden interest charges or time-value-of-money considerations in our fee structure.
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full bg-teal-600 hover:bg-teal-700">
                            Request Detailed Quote
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    Note: This calculator provides estimates only. Actual fees may vary based on specific transaction details, 
                    risk assessment, and other factors. Please contact our trade finance team for a precise quote.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="process">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-teal-600" />
                    Trade Finance Application Process
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to apply for Islamic trade finance products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-200 ml-3.5"></div>
                      
                      {/* Step 1 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-teal-600 text-white flex items-center justify-center h-7 w-7">
                          1
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Initial Consultation</h3>
                        <p className="text-gray-700 mb-4">
                          Meet with our trade finance specialists to discuss your international trade requirements and determine the most appropriate Shariah-compliant solution for your business needs.
                        </p>
                        <div className="bg-teal-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Preparation Checklist:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Business profile and trade history</li>
                            <li>Details of the proposed trade transaction</li>
                            <li>Information about trading partners</li>
                            <li>Estimated transaction value and timeline</li>
                          </ul>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                            Schedule Consultation
                          </Button>
                        </div>
                      </div>
                      
                      {/* Step 2 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-teal-600 text-white flex items-center justify-center h-7 w-7">
                          2
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Documentation Submission</h3>
                        <p className="text-gray-700 mb-4">
                          Submit all required documentation for your trade finance application, including business information, trade details, and supporting documents.
                        </p>
                        <div className="bg-teal-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Required Documentation:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Completed trade finance application form</li>
                            <li>Business registration and license documents</li>
                            <li>Financial statements (last 2-3 years)</li>
                            <li>Trade contract or proforma invoice</li>
                            <li>Import/export licenses (if applicable)</li>
                            <li>KYC (Know Your Customer) documents</li>
                            <li>Shipping and insurance documents (if available)</li>
                          </ul>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                            Download Application Form
                          </Button>
                          <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                            Online Application
                          </Button>
                        </div>
                      </div>
                      
                      {/* Step 3 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-teal-600 text-white flex items-center justify-center h-7 w-7">
                          3
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Application Review & Shariah Assessment</h3>
                        <p className="text-gray-700 mb-4">
                          Our team will review your application for completeness and conduct both a financial assessment and Shariah compliance review of the proposed transaction.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-teal-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Financial Assessment:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                              <li>Credit evaluation</li>
                              <li>Transaction risk assessment</li>
                              <li>Business financial health review</li>
                              <li>Trade history analysis</li>
                            </ul>
                          </div>
                          <div className="bg-teal-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Shariah Compliance Review:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                              <li>Trade goods permissibility check</li>
                              <li>Contract structure assessment</li>
                              <li>Transaction flow evaluation</li>
                              <li>Verification of halal business activities</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 4 */}
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-0 rounded-full bg-teal-600 text-white flex items-center justify-center h-7 w-7">
                          4
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Offer & Agreement</h3>
                        <p className="text-gray-700 mb-4">
                          Upon approval, you'll receive a detailed offer outlining the terms and conditions of the trade finance facility. Once accepted, the formal agreement will be prepared for signing.
                        </p>
                        <div className="bg-teal-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Agreement Components:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Facility type and structure (Murabaha, Wakala, etc.)</li>
                            <li>Transaction amount and currency</li>
                            <li>Fee structure and payment terms</li>
                            <li>Tenor and timeline</li>
                            <li>Documentation requirements</li>
                            <li>Terms and conditions</li>
                            <li>Rights and obligations of all parties</li>
                          </ul>
                        </div>
                      </div>
                      
                      {/* Step 5 */}
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 rounded-full bg-teal-600 text-white flex items-center justify-center h-7 w-7">
                          5
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Execution & Monitoring</h3>
                        <p className="text-gray-700 mb-4">
                          After agreement signing, the trade finance facility is executed according to the agreed structure. Our team will monitor the transaction through to completion.
                        </p>
                        <div className="bg-green-50 p-4 rounded-md border border-green-200">
                          <div className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium mb-1">Transaction Support</h4>
                              <p className="text-sm text-gray-700">
                                Throughout the transaction lifecycle, our dedicated trade finance team will provide support and guidance, ensuring smooth processing of documents, payments, and shipments in accordance with Islamic finance principles.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-teal-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-teal-800">Application Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Initial Consultation</div>
                          <div className="w-2/3 text-sm">1-2 business days to schedule</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Documentation Review</div>
                          <div className="w-2/3 text-sm">3-5 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Application Assessment</div>
                          <div className="w-2/3 text-sm">5-7 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Offer Preparation</div>
                          <div className="w-2/3 text-sm">2-3 business days</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1/3 text-sm font-medium">Execution</div>
                          <div className="w-2/3 text-sm">1-3 business days after agreement signing</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        * Timeline may vary based on transaction complexity, documentation completeness, and other factors.
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button className="bg-teal-600 hover:bg-teal-700">
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
                    <HelpCircle className="h-5 w-5 mr-2 text-teal-600" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Common questions about Islamic trade finance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left">
                        What makes Islamic trade finance different from conventional trade finance?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Islamic trade finance differs from conventional trade finance in several key ways:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li><strong>No interest (Riba):</strong> Islamic trade finance replaces interest-based fees with service-based fees and profit-sharing arrangements.</li>
                          <li><strong>Asset-backed transactions:</strong> All financing must be tied to real, tangible assets or services.</li>
                          <li><strong>Ethical restrictions:</strong> Financing cannot be used for prohibited goods or services (alcohol, pork, gambling, etc.).</li>
                          <li><strong>Risk sharing:</strong> Islamic finance emphasizes the sharing of risks and rewards between parties.</li>
                          <li><strong>Contractual structures:</strong> Uses Islamic contracts such as Murabaha (cost-plus), Wakala (agency), and Musharaka (partnership) instead of conventional loan agreements.</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left">
                        How does an Islamic Letter of Credit work?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          An Islamic Letter of Credit (LC) typically follows one of these Shariah-compliant structures:
                        </p>
                        <ol className="list-decimal pl-5 mt-2 space-y-2 text-gray-700">
                          <li>
                            <strong>Wakala (Agency) LC:</strong> The bank acts as an agent (Wakil) for the importer, handling the LC process for a fixed agency fee rather than charging interest. The importer provides the bank with funds to pay the exporter, or the bank may provide a separate Murabaha facility for this purpose.
                          </li>
                          <li>
                            <strong>Murabaha (Cost-plus) LC:</strong> The bank purchases goods from the supplier and sells them to the importer at a marked-up price, with payment deferred for an agreed period. The LC is used to secure the international transaction between the bank and the supplier.
                          </li>
                          <li>
                            <strong>Musharaka (Partnership) LC:</strong> The bank and importer enter into a partnership to purchase the goods, with profits shared according to a pre-agreed ratio. The LC is issued based on this partnership agreement.
                          </li>
                        </ol>
                        <p className="text-gray-700 mt-2">
                          In all cases, the bank's fees are structured as fixed service charges or legitimate profit shares rather than interest, ensuring Shariah compliance.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left">
                        What types of businesses can use Islamic trade finance?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Islamic trade finance is available to a wide range of businesses engaged in international trade, provided they meet these criteria:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>The business activities must be Shariah-compliant (halal)</li>
                          <li>The goods or services being traded must be permissible under Islamic law</li>
                          <li>The business must have proper documentation and meet standard credit requirements</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          Common industries that use Islamic trade finance include:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Halal food and consumer goods</li>
                          <li>Textiles and clothing</li>
                          <li>Electronics and technology</li>
                          <li>Construction materials</li>
                          <li>Medical equipment and pharmaceuticals</li>
                          <li>Agricultural products</li>
                          <li>Industrial machinery and equipment</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left">
                        Are Islamic trade finance fees higher than conventional trade finance?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Islamic trade finance fees are generally competitive with conventional trade finance. While the fee structure differs (service-based rather than interest-based), the overall cost to the client is typically comparable for several reasons:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Islamic banks operate in the same competitive market and must offer comparable pricing</li>
                          <li>The operational costs for processing trade finance transactions are similar</li>
                          <li>Risk assessment methodologies are comparable, leading to similar risk premiums</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          In some cases, Islamic trade finance may involve additional documentation or structuring to ensure Shariah compliance, which might result in slightly higher processing fees. However, many clients find that the ethical alignment and risk-sharing approach of Islamic finance outweigh any minor cost differences.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-left">
                        What currencies can be used for Islamic trade finance?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Islamic trade finance can be conducted in any major currency, including:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>US Dollar (USD)</li>
                          <li>Euro (EUR)</li>
                          <li>British Pound (GBP)</li>
                          <li>Japanese Yen (JPY)</li>
                          <li>UAE Dirham (AED)</li>
                          <li>Saudi Riyal (SAR)</li>
                          <li>Malaysian Ringgit (MYR)</li>
                          <li>Other major currencies</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          The choice of currency typically depends on the underlying trade contract, the countries involved, and the preferences of the trading partners. Multi-currency facilities are also available for businesses that trade in multiple currencies.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-left">
                        What is the typical processing time for Islamic trade finance applications?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          The processing time for Islamic trade finance applications varies based on several factors:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li><strong>New clients:</strong> 2-3 weeks for initial onboarding and KYC procedures</li>
                          <li><strong>Existing clients:</strong> 5-10 business days for standard transactions</li>
                          <li><strong>Complex transactions:</strong> May require additional time for Shariah review and structuring</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          For recurring trade transactions with established clients, expedited processing is often available, with some transactions being approved within 3-5 business days. Pre-approved trade finance facilities can further reduce processing times for subsequent transactions.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-7">
                      <AccordionTrigger className="text-left">
                        Can Islamic trade finance be used for imports from non-Muslim countries?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Yes, Islamic trade finance can be used for imports from any country, including non-Muslim countries. What matters is not the country of origin, but rather:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>The nature of the goods or services being traded (they must be halal)</li>
                          <li>The structure of the financing arrangement (it must comply with Shariah principles)</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          Islamic banks regularly facilitate trade with partners in North America, Europe, Asia, and other regions worldwide. The Islamic finance principles are applied to the structure of the financing, regardless of the religious or cultural background of the trading partners.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-8">
                      <AccordionTrigger className="text-left">
                        What documentation is required for Islamic trade finance?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          The documentation required for Islamic trade finance typically includes:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li><strong>Business documentation:</strong>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Business registration and license</li>
                              <li>Articles of association</li>
                              <li>Board resolution authorizing the transaction</li>
                              <li>Financial statements (2-3 years)</li>
                            </ul>
                          </li>
                          <li><strong>Transaction documentation:</strong>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Sales contract or proforma invoice</li>
                              <li>Purchase order</li>
                              <li>Import/export licenses (if applicable)</li>
                              <li>Shipping documents (bill of lading, airway bill, etc.)</li>
                              <li>Insurance certificates</li>
                            </ul>
                          </li>
                          <li><strong>Islamic finance documentation:</strong>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Specific Islamic contracts (Murabaha, Wakala, etc.)</li>
                              <li>Offer and acceptance forms</li>
                              <li>Agency agreements (if applicable)</li>
                              <li>Promise to purchase (for Murabaha structures)</li>
                            </ul>
                          </li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          The exact documentation requirements may vary based on the specific trade finance product, transaction complexity, and bank policies.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-9">
                      <AccordionTrigger className="text-left">
                        What are the minimum and maximum financing amounts available?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Our Islamic trade finance solutions accommodate a wide range of transaction sizes:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li><strong>Minimum financing:</strong> $50,000 USD (or equivalent in other currencies)</li>
                          <li><strong>Maximum financing:</strong> Up to $25 million USD for qualified clients</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          For larger transactions exceeding $25 million, syndicated arrangements can be structured with partner Islamic financial institutions. The specific limits depend on several factors, including:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>Client's financial strength and credit history</li>
                          <li>Nature and value of the underlying trade transaction</li>
                          <li>Country and industry risk factors</li>
                          <li>Collateral and security arrangements</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-10">
                      <AccordionTrigger className="text-left">
                        How does Islamic trade finance handle currency exchange risk?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700">
                          Islamic trade finance addresses currency exchange risk through several Shariah-compliant methods:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                          <li>
                            <strong>Matching currency approach:</strong> Structuring the transaction in the same currency as the underlying trade contract to eliminate exchange risk.
                          </li>
                          <li>
                            <strong>Wa'd (Promise) structure:</strong> Using unilateral or bilateral promises to execute currency exchanges at pre-agreed rates on future dates.
                          </li>
                          <li>
                            <strong>Islamic hedging (Tahawwut):</strong> Shariah-compliant alternatives to conventional hedging instruments, based on real transactions rather than speculative derivatives.
                          </li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          It's important to note that conventional currency derivatives and speculative hedging instruments are generally not permissible under Shariah principles. Our trade finance team can advise on the most appropriate Shariah-compliant solution for managing currency risk in your specific transaction.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Have more questions? Our Islamic trade finance experts are here to help.
                  </p>
                  <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                    Contact an Expert
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

export default TradeFinance;
