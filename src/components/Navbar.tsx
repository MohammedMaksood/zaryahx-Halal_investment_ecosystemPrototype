
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, User, X, LogIn, Wallet, BarChart3, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'transaction' | 'system' | 'alert';
}

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { pendingTransactions } = useWallet();

  // Watch for new pending transactions and create notifications
  useEffect(() => {
    if (pendingTransactions && pendingTransactions.length > 0) {
      // Look for new pending transactions without a corresponding notification
      const existingNotificationIds = notifications.map(notif => notif.id);
      const newTransactions = pendingTransactions.filter(txn => 
        !existingNotificationIds.includes(`txn-${txn.id}`) && 
        (txn.type === 'purchase' || txn.type === 'sale')
      );
      
      // Add notifications for new transactions
      if (newTransactions.length > 0) {
        const newNotifications = newTransactions.map(txn => ({
          id: `txn-${txn.id}`,
          title: txn.type === 'purchase' ? 'Stock Purchase' : 'Stock Sale',
          message: txn.details,
          timestamp: txn.timestamp,
          isRead: false,
          type: 'transaction' as const
        }));
        
        setNotifications(prev => [...prev, ...newNotifications]);
      }
    }
  }, [pendingTransactions]);
  
  // Update unread notifications status
  useEffect(() => {
    setHasUnreadNotifications(notifications.some(notif => !notif.isRead));
  }, [notifications]);

  const handleNotification = () => {
    if (notifications.length === 0) {
      toast({
        title: "Notifications",
        description: "You have no new notifications",
      });
    } else {
      // Mark all as read
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      // Show notifications in toast with most recent first
      const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);
      
      toast({
        title: "Notifications",
        description: (
          <div className="max-h-[300px] overflow-y-auto space-y-2 py-1">
            {sortedNotifications.length > 0 ? (
              sortedNotifications.map(notif => (
                <div key={notif.id} className="p-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="font-medium">{notif.title}</div>
                  <div className="text-sm text-white/70">{notif.message}</div>
                  <div className="text-xs text-white/50 mt-1">
                    {new Date(notif.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div>No notifications to display</div>
            )}
          </div>
        ),
      });
    }
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
            <Link to="/portfolio" className="text-sm font-medium text-white/80 hover:text-lavender transition-colors">
              Portfolio
            </Link>
            <Link to="/islamic-finance-advisor" className="text-sm font-medium text-white/80 hover:text-lavender transition-colors">
              Islamic Finance Advisor
            </Link>
          </nav>

          {/* Desktop Right Actions - Search bar removed */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleNotification}
                    className="hover:bg-lavender/20"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                  {hasUnreadNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>

                <Link to="/wallet">
                  <Button variant="ghost" size="icon" className="hover:bg-lavender/20">
                    <Wallet className="h-5 w-5" />
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
                    <DropdownMenuItem onClick={() => navigate('/portfolio')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Portfolio</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wallet')}>
                      <Wallet className="mr-2 h-4 w-4" />
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
              to="/portfolio" 
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
              onClick={toggleMobileMenu}
            >
              Portfolio
            </Link>
            <Link 
              to="/islamic-finance-advisor" 
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-lavender/20"
              onClick={toggleMobileMenu}
            >
              Islamic Finance Advisor
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
