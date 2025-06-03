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
import { useToast } from "@/hooks/use-toast";
import { BarChart2, ShoppingCart, LayoutDashboard, RefreshCw } from "lucide-react";
import { usePortfolioContext } from "@/contexts/PortfolioContext";
import { usePortfolio } from "@/hooks/usePortfolio";
// TypeScript interfaces were converted to comments in usePortfolio.js:
// StockHolding: id, name, symbol, quantity, avgPrice, currentPrice, value, profitLoss, profitLossPercentage
// Order: id, stockName, stockSymbol, type, quantity, price, total, status, date
// TransactionDetails: symbol, quantity, price, total, type

const Portfolio = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const viewParam = searchParams.get('view') || 'overview';
  
  // Use our PortfolioContext for state management
  const { holdings, orders, addStockToPortfolio, sellStockFromPortfolio, updatePortfolio } = usePortfolioContext();
  
  // State for transaction dialog
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null); // StockHolding | null
  const [transactionType, setTransactionType] = useState('buy'); // 'buy' | 'sell'
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin?redirect=/portfolio');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Calculate total portfolio value
  const totalPortfolioValue = holdings.reduce((total, stock) => total + stock.value, 0);
  const totalProfitLoss = holdings.reduce((total, stock) => total + stock.profitLoss, 0);
  const totalProfitLossPercentage = totalPortfolioValue > 0 ? (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100 : 0;
  
  // Calculate values by asset type
  const stocksValue = holdings
    .filter(holding => !holding.symbol.includes('-ETF'))
    .reduce((total, stock) => total + stock.value, 0);
    
  const etfsValue = holdings
    .filter(holding => holding.symbol.includes('-ETF'))
    .reduce((total, etf) => total + etf.value, 0);
    
  // Calculate percentages
  const stocksPercentage = totalPortfolioValue > 0 ? (stocksValue / totalPortfolioValue) * 100 : 0;
  const etfsPercentage = totalPortfolioValue > 0 ? (etfsValue / totalPortfolioValue) * 100 : 0;

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
              variant="outline"
              className="border-lavender/30 hover:bg-lavender/20 flex items-center gap-2"
              onClick={() => {
                updatePortfolio();
                toast({
                  title: "Portfolio Refreshed",
                  description: "Your portfolio data has been updated with the latest information."
                });
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button 
              className="bg-lavender hover:bg-lavender-dark"
              onClick={() => navigate('/stocks')}
            >
              Invest in New Stock
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue={viewParam} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2" onClick={() => navigate('/portfolio?view=overview')}>
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2" onClick={() => navigate('/portfolio?view=orders')}>
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" onClick={() => navigate('/portfolio?view=analytics')}>
              <BarChart2 className="h-4 w-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Portfolio Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-secondary/30 border-black h-full">
                  <CardHeader>
                    <CardTitle>Portfolio Summary</CardTitle>
                    <CardDescription>Your investment overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="text-sm text-black">Total Portfolio Value</div>
                        <div className="text-3xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
                        <div className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)} ({totalProfitLossPercentage.toFixed(1)}%)
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-sm">Stocks</div>
                            <div className="text-sm">${stocksValue.toFixed(2)}</div>
                          </div>
                          <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                            <div className="h-full bg-lavender" style={{width: `${Math.min(stocksPercentage, 100)}%`}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-sm">ETFs</div>
                            <div className="text-sm">${etfsValue.toFixed(2)}</div>
                          </div>
                          <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-400" style={{width: `${Math.min(etfsPercentage, 100)}%`}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-black">
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
                <Card className="bg-secondary/30 border-black">
                  <CardHeader>
                    <CardTitle>Holdings</CardTitle>
                    <CardDescription>Your investment portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-black">
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
                            <tr key={stock.id} className="border-b border-black hover:bg-white/5">
                              <td className="py-3 px-4">
                                <div>{stock.name}</div>
                                <div className="text-xs text-black">{stock.symbol}</div>
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
                              <td colSpan={7} className="py-8 text-center text-black">
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
            <Card className="bg-secondary/30 border-black">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Track your buy and sell orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black">
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
                        <tr key={order.id} className="border-b border-black hover:bg-white/5">
                          <td className="py-3 px-4">{order.id}</td>
                          <td className="py-3 px-4">
                            <div>{order.stockName}</div>
                            <div className="text-xs text-black">{order.stockSymbol}</div>
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
                          <td colSpan={9} className="py-8 text-center text-black">
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
            <Card className="bg-secondary/30 border-black">
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>Insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart2 className="h-12 w-12 mx-auto mb-4 text-lavender opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard Coming Soon</h3>
                  <p className="text-black max-w-md mx-auto">
                    We're working on advanced analytics to help you track your portfolio performance, sector allocation, and Shariah compliance metrics over time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          

        </Tabs>
      </main>
      
      <Footer />
      
      {/* Stock Transaction Dialog */}
      <StockTransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        stock={selectedStock}
        transactionType={transactionType}
        onComplete={(success, quantity) => {
          if (!success || !selectedStock) return;
          console.log('Transaction completed:', transactionType, quantity, selectedStock.symbol);
          
          // Process the transaction based on type
          if (transactionType === 'buy') {
            // Add to portfolio
            const success = addStockToPortfolio({
              name: selectedStock.name,
              symbol: selectedStock.symbol,
              quantity,
              price: selectedStock.currentPrice,
              total: quantity * selectedStock.currentPrice
            });
            
            if (success) {
              toast({
                title: "Purchase Successful",
                description: `You have purchased ${quantity} shares of ${selectedStock.name}.`
              });
            }
          } else {
            // Sell from portfolio
            const success = sellStockFromPortfolio({
              symbol: selectedStock.symbol,
              quantity,
              price: selectedStock.currentPrice,
              total: quantity * selectedStock.currentPrice
            });
            
            if (success) {
              toast({
                title: "Sale Successful",
                description: `You have sold ${quantity} shares of ${selectedStock.name}.`
              });
            } else {
              toast({
                title: "Sale Failed",
                description: "You may not have enough shares to complete this transaction.",
                variant: "destructive"
              });
            }
          }
          
          // Update the portfolio to refresh the data
          updatePortfolio();
        }}
      />
    </div>
  );
};
export default Portfolio;