
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('zaryah_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('zaryah_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login - in production, validate with API
      if (email === 'demo@example.com' && password === 'password123') {
        const mockUser: User = {
          id: '12345',
          name: 'Demo User',
          email,
          createdAt: new Date(),
          profileImage: '/placeholder.svg'
        };
        
        setUser(mockUser);
        localStorage.setItem('zaryah_user', JSON.stringify(mockUser));
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        return true;
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password.',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock signup - in production, register with API
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        email,
        createdAt: new Date()
      };
      
      setUser(mockUser);
      localStorage.setItem('zaryah_user', JSON.stringify(mockUser));
      
      toast({
        title: 'Account created successfully!',
        description: 'Welcome to ZaryahX.',
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Registration failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zaryah_user');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
