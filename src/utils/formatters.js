/**
 * Format a price value to currency string
 * @param {number} price - The price to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = '$') => {
  if (price === null || price === undefined || isNaN(price)) {
    return `${currency}--`;
  }
  return `${currency}${price.toFixed(2)}`;
};

/**
 * Format a change value with sign
 * @param {number} change - The change value
 * @returns {string} Formatted change with + or - sign
 */
export const formatChange = (change) => {
  if (change === null || change === undefined || isNaN(change)) {
    return '--';
  }
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
};

/**
 * Format a percentage change
 * @param {number} changePercent - The percentage change
 * @returns {string} Formatted percentage with sign
 */
export const formatPercentChange = (changePercent) => {
  if (changePercent === null || changePercent === undefined || isNaN(changePercent)) {
    return '--';
  }
  const sign = changePercent >= 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

/**
 * Format volume number to compact notation
 * @param {number} volume - The volume number
 * @returns {string} Formatted volume (e.g., 1.2M, 500K)
 */
export const formatVolume = (volume) => {
  if (volume === null || volume === undefined || isNaN(volume)) {
    return '--';
  }

  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(2)}B`;
  }
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  }
  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  }
  return volume.toString();
};

/**
 * Format Unix timestamp to readable date/time
 * @param {number} timestamp - Unix timestamp
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp, includeTime = false) => {
  if (!timestamp) return '--';

  const date = new Date(timestamp * 1000);
  const options = includeTime
    ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { month: 'short', day: 'numeric', year: 'numeric' };

  return date.toLocaleDateString('en-US', options);
};
