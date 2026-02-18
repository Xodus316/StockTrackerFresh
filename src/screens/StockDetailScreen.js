import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';
import PriceDisplay from '../components/PriceDisplay';
import StockChart from '../components/StockChart';
import useStockPrice from '../hooks/useStockPrice';
import useWatchlist from '../hooks/useWatchlist';
import yahooFinanceService from '../services/yahooFinanceService';
import { TIME_RANGES } from '../constants/config';
import { formatVolume } from '../utils/formatters';
import COLORS from '../utils/colors';

/**
 * StockDetailScreen
 * Displays detailed information and chart for a stock
 */
const StockDetailScreen = ({ route, navigation }) => {
  const { symbol } = route.params;
  const { data: stockData, loading: priceLoading } = useStockPrice(symbol);
  const { removeStock } = useWatchlist();

  const [selectedRange, setSelectedRange] = useState('1M');
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  // Set navigation title
  useEffect(() => {
    navigation.setOptions({ title: symbol });
  }, [symbol, navigation]);

  // Fetch chart data
  useEffect(() => {
    loadChartData(selectedRange);
  }, [symbol, selectedRange]);

  const loadChartData = async (range) => {
    try {
      setChartLoading(true);
      const history = await yahooFinanceService.getStockHistory(symbol, range);
      setChartData(history.data);
    } catch (error) {
      console.error('Error loading chart:', error);
      setChartData(null);
    } finally {
      setChartLoading(false);
    }
  };

  const handleRemoveStock = () => {
    Alert.alert(
      'Remove Stock',
      `Remove ${symbol} from watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeStock(symbol);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderTimeRangeButtons = () => (
    <View style={styles.timeRangeContainer}>
      {Object.keys(TIME_RANGES).map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            selectedRange === range && styles.timeRangeButtonActive,
          ]}
          onPress={() => setSelectedRange(range)}
        >
          <Text
            style={[
              styles.timeRangeText,
              selectedRange === range && styles.timeRangeTextActive,
            ]}
          >
            {TIME_RANGES[range].label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (priceLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Price Section */}
      <View style={styles.priceSection}>
        <Text style={styles.symbolTitle}>{symbol}</Text>
        {stockData && (
          <>
            <PriceDisplay
              price={stockData.price}
              change={stockData.change}
              changePercent={stockData.changePercent}
              size="large"
            />
            <View style={styles.metaContainer}>
              {stockData.volume && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Volume</Text>
                  <Text style={styles.metaValue}>{formatVolume(stockData.volume)}</Text>
                </View>
              )}
              {stockData.previousClose && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Prev Close</Text>
                  <Text style={styles.metaValue}>${stockData.previousClose.toFixed(2)}</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>

      {/* Time Range Selector */}
      {renderTimeRangeButtons()}

      {/* Chart */}
      {chartLoading ? (
        <View style={styles.chartLoadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : (
        <StockChart data={chartData} timeRange={selectedRange} />
      )}

      {/* Remove Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleRemoveStock}
          textColor={COLORS.danger}
          style={styles.removeButton}
        >
          Remove from Watchlist
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  priceSection: {
    backgroundColor: COLORS.surface,
    padding: 20,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  symbolTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  timeRangeTextActive: {
    color: COLORS.surface,
  },
  chartLoadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  removeButton: {
    borderColor: COLORS.danger,
  },
});

export default StockDetailScreen;
