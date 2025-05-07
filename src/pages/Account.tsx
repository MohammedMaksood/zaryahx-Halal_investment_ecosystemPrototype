
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LogIn, Wallet as WalletIcon, CreditCard, Settings, KeyRound } from 'lucide-react';
import LoadingAnimation from '@/components/LoadingAnimation';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const getInitials = (name: string) => {
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
            <Card className="bg-secondary/30 border-white/10 overflow-hidden">
              <div className="bg-lavender/20 p-6 flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="bg-lavender text-white text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold text-center">{user.name}</h2>
                <p className="text-sm text-white/60 text-center">{user.email}</p>
              </div>
              
              <div className="p-4">
                <nav className="space-y-2">
                  <Link to="/account">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Button>
                  </Link>
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
            <Tabs defaultValue="profile">
              <TabsList className="grid grid-cols-3 h-auto mb-6">
                <TabsTrigger value="profile" className="py-3">Profile</TabsTrigger>
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
              
              <TabsContent value="preferences">
                <Card className="bg-secondary/30 border-white/10">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage your notification settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Notification settings could go here */}
                      <p className="text-white/60">
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
