import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { FAB } from 'react-native-paper';
import StockCard from '../components/StockCard';
import useWatchlist from '../hooks/useWatchlist';
import COLORS from '../utils/colors';

/**
 * HomeScreen
 * Main screen displaying the user's watchlist
 */
const HomeScreen = ({ navigation }) => {
  const {
    watchlist,
    stockData,
    loading,
    refreshing,
    refreshAll,
    isEmpty,
  } = useWatchlist();

  const handleRefresh = async () => {
    await refreshAll();
  };

  const handleStockPress = (symbol) => {
    navigation.navigate('StockDetail', { symbol });
  };

  const handleAddStock = () => {
    navigation.navigate('AddStock');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Stocks in Watchlist</Text>
      <Text style={styles.emptyText}>
        Tap the + button to add stocks to your watchlist
      </Text>
    </View>
  );

  const renderStockCard = ({ item }) => (
    <StockCard
      symbol={item}
      data={stockData[item]}
      loading={loading && !stockData[item]}
      onPress={() => handleStockPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={watchlist}
        renderItem={renderStockCard}
        keyExtractor={(item) => item}
        contentContainerStyle={
          isEmpty() ? styles.emptyListContent : styles.listContent
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddStock}
        color={COLORS.surface}
      />
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
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
  },
});

export default HomeScreen;
