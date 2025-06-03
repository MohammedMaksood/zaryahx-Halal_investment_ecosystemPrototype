import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getStockPrices } from '@/services/stockApi';
import { toast } from '@/hooks/use-toast';

/**
 * @typedef {Object} StockHolding
 * @property {string} id - Unique identifier
 * @property {string} name - Stock name
 * @property {string} symbol - Stock symbol
 * @property {number} quantity - Number of shares
 * @property {number} avgPrice - Average purchase price
 * @property {number} currentPrice - Current market price
 * @property {number} value - Total value of holding
 * @property {number} profitLoss - Profit or loss amount
 * @property {number} profitLossPercentage - Profit or loss percentage
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Order ID
 * @property {string} stockName - Stock name
 * @property {string} stockSymbol - Stock symbol
 * @property {'buy'|'sell'} type - Order type
 * @property {number} quantity - Number of shares
 * @property {number} price - Price per share
 * @property {number} total - Total order value
 * @property {'pending'|'completed'|'cancelled'} status - Order status
 * @property {string} date - Order date
 */

/**
 * @typedef {Object} TransactionDetails
 * @property {string} name - Stock name
 * @property {string} symbol - Stock symbol
 * @property {number} quantity - Number of shares
 * @property {number} price - Price per share
 * @property {number} total - Total transaction value
 */

/**
 * @typedef {Object} StockPurchaseDetails
 * @property {string} symbol - Stock symbol
 * @property {string} name - Stock name
 * @property {number} quantity - Number of shares
 * @property {number} price - Price per share
 * @property {number} total - Total purchase value
 * @property {string} date - Purchase date
 */


/**
 * @typedef {Object} PortfolioContextType
 * @property {StockHolding[]} holdings - Stock holdings
 * @property {Order[]} orders - Order history
 * @property {function(TransactionDetails): boolean} addStockToPortfolio - Add stock to portfolio
 * @property {function(TransactionDetails): boolean} sellStockFromPortfolio - Sell stock from portfolio
 * @property {function(): Promise<void>} updatePortfolio - Update portfolio data
 */

const PortfolioContext = createContext(undefined);

/**
 * StockPurchaseDetails type for use in other components
 * @typedef {Object} StockPurchaseDetails
 */
export const StockPurchaseDetails = {};

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider');
  }
  return context;
};



// Default sample data
const defaultHoldings = [
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

const defaultOrders = [
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

export const PortfolioProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Initialize state with data from localStorage or defaults
  /** @type {[StockHolding[], function(StockHolding[]|function(StockHolding[]): StockHolding[]): void]} */
  const [holdings, setHoldings] = useState(() => {
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
  
  /** @type {[Order[], function(Order[]|function(Order[]): Order[]): void]} */
  const [orders, setOrders] = useState(() => {
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
  /**
   * Add stock to portfolio
   * @param {TransactionDetails} stockDetails - Stock purchase details
   * @returns {boolean} - Success status
   */
  const addStockToPortfolio = (stockDetails) => {
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
      const newHolding= {
        id: `holding-${Date.now()}`,
        name,
        symbol,
        quantity: quantity,
        avgPrice: price,
        currentPrice: price, // Initially set current price to purchase price
        value: quantity * price,
        profitLoss: 0,
        profitLossPercentage: 0
      };
      
      setHoldings(prevHoldings => [...prevHoldings, newHolding]);
    }
    
    // Add new order
    const newOrder= {
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
  /**
   * Sell stock from portfolio
   * @param {TransactionDetails} stockDetails - Stock sell details
   * @returns {boolean} - Success status
   */
  const sellStockFromPortfolio = (stockDetails) => {
    if (!isAuthenticated) return false;
    
    const { symbol, quantity, price, total } = stockDetails;
    
    // Find the stock in holdings
    const existingStockIndex = holdings.findIndex(h => h.symbol === symbol);
    
    if (existingStockIndex === -1) {
      console.error(`Stock ${symbol} not found in portfolio`);
      return false;
    }
    
    const holding = holdings[existingStockIndex];
    
    // Check if user h shares to sell
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
    const newOrder= {
      id: `ORD-${Math.floor(Math.random() * 10000) + 1000}`,
      stockName: holding.name,
      stockSymbol,
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
  /** @type {[string|null, function(string|null): void]} */
  const [error, setError] = useState(null);

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
