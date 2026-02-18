import React, { createContext, useState, useEffect, useContext } from 'react';
import storageService from '../services/storageService';
import yahooFinanceService from '../services/yahooFinanceService';

// Create Context
const StockContext = createContext();

/**
 * Stock Context Provider
 * Manages global state for watchlist and stock data
 */
export const StockProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Load watchlist from storage on mount
  useEffect(() => {
    loadWatchlist();
  }, []);

  // Load watchlist from AsyncStorage
  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const savedWatchlist = await storageService.loadWatchlist();
      setWatchlist(savedWatchlist);

      // Fetch initial data for watchlist
      if (savedWatchlist.length > 0) {
        await fetchStockData(savedWatchlist);
      }
    } catch (err) {
      setError('Failed to load watchlist');
      console.error('Error loading watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock data for symbols
  const fetchStockData = async (symbols) => {
    try {
      const quotes = await yahooFinanceService.getMultipleQuotes(symbols);
      const dataMap = {};
      quotes.forEach(quote => {
        if (quote) {
          dataMap[quote.symbol] = quote;
        }
      });
      setStockData(dataMap);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error('Error fetching stock data:', err);
    }
  };

  // Add stock to watchlist
  const addStock = async (symbol) => {
    try {
      if (watchlist.includes(symbol)) {
        return { success: false, message: 'Stock already in watchlist' };
      }

      const updatedWatchlist = await storageService.addToWatchlist(symbol);
      setWatchlist(updatedWatchlist);

      // Fetch data for the new stock
      const quote = await yahooFinanceService.getStockQuote(symbol);
      if (quote) {
        setStockData(prev => ({ ...prev, [symbol]: quote }));
      }

      return { success: true, message: 'Stock added to watchlist' };
    } catch (err) {
      console.error('Error adding stock:', err);
      return { success: false, message: 'Failed to add stock' };
    }
  };

  // Remove stock from watchlist
  const removeStock = async (symbol) => {
    try {
      const updatedWatchlist = await storageService.removeFromWatchlist(symbol);
      setWatchlist(updatedWatchlist);

      // Remove from stock data
      setStockData(prev => {
        const newData = { ...prev };
        delete newData[symbol];
        return newData;
      });

      return { success: true, message: 'Stock removed from watchlist' };
    } catch (err) {
      console.error('Error removing stock:', err);
      return { success: false, message: 'Failed to remove stock' };
    }
  };

  // Refresh all stock data
  const refreshAll = async () => {
    try {
      setRefreshing(true);
      await fetchStockData(watchlist);
      return { success: true };
    } catch (err) {
      console.error('Error refreshing data:', err);
      return { success: false };
    } finally {
      setRefreshing(false);
    }
  };

  // Get stock data for a specific symbol
  const getStockData = (symbol) => {
    return stockData[symbol] || null;
  };

  const value = {
    watchlist,
    stockData,
    loading,
    refreshing,
    error,
    addStock,
    removeStock,
    refreshAll,
    getStockData,
  };

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
};

/**
 * Custom hook to use Stock Context
 */
export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

export default StockContext;
