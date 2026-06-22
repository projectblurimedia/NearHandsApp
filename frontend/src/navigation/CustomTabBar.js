import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';

// MaterialCommunityIcons = softer, rounder, more modern look
const TABS = {
  Home:     { on: 'home-variant',         off: 'home-variant-outline' },
  Search:   { on: 'magnify',              off: 'magnify' },
  Problems: { on: 'bell-badge',           off: 'bell-outline' },
  Earnings: { on: 'wallet',               off: 'wallet-outline' },
  Profile:  { on: 'account-circle',       off: 'account-circle-outline' },
};

function TabItem({ route, isFocused, label, navigation }) {
  const { colors } = useTheme();

  // Pill: animates from 0 → 1 (scale + opacity) when tab becomes active
  const pillProgress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    pillProgress.value = withSpring(isFocused ? 1 : 0, {
      damping: 18,
      stiffness: 280,
    });
  }, [isFocused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillProgress.value,
    transform: [
      { scaleX: 0.6 + pillProgress.value * 0.4 },
      { scaleY: 0.7 + pillProgress.value * 0.3 },
    ],
  }));

  const iconColor = isFocused ? '#ffffff' : colors.subtext;

  // Press bounce
  const bounce = useSharedValue(1);
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounce.value }],
  }));

  const handlePress = () => {
    bounce.value = withSpring(0.84, { damping: 16, stiffness: 420 }, () => {
      bounce.value = withSpring(1, { damping: 13, stiffness: 340 });
    });
    if (!isFocused) navigation.navigate(route.name);
  };

  const icons = TABS[route.name] ?? { on: 'circle', off: 'circle-outline' };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.tabItem}
      activeOpacity={1}
    >
      <Animated.View style={[styles.itemInner, bounceStyle]}>

        {/* Icon container with pill underneath */}
        <View style={styles.iconZone}>
          {/* Gradient pill — behind icon, animates in/out */}
          <Animated.View style={[styles.pill, pillStyle]}>
            <LinearGradient
              colors={GRADIENT}
              start={GRADIENT_START}
              end={GRADIENT_END}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          <MaterialCommunityIcons
            name={isFocused ? icons.on : icons.off}
            size={24}
            color={iconColor}
          />
        </View>

        {/* Label always visible — color changes */}
        <StyledText
          weight={isFocused ? '600' : '400'}
          style={[
            styles.label,
            { color: isFocused ? '#1D9BF0' : colors.subtext },
          ]}
          numberOfLines={1}
        >
          {label}
        </StyledText>

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
            backgroundColor: isDark ? '#111827' : '#ffffff',
            shadowColor: '#1D9BF0',
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
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    // Glowing blue shadow
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconZone: {
    width: 50,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 3,
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    overflow: 'hidden',
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
