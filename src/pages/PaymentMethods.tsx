
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Wallet as WalletIcon, DollarSign, PlusCircle, Bitcoin, User, Trash2, Check } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import LoadingAnimation from '@/components/LoadingAnimation';
import { useToast } from '@/hooks/use-toast';

const PaymentMethods = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeMethods, setActiveMethods] = useState([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      lastDigits: '4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'upi',
      name: 'UPI ID: user@ybl',
      upiId: 'user@ybl',
      isDefault: false
    }
  ]);
  
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
          <LoadingAnimation type="spinner" size="lg" text="Loading your payment methods..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  const handleRemoveMethod = (id: string) => {
    setActiveMethods(prev => prev.filter(method => method.id !== id));
    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed successfully."
    });
  };

  const handleSetDefault = (id: string) => {
    setActiveMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated."
    });
  };

  // Form schema for credit card
  const cardFormSchema = z.object({
    cardNumber: z.string().min(16, { message: 'Card number must be 16 digits' }),
    cardName: z.string().min(2, { message: 'Please enter the cardholder name' }),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Must be in MM/YY format' }),
    cvv: z.string().min(3, { message: 'CVV must be at least 3 digits' }),
  });
  
  // Form schema for UPI
  const upiFormSchema = z.object({
    upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, { message: 'Please enter a valid UPI ID (e.g. username@bank)' }),
  });
  
  // Form schema for cryptocurrency
  const cryptoFormSchema = z.object({
    walletAddress: z.string().min(20, { message: 'Please enter a valid wallet address' }),
    cryptoType: z.string().min(1, { message: 'Please select a cryptocurrency' }),
  });

  // Form handlers
  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    }
  });
  
  const upiForm = useForm<z.infer<typeof upiFormSchema>>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: {
      upiId: ''
    }
  });
  
  const cryptoForm = useForm<z.infer<typeof cryptoFormSchema>>({
    resolver: zodResolver(cryptoFormSchema),
    defaultValues: {
      walletAddress: '',
      cryptoType: 'BTC'
    }
  });

  // Form submission handlers
  const onCardSubmit = (data: z.infer<typeof cardFormSchema>) => {
    const newMethod = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'card',
      name: `Card ending in ${data.cardNumber.slice(-4)}`,
      lastDigits: data.cardNumber.slice(-4),
      expiryDate: data.expiryDate,
      isDefault: activeMethods.length === 0
    };
    
    setActiveMethods(prev => [...prev, newMethod]);
    toast({
      title: "Card added successfully",
      description: "Your card has been added to your payment methods."
    });
    
    // Reset the form
    cardForm.reset();
  };
  
  const onUpiSubmit = (data: z.infer<typeof upiFormSchema>) => {
    const newMethod = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'upi',
      name: `UPI ID: ${data.upiId}`,
      upiId: data.upiId,
      isDefault: activeMethods.length === 0
    };
    
    setActiveMethods(prev => [...prev, newMethod]);
    toast({
      title: "UPI ID added successfully",
      description: "Your UPI ID has been added to your payment methods."
    });
    
    // Reset the form
    upiForm.reset();
  };
  
  const onCryptoSubmit = (data: z.infer<typeof cryptoFormSchema>) => {
    const newMethod = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'crypto',
      name: `${data.cryptoType} Wallet`,
      walletAddress: data.walletAddress,
      cryptoType: data.cryptoType,
      isDefault: activeMethods.length === 0
    };
    
    setActiveMethods(prev => [...prev, newMethod]);
    toast({
      title: "Crypto wallet added successfully",
      description: "Your cryptocurrency wallet has been added to your payment methods."
    });
    
    // Reset the form
    cryptoForm.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient mb-6">Payment Methods</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="bg-secondary/30 border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Payment Methods</CardTitle>
                    <CardDescription>Manage your deposit and withdrawal methods</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-lavender hover:bg-lavender-dark">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg bg-secondary/30 border-white/10">
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                          Choose a payment method to add to your account
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Tabs defaultValue="card" className="mt-4">
                        <TabsList className="grid grid-cols-3 mb-4">
                          <TabsTrigger value="card">Credit Card</TabsTrigger>
                          <TabsTrigger value="upi">UPI</TabsTrigger>
                          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="card">
                          <Form {...cardForm}>
                            <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-4">
                              <FormField
                                control={cardForm.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                          placeholder="1234 5678 9012 3456" 
                                          className="pl-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender" 
                                          {...field} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={cardForm.control}
                                name="cardName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cardholder Name</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                          placeholder="John Smith" 
                                          className="pl-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender" 
                                          {...field} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={cardForm.control}
                                  name="expiryDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiry Date</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="MM/YY" 
                                          className="bg-secondary/50 border-white/10 focus-visible:ring-lavender" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={cardForm.control}
                                  name="cvv"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVV</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="password"
                                          placeholder="•••" 
                                          className="bg-secondary/50 border-white/10 focus-visible:ring-lavender" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <DialogFooter className="mt-6">
                                <Button type="submit" className="bg-lavender hover:bg-lavender-dark">
                                  Add Card
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </TabsContent>
                        
                        <TabsContent value="upi">
                          <Form {...upiForm}>
                            <form onSubmit={upiForm.handleSubmit(onUpiSubmit)} className="space-y-4">
                              <FormField
                                control={upiForm.control}
                                name="upiId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>UPI ID</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                          placeholder="yourname@bank" 
                                          className="pl-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender" 
                                          {...field} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Enter your UPI ID like username@ybl or phonenumber@upi
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <DialogFooter className="mt-6">
                                <Button type="submit" className="bg-lavender hover:bg-lavender-dark">
                                  Add UPI
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </TabsContent>
                        
                        <TabsContent value="crypto">
                          <Form {...cryptoForm}>
                            <form onSubmit={cryptoForm.handleSubmit(onCryptoSubmit)} className="space-y-4">
                              <FormField
                                control={cryptoForm.control}
                                name="cryptoType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cryptocurrency</FormLabel>
                                    <FormControl>
                                      <select 
                                        {...field}
                                        className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                      >
                                        <option value="BTC">Bitcoin (BTC)</option>
                                        <option value="ETH">Ethereum (ETH)</option>
                                        <option value="LTC">Litecoin (LTC)</option>
                                        <option value="XRP">Ripple (XRP)</option>
                                        <option value="USDT">Tether (USDT)</option>
                                      </select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={cryptoForm.control}
                                name="walletAddress"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Wallet Address</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Bitcoin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                          placeholder="Your wallet address" 
                                          className="pl-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender" 
                                          {...field} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Enter your wallet address for receiving funds
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <DialogFooter className="mt-6">
                                <Button type="submit" className="bg-lavender hover:bg-lavender-dark">
                                  Add Wallet
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {activeMethods.length > 0 ? (
                  <div className="space-y-4">
                    {activeMethods.map(method => (
                      <div 
                        key={method.id} 
                        className="p-4 border border-white/10 rounded-lg flex justify-between items-center bg-secondary/10 hover:bg-secondary/20 transition-all"
                      >
                        <div className="flex items-center">
                          {method.type === 'card' && (
                            <div className="h-10 w-10 bg-lavender/20 rounded-full flex items-center justify-center mr-4">
                              <CreditCard className="h-5 w-5 text-lavender" />
                            </div>
                          )}
                          {method.type === 'upi' && (
                            <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                              <DollarSign className="h-5 w-5 text-green-400" />
                            </div>
                          )}
                          {method.type === 'crypto' && (
                            <div className="h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4">
                              <Bitcoin className="h-5 w-5 text-yellow-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-xs text-white/60">
                              {method.isDefault && (
                                <span className="bg-lavender/20 text-lavender px-2 py-0.5 rounded-full text-xs">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="space-x-2">
                          {!method.isDefault && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleSetDefault(method.id)}
                              className="h-8 px-2 text-xs hover:bg-lavender/20 hover:text-lavender"
                            >
                              <Check className="h-3.5 w-3.5 mr-1" /> Set Default
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveMethod(method.id)}
                            className="h-8 px-2 text-xs hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-white/60">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No payment methods added yet.</p>
                    <p className="text-sm mt-1">Add a payment method to deposit or withdraw funds.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="bg-secondary/30 border-white/10 mb-6">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/wallet">
                  <Button variant="outline" className="w-full border-lavender text-lavender hover:bg-lavender/20">
                    <WalletIcon className="mr-2 h-4 w-4" /> Go to Wallet
                  </Button>
                </Link>
                <Link to="/account">
                  <Button variant="outline" className="w-full border-lavender text-lavender hover:bg-lavender/20">
                    <User className="mr-2 h-4 w-4" /> Account Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/30 border-white/10">
              <CardHeader>
                <CardTitle>Payment Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70 mb-4">
                  Your payment information is secured with industry-standard encryption. We never store complete card details on our servers.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-400 mt-0.5" />
                    <span>256-bit SSL encryption</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-400 mt-0.5" />
                    <span>PCI DSS compliant</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-400 mt-0.5" />
                    <span>Secure authentication</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentMethods;
