import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';

const TAB_CONFIG = {
  Home:     { active: 'home',         inactive: 'home-outline' },
  Search:   { active: 'search',       inactive: 'search-outline' },
  Problems: { active: 'alert-circle', inactive: 'alert-circle-outline' },
  Earnings: { active: 'wallet',       inactive: 'wallet-outline' },
  Profile:  { active: 'person',       inactive: 'person-outline' },
};

function TabItem({ route, isFocused, label, navigation }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.88, { damping: 14 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    if (!isFocused) navigation.navigate(route.name);
  };

  const icons = TAB_CONFIG[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.tabItem}
      activeOpacity={1}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        {isFocused ? (
          <LinearGradient
            colors={GRADIENT}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={styles.activePill}
          >
            <Ionicons name={icons.active} size={17} color="#fff" />
            <StyledText weight="700" style={styles.activeLabel} numberOfLines={1}>
              {label}
            </StyledText>
          </LinearGradient>
        ) : (
          <View style={styles.inactiveItem}>
            <Ionicons name={icons.inactive} size={22} color={colors.subtext} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

export function CustomTabBar({ state, descriptors, navigation }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.background,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: isDark ? '#1a2235' : '#ffffff',
            shadowColor: isDark ? '#1D9BF0' : '#0D3FBF',
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              label={label}
              navigation={navigation}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 22,
  },
  activeLabel: {
    color: '#fff',
    fontSize: 11,
    maxWidth: 60,
  },
  inactiveItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
