import { useStock } from '../context/StockContext';

/**
 * Custom hook for watchlist operations
 * Wraps the StockContext for easier use in components
 * @returns {Object} Watchlist data and operations
 */
const useWatchlist = () => {
  const {
    watchlist,
    stockData,
    loading,
    refreshing,
    error,
    addStock,
    removeStock,
    refreshAll,
    getStockData,
  } = useStock();

  // Get watchlist with stock data
  const getWatchlistWithData = () => {
    return watchlist
      .map(symbol => ({
        symbol,
        data: stockData[symbol],
      }))
      .filter(item => item.data !== undefined);
  };

  // Check if symbol is in watchlist
  const isInWatchlist = (symbol) => {
    return watchlist.includes(symbol);
  };

  // Get watchlist count
  const getCount = () => {
    return watchlist.length;
  };

  // Check if watchlist is empty
  const isEmpty = () => {
    return watchlist.length === 0;
  };

  return {
    watchlist,
    stockData,
    loading,
    refreshing,
    error,
    addStock,
    removeStock,
    refreshAll,
    getStockData,
    getWatchlistWithData,
    isInWatchlist,
    getCount,
    isEmpty,
  };
};

export default useWatchlist;
