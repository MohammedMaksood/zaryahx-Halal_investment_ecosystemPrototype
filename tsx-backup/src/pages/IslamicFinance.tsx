import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, DollarSign, Home, Briefcase, Users, FileText, Truck } from 'lucide-react';

const IslamicFinance: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold mb-4 text-black">Islamic Finance Solutions</h1>
              <p className="text-lg text-black/70 max-w-3xl mx-auto">
                Explore our range of Shariah-compliant financing options designed to meet your personal and business needs
                while adhering to Islamic principles.
              </p>
            </div>
            
            {/* Finance Options Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-6 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="murabaha">Murabaha</TabsTrigger>
                <TabsTrigger value="ijara">Ijara</TabsTrigger>
                <TabsTrigger value="musharaka">Musharaka</TabsTrigger>
                <TabsTrigger value="trade">Trade Finance</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Murabaha Card */}
                  <Card className="overflow-hidden border border-lavender/20 hover:border-lavender/40 hover:shadow-md transition-all">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 pb-8">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle>Murabaha Financing</CardTitle>
                      <CardDescription>Cost-plus financing for asset purchases</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-black/70 mb-4">
                        Acquire assets with transparent pricing and fixed payments through our Shariah-compliant Murabaha contracts.
                      </p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>Transparent cost and profit margin</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>Fixed payment schedule</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>No hidden fees or interest</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link to="/islamic-finance/murabaha" className="w-full">
                        <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                          Explore Murabaha <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  
                  {/* Ijara Card */}
                  <Card className="overflow-hidden border border-lavender/20 hover:border-lavender/40 hover:shadow-md transition-all">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 pb-8">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Home className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle>Ijara Leasing</CardTitle>
                      <CardDescription>Shariah-compliant leasing solutions</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-black/70 mb-4">
                        Lease assets with the option to own through our flexible Ijara arrangements that comply with Islamic principles.
                      </p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span>Flexible lease terms</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span>Option to purchase at end of term</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span>Clear ownership structure</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link to="/islamic-finance/ijara" className="w-full">
                        <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                          Explore Ijara <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  
                  {/* Musharaka Card */}
                  <Card className="overflow-hidden border border-lavender/20 hover:border-lavender/40 hover:shadow-md transition-all">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 pb-8">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle>Musharaka Partnership</CardTitle>
                      <CardDescription>Equity-based partnership financing</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-black/70 mb-4">
                        Enter into ethical partnership agreements with profit and loss sharing based on Islamic principles.
                      </p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">✓</span>
                          <span>Equitable profit sharing</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">✓</span>
                          <span>Diminishing partnership options</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">✓</span>
                          <span>Joint ownership structure</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link to="/islamic-finance/musharaka" className="w-full">
                        <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                          Explore Musharaka <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  
                  {/* Trade Finance Card */}
                  <Card className="overflow-hidden border border-lavender/20 hover:border-lavender/40 hover:shadow-md transition-all">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100/50 pb-8">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-teal-600" />
                      </div>
                      <CardTitle>Trade Finance</CardTitle>
                      <CardDescription>Letters of credit for halal businesses</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-black/70 mb-4">
                        Facilitate international trade with Shariah-compliant letters of credit and trade financing solutions.
                      </p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          <span>Compliant documentation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          <span>Transparent fee structure</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          <span>International trade support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link to="/islamic-finance/trade" className="w-full">
                        <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50">
                          Explore Trade Finance <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  
                  {/* Equipment Financing Card */}
                  <Card className="overflow-hidden border border-lavender/20 hover:border-lavender/40 hover:shadow-md transition-all">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 pb-8">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <Truck className="h-6 w-6 text-amber-600" />
                      </div>
                      <CardTitle>Equipment Financing</CardTitle>
                      <CardDescription>Ijara-based leasing for businesses</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-black/70 mb-4">
                        Acquire business equipment through Shariah-compliant leasing arrangements with flexible terms.
                      </p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">✓</span>
                          <span>Wide range of equipment options</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">✓</span>
                          <span>Customizable lease terms</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">✓</span>
                          <span>Maintenance options available</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link to="/islamic-finance/equipment" className="w-full">
                        <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50">
                          Explore Equipment Financing <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  
                  {/* Zakat Calculator Card */}
                  <Card className="overflow-hidden border border-lavender/20 hover:border-lavender/40 hover:shadow-md transition-all">
                    <CardHeader className="bg-gradient-to-r from-lavender/10 to-lavender/30 pb-8">
                      <div className="w-12 h-12 rounded-full bg-lavender/20 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <CardTitle>Zakat Calculator</CardTitle>
                      <CardDescription>Calculate your Zakat obligation</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-black/70 mb-4">
                        Accurately calculate your Zakat obligations according to Islamic principles with our easy-to-use calculator.
                      </p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-start">
                          <span className="text-lavender mr-2">✓</span>
                          <span>Accurate Nisab thresholds</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-lavender mr-2">✓</span>
                          <span>Comprehensive asset categories</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-lavender mr-2">✓</span>
                          <span>Detailed calculation breakdown</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link to="/zakat-calculator" className="w-full">
                        <Button variant="outline" className="w-full border-lavender/30 text-lavender hover:bg-lavender/10">
                          Use Zakat Calculator <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Educational Section */}
                <div className="mt-16 bg-gradient-to-r from-lavender/10 to-lavender/5 p-8 rounded-lg border border-lavender/20">
                  <h2 className="text-2xl font-bold mb-4">Understanding Islamic Finance</h2>
                  <p className="mb-6">
                    Islamic finance operates on principles derived from Shariah law. These include the prohibition of interest (riba),
                    excessive uncertainty (gharar), and gambling (maysir). Instead, Islamic finance emphasizes ethical, risk-sharing
                    arrangements that promote fairness and transparency.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/50 p-4 rounded-lg border border-lavender/20">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-lavender/20 flex items-center justify-center mr-2 text-xs">1</span>
                        Prohibition of Interest (Riba)
                      </h3>
                      <p className="text-sm">
                        Islamic finance prohibits the charging or paying of interest. Instead, financial transactions
                        are structured as trades, partnerships, or leases with transparent profit margins.
                      </p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg border border-lavender/20">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-lavender/20 flex items-center justify-center mr-2 text-xs">2</span>
                        Risk Sharing
                      </h3>
                      <p className="text-sm">
                        Islamic finance encourages the sharing of risks and rewards between parties. Profit and loss
                        sharing arrangements ensure that both parties have a stake in the outcome.
                      </p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg border border-lavender/20">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-lavender/20 flex items-center justify-center mr-2 text-xs">3</span>
                        Asset-Backed Transactions
                      </h3>
                      <p className="text-sm">
                        Islamic financial transactions must be backed by tangible assets. This ensures that the
                        economy is supported by real economic activity rather than speculative practices.
                      </p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg border border-lavender/20">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-lavender/20 flex items-center justify-center mr-2 text-xs">4</span>
                        Ethical Investments
                      </h3>
                      <p className="text-sm">
                        Islamic finance prohibits investments in businesses involved in activities considered
                        harmful, such as alcohol, gambling, pork-related products, and conventional financial services.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Content for other tabs - redirecting to their respective pages */}
              <TabsContent value="murabaha">
                <div className="p-12 text-center bg-white/50 rounded-lg border border-lavender/20">
                  <h2 className="text-2xl font-bold mb-4">Murabaha Financing</h2>
                  <p className="text-lg mb-6">Explore our Shariah-compliant cost-plus financing options for asset purchases.</p>
                  <Link to="/islamic-finance/murabaha">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      View Murabaha Financing
                    </Button>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="ijara">
                <div className="p-12 text-center bg-white/50 rounded-lg border border-lavender/20">
                  <h2 className="text-2xl font-bold mb-4">Ijara Leasing</h2>
                  <p className="text-lg mb-6">Discover our Shariah-compliant leasing solutions with flexible terms.</p>
                  <Link to="/islamic-finance/ijara">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      View Ijara Leasing
                    </Button>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="musharaka">
                <div className="p-12 text-center bg-white/50 rounded-lg border border-lavender/20">
                  <h2 className="text-2xl font-bold mb-4">Musharaka Partnership</h2>
                  <p className="text-lg mb-6">Learn about our equity-based partnership financing with fair profit sharing.</p>
                  <Link to="/islamic-finance/musharaka">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      View Musharaka Partnership
                    </Button>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="trade">
                <div className="p-12 text-center bg-white/50 rounded-lg border border-lavender/20">
                  <h2 className="text-2xl font-bold mb-4">Trade Finance</h2>
                  <p className="text-lg mb-6">Facilitate international trade with our Shariah-compliant letters of credit and trade financing solutions.</p>
                  <Link to="/islamic-finance/trade">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      View Trade Finance
                    </Button>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="equipment">
                <div className="p-12 text-center bg-white/50 rounded-lg border border-lavender/20">
                  <h2 className="text-2xl font-bold mb-4">Equipment Financing</h2>
                  <p className="text-lg mb-6">Acquire business equipment through our Shariah-compliant financing arrangements with flexible terms.</p>
                  <Link to="/islamic-finance/equipment">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                      View Equipment Financing
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IslamicFinance;
