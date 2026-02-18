// API Configuration
export const API_CONFIG = {
  YAHOO_FINANCE_BASE_URL: 'https://query1.finance.yahoo.com',
  CHART_ENDPOINT: '/v8/finance/chart',
  SEARCH_ENDPOINT: '/v1/finance/search',
};

// App Configuration
export const APP_CONFIG = {
  REFRESH_INTERVAL: 10000, // 10 seconds
  SEARCH_DEBOUNCE_DELAY: 300, // 300ms
  DEFAULT_TIME_RANGE: '1mo',
};

// Time Ranges for Charts
export const TIME_RANGES = {
  '1D': { range: '1d', interval: '5m', label: '1D' },
  '5D': { range: '5d', interval: '15m', label: '5D' },
  '1M': { range: '1mo', interval: '1d', label: '1M' },
  '3M': { range: '3mo', interval: '1d', label: '3M' },
  '1Y': { range: '1y', interval: '1wk', label: '1Y' },
  '5Y': { range: '5y', interval: '1mo', label: '5Y' },
};

// Popular stocks for suggestions
export const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
];

// AsyncStorage Keys
export const STORAGE_KEYS = {
  WATCHLIST: '@stocktracker_watchlist',
  PREFERENCES: '@stocktracker_preferences',
};
