import { API_CONFIG, TIME_RANGES } from '../constants/config';

/**
 * Yahoo Finance Service
 * Handles all API calls to Yahoo Finance
 */
class YahooFinanceService {
  /**
   * Get stock quote (current price, change, volume, etc.)
   * @param {string} symbol - Stock symbol (e.g., 'AAPL')
   * @returns {Promise<Object>} Stock quote data
   */
  async getStockQuote(symbol) {
    try {
      const url = `${API_CONFIG.YAHOO_FINANCE_BASE_URL}${API_CONFIG.CHART_ENDPOINT}/${symbol}?interval=1d&range=1d`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data?.chart?.result?.[0]) {
        throw new Error('Invalid response from Yahoo Finance');
      }

      const result = data.chart.result[0];
      const meta = result.meta;

      return {
        symbol: meta.symbol,
        price: meta.regularMarketPrice || meta.chartPreviousClose,
        previousClose: meta.previousClose || meta.chartPreviousClose,
        change: meta.regularMarketPrice - (meta.previousClose || meta.chartPreviousClose),
        changePercent: ((meta.regularMarketPrice - (meta.previousClose || meta.chartPreviousClose)) / (meta.previousClose || meta.chartPreviousClose)) * 100,
        volume: meta.regularMarketVolume,
        marketCap: meta.marketCap,
        currency: meta.currency || 'USD',
        timestamp: meta.regularMarketTime,
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  }

  /**
   * Get historical stock data for charts
   * @param {string} symbol - Stock symbol
   * @param {string} timeRange - Time range key (e.g., '1D', '1M', '1Y')
   * @returns {Promise<Object>} Historical price data
   */
  async getStockHistory(symbol, timeRange = '1M') {
    try {
      const rangeConfig = TIME_RANGES[timeRange] || TIME_RANGES['1M'];
      const url = `${API_CONFIG.YAHOO_FINANCE_BASE_URL}${API_CONFIG.CHART_ENDPOINT}/${symbol}?interval=${rangeConfig.interval}&range=${rangeConfig.range}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data?.chart?.result?.[0]) {
        throw new Error('Invalid response from Yahoo Finance');
      }

      const result = data.chart.result[0];
      const timestamps = result.timestamp || [];
      const quotes = result.indicators?.quote?.[0] || {};
      const closes = quotes.close || [];

      // Filter out null values and prepare chart data
      const chartData = timestamps
        .map((timestamp, index) => ({
          timestamp,
          date: new Date(timestamp * 1000),
          price: closes[index],
        }))
        .filter(item => item.price !== null && item.price !== undefined);

      return {
        symbol: result.meta.symbol,
        data: chartData,
        currency: result.meta.currency || 'USD',
        timeRange: rangeConfig.label,
      };
    } catch (error) {
      console.error(`Error fetching history for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch history for ${symbol}`);
    }
  }

  /**
   * Search for stock symbols
   * @param {string} query - Search query (symbol or company name)
   * @returns {Promise<Array>} Array of search results
   */
  async searchSymbol(query) {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const url = `${API_CONFIG.YAHOO_FINANCE_BASE_URL}${API_CONFIG.SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data?.quotes) {
        return [];
      }

      // Filter for stocks only (equity type)
      return data.quotes
        .filter(quote => quote.quoteType === 'EQUITY')
        .map(quote => ({
          symbol: quote.symbol,
          name: quote.longname || quote.shortname || quote.symbol,
          exchange: quote.exchange,
          type: quote.quoteType,
        }))
        .slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error(`Error searching for ${query}:`, error.message);
      return [];
    }
  }

  /**
   * Get multiple stock quotes in batch
   * @param {Array<string>} symbols - Array of stock symbols
   * @returns {Promise<Array>} Array of stock quotes
   */
  async getMultipleQuotes(symbols) {
    try {
      if (!symbols || symbols.length === 0) {
        return [];
      }

      // Fetch quotes in parallel
      const promises = symbols.map(symbol =>
        this.getStockQuote(symbol).catch(error => {
          console.error(`Failed to fetch ${symbol}:`, error.message);
          return null;
        })
      );

      const results = await Promise.all(promises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Error fetching multiple quotes:', error.message);
      return [];
    }
  }
}

export default new YahooFinanceService();
