import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProblemsScreen } from '../screens/ProblemsScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomTabBar } from './CustomTabBar';
import { useApp } from '../hooks/useApp';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const { mode } = useApp();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Problems"
        component={ProblemsScreen}
        options={{ tabBarLabel: mode === 'worker' ? 'Complaints' : 'Problems' }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ tabBarLabel: mode === 'worker' ? 'Earnings' : 'Wallet' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
