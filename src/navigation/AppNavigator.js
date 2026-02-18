import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddStockScreen from '../screens/AddStockScreen';
import StockDetailScreen from '../screens/StockDetailScreen';
import COLORS from '../utils/colors';

const Stack = createStackNavigator();

/**
 * AppNavigator
 * Main navigation configuration
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Stock Tracker',
          }}
        />
        <Stack.Screen
          name="AddStock"
          component={AddStockScreen}
          options={{
            title: 'Add Stock',
          }}
        />
        <Stack.Screen
          name="StockDetail"
          component={StockDetailScreen}
          options={{
            title: 'Stock Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
