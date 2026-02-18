import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

/**
 * Storage Service
 * Handles all AsyncStorage operations for watchlist and preferences
 */
class StorageService {
  /**
   * Save watchlist to AsyncStorage
   * @param {Array<string>} symbols - Array of stock symbols
   * @returns {Promise<boolean>} Success status
   */
  async saveWatchlist(symbols) {
    try {
      const jsonValue = JSON.stringify(symbols);
      await AsyncStorage.setItem(STORAGE_KEYS.WATCHLIST, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving watchlist:', error);
      return false;
    }
  }

  /**
   * Load watchlist from AsyncStorage
   * @returns {Promise<Array<string>>} Array of stock symbols
   */
  async loadWatchlist() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading watchlist:', error);
      return [];
    }
  }

  /**
   * Add a symbol to watchlist
   * @param {string} symbol - Stock symbol to add
   * @returns {Promise<Array<string>>} Updated watchlist
   */
  async addToWatchlist(symbol) {
    try {
      const watchlist = await this.loadWatchlist();
      if (!watchlist.includes(symbol)) {
        watchlist.push(symbol);
        await this.saveWatchlist(watchlist);
      }
      return watchlist;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return [];
    }
  }

  /**
   * Remove a symbol from watchlist
   * @param {string} symbol - Stock symbol to remove
   * @returns {Promise<Array<string>>} Updated watchlist
   */
  async removeFromWatchlist(symbol) {
    try {
      const watchlist = await this.loadWatchlist();
      const updatedWatchlist = watchlist.filter(s => s !== symbol);
      await this.saveWatchlist(updatedWatchlist);
      return updatedWatchlist;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return [];
    }
  }

  /**
   * Save user preferences
   * @param {Object} preferences - User preferences object
   * @returns {Promise<boolean>} Success status
   */
  async savePreferences(preferences) {
    try {
      const jsonValue = JSON.stringify(preferences);
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  }

  /**
   * Load user preferences
   * @returns {Promise<Object>} User preferences object
   */
  async loadPreferences() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('Error loading preferences:', error);
      return {};
    }
  }

  /**
   * Clear all stored data
   * @returns {Promise<boolean>} Success status
   */
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.WATCHLIST, STORAGE_KEYS.PREFERENCES]);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
}

export default new StorageService();
