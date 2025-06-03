
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {Date} createdAt - Account creation date
 * @property {string} [profileImage] - Optional profile image URL
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Current user or null if not authenticated
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {boolean} isLoading - Whether auth state is loading
 * @property {function(string, string): Promise<boolean>} login - Login function
 * @property {function(string, string, string): Promise<boolean>} signup - Signup function
 * @property {function()} logout - Logout function
 */

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  /** @type {[User|null, function(User|null): void]} */
  const [user, setUser] = useState(null);
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

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>} Success status
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login - in production, validate with API
      if (email === 'demo@example.com' && password === 'password123') {
        const mockUser= {
          id: '12345',
          name: 'Demo User',
          email,
          createdAt: new Date(),
          profileImage: '/placeholder.svg'
        };
        
        setUser(mockUser);
        localStorage.setItem('zaryah_user', JSON.stringify(mockUser));
        
        toast({
          title: 'Welcome back',
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

  /**
   * Signup function
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>} Success status
   */
  const signup = async (name, email, password) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock signup - in production, register with API
      const mockUser= {
        id: Math.random().toString(36).substring(2, 11),
        name,
        email,
        createdAt: new Date()
      };
      
      setUser(mockUser);
      localStorage.setItem('zaryah_user', JSON.stringify(mockUser));
      
      toast({
        title: 'Account created successfully',
        description: 'Welcome to Zaryah.',
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
