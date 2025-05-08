
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Share, FileBarChart, TrendingUp, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from '@/hooks/use-toast';
import HalalBadge from '@/components/HalalBadge';
import LoadingAnimation from '@/components/LoadingAnimation';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StockDataType {
  name: string;
  symbol: string;
  price: number;
  change: number;
  status: 'halal' | 'haram' | 'pending';
  description: string;
  category: string;
  dividendYield: string;
  marketCap: string;
  peRatio: string;
  volume: string;
  dayRange: string;
  yearRange: string;
  sharesOutstanding: string;
  eps: string;
  beta: string;
  sector: string;
  industry: string;
  yearFounded: number;
  employees: number;
  ceo: string;
  headquarters: string;
  website: string;
  priceHistory: Array<{date: string, price: number}>;
  analysts: Array<{firm: string, rating: string, target: number}>;
  news: Array<{title: string, date: string}>;
  about: string;
}

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<StockDataType | null>(null);
  
  // Investment state
  const [investmentType, setInvestmentType] = useState<'intraday' | 'long-term'>('long-term');
  const [shares, setShares] = useState('1');
  const [showInvestModal, setShowInvestModal] = useState(false);
  
  useEffect(() => {
    // Simulate API call to fetch stock details
    setLoading(true);
    
    // Mock data - in a real app, this would be an API call
    setTimeout(() => {
      const mockStocks: Record<string, StockDataType> = {
        "RJHI.SR": {
          name: "Al Rajhi Bank",
          symbol: "RJHI.SR",
          price: 89.25,
          change: 1.2,
          status: "halal",
          description: "Islamic banking and investment products",
          category: "finance",
          dividendYield: "2.7%",
          marketCap: "$59.8B",
          peRatio: "15.2",
          volume: "3.2M",
          dayRange: "88.45 - 90.10",
          yearRange: "75.30 - 95.40",
          sharesOutstanding: "2.5B",
          eps: "$3.75",
          beta: "0.85",
          sector: "Financial Services",
          industry: "Islamic Banking",
          yearFounded: 1957,
          employees: 13500,
          ceo: "Waleed Abdullah Al-Mogbel",
          headquarters: "Riyadh, Saudi Arabia",
          website: "www.alrajhibank.com.sa",
          priceHistory: [
            { date: "2025-05-01", price: 88.10 },
            { date: "2025-05-02", price: 88.45 },
            { date: "2025-05-03", price: 87.90 },
            { date: "2025-05-04", price: 88.30 },
            { date: "2025-05-05", price: 89.15 },
            { date: "2025-05-06", price: 88.75 },
            { date: "2025-05-07", price: 89.25 }
          ],
          analysts: [
            { firm: "Morgan Stanley", rating: "Overweight", target: 95.00 },
            { firm: "Goldman Sachs", rating: "Buy", target: 97.50 },
            { firm: "Citi", rating: "Neutral", target: 90.00 }
          ],
          news: [
            { title: "Al Rajhi Bank reports 5% profit increase in Q1", date: "2025-03-15" },
            { title: "New Islamic financing products launched", date: "2025-02-28" },
            { title: "Bank expands presence in Southeast Asia", date: "2025-01-12" }
          ],
          about: "Al Rajhi Bank is a Saudi Arabian bank and the world's largest Islamic bank by assets. The bank is a major investor in Saudi Arabia's business and is one of the largest joint stock companies in the Kingdom. Headquartered in Riyadh, the bank has a network of over 500 branches, primarily in Saudi Arabia, but also in Kuwait, Jordan and Malaysia."
        },
        "BABA": {
          name: "Alibaba Group",
          symbol: "BABA",
          price: 87.15,
          change: -1.2,
          status: "halal",
          description: "E-commerce and cloud computing",
          category: "technology",
          dividendYield: "1.2%",
          marketCap: "$224.3B",
          peRatio: "19.8",
          volume: "15.7M",
          dayRange: "86.45 - 89.30",
          yearRange: "65.20 - 110.40",
          sharesOutstanding: "2.58B",
          eps: "$4.42",
          beta: "1.28",
          sector: "Consumer Cyclical",
          industry: "Internet Retail",
          yearFounded: 1999,
          employees: 258000,
          ceo: "Eddie Wu",
          headquarters: "Hangzhou, China",
          website: "www.alibabagroup.com",
          priceHistory: [
            { date: "2025-05-01", price: 88.20 },
            { date: "2025-05-02", price: 87.85 },
            { date: "2025-05-03", price: 87.40 },
            { date: "2025-05-04", price: 86.95 },
            { date: "2025-05-05", price: 86.60 },
            { date: "2025-05-06", price: 87.05 },
            { date: "2025-05-07", price: 87.15 }
          ],
          analysts: [
            { firm: "JP Morgan", rating: "Overweight", target: 110.00 },
            { firm: "Bank of America", rating: "Buy", target: 105.00 },
            { firm: "HSBC", rating: "Hold", target: 90.00 }
          ],
          news: [
            { title: "Alibaba expands cloud services in Middle East", date: "2025-04-10" },
            { title: "New logistics network announced for global shipping", date: "2025-03-22" },
            { title: "Quarterly earnings exceed analyst expectations", date: "2025-02-05" }
          ],
          about: "Alibaba Group Holding Limited is a Chinese multinational technology company specializing in e-commerce, retail, Internet, and technology. Founded in 1999, the company provides consumer-to-consumer, business-to-consumer, and business-to-business sales services via web portals, as well as electronic payment services, shopping search engines, and cloud computing services."
        },
        "MSFT": {
          name: "Microsoft Corp.",
          symbol: "MSFT",
          price: 337.18,
          change: 1.7,
          status: "halal",
          description: "Software, cloud computing, and hardware",
          category: "technology",
          dividendYield: "0.8%",
          marketCap: "$2.5T",
          peRatio: "28.4",
          volume: "22.1M",
          dayRange: "334.50 - 339.25",
          yearRange: "290.10 - 345.80",
          sharesOutstanding: "7.43B",
          eps: "$11.24",
          beta: "0.92",
          sector: "Technology",
          industry: "Software—Infrastructure",
          yearFounded: 1975,
          employees: 221000,
          ceo: "Satya Nadella",
          headquarters: "Redmond, Washington, USA",
          website: "www.microsoft.com",
          priceHistory: [
            { date: "2025-05-01", price: 334.25 },
            { date: "2025-05-02", price: 335.10 },
            { date: "2025-05-03", price: 336.85 },
            { date: "2025-05-04", price: 335.95 },
            { date: "2025-05-05", price: 336.40 },
            { date: "2025-05-06", price: 337.05 },
            { date: "2025-05-07", price: 337.18 }
          ],
          analysts: [
            { firm: "Wedbush", rating: "Outperform", target: 375.00 },
            { firm: "Morgan Stanley", rating: "Overweight", target: 372.00 },
            { firm: "Goldman Sachs", rating: "Buy", target: 380.00 }
          ],
          news: [
            { title: "Microsoft launches new AI features for Azure", date: "2025-04-18" },
            { title: "Windows 12 update announced for Q3", date: "2025-03-30" },
            { title: "Cloud revenue exceeds expectations in latest quarter", date: "2025-02-15" }
          ],
          about: "Microsoft Corporation is an American multinational technology corporation that produces computer software, consumer electronics, personal computers, and related services. Its best-known software products are the Microsoft Windows line of operating systems, the Microsoft Office suite, and the Internet Explorer and Edge web browsers."
        }
      };
      
      const defaultStock = {
        name: symbol || "",
        symbol: symbol || "",
        price: 125.45,
        change: 0.85,
        status: "halal" as const,
        description: "This stock has been verified as Shariah-compliant by our Islamic scholars.",
        category: "other",
        dividendYield: "1.8%",
        marketCap: "$45.2B",
        peRatio: "22.3",
        volume: "5.4M",
        dayRange: "124.10 - 126.70",
        yearRange: "98.40 - 130.20",
        sharesOutstanding: "365M",
        eps: "$5.64",
        beta: "1.05",
        sector: "Technology",
        industry: "Software",
        yearFounded: 2005,
        employees: 5200,
        ceo: "John Smith",
        headquarters: "San Francisco, CA, USA",
        website: "www.example.com",
        priceHistory: [
          { date: "2025-05-01", price: 124.25 },
          { date: "2025-05-02", price: 124.85 },
          { date: "2025-05-03", price: 124.50 },
          { date: "2025-05-04", price: 124.95 },
          { date: "2025-05-05", price: 125.30 },
          { date: "2025-05-06", price: 125.15 },
          { date: "2025-05-07", price: 125.45 }
        ],
        analysts: [
          { firm: "Credit Suisse", rating: "Neutral", target: 130.00 },
          { firm: "Barclays", rating: "Overweight", target: 140.00 },
          { firm: "UBS", rating: "Buy", target: 135.00 }
        ],
        news: [
          { title: "Company announces expansion into new markets", date: "2025-04-05" },
          { title: "Quarterly results show steady growth", date: "2025-03-10" },
          { title: "New executive leadership announced", date: "2025-02-20" }
        ],
        about: "This company operates in compliance with Islamic finance principles, avoiding interest-based income, excessive uncertainty, and businesses in prohibited industries. The company has been screened for financial ratios and business activities to ensure Shariah compliance."
      };
      
      setStockData(mockStocks[symbol as keyof typeof mockStocks] || defaultStock);
      setLoading(false);
      
      // Open investment modal if that's the active tab
      if (initialTab === 'invest') {
        setShowInvestModal(true);
      }
    }, 1000);
  }, [symbol, initialTab]);

  const handleInvest = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to invest in stocks",
      });
      navigate('/signin?redirect=/stocks/' + symbol);
      return;
    }
    
    setShowInvestModal(true);
  };

  const handlePlaceOrder = () => {
    const sharesNum = parseInt(shares);
    
    if (isNaN(sharesNum) || sharesNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of shares",
      });
      return;
    }
    
    toast({
      title: "Order Submitted",
      description: `Order to ${investmentType === 'intraday' ? 'trade' : 'invest in'} ${sharesNum} shares of ${stockData?.name} has been submitted`,
    });
    
    setShowInvestModal(false);
    
    // Redirect to wallet page to show the order
    navigate('/wallet');
  };

  const handleShare = () => {
    toast({
      title: "Share Link Generated",
      description: `Share link for ${stockData?.symbol} has been copied to clipboard`,
    });
  };
  
  const handleWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${stockData?.name} has been added to your watchlist`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pb-16">
        {loading ? (
          <div className="container mx-auto px-4 py-20">
            <LoadingAnimation type="spinner" size="lg" text={`Loading details for ${symbol}...`} />
          </div>
        ) : (
          <>
            {/* Back button and header */}
            <div className="container mx-auto px-4 pt-6 pb-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="mb-4 hover:bg-lavender/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stocks
              </Button>
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{stockData?.name}</h1>
                    <HalalBadge type={stockData?.status || 'pending'} size="md" />
                  </div>
                  <p className="text-white/60">{stockData?.symbol} • {stockData?.sector}</p>
                  <p className="mt-3 text-white/80">{stockData?.description}</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="p-5 rounded-lg bg-secondary/30 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Current Price</span>
                      <div className={`px-2 py-1 rounded-full text-xs ${stockData?.change && stockData.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {stockData?.change && stockData.change >= 0 ? '+' : ''}{stockData?.change}%
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-4">${stockData?.price.toFixed(2)}</div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-white/40">Day Range</p>
                        <p className="text-sm">{stockData?.dayRange}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Year Range</p>
                        <p className="text-sm">{stockData?.yearRange}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={handleInvest} 
                        className="w-full bg-lavender hover:bg-lavender-dark"
                        disabled={stockData?.status === 'haram'}
                      >
                        {stockData?.status === 'haram' ? 'Non-Halal' : 'Invest Now'}
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={handleWatchlist}
                          className="flex-1 border-lavender text-lavender hover:bg-lavender/20"
                        >
                          <Eye className="mr-2 h-4 w-4" /> Watchlist
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleShare}
                          className="flex-1 border-lavender text-lavender hover:bg-lavender/20"
                        >
                          <Share className="mr-2 h-4 w-4" /> Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stock details */}
            <div className="container mx-auto px-4 mt-8">
              <Tabs defaultValue={initialTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                  <TabsTrigger value="news">News</TabsTrigger>
                  <TabsTrigger value="invest">Invest</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-secondary/20 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-xl">Company Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-white/80 mb-6">{stockData?.about}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-white/40">Market Cap</p>
                            <p className="text-sm font-medium">{stockData?.marketCap}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">P/E Ratio</p>
                            <p className="text-sm font-medium">{stockData?.peRatio}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Dividend Yield</p>
                            <p className="text-sm font-medium">{stockData?.dividendYield}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Volume</p>
                            <p className="text-sm font-medium">{stockData?.volume}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">EPS</p>
                            <p className="text-sm font-medium">{stockData?.eps}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Beta</p>
                            <p className="text-sm font-medium">{stockData?.beta}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Shares Outstanding</p>
                            <p className="text-sm font-medium">{stockData?.sharesOutstanding}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Year Founded</p>
                            <p className="text-sm font-medium">{stockData?.yearFounded}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-secondary/20 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-xl">Analyst Ratings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stockData?.analysts.map((analyst, index) => (
                            <div key={index} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                              <div>
                                <p className="font-medium">{analyst.firm}</p>
                                <p className="text-xs text-white/60">{analyst.rating}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${analyst.target.toFixed(2)}</p>
                                <p className="text-xs text-white/60">Target Price</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-secondary/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <p className="text-xs text-white/40">CEO</p>
                            <p className="text-sm font-medium">{stockData?.ceo}</p>
                          </div>
                          <div className="mb-4">
                            <p className="text-xs text-white/40">Headquarters</p>
                            <p className="text-sm font-medium">{stockData?.headquarters}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Employees</p>
                            <p className="text-sm font-medium">{stockData?.employees?.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <p className="text-xs text-white/40">Industry</p>
                            <p className="text-sm font-medium">{stockData?.industry}</p>
                          </div>
                          <div className="mb-4">
                            <p className="text-xs text-white/40">Sector</p>
                            <p className="text-sm font-medium">{stockData?.sector}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Website</p>
                            <p className="text-sm font-medium text-lavender">{stockData?.website}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="financials">
                  <Card className="bg-secondary/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl">Financial Performance</CardTitle>
                      <CardDescription>Quarterly financial data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quarter</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Net Income</TableHead>
                            <TableHead>EPS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Q1 2025</TableCell>
                            <TableCell>${(Math.random() * 10 + 5).toFixed(2)}B</TableCell>
                            <TableCell>${(Math.random() * 2 + 0.8).toFixed(2)}B</TableCell>
                            <TableCell>${(Math.random() * 2 + 0.5).toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Q4 2024</TableCell>
                            <TableCell>${(Math.random() * 10 + 5).toFixed(2)}B</TableCell>
                            <TableCell>${(Math.random() * 2 + 0.8).toFixed(2)}B</TableCell>
                            <TableCell>${(Math.random() * 2 + 0.5).toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Q3 2024</TableCell>
                            <TableCell>${(Math.random() * 10 + 5).toFixed(2)}B</TableCell>
                            <TableCell>${(Math.random() * 2 + 0.8).toFixed(2)}B</TableCell>
                            <TableCell>${(Math.random() * 2 + 0.5).toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Q2 2024</TableCell>
                            <TableCell>${(Math.random() * 10 + 5).toFixed(2)}B</TableCell>
                            <TableCell>${(Math.random() * 2 + 0.8).toFixed(2)}B</TableCell>
                            <TableCell>${(Math.random() * 2 + 0.5).toFixed(2)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="news">
                  <Card className="bg-secondary/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <FileBarChart className="h-5 w-5" />
                        Recent News
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableBody>
                          {stockData?.news.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell className="text-right text-white/60">{item.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="invest">
                  <Card className="bg-secondary/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl">Investment Options</CardTitle>
                      <CardDescription>Choose how you want to invest in {stockData?.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Card className="bg-secondary/40 border-white/10 hover:border-lavender/30 transition-all cursor-pointer" onClick={() => { setInvestmentType('intraday'); setShowInvestModal(true); }}>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-lavender" />
                                Intraday Trading
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-white/80">Short-term trading within the same market day. Buy and sell within market hours.</p>
                            </CardContent>
                            <CardFooter>
                              <p className="text-xs text-white/60">Settlement: Same day</p>
                            </CardFooter>
                          </Card>
                          
                          <Card className="bg-secondary/40 border-white/10 hover:border-lavender/30 transition-all cursor-pointer" onClick={() => { setInvestmentType('long-term'); setShowInvestModal(true); }}>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-lavender" />
                                Long-term Investment
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-white/80">Buy and hold for potential long-term growth and dividends.</p>
                            </CardContent>
                            <CardFooter>
                              <p className="text-xs text-white/60">Settlement: T+2 days</p>
                            </CardFooter>
                          </Card>
                          
                          <Card className="bg-secondary/40 border-white/10">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-lavender" />
                                IPO Access
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-white/80">Get access to upcoming Initial Public Offerings.</p>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" className="w-full border-lavender/30 hover:bg-lavender/20" disabled>
                                No Available IPOs
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-white/70 mb-4">Learn more about different investment options and strategies</p>
                          <Button variant="ghost" className="border border-lavender/30 hover:bg-lavender/20">
                            Investment Education
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Investment Modal */}
            <Dialog open={showInvestModal} onOpenChange={setShowInvestModal}>
              <DialogContent className="bg-secondary/30 border-white/10">
                <DialogHeader>
                  <DialogTitle>
                    {investmentType === 'intraday' ? 'Intraday Trading' : 'Long-term Investment'}
                  </DialogTitle>
                  <DialogDescription>
                    {stockData?.name} ({stockData?.symbol}) - ${stockData?.price.toFixed(2)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div>
                    <RadioGroup defaultValue={investmentType} onValueChange={(value) => setInvestmentType(value as 'intraday' | 'long-term')} className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <RadioGroupItem value="intraday" id="intraday" className="peer sr-only" />
                        <Label
                          htmlFor="intraday"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-white/10 bg-secondary/40 p-4 hover:bg-lavender/5 hover:border-lavender/30 peer-data-[state=checked]:border-lavender peer-data-[state=checked]:bg-lavender/10"
                        >
                          <TrendingUp className="h-5 w-5 mb-2" />
                          <div className="font-semibold">Intraday</div>
                          <span className="text-xs text-white/60">Same day</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="long-term" id="long-term" className="peer sr-only" />
                        <Label
                          htmlFor="long-term"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-white/10 bg-secondary/40 p-4 hover:bg-lavender/5 hover:border-lavender/30 peer-data-[state=checked]:border-lavender peer-data-[state=checked]:bg-lavender/10"
                        >
                          <Calendar className="h-5 w-5 mb-2" />
                          <div className="font-semibold">Long-term</div>
                          <span className="text-xs text-white/60">Hold for growth</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shares">Number of Shares</Label>
                    <Input
                      id="shares"
                      type="number"
                      min="1"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      className="bg-secondary/50 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Estimated Cost</span>
                      <span className="font-semibold">${((stockData?.price || 0) * parseInt(shares || '0')).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-white/70">Trading Fee</span>
                      <span className="font-semibold">${(0.0025 * (stockData?.price || 0) * parseInt(shares || '0')).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">
                        ${((stockData?.price || 0) * parseInt(shares || '0') * 1.0025).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowInvestModal(false)}>Cancel</Button>
                  <Button onClick={handlePlaceOrder} className="bg-lavender hover:bg-lavender-dark">
                    Place Order
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default StockDetails;
