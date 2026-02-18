import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import COLORS from '../utils/colors';

const screenWidth = Dimensions.get('window').width;

/**
 * StockChart Component
 * Displays historical price chart
 */
const StockChart = ({ data, timeRange = '1M' }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No chart data available</Text>
      </View>
    );
  }

  // Extract prices for chart
  const prices = data.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const isPositive = lastPrice >= firstPrice;

  // Prepare chart data
  const chartData = {
    labels: [], // We'll hide labels for cleaner look
    datasets: [
      {
        data: prices,
        color: (opacity = 1) => isPositive
          ? `rgba(76, 175, 80, ${opacity})`  // Green
          : `rgba(244, 67, 54, ${opacity})`, // Red
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => isPositive
      ? `rgba(76, 175, 80, ${opacity})`
      : `rgba(244, 67, 54, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(117, 117, 117, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0', // Hide dots for cleaner look
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // Solid grid lines
      stroke: COLORS.chartGrid,
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={true}
        segments={4}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Range: <Text style={styles.infoValue}>${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  infoContainer: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default StockChart;
