import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';

// MaterialCommunityIcons — rounded, soft, modern
const TABS = {
  Home:     { on: 'home-variant',      off: 'home-variant-outline' },
  Search:   { on: 'magnify',           off: 'magnify' },
  Problems: { on: 'bell-badge',        off: 'bell-outline' },
  Earnings: { on: 'wallet',            off: 'wallet-outline' },
  Profile:  { on: 'account-circle',    off: 'account-circle-outline' },
};

const ACTIVE_COLOR   = '#1D9BF0';
const INACTIVE_COLOR = '#9CA3AF';

function TabItem({ route, isFocused, label, navigation, isDark }) {
  // Pill: tinted background that scales in when active
  const pillScale   = useSharedValue(isFocused ? 1 : 0.55);
  const pillOpacity = useSharedValue(isFocused ? 1 : 0);
  // Bounce on press
  const bounce = useSharedValue(1);

  useEffect(() => {
    pillScale.value   = withSpring(isFocused ? 1 : 0.55, { damping: 18, stiffness: 300 });
    pillOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 160 });
  }, [isFocused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
    transform: [{ scaleX: pillScale.value }, { scaleY: pillScale.value }],
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounce.value }],
  }));

  const handlePress = () => {
    bounce.value = withSpring(0.84, { damping: 14, stiffness: 420 }, () => {
      bounce.value = withSpring(1,    { damping: 13, stiffness: 340 });
    });
    if (!isFocused) navigation.navigate(route.name);
  };

  const icons = TABS[route.name] ?? { on: 'circle', off: 'circle-outline' };

  // Pill bg: low-opacity brand blue — icon color brand blue = visible in both modes
  const pillBg = isDark ? 'rgba(29,155,240,0.24)' : 'rgba(29,155,240,0.13)';

  return (
    <TouchableOpacity onPress={handlePress} style={styles.item} activeOpacity={1}>
      <Animated.View style={[styles.itemInner, bounceStyle]}>

        {/* Icon + tinted pill indicator */}
        <View style={styles.iconZone}>
          <Animated.View style={[styles.pill, { backgroundColor: pillBg }, pillStyle]} />
          <MaterialCommunityIcons
            name={isFocused ? icons.on : icons.off}
            size={24}
            color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
        </View>

        {/* Label — always visible, always below icon */}
        <StyledText
          weight={isFocused ? '600' : '400'}
          numberOfLines={1}
          style={[styles.label, { color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR }]}
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
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
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
              isDark={isDark}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    // Glowing shadow — user approved
    shadowOffset:  { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius:  24,
    elevation:     20,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconZone: {
    width:        52,
    height:       34,
    borderRadius: 17,
    alignItems:   'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow:     'hidden',
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 17,
  },
  label: {
    fontSize:      10,
    letterSpacing: 0.1,
    textAlign:     'center',
    maxWidth:      64,
  },
});
