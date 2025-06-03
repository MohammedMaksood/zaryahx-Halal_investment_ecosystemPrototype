import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet as WalletIcon, 
  ShoppingBag, 
  ArrowUp, 
  ArrowDown, 
  CreditCard, 
  Bitcoin, 
  DollarSign,
  Plus,
  Shield,
  Users,
  LogOut
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from '@/hooks/use-toast';
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Blockchain components
import { Web3Provider } from '@/contexts/Web3Context';
import BlockchainWallet from "@/components/blockchain/BlockchainWallet";
import TransactionHistory from "@/components/blockchain/TransactionHistory";
import ShariahComplianceVerifier from "@/components/blockchain/ShariahComplianceVerifier";
import CommunityPortfolio from "@/components/blockchain/CommunityPortfolio";
import DisconnectButton from "@/components/blockchain/DisconnectButton";

interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale';
  amount: number;
  date: string;
  symbol?: string;
  shares?: number;
  price?: number;
  status: 'completed' | 'pending' | 'failed';
  method?: string;
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
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [balance, setBalance] = useState(0); // Start with zero balance
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedDepositMethod, setSelectedDepositMethod] = useState('card');
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState('bank');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  
  // Check if we're coming from a stock buy action
  const buyAction = searchParams.get('action') === 'buy';
  const symbol = searchParams.get('symbol');
  const price = searchParams.get('price') ? parseFloat(searchParams.get('price')!) : null;
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin?redirect=/wallet');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  useEffect(() => {
    // Only load data if authenticated
    if (isAuthenticated) {
      // Simulate fetching user wallet data
      setTimeout(() => {
        // Start with an empty wallet
        const mockTransactions: WalletTransaction[] = [];
        const mockPortfolio: Portfolio[] = [];
        
        setTransactions(mockTransactions);
        setPortfolio(mockPortfolio);
        setLoading(false);
        
        // Show welcome message if no transactions
        if (mockTransactions.length === 0 && balance === 0) {
          setShowWelcomeMessage(true);
        }
      }, 1200);
    }
  }, [isAuthenticated, balance]);
  
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
        if (balance === 0) {
          toast({
            title: "Insufficient Balance",
            description: `Please deposit funds first to invest in ${stockName}`,
          });
          setShowDepositModal(true);
        } else {
          toast({
            title: "Ready to Invest",
            description: `Enter the number of shares you want to buy for ${stockName} at $${price}`,
          });
          // Navigate to stock details with invest tab
          navigate(`/stocks/${symbol}?tab=invest`);
        }
      }, 1500);
    }
  }, [buyAction, symbol, price, toast, navigate, balance]);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
      });
      return;
    }
    
    // Get method name for the transaction
    let methodName = "Credit Card";
    if (selectedDepositMethod === 'upi') methodName = "UPI";
    if (selectedDepositMethod === 'crypto') methodName = "Cryptocurrency";
    
    // Simulate deposit transaction
    const newTransaction: WalletTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'deposit',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      method: methodName
    };
    
    setBalance(prevBalance => prevBalance + amount);
    setTransactions(prev => [newTransaction, ...prev]);
    setDepositAmount('');
    setShowDepositModal(false);
    setShowWelcomeMessage(false);
    
    toast({
      title: "Deposit Successful",
      description: `$${amount.toFixed(2)} has been added to your wallet`,
    });
  };

  const handleWithdraw = () => {
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
    
    // Get method name for the transaction
    let methodName = "Bank Transfer";
    if (selectedWithdrawMethod === 'upi') methodName = "UPI";
    if (selectedWithdrawMethod === 'crypto') methodName = "Cryptocurrency";
    
    // Simulate withdrawal transaction
    const newTransaction: WalletTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'withdrawal',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      method: methodName
    };
    
    setBalance(prevBalance => prevBalance - amount);
    setTransactions(prev => [newTransaction, ...prev]);
    setWithdrawAmount('');
    setShowWithdrawModal(false);
    
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <LoadingAnimation type="spinner" size="lg" text="Loading your wallet..." />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

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
            {showWelcomeMessage && (
              <Card className="mb-8 bg-lavender/10 border-lavender/30">
                <CardHeader>
                  <CardTitle>Welcome to Your Investment Wallet</CardTitle>
                  <CardDescription>Get started by adding funds to your wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-white/80">
                    Your wallet is ready! To begin investing in halal stocks, you'll need to deposit funds first.
                  </p>
                  <Button 
                    onClick={() => setShowDepositModal(true)} 
                    className="bg-lavender hover:bg-lavender-dark"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Funds Now
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Main Wallet Balance Card */}
              <Card className="bg-gradient-to-br from-lavender/30 to-lavender/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <WalletIcon className="h-5 w-5" />
                    Balance
                  </CardTitle>
                  <CardDescription className="text-white/60">Available funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">${balance.toFixed(2)}</div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-lavender text-lavender hover:bg-lavender/20"
                      >
                        <ArrowDown className="mr-2 h-4 w-4" /> Deposit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-secondary/30 border-white/10">
                      <DialogHeader>
                        <DialogTitle>Deposit Funds</DialogTitle>
                        <DialogDescription>
                          Add money to your investment wallet
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="card" onValueChange={(value) => setSelectedDepositMethod(value)}>
                        <TabsList className="grid grid-cols-3 mb-4">
                          <TabsTrigger value="card">Card</TabsTrigger>
                          <TabsTrigger value="upi">UPI</TabsTrigger>
                          <TabsTrigger value="crypto">Crypto</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="card" className="space-y-4">
                          <div className="p-4 border border-white/10 rounded-lg bg-lavender/5">
                            <div className="flex items-center mb-4">
                              <CreditCard className="h-5 w-5 text-lavender mr-2" />
                              <div className="font-medium">Credit/Debit Card</div>
                            </div>
                            <p className="text-sm text-white/60 mb-2">Your saved cards:</p>
                            <div className="px-3 py-2 border border-white/10 rounded-md bg-secondary/30 flex justify-between items-center mb-2">
                              <span>Visa ending in 4242</span>
                              <input type="radio" name="card" defaultChecked className="h-4 w-4 accent-lavender" />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2 border-lavender text-lavender hover:bg-lavender/20"
                              onClick={() => navigate('/payment-methods')}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" /> Add New Card
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Amount to Deposit</label>
                              <div className="relative">
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
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="upi" className="space-y-4">
                          {/* UPI deposit content */}
                          <div className="p-4 border border-white/10 rounded-lg bg-lavender/5">
                            <div className="flex items-center mb-4">
                              <DollarSign className="h-5 w-5 text-green-400 mr-2" />
                              <div className="font-medium">UPI Transfer</div>
                            </div>
                            <p className="text-sm text-white/60 mb-2">Your saved UPI IDs:</p>
                            <div className="px-3 py-2 border border-white/10 rounded-md bg-secondary/30 flex justify-between items-center mb-2">
                              <span>user@ybl</span>
                              <input type="radio" name="upi" defaultChecked className="h-4 w-4 accent-lavender" />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2 border-lavender text-lavender hover:bg-lavender/20"
                              onClick={() => navigate('/payment-methods')}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" /> Add New UPI ID
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Amount to Deposit</label>
                              <div className="relative">
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
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="crypto" className="space-y-4">
                          {/* Crypto deposit content */}
                          <div className="p-4 border border-white/10 rounded-lg bg-lavender/5">
                            <div className="flex items-center mb-4">
                              <Bitcoin className="h-5 w-5 text-yellow-400 mr-2" />
                              <div className="font-medium">Cryptocurrency</div>
                            </div>
                            <p className="text-sm text-white/60 mb-2">Select cryptocurrency:</p>
                            <select className="w-full bg-secondary/50 border border-white/10 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender">
                              <option>Bitcoin (BTC)</option>
                              <option>Ethereum (ETH)</option>
                              <option>Tether (USDT)</option>
                            </select>
                            <p className="text-xs text-white/60 mt-4 mb-1">
                              Our current rate: 1 BTC = $65,847.23
                            </p>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Amount to Deposit (USD)</label>
                              <div className="relative">
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
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <DialogFooter>
                        <Button type="submit" onClick={handleDeposit} className="bg-lavender hover:bg-lavender-dark">
                          Confirm Deposit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="border-lavender text-lavender hover:bg-lavender/20"
                        disabled={balance <= 0}
                      >
                        <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-secondary/30 border-white/10">
                      <DialogHeader>
                        <DialogTitle>Withdraw Funds</DialogTitle>
                        <DialogDescription>
                          Transfer money from your investment wallet
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="bank" onValueChange={(value) => setSelectedWithdrawMethod(value)}>
                        <TabsList className="grid grid-cols-3 mb-4">
                          <TabsTrigger value="bank">Bank</TabsTrigger>
                          <TabsTrigger value="upi">UPI</TabsTrigger>
                          <TabsTrigger value="crypto">Crypto</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="bank" className="space-y-4">
                          {/* Bank withdrawal content */}
                          <div className="p-4 border border-white/10 rounded-lg bg-lavender/5">
                            <div className="flex items-center mb-4">
                              <CreditCard className="h-5 w-5 text-lavender mr-2" />
                              <div className="font-medium">Bank Transfer</div>
                            </div>
                            <p className="text-sm text-white/60 mb-2">Your saved bank accounts:</p>
                            <div className="px-3 py-2 border border-white/10 rounded-md bg-secondary/30 flex justify-between items-center mb-2">
                              <span>Bank Account ending in 9876</span>
                              <input type="radio" name="bank" defaultChecked className="h-4 w-4 accent-lavender" />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2 border-lavender text-lavender hover:bg-lavender/20"
                              onClick={() => navigate('/payment-methods')}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" /> Add New Account
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Amount to Withdraw</label>
                              <div className="relative">
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
                              <p className="text-xs text-white/60">
                                Available balance: ${balance.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="upi" className="space-y-4">
                          {/* UPI withdrawal content */}
                          <div className="p-4 border border-white/10 rounded-lg bg-lavender/5">
                            <div className="flex items-center mb-4">
                              <DollarSign className="h-5 w-5 text-green-400 mr-2" />
                              <div className="font-medium">UPI Transfer</div>
                            </div>
                            <p className="text-sm text-white/60 mb-2">Your saved UPI IDs:</p>
                            <div className="px-3 py-2 border border-white/10 rounded-md bg-secondary/30 flex justify-between items-center mb-2">
                              <span>user@ybl</span>
                              <input type="radio" name="upi-withdraw" defaultChecked className="h-4 w-4 accent-lavender" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Amount to Withdraw</label>
                              <div className="relative">
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
                              <p className="text-xs text-white/60">
                                Available balance: ${balance.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="crypto" className="space-y-4">
                          {/* Crypto withdrawal content */}
                          <div className="p-4 border border-white/10 rounded-lg bg-lavender/5">
                            <div className="flex items-center mb-4">
                              <Bitcoin className="h-5 w-5 text-yellow-400 mr-2" />
                              <div className="font-medium">Cryptocurrency</div>
                            </div>
                            <p className="text-sm text-white/60 mb-2">Select cryptocurrency:</p>
                            <select className="w-full bg-secondary/50 border border-white/10 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender">
                              <option>Bitcoin (BTC)</option>
                              <option>Ethereum (ETH)</option>
                              <option>Tether (USDT)</option>
                            </select>
                            <p className="text-sm text-white/60 mt-4 mb-2">Wallet Address:</p>
                            <Input
                              placeholder="Your crypto wallet address"
                              className="bg-secondary/50 border-white/10 focus-visible:ring-lavender text-sm"
                            />
                            <p className="text-xs text-white/60 mt-4 mb-1">
                              Our current rate: 1 BTC = $65,847.23
                            </p>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Amount to Withdraw (USD)</label>
                              <div className="relative">
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
                              <p className="text-xs text-white/60">
                                Available balance: ${balance.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <DialogFooter>
                        <Button type="submit" onClick={handleWithdraw} className="bg-lavender hover:bg-lavender-dark">
                          Confirm Withdrawal
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                    <Link to="/payment-methods">
                      <Button variant="outline" className="w-full mb-2 border-lavender text-lavender hover:bg-lavender/20">
                        <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
                      </Button>
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
            
            {/* Withdraw Form */}
            <div className="mb-8">
              <Card id="withdraw-form" className="bg-secondary/20 border-white/10">
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>Transfer money from your wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleWithdraw(); }}>
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
                      <Button 
                        type="submit" 
                        className="bg-lavender hover:bg-lavender-dark"
                        disabled={balance <= 0}
                      >
                        Withdraw
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Unified Wallet Experience */}
            <Web3Provider>
              <div className="space-y-8 fade-in">
                {/* Unified Wallet Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <WalletIcon className="mr-2 h-5 w-5 text-lavender" /> 
                      Unified Wallet
                    </h2>
                    <Card className="bg-gradient-to-br from-lavender/30 to-lavender/5 border-white/10 hover-lift">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="grid grid-cols-2 gap-4 flex-1">
                            <div>
                              <h3 className="text-sm font-medium text-white/60">Fiat Balance</h3>
                              <p className="text-2xl font-bold mt-1">${balance.toFixed(2)}</p>
                            </div>
                            <BlockchainWallet showBalanceOnly={true} />
                          </div>
                          <DisconnectButton />
                        </div>
                        <div className="flex space-x-2 mt-6">
                          <Button 
                            onClick={() => setShowDepositModal(true)} 
                            className="flex-1 button-hover lavender-glow"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Deposit
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 button-hover"
                            disabled={balance <= 0}
                            onClick={() => setShowWithdrawModal(true)}
                          >
                            <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-lavender" /> 
                      Shariah Compliance
                    </h2>
                    <ShariahComplianceVerifier compact={true} />
                  </div>
                </div>
                
                {/* Unified Transaction History */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ArrowDown className="mr-2 h-5 w-5 text-lavender" /> 
                    Transaction History
                  </h2>
                  
                  <Tabs defaultValue="all" className="card-hover bg-secondary/20 p-4 rounded-lg border border-white/10">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="all" className="transition-all hover:bg-lavender/20">
                        All Transactions
                      </TabsTrigger>
                      <TabsTrigger value="fiat" className="transition-all hover:bg-lavender/20">
                        <DollarSign className="mr-2 h-4 w-4" /> Fiat
                      </TabsTrigger>
                      <TabsTrigger value="crypto" className="transition-all hover:bg-lavender/20">
                        <Bitcoin className="mr-2 h-4 w-4" /> Crypto
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="fade-in">
                      {/* Combined transactions view */}
                      {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 text-left text-sm text-white/60">
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Type</th>
                                <th className="py-2 px-4">Amount</th>
                                <th className="py-2 px-4">Method</th>
                                <th className="py-2 px-4">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 scale-transition">
                                  <td className="py-3 px-4">{tx.date}</td>
                                  <td className="py-3 px-4 capitalize">
                                    <span className={tx.type === 'deposit' ? 'text-green-400' : tx.type === 'withdrawal' ? 'text-red-400' : ''}>
                                      {tx.type}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={tx.type === 'deposit' ? 'text-green-400' : tx.type === 'withdrawal' ? 'text-red-400' : ''}>
                                      {tx.type === 'deposit' ? '+ ' : tx.type === 'withdrawal' ? '- ' : ''}
                                      ${tx.amount.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">{tx.method || '-'}</td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {tx.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-white/70">No transaction history yet.</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="fiat" className="fade-in">
                      {/* Fiat transactions */}
                      {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 text-left text-sm text-white/60">
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Type</th>
                                <th className="py-2 px-4">Amount</th>
                                <th className="py-2 px-4">Method</th>
                                <th className="py-2 px-4">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions
                                .filter(tx => tx.method !== 'Cryptocurrency')
                                .map((tx) => (
                                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 scale-transition">
                                  <td className="py-3 px-4">{tx.date}</td>
                                  <td className="py-3 px-4 capitalize">
                                    <span className={tx.type === 'deposit' ? 'text-green-400' : tx.type === 'withdrawal' ? 'text-red-400' : ''}>
                                      {tx.type}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={tx.type === 'deposit' ? 'text-green-400' : tx.type === 'withdrawal' ? 'text-red-400' : ''}>
                                      {tx.type === 'deposit' ? '+ ' : tx.type === 'withdrawal' ? '- ' : ''}
                                      ${tx.amount.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">{tx.method || '-'}</td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {tx.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-white/70">No fiat transactions yet.</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="crypto" className="fade-in">
                      <TransactionHistory />
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Community Portfolios Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-lavender" /> 
                    Community-Directed Impact Portfolios
                  </h2>
                  <CommunityPortfolio />
                </div>
              </div>
            </Web3Provider>
          </>  
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
