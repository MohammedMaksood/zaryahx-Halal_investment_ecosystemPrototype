
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, User, X, LogIn, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery}`,
    });
    setSearchQuery('');
  };

  const handleNotification = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toggleMobileMenu(); // Close mobile menu if open
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-lavender to-white bg-clip-text text-transparent">
                ZaryahX
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/stocks" className="text-sm font-medium text-white/80 hover:text-lavender transition-colors">
              Halal Stocks
            </Link>
            <Link to="/analysis" className="text-sm font-medium text-white/80 hover:text-lavender transition-colors">
              Analysis
            </Link>
            <Link to="/academics" className="text-sm font-medium text-white/80 hover:text-lavender transition-colors">
              Islamic Academics
            </Link>
            <Link to="/groceries" className="text-sm font-medium text-white/80 hover:text-lavender transition-colors">
              Halal Groceries
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative w-auto">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[180px] bg-secondary/50 border-white/10 focus-visible:ring-lavender"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>

            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleNotification}
                  className="hover:bg-lavender/20"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                <Link to="/wallet">
                  <Button variant="ghost" size="icon" className="hover:bg-lavender/20">
                    <WalletIcon className="h-5 w-5" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-lavender/20 rounded-full h-8 w-8 p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImage} alt={user?.name || 'User'} />
                        <AvatarFallback className="bg-lavender text-white text-xs">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-white/10">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wallet')}>
                      <WalletIcon className="mr-2 h-4 w-4" />
                      <span>Wallet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/payment-methods')}>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Payment Methods</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400">
                      <LogIn className="mr-2 h-4 w-4 rotate-180" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/signin">
                  <Button variant="ghost" className="hover:bg-lavender/20">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-lavender hover:bg-lavender-dark">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="hover:bg-lavender/20">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glassy-card absolute top-16 left-0 right-0 border-b border-t border-white/10 animate-fade-in">
          <div className="space-y-1 px-4 py-5">
            <Link 
              to="/stocks" 
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
              onClick={toggleMobileMenu}
            >
              Halal Stocks
            </Link>
            <Link 
              to="/analysis" 
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
              onClick={toggleMobileMenu}
            >
              Analysis
            </Link>
            <Link 
              to="/academics" 
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
              onClick={toggleMobileMenu}
            >
              Islamic Academics
            </Link>
            <Link 
              to="/groceries" 
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
              onClick={toggleMobileMenu}
            >
              Halal Groceries
            </Link>
            
            <div className="pt-4 pb-2">
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileImage} alt={user?.name || 'User'} />
                        <AvatarFallback className="bg-lavender text-white">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-xs text-white/60">{user?.email}</div>
                      </div>
                    </div>
                    <div className="border-t border-white/10 my-2"></div>
                    <Link 
                      to="/account" 
                      className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
                      onClick={toggleMobileMenu}
                    >
                      My Account
                    </Link>
                    <Link 
                      to="/wallet" 
                      className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
                      onClick={toggleMobileMenu}
                    >
                      Wallet
                    </Link>
                    <Link 
                      to="/payment-methods" 
                      className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
                      onClick={toggleMobileMenu}
                    >
                      Payment Methods
                    </Link>
                    <button 
                      className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-red-400 hover:bg-red-500/10"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="w-full grid grid-cols-2 gap-2">
                    <Link to="/signin" className="w-full" onClick={toggleMobileMenu}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center w-full justify-center space-x-2 border-lavender hover:bg-lavender/20"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full" onClick={toggleMobileMenu}>
                      <Button 
                        size="sm" 
                        className="flex items-center w-full justify-center space-x-2 bg-lavender hover:bg-lavender-dark"
                      >
                        <User className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSearch} className="pt-2 pb-3">
              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
