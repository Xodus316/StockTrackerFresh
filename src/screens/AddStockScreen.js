import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import yahooFinanceService from '../services/yahooFinanceService';
import useWatchlist from '../hooks/useWatchlist';
import { APP_CONFIG, POPULAR_STOCKS } from '../constants/config';
import COLORS from '../utils/colors';

/**
 * AddStockScreen
 * Search and add stocks to watchlist
 */
const AddStockScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addStock, isInWatchlist } = useWatchlist();

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      await handleSearch(searchQuery);
    }, APP_CONFIG.SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const results = await yahooFinanceService.searchSymbol(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (symbol) => {
    const result = await addStock(symbol);
    if (result.success) {
      navigation.goBack();
    } else {
      alert(result.message);
    }
  };

  const renderSearchResult = ({ item }) => {
    const inWatchlist = isInWatchlist(item.symbol);

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleAddStock(item.symbol)}
        disabled={inWatchlist}
      >
        <View style={styles.resultLeft}>
          <Text style={styles.resultSymbol}>{item.symbol}</Text>
          <Text style={styles.resultName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        {inWatchlist && (
          <Text style={styles.addedText}>Added</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderPopularStocks = () => (
    <View style={styles.popularContainer}>
      <Text style={styles.sectionTitle}>Popular Stocks</Text>
      {POPULAR_STOCKS.map((stock) => {
        const inWatchlist = isInWatchlist(stock.symbol);
        return (
          <TouchableOpacity
            key={stock.symbol}
            style={styles.resultItem}
            onPress={() => handleAddStock(stock.symbol)}
            disabled={inWatchlist}
          >
            <View style={styles.resultLeft}>
              <Text style={styles.resultSymbol}>{stock.symbol}</Text>
              <Text style={styles.resultName}>{stock.name}</Text>
            </View>
            {inWatchlist && (
              <Text style={styles.addedText}>Added</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    if (searchQuery.trim().length === 0) {
      return renderPopularStocks();
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search stocks (e.g., AAPL, Tesla)"
        autoFocus={true}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingVertical: 8,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  resultLeft: {
    flex: 1,
    marginRight: 16,
  },
  resultSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  resultName: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  addedText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  popularContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default AddStockScreen;
