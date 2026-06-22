import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { GRADIENT_VIVID, GRADIENT_START, GRADIENT_END } from '../constants/colors';

const TABS = {
  Home:     { on: 'home',          off: 'home-outline' },
  Search:   { on: 'search',        off: 'search-outline' },
  Problems: { on: 'alert-circle',  off: 'alert-circle-outline' },
  Earnings: { on: 'wallet',        off: 'wallet-outline' },
  Profile:  { on: 'person',        off: 'person-outline' },
};

function TabItem({ route, isFocused, label, navigation }) {
  const { colors } = useTheme();
  const press = useSharedValue(1);
  const active = useSharedValue(isFocused ? 1 : 0);

  // sync active value when tab changes
  React.useEffect(() => {
    active.value = withTiming(isFocused ? 1 : 0, { duration: 160 });
  }, [isFocused]);

  const iconScale = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: active.value,
    transform: [{ scale: 0.7 + active.value * 0.3 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: active.value,
    transform: [{ translateY: (1 - active.value) * 4 }],
  }));

  const handlePress = () => {
    press.value = withSpring(0.82, { damping: 18, stiffness: 400 }, () => {
      press.value = withSpring(1, { damping: 14, stiffness: 320 });
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
      <Animated.View style={[styles.iconWrap, iconScale]}>
        {/* Gradient pill behind icon when active */}
        <Animated.View style={[styles.pillBg, pillStyle]}>
          <LinearGradient
            colors={GRADIENT_VIVID}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Ionicons
          name={isFocused ? icons.on : icons.off}
          size={22}
          color={isFocused ? '#ffffff' : colors.subtext}
        />
      </Animated.View>

      {/* Label — fades + slides in when active */}
      <Animated.View style={labelStyle}>
        <StyledText
          weight="600"
          style={[styles.label, { color: '#1CB5E0' }]}
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
            shadowColor: isDark ? '#1CB5E0' : '#203A43',
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
    paddingTop: 10,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 26,
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 18,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 46,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pillBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    overflow: 'hidden',
  },
  label: {
    fontSize: 9.5,
    letterSpacing: 0.1,
  },
});
