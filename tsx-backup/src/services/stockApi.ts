import axios from 'axios';

interface StockPriceResponse {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface StockPriceError {
  code: string;
  message: string;
}

const API_BASE_URL = 'https://api.example.com/stocks'; // Replace with actual stock API

export const getStockPrices = async (symbols: string[]): Promise<StockPriceResponse[]> => {
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
