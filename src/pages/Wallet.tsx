
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ShoppingBag, ArrowUp, ArrowDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from '@/hooks/use-toast';
import LoadingAnimation from "@/components/LoadingAnimation";

interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale';
  amount: number;
  date: string;
  symbol?: string;
  shares?: number;
  price?: number;
  status: 'completed' | 'pending' | 'failed';
}

interface Portfolio {
  symbol: string;
  name: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
}

const Wallet = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [balance, setBalance] = useState(5000);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check if we're coming from a stock buy action
  const buyAction = searchParams.get('action') === 'buy';
  const symbol = searchParams.get('symbol');
  const price = searchParams.get('price') ? parseFloat(searchParams.get('price')!) : null;
  
  useEffect(() => {
    // Simulate fetching user wallet data
    setTimeout(() => {
      // Mock initial transactions
      const mockTransactions: WalletTransaction[] = [
        {
          id: '1',
          type: 'deposit',
          amount: 2000,
          date: '2025-04-30',
          status: 'completed'
        },
        {
          id: '2',
          type: 'purchase',
          amount: 894.5,
          date: '2025-05-01',
          symbol: 'RJHI.SR',
          shares: 10,
          price: 89.45,
          status: 'completed'
        },
        {
          id: '3',
          type: 'purchase',
          amount: 674.5,
          date: '2025-05-03',
          symbol: 'MSFT',
          shares: 2,
          price: 337.25,
          status: 'completed'
        }
      ];
      
      // Mock portfolio
      const mockPortfolio: Portfolio[] = [
        {
          symbol: 'RJHI.SR',
          name: 'Al Rajhi Bank',
          shares: 10,
          averagePrice: 89.45,
          currentPrice: 89.25
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corp.',
          shares: 2,
          averagePrice: 337.25,
          currentPrice: 337.18
        }
      ];
      
      setTransactions(mockTransactions);
      setPortfolio(mockPortfolio);
      setLoading(false);
    }, 1200);
  }, []);
  
  // Handle stock purchase if coming from stock detail page
  useEffect(() => {
    if (buyAction && symbol && price) {
      const stockNames: Record<string, string> = {
        "RJHI.SR": "Al Rajhi Bank",
        "BABA": "Alibaba Group",
        "MSFT": "Microsoft Corp.",
        "AAPL": "Apple Inc.",
        "GOOGL": "Alphabet Inc."
      };
      
      const stockName = stockNames[symbol] || symbol;
      
      // Open buy dialog or directly show modal
      setTimeout(() => {
        toast({
          title: "Ready to Invest",
          description: `Enter the number of shares you want to buy for ${stockName} at $${price}`,
        });
      }, 1500);
    }
  }, [buyAction, symbol, price, toast]);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
      });
      return;
    }
    
    // Simulate deposit transaction
    const newTransaction: WalletTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'deposit',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    
    setBalance(prevBalance => prevBalance + amount);
    setTransactions(prev => [newTransaction, ...prev]);
    setDepositAmount('');
    
    toast({
      title: "Deposit Successful",
      description: `$${amount.toFixed(2)} has been added to your wallet`,
    });
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "The withdrawal amount exceeds your available balance",
      });
      return;
    }
    
    // Simulate withdrawal transaction
    const newTransaction: WalletTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'withdrawal',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    
    setBalance(prevBalance => prevBalance - amount);
    setTransactions(prev => [newTransaction, ...prev]);
    setWithdrawAmount('');
    
    toast({
      title: "Withdrawal Successful",
      description: `$${amount.toFixed(2)} has been withdrawn from your wallet`,
    });
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => total + (item.currentPrice * item.shares), 0);
  };

  const calculatePortfolioGrowth = () => {
    const cost = portfolio.reduce((total, item) => total + (item.averagePrice * item.shares), 0);
    const value = calculatePortfolioValue();
    return value - cost;
  };

  const getGrowthPercentage = () => {
    const cost = portfolio.reduce((total, item) => total + (item.averagePrice * item.shares), 0);
    const value = calculatePortfolioValue();
    return cost > 0 ? ((value - cost) / cost) * 100 : 0;
  };
  
  // Handle item growth percentage calculation
  const getItemGrowth = (item: Portfolio) => {
    return ((item.currentPrice - item.averagePrice) / item.averagePrice) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient mb-6">My Wallet</h1>

        {loading ? (
          <div className="py-20">
            <LoadingAnimation type="spinner" size="lg" text="Loading your wallet..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Main Wallet Balance Card */}
              <Card className="bg-gradient-to-br from-lavender/30 to-lavender/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Balance
                  </CardTitle>
                  <CardDescription className="text-white/60">Available funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">${balance.toFixed(2)}</div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="border-lavender text-lavender hover:bg-lavender/20"
                    onClick={() => document.getElementById('deposit-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" /> Deposit
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-lavender text-lavender hover:bg-lavender/20"
                    onClick={() => document.getElementById('withdraw-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Portfolio Value Card */}
              <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Portfolio Value
                  </CardTitle>
                  <CardDescription className="text-white/60">Current investment worth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">${calculatePortfolioValue().toFixed(2)}</div>
                  <div className={`text-sm ${calculatePortfolioGrowth() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {calculatePortfolioGrowth() >= 0 ? '↗' : '↘'} ${Math.abs(calculatePortfolioGrowth()).toFixed(2)} ({getGrowthPercentage().toFixed(2)}%)
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/orders" className="w-full">
                    <Button className="w-full bg-lavender hover:bg-lavender-dark">
                      View Orders
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Quick Actions Card */}
              <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link to="/stocks">
                      <Button className="w-full mb-2 bg-lavender hover:bg-lavender-dark">Buy New Stocks</Button>
                    </Link>
                    <Link to="/analysis">
                      <Button variant="outline" className="w-full border-lavender text-lavender hover:bg-lavender/20">
                        Analyze a Stock
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Portfolio Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">My Portfolio</h2>
              
              {portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.map((item) => (
                    <Card key={item.symbol} className="bg-secondary/20 border-white/10 hover:border-lavender/30 transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-lg">{item.symbol}</CardTitle>
                            <CardDescription>{item.name}</CardDescription>
                          </div>
                          <div className={`self-start px-2 py-1 rounded-full text-xs ${getItemGrowth(item) >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {getItemGrowth(item) >= 0 ? '+' : ''}{getItemGrowth(item).toFixed(2)}%
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                          <div>
                            <div className="text-white/60">Shares</div>
                            <div className="font-medium">{item.shares}</div>
                          </div>
                          <div>
                            <div className="text-white/60">Current Price</div>
                            <div className="font-medium">${item.currentPrice.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-white/60">Avg. Cost</div>
                            <div className="font-medium">${item.averagePrice.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-white/60">Value</div>
                            <div className="font-medium">${(item.shares * item.currentPrice).toFixed(2)}</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/stocks/${item.symbol}`} className="w-full">
                          <Button 
                            variant="outline"
                            className="w-full border-lavender text-lavender hover:bg-lavender/20"
                          >
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-secondary/20 border-white/10 p-6 text-center">
                  <p className="mb-4 text-white/70">You don't have any investments yet.</p>
                  <Link to="/stocks">
                    <Button className="bg-lavender hover:bg-lavender-dark">Explore Halal Stocks</Button>
                  </Link>
                </Card>
              )}
            </div>
            
            {/* Deposit & Withdraw Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card id="deposit-form" className="bg-secondary/20 border-white/10">
                <CardHeader>
                  <CardTitle>Deposit Funds</CardTitle>
                  <CardDescription>Add money to your investment wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDeposit}>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <Input
                          type="number"
                          placeholder="Amount"
                          className="pl-8 bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="bg-lavender hover:bg-lavender-dark">
                        Deposit
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card id="withdraw-form" className="bg-secondary/20 border-white/10">
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>Transfer money from your wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWithdraw}>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <Input
                          type="number"
                          placeholder="Amount"
                          className="pl-8 bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          max={balance}
                        />
                      </div>
                      <Button type="submit" className="bg-lavender hover:bg-lavender-dark">
                        Withdraw
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Transactions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              
              <Card className="bg-secondary/20 border-white/10">
                {transactions.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium flex items-center">
                            {transaction.type === 'deposit' && (
                              <ArrowDown className="mr-2 h-4 w-4 text-green-400" />
                            )}
                            {transaction.type === 'withdrawal' && (
                              <ArrowUp className="mr-2 h-4 w-4 text-red-400" />
                            )}
                            {transaction.type === 'purchase' && (
                              <ShoppingBag className="mr-2 h-4 w-4 text-lavender" />
                            )}
                            {transaction.type === 'sale' && (
                              <ShoppingBag className="mr-2 h-4 w-4 text-lavender" />
                            )}
                            {transaction.type === 'deposit' && 'Deposit'}
                            {transaction.type === 'withdrawal' && 'Withdrawal'}
                            {transaction.type === 'purchase' && `Purchased ${transaction.symbol}`}
                            {transaction.type === 'sale' && `Sold ${transaction.symbol}`}
                          </div>
                          <div className="text-xs text-white/60">
                            {transaction.date}
                            {transaction.shares && transaction.price && (
                              <span> • {transaction.shares} shares @ ${transaction.price}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className={`text-right font-medium ${
                            transaction.type === 'deposit' || transaction.type === 'sale' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'sale' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-right">
                            <span className={`px-2 py-0.5 rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-500/10 text-green-400' : 
                              transaction.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <CardContent className="text-center py-6">
                    <p className="text-white/70">No transactions yet</p>
                  </CardContent>
                )}
              </Card>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;
