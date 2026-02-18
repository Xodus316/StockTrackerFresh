import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import COLORS from '../utils/colors';

/**
 * SearchBar Component
 * Reusable search input component
 */
const SearchBar = ({ value, onChangeText, placeholder = 'Search...', autoFocus = false }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        autoCapitalize="characters"
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
});

export default SearchBar;
