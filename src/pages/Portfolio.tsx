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
  
  // Transaction dialog state
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockHolding | null>(null);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin?redirect=/portfolio');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <LoadingAnimation type="spinner" size="lg" text="Loading your portfolio..." />
        </main>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Portfolio Summary Card */}
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
                    <div className="text-3xl font-bold">$4,630.40</div>
                    <div className="text-sm text-green-400">+$133.25 (2.9%)</div>
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
                        <div className="h-full bg-lavender" style={{width: '17%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm font-medium mb-3">Quick Actions</div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/account')}>
                        View Account Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/wallet')}>
                        Manage Wallet
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-secondary/30 border-white/10">
              <CardHeader>
                <Tabs defaultValue={viewParam} className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger 
                      value="holdings" 
                      className="flex-1"
                      onClick={() => navigate('/portfolio?view=holdings')}
                    >
                      Current Holdings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="orders" 
                      className="flex-1"
                      onClick={() => navigate('/portfolio?view=orders')}
                    >
                      Placed Orders
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="holdings">
                    {/* Current Holdings Table */}
                    <div className="rounded-md border border-white/10 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-secondary/50 border-b border-white/10">
                              <th className="py-3 px-4 text-left">Stock</th>
                              <th className="py-3 px-4 text-left">Quantity</th>
                              <th className="py-3 px-4 text-left">Avg. Price</th>
                              <th className="py-3 px-4 text-left">Current Price</th>
                              <th className="py-3 px-4 text-left">Value</th>
                              <th className="py-3 px-4 text-left">Profit/Loss</th>
                              <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Sample data - in a real app, this would come from an API */}
                            <tr className="border-b border-white/10 hover:bg-secondary/30">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center mr-3">
                                    <span className="text-xs font-medium">AAPL</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div>
                                      <div className="font-medium">Apple Inc.</div>
                                      <div className="text-xs text-white/60">AAPL</div>
                                    </div>

                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">10</td>
                              <td className="py-3 px-4">$175.50</td>
                              <td className="py-3 px-4">$182.63</td>
                              <td className="py-3 px-4">$1,826.30</td>
                              <td className="py-3 px-4 text-green-400">+$71.30 (4.1%)</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-2 text-xs"
                                    onClick={() => {
                                      setSelectedStock(holdings[2]);
                                      setTransactionType('buy');
                                      setTransactionDialogOpen(true);
                                    }}
                                  >
                                    Buy More
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400/10"
                                    onClick={() => {
                                      setSelectedStock(holdings[2]);
                                      setTransactionType('sell');
                                      setTransactionDialogOpen(true);
                                    }}
                                  >
                                    Sell
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="border-b border-white/10 hover:bg-secondary/30">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center mr-3">
                                    <span className="text-xs font-medium">MSFT</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div>
                                      <div className="font-medium">Microsoft Corporation</div>
                                      <div className="text-xs text-white/60">MSFT</div>
                                    </div>

                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">5</td>
                              <td className="py-3 px-4">$320.75</td>
                              <td className="py-3 px-4">$337.22</td>
                              <td className="py-3 px-4">$1,686.10</td>
                              <td className="py-3 px-4 text-green-400">+$82.35 (5.1%)</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-2 text-xs"
                                    onClick={() => {
                                      setSelectedStock(holdings[2]);
                                      setTransactionType('buy');
                                      setTransactionDialogOpen(true);
                                    }}
                                  >
                                    Buy More
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400/10"
                                    onClick={() => {
                                      setSelectedStock(holdings[2]);
                                      setTransactionType('sell');
                                      setTransactionDialogOpen(true);
                                    }}
                                  >
                                    Sell
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-secondary/30">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center mr-3">
                                    <span className="text-xs font-medium">GOOGL</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div>
                                      <div className="font-medium">Alphabet Inc.</div>
                                      <div className="text-xs text-white/60">GOOGL</div>
                                    </div>

                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">8</td>
                              <td className="py-3 px-4">$142.30</td>
                              <td className="py-3 px-4">$139.75</td>
                              <td className="py-3 px-4">$1,118.00</td>
                              <td className="py-3 px-4 text-red-400">-$20.40 (1.8%)</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-2 text-xs"
                                    onClick={() => {
                                      setSelectedStock(holdings[2]);
                                      setTransactionType('buy');
                                      setTransactionDialogOpen(true);
                                    }}
                                  >
                                    Buy More
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400/10"
                                    onClick={() => {
                                      setSelectedStock(holdings[2]);
                                      setTransactionType('sell');
                                      setTransactionDialogOpen(true);
                                    }}
                                  >
                                    Sell
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="orders">
                    {/* Placed Orders Table */}
                    <div className="rounded-md border border-white/10 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-secondary/50 border-b border-white/10">
                              <th className="py-3 px-4 text-left">Order ID</th>
                              <th className="py-3 px-4 text-left">Stock</th>
                              <th className="py-3 px-4 text-left">Type</th>
                              <th className="py-3 px-4 text-left">Quantity</th>
                              <th className="py-3 px-4 text-left">Price</th>
                              <th className="py-3 px-4 text-left">Total</th>
                              <th className="py-3 px-4 text-left">Status</th>
                              <th className="py-3 px-4 text-left">Date</th>
                              <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Sample data - in a real app, this would come from an API */}
                            <tr className="border-b border-white/10 hover:bg-secondary/30">
                              <td className="py-3 px-4">ORD-7829</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div>
                                    <div className="font-medium">Apple Inc.</div>
                                    <div className="text-xs text-white/60">AAPL</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-green-400">Buy</td>
                              <td className="py-3 px-4">2</td>
                              <td className="py-3 px-4">$182.50</td>
                              <td className="py-3 px-4">$365.00</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">Pending</span>
                              </td>
                              <td className="py-3 px-4">May 9, 2025</td>
                              <td className="py-3 px-4">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400/10"
                                  onClick={() => {
                                    // Cancel the order
                                    const updatedOrders = orders.map(order => 
                                      order.id === 'ORD-7829' ? {...order, status: 'cancelled' as const} : order
                                    );
                                    setOrders(updatedOrders);
                                    toast({
                                      title: "Order Cancelled",
                                      description: "Your order has been cancelled successfully.",
                                    });
                                  }}
                                >
                                  Cancel
                                </Button>
                              </td>
                            </tr>
                            <tr className="border-b border-white/10 hover:bg-secondary/30">
                              <td className="py-3 px-4">ORD-7825</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div>
                                    <div className="font-medium">Microsoft Corporation</div>
                                    <div className="text-xs text-white/60">MSFT</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-red-400">Sell</td>
                              <td className="py-3 px-4">1</td>
                              <td className="py-3 px-4">$340.00</td>
                              <td className="py-3 px-4">$340.00</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Completed</span>
                              </td>
                              <td className="py-3 px-4">May 8, 2025</td>
                              <td className="py-3 px-4">
                                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                  View
                                </Button>
                              </td>
                            </tr>
                            <tr className="hover:bg-secondary/30">
                              <td className="py-3 px-4">ORD-7820</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div>
                                    <div className="font-medium">Tesla, Inc.</div>
                                    <div className="text-xs text-white/60">TSLA</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-green-400">Buy</td>
                              <td className="py-3 px-4">3</td>
                              <td className="py-3 px-4">$175.25</td>
                              <td className="py-3 px-4">$525.75</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Completed</span>
                              </td>
                              <td className="py-3 px-4">May 7, 2025</td>
                              <td className="py-3 px-4">
                                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                  View
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
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
        maxSellQuantity={transactionType === 'sell' && selectedStock ? selectedStock.quantity : undefined}
        onComplete={(success) => {
          if (!success || !selectedStock) return;
          
          // Create transaction details object
          const details = {
            symbol: selectedStock.symbol,
            quantity: transactionType === 'sell' ? 
              (selectedStock.quantity > 0 ? Math.min(selectedStock.quantity, 1) : 0) : 1,
            price: selectedStock.currentPrice,
            total: transactionType === 'sell' ? 
              (selectedStock.quantity > 0 ? Math.min(selectedStock.quantity, 1) * selectedStock.currentPrice : 0) : 
              selectedStock.currentPrice,
            type: transactionType
          };
            if (details.type === 'buy') {
              // Update holdings with new purchase
              const updatedHoldings = holdings.map(holding => {
                if (holding.symbol === details.symbol) {
                  const newQuantity = holding.quantity + details.quantity;
                  const newAvgPrice = ((holding.quantity * holding.avgPrice) + (details.quantity * details.price)) / newQuantity;
                  const newValue = newQuantity * holding.currentPrice;
                  const newProfitLoss = newValue - (newQuantity * newAvgPrice);
                  const newProfitLossPercentage = (newProfitLoss / (newQuantity * newAvgPrice)) * 100;
                  
                  return {
                    ...holding,
                    quantity: newQuantity,
                    avgPrice: newAvgPrice,
                    value: newValue,
                    profitLoss: newProfitLoss,
                    profitLossPercentage: newProfitLossPercentage
                  };
                }
                return holding;
              });
              
              setHoldings(updatedHoldings);
              
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
              // Update holdings with sale
              const updatedHoldings = holdings.map(holding => {
                if (holding.symbol === details.symbol) {
                  const newQuantity = holding.quantity - details.quantity;
                  
                  // If all shares sold, remove from holdings
                  if (newQuantity <= 0) {
                    return null;
                  }
                  
                  const newValue = newQuantity * holding.currentPrice;
                  const newProfitLoss = newValue - (newQuantity * holding.avgPrice);
                  const newProfitLossPercentage = (newProfitLoss / (newQuantity * holding.avgPrice)) * 100;
                  
                  return {
                    ...holding,
                    quantity: newQuantity,
                    value: newValue,
                    profitLoss: newProfitLoss,
                    profitLossPercentage: newProfitLossPercentage
                  };
                }
                return holding;
              }).filter(Boolean) as StockHolding[];
              
              setHoldings(updatedHoldings);
              
              // Add new order
              const newOrder: Order = {
                id: `ORD-${Math.floor(Math.random() * 1000) + 7900}`,
                stockName: selectedStock.name,
                stockSymbol: selectedStock.symbol,
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
