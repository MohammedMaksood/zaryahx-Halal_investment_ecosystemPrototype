
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Share, FileBarChart, TrendingUp, Clock, Calendar, BarChart3, LineChart, DollarSign, Percent, Activity } from "lucide-react";
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
import { cn } from "@/lib/utils";
import CandlestickChart from "@/components/CandlestickChart";
import OrderForm from "@/components/OrderForm";

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
  candlestickData: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  performance: {
    day: number;
    week: number;
    month: number;
    ytd: number;
    year: number;
  };
  fundamentals: {
    roe: string;
    roa: string;
    debtToEquity: string;
    currentRatio: string;
    quickRatio: string;
    profitMargin: string;
  };
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
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [investmentType, setInvestmentType] = useState<'intraday' | 'long-term'>('long-term');
  const [shares, setShares] = useState('1');
  const [showInvestModal, setShowInvestModal] = useState(false);
  
  useEffect(() => {
    // Simulate API call to fetch stock details
    setLoading(true);
    
    // Reset modal state when loading new stock data
    setShowInvestModal(false);
    
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
          candlestickData: [
            { time: "2025-05-01", open: 87.80, high: 88.50, low: 87.60, close: 88.10 },
            { time: "2025-05-02", open: 88.10, high: 88.80, low: 87.90, close: 88.45 },
            { time: "2025-05-03", open: 88.45, high: 88.60, low: 87.70, close: 87.90 },
            { time: "2025-05-04", open: 87.90, high: 88.40, low: 87.80, close: 88.30 },
            { time: "2025-05-05", open: 88.30, high: 89.30, low: 88.20, close: 89.15 },
            { time: "2025-05-06", open: 89.15, high: 89.40, low: 88.60, close: 88.75 },
            { time: "2025-05-07", open: 88.75, high: 89.50, low: 88.70, close: 89.25 },
            { time: "2025-05-08", open: 89.25, high: 89.70, low: 89.00, close: 89.60 },
            { time: "2025-05-09", open: 89.60, high: 90.20, low: 89.40, close: 90.10 },
            { time: "2025-05-10", open: 90.10, high: 90.50, low: 89.80, close: 90.30 },
            { time: "2025-05-11", open: 90.30, high: 90.40, low: 89.20, close: 89.40 },
            { time: "2025-05-12", open: 89.40, high: 89.60, low: 88.90, close: 89.25 }
          ],
          performance: {
            day: 0.5,
            week: 1.8,
            month: 3.2,
            ytd: 7.5,
            year: 12.4
          },
          fundamentals: {
            roe: "15.8%",
            roa: "1.9%",
            debtToEquity: "0.62",
            currentRatio: "1.35",
            quickRatio: "1.22",
            profitMargin: "38.5%"
          },
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
          candlestickData: [
            { time: "2025-05-01", open: 88.50, high: 89.10, low: 87.90, close: 88.20 },
            { time: "2025-05-02", open: 88.20, high: 88.40, low: 87.30, close: 87.85 },
            { time: "2025-05-03", open: 87.85, high: 88.00, low: 87.10, close: 87.40 },
            { time: "2025-05-04", open: 87.40, high: 87.60, low: 86.70, close: 86.95 },
            { time: "2025-05-05", open: 86.95, high: 87.20, low: 86.40, close: 86.60 },
            { time: "2025-05-06", open: 86.60, high: 87.30, low: 86.50, close: 87.05 },
            { time: "2025-05-07", open: 87.05, high: 87.40, low: 86.80, close: 87.15 },
            { time: "2025-05-08", open: 87.15, high: 87.60, low: 86.90, close: 87.30 },
            { time: "2025-05-09", open: 87.30, high: 87.80, low: 87.10, close: 87.50 },
            { time: "2025-05-10", open: 87.50, high: 87.90, low: 87.20, close: 87.70 },
            { time: "2025-05-11", open: 87.70, high: 88.10, low: 87.40, close: 87.90 },
            { time: "2025-05-12", open: 87.90, high: 88.30, low: 87.60, close: 88.10 }
          ],
          performance: {
            day: -0.3,
            week: 0.6,
            month: -2.8,
            ytd: 5.2,
            year: -8.5
          },
          fundamentals: {
            roe: "12.3%",
            roa: "4.5%",
            debtToEquity: "0.28",
            currentRatio: "2.15",
            quickRatio: "1.85",
            profitMargin: "22.7%"
          },
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
          candlestickData: [
            { time: "2025-05-01", open: 333.80, high: 335.20, low: 332.90, close: 334.25 },
            { time: "2025-05-02", open: 334.25, high: 336.40, low: 334.00, close: 335.10 },
            { time: "2025-05-03", open: 335.10, high: 337.50, low: 334.80, close: 336.85 },
            { time: "2025-05-04", open: 336.85, high: 337.20, low: 335.30, close: 335.95 },
            { time: "2025-05-05", open: 335.95, high: 336.90, low: 335.60, close: 336.40 },
            { time: "2025-05-06", open: 336.40, high: 337.80, low: 336.20, close: 337.05 },
            { time: "2025-05-07", open: 337.05, high: 338.10, low: 336.70, close: 337.18 },
            { time: "2025-05-08", open: 337.18, high: 338.50, low: 336.90, close: 338.25 },
            { time: "2025-05-09", open: 338.25, high: 339.40, low: 337.80, close: 339.10 },
            { time: "2025-05-10", open: 339.10, high: 340.20, low: 338.60, close: 339.85 },
            { time: "2025-05-11", open: 339.85, high: 341.30, low: 339.40, close: 340.75 },
            { time: "2025-05-12", open: 340.75, high: 342.10, low: 340.20, close: 341.50 }
          ],
          performance: {
            day: 0.4,
            week: 2.1,
            month: 4.5,
            ytd: 12.8,
            year: 18.2
          },
          fundamentals: {
            roe: "42.5%",
            roa: "21.3%",
            debtToEquity: "0.45",
            currentRatio: "2.85",
            quickRatio: "2.65",
            profitMargin: "35.8%"
          },
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
        candlestickData: [
          { time: "2025-05-01", open: 123.90, high: 124.80, low: 123.70, close: 124.25 },
          { time: "2025-05-02", open: 124.25, high: 125.10, low: 124.20, close: 124.85 },
          { time: "2025-05-03", open: 124.85, high: 125.20, low: 124.30, close: 124.50 },
          { time: "2025-05-04", open: 124.50, high: 125.10, low: 124.40, close: 124.95 },
          { time: "2025-05-05", open: 124.95, high: 125.60, low: 124.90, close: 125.30 },
          { time: "2025-05-06", open: 125.30, high: 125.50, low: 125.00, close: 125.15 },
          { time: "2025-05-07", open: 125.15, high: 125.80, low: 125.10, close: 125.45 },
          { time: "2025-05-08", open: 125.45, high: 125.90, low: 125.20, close: 125.70 },
          { time: "2025-05-09", open: 125.70, high: 126.20, low: 125.50, close: 126.00 },
          { time: "2025-05-10", open: 126.00, high: 126.40, low: 125.80, close: 126.30 },
          { time: "2025-05-11", open: 126.30, high: 126.50, low: 125.90, close: 126.10 },
          { time: "2025-05-12", open: 126.10, high: 126.70, low: 125.80, close: 126.50 }
        ],
        performance: {
          day: 0.2,
          week: 1.5,
          month: 2.8,
          ytd: 8.3,
          year: 15.6
        },
        fundamentals: {
          roe: "18.5%",
          roa: "9.2%",
          debtToEquity: "0.38",
          currentRatio: "1.95",
          quickRatio: "1.75",
          profitMargin: "28.4%"
        },
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
      
      // Do not automatically open the investment modal
      // Even if the initialTab is 'invest'
      setShowInvestModal(false);
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
    
    // Make sure we have valid stock data before showing the modal
    if (stockData) {
      console.log('Opening investment modal for:', stockData.name);
      setShowInvestModal(true);
    } else {
      toast({
        title: "Error",
        description: "Unable to load stock data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Function to handle the Invest tab selection
  const handleInvestTab = () => {
    // This function doesn't open the modal directly
    // It just ensures the user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access investment options",
      });
      navigate('/signin?redirect=/stocks/' + symbol + '?tab=invest');
      return;
    }
    
    // Make sure the invest modal is closed when viewing the invest tab
    setShowInvestModal(false);
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
      description: `${orderType.toUpperCase()} order for ${sharesNum} shares of ${stockData?.name} has been submitted`,
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
                  <p className="mt-3 mb-6 text-white/80">{stockData?.description}</p>
                  
                  {/* Candlestick Chart */}
                  <div className="mt-6 mb-8 bg-secondary/20 p-4 rounded-lg border border-white/10">
                    <h3 className="text-lg font-medium mb-4">Price Chart</h3>
                    {stockData?.candlestickData && (
                      <CandlestickChart 
                        data={stockData.candlestickData} 
                        width={600}
                        height={300}
                      />
                    )}
                  </div>
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
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => { setOrderType('buy'); handleInvest(); }}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={stockData?.status === 'haram'}
                        >
                          Buy
                        </Button>
                        <Button 
                          onClick={() => { setOrderType('sell'); handleInvest(); }}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          disabled={stockData?.status === 'haram'}
                        >
                          Sell
                        </Button>
                      </div>
                      
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
                  <TabsTrigger value="invest" onClick={handleInvestTab}>Invest</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-secondary/20 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                          <BarChart3 className="mr-2 h-5 w-5 text-lavender" />
                          Company Overview
                        </CardTitle>
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

                  {/* Performance Card */}
                  <Card className="bg-secondary/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center">
                        <LineChart className="mr-2 h-5 w-5 text-lavender" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">1 Day</span>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${stockData?.performance.day >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(Math.abs(stockData?.performance.day || 0) * 5, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${stockData?.performance.day >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stockData?.performance.day >= 0 ? '+' : ''}{stockData?.performance.day}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">1 Week</span>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${stockData?.performance.week >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(Math.abs(stockData?.performance.week || 0) * 2, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${stockData?.performance.week >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stockData?.performance.week >= 0 ? '+' : ''}{stockData?.performance.week}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">1 Month</span>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${stockData?.performance.month >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(Math.abs(stockData?.performance.month || 0), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${stockData?.performance.month >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stockData?.performance.month >= 0 ? '+' : ''}{stockData?.performance.month}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">YTD</span>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${stockData?.performance.ytd >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(Math.abs(stockData?.performance.ytd || 0) * 0.5, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${stockData?.performance.ytd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stockData?.performance.ytd >= 0 ? '+' : ''}{stockData?.performance.ytd}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">1 Year</span>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${stockData?.performance.year >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(Math.abs(stockData?.performance.year || 0) * 0.3, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${stockData?.performance.year >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stockData?.performance.year >= 0 ? '+' : ''}{stockData?.performance.year}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Fundamentals Card */}
                  <Card className="bg-secondary/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center">
                        <Percent className="mr-2 h-5 w-5 text-lavender" />
                        Fundamentals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-white/40">Return on Equity</p>
                          <p className="text-sm font-medium">{stockData?.fundamentals.roe}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Return on Assets</p>
                          <p className="text-sm font-medium">{stockData?.fundamentals.roa}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Debt to Equity</p>
                          <p className="text-sm font-medium">{stockData?.fundamentals.debtToEquity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Current Ratio</p>
                          <p className="text-sm font-medium">{stockData?.fundamentals.currentRatio}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Quick Ratio</p>
                          <p className="text-sm font-medium">{stockData?.fundamentals.quickRatio}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Profit Margin</p>
                          <p className="text-sm font-medium">{stockData?.fundamentals.profitMargin}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Company Information Card */}
                  <Card className="bg-secondary/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-lavender" />
                        Company Information
                      </CardTitle>
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
                          <Card 
                            className="bg-secondary/40 border-white/10 hover:border-lavender/30 transition-all cursor-pointer" 
                            onClick={() => { 
                              setOrderType('buy'); 
                              setInvestmentType('intraday'); 
                              setShowInvestModal(true);
                            }}
                          >
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
                          
                          <Card 
                            className="bg-secondary/40 border-white/10 hover:border-lavender/30 transition-all cursor-pointer" 
                            onClick={() => { 
                              setOrderType('buy'); 
                              setInvestmentType('long-term'); 
                              setShowInvestModal(true);
                            }}
                          >
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
            
            {/* Full-screen Order Interface */}
            {showInvestModal && stockData && (
              <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
                <div className="container mx-auto px-4 py-8">
                  <div className="flex flex-col space-y-4 mb-6">
                    <div>
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowInvestModal(false)}
                        className="hover:bg-lavender/20 mb-2"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stock Details
                      </Button>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {orderType === 'buy' ? 'Buy' : 'Sell'} {stockData.name}
                      </h2>
                      <p className="text-white/60">
                        {stockData.symbol} - Current Price: ${stockData.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left column - Chart and Stock Info */}
                    <div className="space-y-6">
                      <Card className="bg-secondary/20 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-xl">Price Chart</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {stockData.candlestickData && (
                            <CandlestickChart 
                              data={stockData.candlestickData} 
                              width={600}
                              height={300}
                            />
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-secondary/20 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-xl">Stock Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-white/40">Market Cap</p>
                              <p className="text-sm font-medium">{stockData.marketCap}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40">P/E Ratio</p>
                              <p className="text-sm font-medium">{stockData.peRatio}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40">Volume</p>
                              <p className="text-sm font-medium">{stockData.volume}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40">52-Week Range</p>
                              <p className="text-sm font-medium">{stockData.yearRange}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Right column - Order Form */}
                    <div>
                      <Card className="bg-secondary/20 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-xl">
                            {orderType === 'buy' ? 'Buy Order' : 'Sell Order'}
                          </CardTitle>
                          <CardDescription>
                            Place your {orderType === 'buy' ? 'buy' : 'sell'} order for {stockData.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {/* Simplified order form */}
                          <div className="space-y-6">
                            <div>
                              <Label htmlFor="quantity">Quantity</Label>
                              <Input 
                                id="quantity" 
                                type="text" 
                                value={shares}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    setShares(value);
                                  }
                                }}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Exchange</Label>
                                <div className="mt-1 flex space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      id="nse" 
                                      name="exchange" 
                                      value="NSE" 
                                      defaultChecked 
                                      className="h-4 w-4 text-lavender" 
                                    />
                                    <Label htmlFor="nse">NSE</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      id="bse" 
                                      name="exchange" 
                                      value="BSE" 
                                      className="h-4 w-4 text-lavender" 
                                    />
                                    <Label htmlFor="bse">BSE</Label>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Order Type</Label>
                                <div className="mt-1 flex space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      id="market" 
                                      name="orderType" 
                                      value="market" 
                                      defaultChecked 
                                      className="h-4 w-4 text-lavender" 
                                    />
                                    <Label htmlFor="market">Market</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      id="limit" 
                                      name="orderType" 
                                      value="limit" 
                                      className="h-4 w-4 text-lavender" 
                                    />
                                    <Label htmlFor="limit">Limit</Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-6 border-t border-white/10">
                              <div className="flex justify-between items-center mb-2">
                                <Label>Estimated Total</Label>
                                <span className="text-xl font-bold">
                                  ${((parseInt(shares) || 0) * stockData.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            
                            <Button 
                              onClick={handlePlaceOrder} 
                              className={cn(
                                "w-full", 
                                orderType === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                              )}
                            >
                              Place {orderType.toUpperCase()} Order
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default StockDetails;
