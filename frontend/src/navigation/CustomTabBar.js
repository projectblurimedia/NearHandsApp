import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';

const TABS = {
  Home:     { on: 'home',          off: 'home-outline' },
  Search:   { on: 'search',        off: 'search-outline' },
  Problems: { on: 'alert-circle',  off: 'alert-circle-outline' },
  Earnings: { on: 'wallet',        off: 'wallet-outline' },
  Profile:  { on: 'person',        off: 'person-outline' },
};

function TabItem({ route, isFocused, label, navigation }) {
  const { colors } = useTheme();

  // Pill scale: 1 when active, 0 when inactive
  const pillScale = useSharedValue(isFocused ? 1 : 0);
  // Icon/label color: 1 = active blue, 0 = gray
  const colorProgress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    pillScale.value = withSpring(isFocused ? 1 : 0, {
      damping: 20,
      stiffness: 300,
    });
    colorProgress.value = withTiming(isFocused ? 1 : 0, { duration: 180 });
  }, [isFocused]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: pillScale.value }, { scaleY: pillScale.value }],
    opacity: pillScale.value,
  }));

  const pressScale = useSharedValue(1);
  const itemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePress = () => {
    pressScale.value = withSpring(0.86, { damping: 16, stiffness: 400 }, () => {
      pressScale.value = withSpring(1, { damping: 14, stiffness: 340 });
    });
    if (!isFocused) navigation.navigate(route.name);
  };

  const icons = TABS[route.name] ?? { on: 'ellipse', off: 'ellipse-outline' };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.tabItem}
      activeOpacity={1}
    >
      <Animated.View style={itemStyle}>
        {/* Icon row: pill behind icon */}
        <View style={styles.iconWrap}>
          <Animated.View style={[styles.pill, pillStyle]}>
            <LinearGradient
              colors={GRADIENT}
              start={GRADIENT_START}
              end={GRADIENT_END}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Ionicons
            name={isFocused ? icons.on : icons.off}
            size={21}
            color={isFocused ? '#ffffff' : colors.subtext}
          />
        </View>

        {/* Label — always visible, color changes */}
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
    // Glowing blue shadow — kept from before
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    width: 52,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 4,
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    overflow: 'hidden',
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
