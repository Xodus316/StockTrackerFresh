import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import PriceDisplay from './PriceDisplay';
import COLORS from '../utils/colors';

/**
 * StockCard Component
 * Displays a single stock in the watchlist
 */
const StockCard = ({ symbol, data, loading, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={loading}
    >
      <View style={styles.leftSection}>
        <Text style={styles.symbol}>{symbol}</Text>
        {data && <Text style={styles.name} numberOfLines={1}>{data.currency || 'USD'}</Text>}
      </View>

      <View style={styles.rightSection}>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : data ? (
          <PriceDisplay
            price={data.price}
            change={data.change}
            changePercent={data.changePercent}
            size="small"
            currency="$"
          />
        ) : (
          <Text style={styles.errorText}>--</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default StockCard;
