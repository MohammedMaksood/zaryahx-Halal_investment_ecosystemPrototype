
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

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

            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNotification}
              className="hover:bg-lavender/20"
            >
              <Bell className="h-5 w-5" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-lavender/20">
                  <User className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md glassy-card">
                <DialogHeader>
                  <DialogTitle className="text-gradient">Account</DialogTitle>
                  <DialogDescription>
                    Sign in to access your ZaryahX account
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-lavender text-white hover:bg-lavender/20"
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-lavender hover:bg-lavender-dark text-white"
                  >
                    Create Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                <Button 
                  onClick={handleNotification} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center w-full justify-center space-x-2 border-lavender hover:bg-lavender/20"
                >
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </Button>
              </div>
            </div>
            
            <div className="pt-2 pb-3">
              <div className="flex items-center space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center w-full justify-center space-x-2 border-lavender hover:bg-lavender/20"
                    >
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md glassy-card">
                    <DialogHeader>
                      <DialogTitle className="text-gradient">Account</DialogTitle>
                      <DialogDescription>
                        Sign in to access your ZaryahX account
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Button 
                        variant="outline" 
                        className="w-full border-lavender text-white hover:bg-lavender/20"
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full bg-lavender hover:bg-lavender-dark text-white"
                      >
                        Create Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
