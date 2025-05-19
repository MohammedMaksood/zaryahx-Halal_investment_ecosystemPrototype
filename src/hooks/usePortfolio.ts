import { useState, useEffect } from 'react';

// Define interfaces for our data
export interface StockHolding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface Order {
  id: string;
  stockName: string;
  stockSymbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface TransactionDetails {
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  type: 'buy' | 'sell';
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
  },
  {
    id: '3',
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    quantity: 8,
    avgPrice: 142.30,
    currentPrice: 139.75,
    value: 1118.00,
    profitLoss: -20.40,
    profitLossPercentage: -1.8
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
    status: 'pending',
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
  },
  {
    id: 'ORD-7820',
    stockName: 'Tesla, Inc.',
    stockSymbol: 'TSLA',
    type: 'buy',
    quantity: 3,
    price: 175.25,
    total: 525.75,
    status: 'completed',
    date: 'May 7, 2025'
  }
];

export function usePortfolio() {
  // Load data from localStorage or use default sample data
  const [holdings, setHoldings] = useState<StockHolding[]>(() => {
    const savedHoldings = localStorage.getItem('portfolio-holdings');
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
    const savedOrders = localStorage.getItem('portfolio-orders');
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
    localStorage.setItem('portfolio-holdings', JSON.stringify(holdings));
  }, [holdings]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolio-orders', JSON.stringify(orders));
  }, [orders]);

  // Function to process a buy transaction
  const processBuyTransaction = (stock: StockHolding, details: TransactionDetails) => {
    console.log('Processing buy transaction:', stock.symbol, details.quantity);
    
    // Check if stock already exists in holdings
    const existingStockIndex = holdings.findIndex(h => h.symbol === details.symbol);
    
    if (existingStockIndex !== -1) {
      // Update existing holding
      const holding = holdings[existingStockIndex];
      const updatedHoldings = [...holdings];
      
      // Calculate new average price and quantity
      const newQuantity = holding.quantity + details.quantity;
      const newAvgPrice = ((holding.quantity * holding.avgPrice) + (details.quantity * details.price)) / newQuantity;
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
        name: stock.name,
        symbol: stock.symbol,
        quantity: details.quantity,
        avgPrice: details.price,
        currentPrice: stock.currentPrice,
        value: details.quantity * stock.currentPrice,
        profitLoss: 0,
        profitLossPercentage: 0
      };
      
      setHoldings(prevHoldings => [...prevHoldings, newHolding]);
    }
    
    // Add new order
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 1000) + 7900}`,
      stockName: stock.name,
      stockSymbol: stock.symbol,
      type: 'buy',
      quantity: details.quantity,
      price: details.price,
      total: details.total,
      status: 'pending' as const,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return true;
  };

  // Function to process a sell transaction
  const processSellTransaction = (stock: StockHolding, details: TransactionDetails) => {
    console.log('Processing sell transaction:', stock.symbol, details.quantity);
    
    // Create a deep copy of the holdings array
    const holdingsCopy = JSON.parse(JSON.stringify(holdings));
    
    // Find the index of the stock being sold
    const stockIndex = holdingsCopy.findIndex(h => h.symbol === details.symbol);
    
    if (stockIndex !== -1) {
      const holding = holdingsCopy[stockIndex];
      
      // Calculate new quantity after selling
      const newQuantity = holding.quantity - details.quantity;
      
      // If all shares sold, remove from holdings
      if (newQuantity <= 0) {
        holdingsCopy.splice(stockIndex, 1);
      } else {
        // Update the holding with new values
        const newValue = newQuantity * holding.currentPrice;
        const newProfitLoss = newValue - (newQuantity * holding.avgPrice);
        const newProfitLossPercentage = (newProfitLoss / (newQuantity * holding.avgPrice)) * 100;
        
        holdingsCopy[stockIndex] = {
          ...holding,
          quantity: newQuantity,
          value: newValue,
          profitLoss: newProfitLoss,
          profitLossPercentage: newProfitLossPercentage
        };
      }
      
      // Update the state with the new holdings array
      setHoldings(holdingsCopy);
      
      // Add new order
      const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 1000) + 7900}`,
        stockName: stock.name,
        stockSymbol: stock.symbol,
        type: 'sell',
        quantity: details.quantity,
        price: details.price,
        total: details.total,
        status: 'pending' as const,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      return true;
    }
    
    return false;
  };

  // Function to process a transaction (buy or sell)
  const processTransaction = (stock: StockHolding, details: TransactionDetails) => {
    if (details.type === 'buy') {
      return processBuyTransaction(stock, details);
    } else {
      return processSellTransaction(stock, details);
    }
  };

  return {
    holdings,
    orders,
    processTransaction
  };
}
