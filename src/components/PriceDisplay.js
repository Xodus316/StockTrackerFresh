import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatPrice, formatChange, formatPercentChange } from '../utils/formatters';
import COLORS from '../utils/colors';

/**
 * PriceDisplay Component
 * Displays stock price with change indicator
 */
const PriceDisplay = ({ price, change, changePercent, size = 'medium', currency = '$' }) => {
  const isPositive = change >= 0;
  const changeColor = isPositive ? COLORS.chartGreen : COLORS.chartRed;

  const sizes = {
    small: { price: 16, change: 12 },
    medium: { price: 24, change: 14 },
    large: { price: 36, change: 18 },
  };

  const fontSize = sizes[size] || sizes.medium;

  return (
    <View style={styles.container}>
      <Text style={[styles.price, { fontSize: fontSize.price }]}>
        {formatPrice(price, currency)}
      </Text>
      <View style={styles.changeContainer}>
        <Text style={[styles.change, { color: changeColor, fontSize: fontSize.change }]}>
          {formatChange(change)}
        </Text>
        <Text style={[styles.changePercent, { color: changeColor, fontSize: fontSize.change }]}>
          {' '}
          ({formatPercentChange(changePercent)})
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  price: {
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontWeight: '600',
  },
  changePercent: {
    fontWeight: '600',
  },
});

export default PriceDisplay;
