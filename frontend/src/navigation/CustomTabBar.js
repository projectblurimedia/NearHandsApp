import React, { useEffect, useRef, useState } from 'react';
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

const ICONS = {
  Home:     { on: 'home-variant',      off: 'home-variant-outline' },
  Search:   { on: 'magnify',           off: 'magnify' },
  Problems: { on: 'bell-badge',        off: 'bell-outline' },
  Earnings: { on: 'wallet',            off: 'wallet-outline' },
  Profile:  { on: 'account-circle',    off: 'account-circle-outline' },
};

const INACTIVE = '#94A3B8';

/* ─── single tab item ─────────────────────────────────────────────── */
function TabItem({ route, isFocused, label, navigation }) {
  // label slides in (maxWidth 0 → 60) and fades in
  const labelW  = useSharedValue(isFocused ? 60 : 0);
  const labelOp = useSharedValue(isFocused ? 1  : 0);
  // press bounce
  const bounce  = useSharedValue(1);

  useEffect(() => {
    labelW.value  = withSpring(isFocused ? 60 : 0, { damping: 20, stiffness: 260 });
    labelOp.value = withTiming(isFocused ? 1  : 0, { duration: 180 });
  }, [isFocused]);

  const labelWrapStyle = useAnimatedStyle(() => ({
    maxWidth: labelW.value,
    opacity:  labelOp.value,
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounce.value }],
  }));

  const handlePress = () => {
    bounce.value = withSpring(0.82, { damping: 12, stiffness: 450 }, () => {
      bounce.value = withSpring(1,    { damping: 10, stiffness: 360 });
    });
    if (!isFocused) navigation.navigate(route.name);
  };

  const icons = ICONS[route.name] ?? { on: 'circle', off: 'circle-outline' };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress} activeOpacity={1}>
      <Animated.View style={[styles.row, bounceStyle]}>

        {/* icon */}
        <MaterialCommunityIcons
          name={isFocused ? icons.on : icons.off}
          size={22}
          color={isFocused ? '#FFFFFF' : INACTIVE}
        />

        {/* name — expands beside icon when active, collapses when inactive */}
        <Animated.View style={[styles.labelWrap, labelWrapStyle]}>
          <StyledText weight="600" numberOfLines={1} style={styles.label}>
            {label}
          </StyledText>
        </Animated.View>

      </Animated.View>
    </TouchableOpacity>
  );
}

/* ─── tab bar ─────────────────────────────────────────────────────── */
export function CustomTabBar({ state, descriptors, navigation }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [barW, setBarW]     = useState(0);
  const firstLayout         = useRef(true);
  const tabCount            = state.routes.length;
  const tabW                = barW > 0 ? barW / tabCount : 0;

  // pill x — snaps on first layout, then springs on tab change
  const pillX = useSharedValue(0);

  useEffect(() => {
    if (tabW <= 0) return;
    const target = state.index * tabW;
    if (firstLayout.current) {
      pillX.value = target;
      firstLayout.current = false;
    } else {
      pillX.value = withSpring(target, { damping: 24, stiffness: 260, mass: 0.9 });
    }
  }, [state.index, tabW]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: tabW,
  }));

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
      {/* shadow shell */}
      <View
        style={[
          styles.shadow,
          {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            shadowColor: '#1D9BF0',
          },
        ]}
      >
        {/* overflow:hidden inner so gradient pill clips to bar corners */}
        <View
          style={[styles.bar, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}
          onLayout={e => setBarW(e.nativeEvent.layout.width)}
        >
          {/* sliding gradient pill (behind all items) */}
          {tabW > 0 && (
            <Animated.View style={[styles.pill, pillStyle]} pointerEvents="none">
              <LinearGradient
                colors={GRADIENT}
                start={GRADIENT_START}
                end={GRADIENT_END}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          )}

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
    </View>
  );
}

const R = 26;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },

  // carries the iOS/Android shadow
  shadow: {
    borderRadius:  R,
    shadowOffset:  { width: 0, height: -3 },
    shadowOpacity: 0.22,
    shadowRadius:  22,
    elevation:     20,
  },

  // clips the sliding pill to the bar's rounded corners
  bar: {
    flexDirection: 'row',
    borderRadius:  R,
    overflow:      'hidden',
    paddingVertical: 6,
  },

  // the gradient pill — absolute, same height as bar interior
  pill: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    zIndex:   0,
  },

  // each tab slot
  item: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          1,            // above the pill
    paddingVertical: 7,
  },

  // horizontal layout: icon + name
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:             5,
  },

  // animated container for the label
  labelWrap: {
    overflow: 'hidden',
  },

  label: {
    fontSize:      11,
    color:         '#FFFFFF',
    letterSpacing: 0.1,
  },
});
