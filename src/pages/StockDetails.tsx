
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Share, FileBarChart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from '@/hooks/use-toast';
import HalalBadge from '@/components/HalalBadge';
import LoadingAnimation from '@/components/LoadingAnimation';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<any>(null);
  
  useEffect(() => {
    // Simulate API call to fetch stock details
    setLoading(true);
    
    // Mock data - in a real app, this would be an API call
    setTimeout(() => {
      const mockStocks = {
        "RJHI.SR": {
          name: "Al Rajhi Bank",
          symbol: "RJHI.SR",
          price: 89.25,
          change: 1.2,
          status: "halal" as const,
          description: "Islamic banking and investment products",
          category: "finance",
          dividendYield: "2.7%",
          marketCap: "$59.8B",
          peRatio: "15.2",
          volume: "3.2M",
          dayRange: "88.45 - 90.10",
          yearRange: "75.30 - 95.40",
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
          status: "halal" as const,
          description: "E-commerce and cloud computing",
          category: "technology",
          dividendYield: "1.2%",
          marketCap: "$224.3B",
          peRatio: "19.8",
          volume: "15.7M",
          dayRange: "86.45 - 89.30",
          yearRange: "65.20 - 110.40",
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
          status: "halal" as const,
          description: "Software, cloud computing, and hardware",
          category: "technology",
          dividendYield: "0.8%",
          marketCap: "$2.5T",
          peRatio: "28.4",
          volume: "22.1M",
          dayRange: "334.50 - 339.25",
          yearRange: "290.10 - 345.80",
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
    }, 1000);
  }, [symbol]);

  const handleInvest = () => {
    toast({
      title: "Investment Started",
      description: `You started the investment process for ${stockData.name} (${stockData.symbol})`,
    });
    
    // Navigate to wallet page with the stock information
    navigate(`/wallet?action=buy&symbol=${stockData.symbol}&price=${stockData.price}`);
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
                    <h1 className="text-2xl md:text-3xl font-bold">{stockData.name}</h1>
                    <HalalBadge type={stockData.status} size="md" />
                  </div>
                  <p className="text-white/60">{stockData.symbol} • {stockData.category}</p>
                  <p className="mt-3 text-white/80">{stockData.description}</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="p-5 rounded-lg bg-secondary/30 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Current Price</span>
                      <div className={`px-2 py-1 rounded-full text-xs ${stockData.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {stockData.change >= 0 ? '+' : ''}{stockData.change}%
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-4">${stockData.price.toFixed(2)}</div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-white/40">Day Range</p>
                        <p className="text-sm">{stockData.dayRange}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Year Range</p>
                        <p className="text-sm">{stockData.yearRange}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={handleInvest} 
                        className="w-full bg-lavender hover:bg-lavender-dark"
                        disabled={stockData.status === 'haram'}
                      >
                        {stockData.status === 'haram' ? 'Non-Halal' : 'Invest Now'}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-secondary/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl">Company Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/80 mb-6">{stockData.about}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-white/40">Market Cap</p>
                        <p className="text-sm font-medium">{stockData.marketCap}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">P/E Ratio</p>
                        <p className="text-sm font-medium">{stockData.peRatio}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Dividend Yield</p>
                        <p className="text-sm font-medium">{stockData.dividendYield}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Volume</p>
                        <p className="text-sm font-medium">{stockData.volume}</p>
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
                      {stockData.analysts.map((analyst: any, index: number) => (
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

              <div className="mt-6">
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
                        {stockData.news.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell className="text-right text-white/60">{item.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default StockDetails;
