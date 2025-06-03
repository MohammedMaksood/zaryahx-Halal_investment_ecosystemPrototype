import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { StockHolding, Order, TransactionDetails } from '@/hooks/usePortfolio';
import { getStockPrices } from '@/services/stockApi';
import { toast } from '@/hooks/use-toast';

interface PortfolioContextType {
  holdings: StockHolding[];
  orders: Order[];
  addStockToPortfolio: (stockDetails: StockPurchaseDetails) => boolean;
  sellStockFromPortfolio: (stockDetails: StockSellDetails) => boolean;
  updatePortfolio: () => void;
}

// Interface for stock purchase details
export interface StockPurchaseDetails {
  name: string;
  symbol: string;
  quantity: number;
  price: number;
  total: number;
}

// Interface for stock sell details
export interface StockSellDetails {
  symbol: string;
  quantity: number;
  price: number;
  total: number;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

// Default sample data
const defaultHoldings: StockHolding[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    quantity: 10,
    avgPrice: 175.50,
    currentPrice: 182.63,
    value: 1826.30,
    profitLoss: 71.30,
    profitLossPercentage: 4.1
  },
  {
    id: '2',
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    quantity: 5,
    avgPrice: 320.75,
    currentPrice: 337.22,
    value: 1686.10,
    profitLoss: 82.35,
    profitLossPercentage: 5.1
  }
];

const defaultOrders: Order[] = [
  {
    id: 'ORD-7829',
    stockName: 'Apple Inc.',
    stockSymbol: 'AAPL',
    type: 'buy',
    quantity: 2,
    price: 182.50,
    total: 365.00,
    status: 'completed',
    date: 'May 9, 2025'
  },
  {
    id: 'ORD-7825',
    stockName: 'Microsoft Corporation',
    stockSymbol: 'MSFT',
    type: 'sell',
    quantity: 1,
    price: 340.00,
    total: 340.00,
    status: 'completed',
    date: 'May 8, 2025'
  }
];

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Initialize state with data from localStorage or defaults
  const [holdings, setHoldings] = useState<StockHolding[]>(() => {
    if (!isAuthenticated) return [];
    
    const savedHoldings = localStorage.getItem(`portfolio-holdings-${user?.id}`);
    if (savedHoldings) {
      try {
        return JSON.parse(savedHoldings);
      } catch (error) {
        console.error('Error parsing saved holdings:', error);
      }
    }
    return defaultHoldings;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    if (!isAuthenticated) return [];
    
    const savedOrders = localStorage.getItem(`portfolio-orders-${user?.id}`);
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        console.error('Error parsing saved orders:', error);
      }
    }
    return defaultOrders;
  });

  // Save holdings to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`portfolio-holdings-${user.id}`, JSON.stringify(holdings));
    }
  }, [holdings, isAuthenticated, user]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`portfolio-orders-${user.id}`, JSON.stringify(orders));
    }
  }, [orders, isAuthenticated, user]);

  // Function to add a stock to the portfolio
  const addStockToPortfolio = (stockDetails: StockPurchaseDetails): boolean => {
    if (!isAuthenticated) return false;
    
    const { name, symbol, quantity, price, total } = stockDetails;
    
    // Check if stock already exists in holdings
    const existingStockIndex = holdings.findIndex(h => h.symbol === symbol);
    
    if (existingStockIndex !== -1) {
      // Update existing holding
      const holding = holdings[existingStockIndex];
      const updatedHoldings = [...holdings];
      
      // Calculate new average price and quantity
      const newQuantity = holding.quantity + quantity;
      const newAvgPrice = ((holding.quantity * holding.avgPrice) + (quantity * price)) / newQuantity;
      const newValue = newQuantity * holding.currentPrice;
      const newProfitLoss = newValue - (newQuantity * newAvgPrice);
      const newProfitLossPercentage = (newProfitLoss / (newQuantity * newAvgPrice)) * 100;
      
      updatedHoldings[existingStockIndex] = {
        ...holding,
        quantity: newQuantity,
        avgPrice: newAvgPrice,
        value: newValue,
        profitLoss: newProfitLoss,
        profitLossPercentage: newProfitLossPercentage
      };
      
      setHoldings(updatedHoldings);
    } else {
      // Add new stock to holdings
      const newHolding: StockHolding = {
        id: `holding-${Date.now()}`,
        name,
        symbol,
        quantity,
        avgPrice: price,
        currentPrice: price, // Initially set current price to purchase price
        value: quantity * price,
        profitLoss: 0,
        profitLossPercentage: 0
      };
      
      setHoldings(prevHoldings => [...prevHoldings, newHolding]);
    }
    
    // Add new order
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000) + 1000}`,
      stockName: name,
      stockSymbol: symbol,
      type: 'buy',
      quantity,
      price,
      total,
      status: 'completed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return true;
  };

  // Function to sell a stock from the portfolio
  const sellStockFromPortfolio = (stockDetails: StockSellDetails): boolean => {
    if (!isAuthenticated) return false;
    
    const { symbol, quantity, price, total } = stockDetails;
    
    // Find the stock in holdings
    const existingStockIndex = holdings.findIndex(h => h.symbol === symbol);
    
    if (existingStockIndex === -1) {
      console.error(`Stock ${symbol} not found in portfolio`);
      return false;
    }
    
    const holding = holdings[existingStockIndex];
    
    // Check if user has enough shares to sell
    if (holding.quantity < quantity) {
      console.error(`Not enough shares to sell: have ${holding.quantity}, trying to sell ${quantity}`);
      return false;
    }
    
    const updatedHoldings = [...holdings];
    
    // Calculate new quantity after selling
    const newQuantity = holding.quantity - quantity;
    
    // If all shares sold, remove from holdings
    if (newQuantity <= 0) {
      updatedHoldings.splice(existingStockIndex, 1);
    } else {
      // Update the holding with new values
      const newValue = newQuantity * price;
      const newProfitLoss = newValue - (newQuantity * holding.avgPrice);
      const newProfitLossPercentage = (newProfitLoss / (newQuantity * holding.avgPrice)) * 100;
      
      updatedHoldings[existingStockIndex] = {
        ...holding,
        quantity: newQuantity,
        value: newValue,
        profitLoss: newProfitLoss,
        profitLossPercentage: newProfitLossPercentage
      };
    }
    
    // Update holdings
    setHoldings(updatedHoldings);
    
    // Add new order
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000) + 1000}`,
      stockName: holding.name,
      stockSymbol: symbol,
      type: 'sell',
      quantity,
      price,
      total,
      status: 'completed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return true;
  };

  // State for loading and error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to update portfolio data (e.g., refresh current prices)
  const updatePortfolio = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get unique symbols from holdings
      const symbols = Array.from(new Set(holdings.map(h => h.symbol)));
      
      // Fetch latest prices
      const prices = await getStockPrices(symbols);
      
      // Update holdings with new prices
      const updatedHoldings = holdings.map(holding => {
        const priceData = prices.find(p => p.symbol === holding.symbol);
        if (priceData) {
          return {
            ...holding,
            currentPrice: priceData.price,
            value: holding.quantity * priceData.price,
            profitLoss: holding.quantity * priceData.price - (holding.quantity * holding.avgPrice),
            profitLossPercentage: ((holding.quantity * priceData.price) / (holding.quantity * holding.avgPrice) - 1) * 100
          };
        }
        return holding;
      });

      setHoldings(updatedHoldings);
      toast({
        title: "Portfolio Updated",
        description: "Your portfolio data has been refreshed with the latest prices."
      });
    } catch (err) {
      console.error('Error updating portfolio:', err);
      setError('Failed to update portfolio data. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to update portfolio data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    holdings,
    orders,
    addStockToPortfolio,
    sellStockFromPortfolio,
    updatePortfolio
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContext;
