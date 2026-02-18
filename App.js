import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StockProvider } from './src/context/StockContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Main App Component
 * Sets up providers and navigation
 */
const App = () => {
  return (
    <PaperProvider>
      <StockProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </StockProvider>
    </PaperProvider>
  );
};

export default App;
