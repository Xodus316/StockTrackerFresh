import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import yahooFinanceService from '../services/yahooFinanceService';
import { APP_CONFIG } from '../constants/config';

/**
 * Custom hook for fetching and auto-updating stock prices
 * @param {string} symbol - Stock symbol to track
 * @param {number} refreshInterval - Refresh interval in ms (default from config)
 * @returns {Object} Stock price data and states
 */
const useStockPrice = (symbol, refreshInterval = APP_CONFIG.REFRESH_INTERVAL) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef(null);

  // Fetch stock price
  const fetchPrice = async () => {
    try {
      const quote = await yahooFinanceService.getStockQuote(symbol);
      setData(quote);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch stock price');
      setLoading(false);
    }
  };

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to foreground - fetch immediately
        fetchPrice();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [symbol]);

  // Set up price fetching and auto-refresh
  useEffect(() => {
    if (!symbol) {
      setLoading(false);
      return;
    }

    // Fetch immediately
    fetchPrice();

    // Set up interval for auto-refresh
    intervalRef.current = setInterval(() => {
      if (AppState.currentState === 'active') {
        fetchPrice();
      }
    }, refreshInterval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, refreshInterval]);

  // Manual refresh function
  const refresh = async () => {
    setLoading(true);
    await fetchPrice();
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
};

export default useStockPrice;
