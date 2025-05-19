import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";
import StockTransactionDialog from "@/components/StockTransactionDialog";
import InvestmentCopilot from "@/components/InvestmentCopilot";
import ShariahComplianceVerification from "@/components/ShariahComplianceVerification";
import HalalMarketIntelligence from "@/components/HalalMarketIntelligence";
import { useToast } from "@/hooks/use-toast";
import { BarChart2, ShoppingCart, LayoutDashboard, Sparkles } from "lucide-react";

// Define interfaces for our data
interface StockHolding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  profitLoss: number;
  profitLossPercentage: number;
}

interface Order {
  id: string;
  stockName: string;
  stockSymbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

const Portfolio = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const viewParam = searchParams.get('view') || 'holdings';
  
  // Sample data - in a real app, this would come from an API
  const [holdings, setHoldings] = useState<StockHolding[]>([
    {
      id: '1',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      quantity: 10,
      avgPrice: 175.50,
      currentPrice: 182.63,
      value: 1826.30,
      profitLoss: 71.30,
      profitLossPercentage: 4.1
    },
    {
      id: '2',
      name: 'Microsoft Corporation',
      symbol: 'MSFT',
      quantity: 5,
      avgPrice: 320.75,
      currentPrice: 337.22,
      value: 1686.10,
      profitLoss: 82.35,
      profitLossPercentage: 5.1
    },
    {
      id: '3',
      name: 'Alphabet Inc.',
      symbol: 'GOOGL',
      quantity: 8,
      avgPrice: 142.30,
      currentPrice: 139.75,
      value: 1118.00,
      profitLoss: -20.40,
      profitLossPercentage: -1.8
    }
  ]);
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-7829',
      stockName: 'Apple Inc.',
      stockSymbol: 'AAPL',
      type: 'buy',
      quantity: 2,
      price: 182.50,
      total: 365.00,
      status: 'pending',
      date: 'May 9, 2025'
    },
    {
      id: 'ORD-7825',
      stockName: 'Microsoft Corporation',
      stockSymbol: 'MSFT',
      type: 'sell',
      quantity: 1,
      price: 340.00,
      total: 340.00,
      status: 'completed',
      date: 'May 8, 2025'
    },
    {
      id: 'ORD-7820',
      stockName: 'Tesla, Inc.',
      stockSymbol: 'TSLA',
      type: 'buy',
      quantity: 3,
      price: 175.25,
      total: 525.75,
      status: 'completed',
      date: 'May 7, 2025'
    }
  ]);
  
  // State for transaction dialog
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockHolding | null>(null);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin?redirect=/portfolio');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Calculate total portfolio value
  const totalPortfolioValue = holdings.reduce((total, stock) => total + stock.value, 0);
  const totalProfitLoss = holdings.reduce((total, stock) => total + stock.profitLoss, 0);
  const totalProfitLossPercentage = (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingAnimation text="Loading your portfolio..." type="spinner" size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">My Investment Portfolio</h1>
          <div className="flex items-center gap-3">
            <Button 
              className="bg-lavender hover:bg-lavender-dark"
              onClick={() => navigate('/stocks')}
            >
              Invest in New Stock
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-tools" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Tools
            </TabsTrigger>
          </TabsList>
          
          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Portfolio Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-secondary/30 border-white/10 h-full">
                  <CardHeader>
                    <CardTitle>Portfolio Summary</CardTitle>
                    <CardDescription>Your investment overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="text-sm text-white/60">Total Portfolio Value</div>
                        <div className="text-3xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
                        <div className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)} ({totalProfitLossPercentage.toFixed(1)}%)
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-sm">Stocks</div>
                            <div className="text-sm">$3,850.20</div>
                          </div>
                          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-lavender" style={{width: '83%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-sm">ETFs</div>
                            <div className="text-sm">$780.20</div>
                          </div>
                          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400" style={{width: '17%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <div className="text-sm font-medium mb-2">Quick Actions</div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="w-full">
                            Deposit
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Portfolio Details */}
              <div className="lg:col-span-3">
                <Card className="bg-secondary/30 border-white/10">
                  <CardHeader>
                    <CardTitle>Holdings</CardTitle>
                    <CardDescription>Your investment portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 font-medium">Stock</th>
                            <th className="text-left py-3 px-4 font-medium">Quantity</th>
                            <th className="text-left py-3 px-4 font-medium">Avg. Price</th>
                            <th className="text-left py-3 px-4 font-medium">Current Price</th>
                            <th className="text-left py-3 px-4 font-medium">Value</th>
                            <th className="text-left py-3 px-4 font-medium">Profit/Loss</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holdings.map((stock) => (
                            <tr key={stock.id} className="border-b border-white/10 hover:bg-white/5">
                              <td className="py-3 px-4">
                                <div>{stock.name}</div>
                                <div className="text-xs text-white/60">{stock.symbol}</div>
                              </td>
                              <td className="py-3 px-4">{stock.quantity}</td>
                              <td className="py-3 px-4">${stock.avgPrice.toFixed(2)}</td>
                              <td className="py-3 px-4">${stock.currentPrice.toFixed(2)}</td>
                              <td className="py-3 px-4">${stock.value.toFixed(2)}</td>
                              <td className="py-3 px-4">
                                <div className={`${stock.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {stock.profitLoss >= 0 ? '+' : ''}{stock.profitLoss.toFixed(2)}
                                </div>
                                <div className={`text-xs ${stock.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {stock.profitLoss >= 0 ? '+' : ''}{stock.profitLossPercentage.toFixed(1)}%
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-2 text-xs"
                                    onClick={() => {
                                      setSelectedStock(stock);
                                      setTransactionType('buy');
                                      setTransactionDialogOpen(true);
                                    }}
                                  >
                                    Buy
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-2 text-xs"
                                    onClick={() => {
                                      setSelectedStock(stock);
                                      setTransactionType('sell');
                                      setTransactionDialogOpen(true);
                                    }}
                                  >
                                    Sell
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {holdings.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-white/60">
                                You don't have any holdings yet. Start investing to build your portfolio.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* ORDERS TAB */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-secondary/30 border-white/10">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Track your buy and sell orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium">Stock</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Quantity</th>
                        <th className="text-left py-3 px-4 font-medium">Price</th>
                        <th className="text-left py-3 px-4 font-medium">Total</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4">{order.id}</td>
                          <td className="py-3 px-4">
                            <div>{order.stockName}</div>
                            <div className="text-xs text-white/60">{order.stockSymbol}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${order.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">{order.quantity}</td>
                          <td className="py-3 px-4">${order.price.toFixed(2)}</td>
                          <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400' 
                                : order.status === 'pending' 
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">{order.date}</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-white/60">
                            You haven't placed any orders yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-secondary/30 border-white/10">
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>Insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart2 className="h-12 w-12 mx-auto mb-4 text-lavender opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard Coming Soon</h3>
                  <p className="text-white/60 max-w-md mx-auto">
                    We're working on advanced analytics to help you track your portfolio performance, sector allocation, and Shariah compliance metrics over time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* AI TOOLS TAB */}
          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* AI Investment Copilot */}
              <div className="lg:col-span-1">
                <InvestmentCopilot holdings={holdings} />
              </div>
              
              {/* Shariah Compliance Verification */}
              <div className="lg:col-span-1">
                <ShariahComplianceVerification holdings={holdings} />
              </div>
            </div>
            
            {/* Predictive Halal Market Intelligence */}
            <div>
              <HalalMarketIntelligence userPortfolio={holdings} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      
      {/* Stock Transaction Dialog */}
      <StockTransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        stock={selectedStock ? {
          name: selectedStock.name,
          symbol: selectedStock.symbol,
          currentPrice: selectedStock.currentPrice
        } : null}
        transactionType={transactionType}
        onComplete={(success, quantity) => {
          if (!success || !selectedStock) return;
          
          const details = {
            symbol: selectedStock.symbol,
            quantity: quantity,
            price: selectedStock.currentPrice,
            total: quantity * selectedStock.currentPrice,
            type: transactionType
          };
          if (details.type === 'buy') {
            // Handle buy transaction
            
            // Check if stock already exists in holdings
            const existingStockIndex = holdings.findIndex(h => h.symbol === details.symbol);
            
            if (existingStockIndex !== -1) {
              // Update existing holding
              const holding = holdings[existingStockIndex];
              const updatedHoldings = [...holdings];
              
              // Calculate new average price and quantity
              const newQuantity = holding.quantity + details.quantity;
              const newAvgPrice = ((holding.quantity * holding.avgPrice) + (details.quantity * details.price)) / newQuantity;
              const newValue = newQuantity * holding.currentPrice;
              const newProfitLoss = newValue - (newQuantity * newAvgPrice);
              const newProfitLossPercentage = (newProfitLoss / (newQuantity * newAvgPrice)) * 100;
              
              updatedHoldings[existingStockIndex] = {
                ...holding,
                quantity: newQuantity,
                avgPrice: newAvgPrice,
                value: newValue,
                profitLoss: newProfitLoss,
                profitLossPercentage: newProfitLossPercentage
              };
              
              setHoldings(updatedHoldings);
            } else {
              // Add new stock to holdings
              const newHolding: StockHolding = {
                id: `holding-${Date.now()}`,
                name: selectedStock.name,
                symbol: selectedStock.symbol,
                quantity: details.quantity,
                avgPrice: details.price,
                currentPrice: selectedStock.currentPrice,
                value: details.quantity * selectedStock.currentPrice,
                profitLoss: 0,
                profitLossPercentage: 0
              };
              
              setHoldings([...holdings, newHolding]);
            }
            
            // Add new order
            const newOrder: Order = {
              id: `ORD-${Math.floor(Math.random() * 1000) + 7900}`,
              stockName: selectedStock.name,
              stockSymbol: selectedStock.symbol,
              type: 'buy',
              quantity: details.quantity,
              price: details.price,
              total: details.total,
              status: 'pending' as const,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };
            
            setOrders([newOrder, ...orders]);
          } else if (details.type === 'sell') {
            // Create a deep copy of the holdings array
            const holdingsCopy = JSON.parse(JSON.stringify(holdings));
            
            // Find the index of the stock being sold
            const stockIndex = holdingsCopy.findIndex(h => h.symbol === details.symbol);
            
            if (stockIndex !== -1) {
              const holding = holdingsCopy[stockIndex];
              
              // Calculate new quantity after selling
              const newQuantity = holding.quantity - details.quantity;
              
              // If all shares sold, remove from holdings
              if (newQuantity <= 0) {
                holdingsCopy.splice(stockIndex, 1);
              } else {
                // Update the holding with new values
                const newValue = newQuantity * holding.currentPrice;
                const newProfitLoss = newValue - (newQuantity * holding.avgPrice);
                const newProfitLossPercentage = (newProfitLoss / (newQuantity * holding.avgPrice)) * 100;
                
                holdingsCopy[stockIndex] = {
                  ...holding,
                  quantity: newQuantity,
                  value: newValue,
                  profitLoss: newProfitLoss,
                  profitLossPercentage: newProfitLossPercentage
                };
              }
              
              // Update the state with the new holdings array
              setHoldings(holdingsCopy);
            }
            
            // Add new order
            const newOrder: Order = {
              id: `ORD-${Math.floor(Math.random() * 1000) + 7900}`,
              stockName: selectedStock!.name,
              stockSymbol: selectedStock!.symbol,
              type: 'sell',
              quantity: details.quantity,
              price: details.price,
              total: details.total,
              status: 'pending' as const,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };
            
            setOrders([newOrder, ...orders]);
          }
        }}
      />
    </div>
  );
};

export default Portfolio;
