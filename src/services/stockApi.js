import axios from 'axios';

/**
 * @typedef {Object} StockPriceResponse
 * @property {string} symbol
 * @property {string} name
 * @property {number} price
 * @property {number} change
 * @property {number} changePercent
 * @property {string} lastUpdated
 */

/**
 * @typedef {Object} StockPriceError
 * @property {string} code
 * @property {string} message
 */

const API_BASE_URL = 'https://api.example.com/stocks'; // Replace with actual stock API

/**
 * Get stock prices for the given symbols
 * @param {string[]} symbols - Array of stock symbols
 * @returns {Promise<StockPriceResponse[]>} Array of stock price data
 */
export const getStockPrices = async (symbols) => {
  try {
    // In a real implementation, make API call to fetch stock prices
    // For now, simulate with mock data
    const mockPrices = {
      AAPL: { price: 182.63, change: 1.25, changePercent: 0.69 },
      MSFT: { price: 337.22, change: -0.55, changePercent: -0.16 },
      // Add more mock prices as needed
    };

    return symbols.map(symbol => ({
      symbol,
      name: symbol === 'AAPL' ? 'Apple Inc.' : 'Microsoft Corporation',
      price: mockPrices[symbol]?.price || 0,
      change: mockPrices[symbol]?.change || 0,
      changePercent: mockPrices[symbol]?.changePercent || 0,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    throw error;
  }
};

/**
 * Get detailed stock information for a single symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Detailed stock information
 */
export const getStockDetails = async (symbol) => {
  try {
    // In a real implementation, make API call to fetch stock details
    // For now, simulate with mock data
    const mockDetails = {
      AAPL: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 182.63,
        change: 1.25,
        changePercent: 0.69,
        marketCap: 2850000000000,
        peRatio: 30.2,
        dividendYield: 0.5,
        volume: 58900000,
        avgVolume: 62500000,
        high52Week: 198.23,
        low52Week: 124.17,
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
      },
      MSFT: {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 337.22,
        change: -0.55,
        changePercent: -0.16,
        marketCap: 2510000000000,
        peRatio: 35.8,
        dividendYield: 0.8,
        volume: 25600000,
        avgVolume: 28900000,
        high52Week: 366.78,
        low52Week: 213.43,
        description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.'
      }
    };

    const details = mockDetails[symbol];
    if (!details) {
      throw { code: 'NOT_FOUND', message: `Stock with symbol ${symbol} not found` };
    }

    return details;
  } catch (error) {
    console.error(`Error fetching details for stock ${symbol}:`, error);
    throw error;
  }
};

/**
 * Search for stocks by name or symbol
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching stocks
 */
export const searchStocks = async (query) => {
  try {
    // In a real implementation, make API call to search stocks
    // For now, simulate with mock data
    const mockStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'META', name: 'Meta Platforms Inc.' }
    ];

    // Filter based on query
    const lowercaseQuery = query.toLowerCase();
    return mockStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(lowercaseQuery) || 
      stock.name.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};
