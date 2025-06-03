
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LogIn, Wallet , CreditCard, Settings, KeyRound } from 'lucide-react';
import LoadingAnimation from '@/components/LoadingAnimation';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab') || 'profile';
  const viewParam = searchParams.get('view') || 'holdings';
  
  // Redirect to sign in if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <LoadingAnimation type="spinner" size="lg" text="Loading your account..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient mb-6">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <Card className="bg-secondary/30 border-black/10 overflow-hidden">
              <div className="bg-lavender/20 p-6 flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="bg-lavender text-black text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold text-center">{user.name}</h2>
                <p className="text-sm text-black text-center">{user.email}</p>
              </div>
              
              <div className="p-4">
                <nav className="space-y-2">
                  <Link to="/account">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Button>
                  </Link>
                  
                  {/* Portfolio Dropdown */}
                  <div className="relative group">
                    <Link to="/account?tab=portfolio">
                      <Button variant="ghost" className="w-full justify-start group-hover:bg-lavender/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 6h-4a2 2 0 0 1-2-2V0" />
                          <path d="M21 12h-4a2 2 0 0 1-2-2V6" />
                          <path d="M21 18h-4a2 2 0 0 1-2-2v-4" />
                          <path d="M3 22V2c0-.6.4-1 1-1h11l6 6v15c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Z" />
                        </svg> Portfolio
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto h-4 w-4 transition-transform group-hover:rotate-180">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </Button>
                    </Link>
                    <div className="absolute left-0 z-10 mt-1 w-full origin-top-right rounded-md bg-secondary/80 backdrop-blur-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                      <div className="py-1">
                        <Link to="/account?tab=portfolio&view=holdings" className="block px-4 py-2 text-sm hover:bg-lavender/20 pl-8">Holdings</Link>
                        <Link to="/account?tab=portfolio&view=orders" className="block px-4 py-2 text-sm hover:bg-lavender/20 pl-8">Orders</Link>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/wallet">
                    <Button variant="ghost" className="w-full justify-start">
                      <WalletIcon className="mr-2 h-4 w-4" /> Wallet
                    </Button>
                  </Link>
                  <Link to="/payment-methods">
                    <Button variant="ghost" className="w-full justify-start">
                      <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
                    </Button>
                  </Link>
                  <Link to="/account?tab=security">
                    <Button variant="ghost" className="w-full justify-start">
                      <KeyRound className="mr-2 h-4 w-4" /> Security
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:bg-red-500/20 hover:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogIn className="mr-2 h-4 w-4 rotate-180" /> Logout
                  </Button>
                </nav>
              </div>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            <Tabs defaultValue={tabParam}>
              <TabsList className="grid grid-cols-4 h-auto mb-6">
                <TabsTrigger value="profile" className="py-3">Profile</TabsTrigger>
                <TabsTrigger value="portfolio" className="py-3">Portfolio</TabsTrigger>
                <TabsTrigger value="security" className="py-3">Security</TabsTrigger>
                <TabsTrigger value="preferences" className="py-3">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="bg-secondary/30 border-white/10">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input 
                        defaultValue={user.name}
                        className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input 
                        defaultValue={user.email}
                        className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea 
                        className="w-full h-24 bg-secondary/50 border border-white/10 rounded-md px-3 py-2 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2"
                        placeholder="Tell us about yourself"
                      ></textarea>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-lavender hover:bg-lavender-dark">
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card className="bg-secondary/30 border-white/10">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input 
                        type="password"
                        className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input 
                        type="password"
                        className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input 
                        type="password"
                        className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-lavender hover:bg-lavender-dark">
                      Update Password
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="portfolio">
                <Card className="bg-secondary/30 border-white/10">
                  <CardHeader>
                    <CardTitle>Investment Portfolio</CardTitle>
                    <CardDescription>View and manage your stock investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={viewParam}>
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="holdings" className="flex-1" onClick={() => navigate('/account?tab=portfolio&view=holdings')}>Current Holdings</TabsTrigger>
                        <TabsTrigger value="orders" className="flex-1" onClick={() => navigate('/account?tab=portfolio&view=orders')}>Placed Orders</TabsTrigger>
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
                                      <div>
                                        <div className="font-medium">Apple Inc.</div>
                                        <div className="text-xs text-black">AAPL</div>
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
                                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                        Buy More
                                      </Button>
                                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400/10">
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
                                      <div>
                                        <div className="font-medium">Microsoft Corporation</div>
                                        <div className="text-xs text-black">MSFT</div>
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
                                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                        Buy More
                                      </Button>
                                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400/10">
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
                                      <div>
                                        <div className="font-medium">Alphabet Inc.</div>
                                        <div className="text-xs text-black">GOOGL</div>
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
                                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                        Buy More
                                      </Button>
                                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400/10">
                                        Sell
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-between items-center">
                          <div>
                            <div className="text-sm text-black">Total Portfolio Value</div>
                            <div className="text-2xl font-bold">$4,630.40</div>
                          </div>
                          <Button className="bg-lavender hover:bg-lavender-dark">
                            Invest in New Stock
                          </Button>
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
                                        <div className="text-xs text-black">AAPL</div>
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
                                    <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400/10">
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
                                        <div className="text-xs text-black">MSFT</div>
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
                                        <div className="text-xs text-black">TSLA</div>
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
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card className="bg-secondary/30 border-white/10">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage your notification settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Notification settings could go here */}
                      <p className="text-black">
                        Notification preferences will be available soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
