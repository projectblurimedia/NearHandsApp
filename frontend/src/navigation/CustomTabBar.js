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

/* ─── icon config (soft MaterialCommunity icons) ──────────────────── */
const ICONS = {
  Home:     { on: 'home-variant',         off: 'home-variant-outline' },
  Search:   { on: 'magnify',              off: 'magnify' },
  Problems: { on: 'bell-badge',           off: 'bell-outline' },
  Earnings: { on: 'wallet',               off: 'wallet-outline' },
  Profile:  { on: 'account-circle',       off: 'account-circle-outline' },
};

const INACTIVE = '#94A3B8';

/* ─── single tab item ─────────────────────────────────────────────── */
function TabItem({ route, isFocused, label, navigation }) {
  const bounce      = useSharedValue(1);
  const labelOp     = useSharedValue(isFocused ? 1 : 0);
  const iconScale   = useSharedValue(isFocused ? 1.08 : 1);

  useEffect(() => {
    labelOp.value   = withTiming(isFocused ? 1 : 0,    { duration: 200 });
    iconScale.value = withSpring(isFocused ? 1.08 : 1, { damping: 18, stiffness: 280 });
  }, [isFocused]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounce.value }],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOp.value,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
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
      <Animated.View style={[styles.itemContent, bounceStyle]}>

        {/* icon */}
        <Animated.View style={iconStyle}>
          <MaterialCommunityIcons
            name={isFocused ? icons.on : icons.off}
            size={24}
            color={isFocused ? '#FFFFFF' : INACTIVE}
          />
        </Animated.View>

        {/* label — always in DOM, fades in/out so height stays stable */}
        <Animated.View style={labelStyle}>
          <StyledText
            weight="600"
            numberOfLines={1}
            style={styles.label}
          >
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

  const [barW, setBarW] = useState(0);
  const firstLayout     = useRef(true);
  const tabCount        = state.routes.length;
  const tabW            = barW > 0 ? barW / tabCount : 0;

  // Sliding pill x-position
  const pillX = useSharedValue(0);

  useEffect(() => {
    if (tabW <= 0) return;
    const target = state.index * tabW;
    if (firstLayout.current) {
      pillX.value    = target;          // snap on first paint
      firstLayout.current = false;
    } else {
      pillX.value = withSpring(target, {
        damping:   24,
        stiffness: 260,
        mass:      0.9,
      });
    }
  }, [state.index, tabW]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width:     tabW,
  }));

  const barBg = isDark ? '#0F172A' : '#FFFFFF';

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
      {/* shadow wrapper (separate from overflow-hidden inner) */}
      <View
        style={[
          styles.shadow,
          { backgroundColor: barBg, shadowColor: '#1D9BF0' },
        ]}
      >
        {/* inner: overflow:hidden so gradient pill clips to bar shape */}
        <View
          style={[styles.bar, { backgroundColor: barBg }]}
          onLayout={e => setBarW(e.nativeEvent.layout.width)}
        >
          {/* sliding gradient pill */}
          {tabW > 0 && (
            <Animated.View
              style={[styles.pill, pillStyle]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={GRADIENT}
                start={GRADIENT_START}
                end={GRADIENT_END}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          )}

          {/* tab items rendered above the pill */}
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

const RADIUS = 28;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop:        8,
  },

  /* outer view — carries the iOS shadow */
  shadow: {
    borderRadius:  RADIUS,
    shadowOffset:  { width: 0, height: -3 },
    shadowOpacity: 0.22,
    shadowRadius:  22,
    elevation:     20,           // Android glow
  },

  /* inner view — clips the gradient pill */
  bar: {
    flexDirection: 'row',
    borderRadius:  RADIUS,
    overflow:      'hidden',
    paddingVertical: 8,
  },

  /* gradient pill — sits behind all items */
  pill: {
    position:     'absolute',
    top:          0,
    bottom:       0,
    overflow:     'hidden',
    borderRadius: RADIUS,
    zIndex:       0,
  },

  /* each tab item */
  item: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         1,           // above the pill
    paddingVertical: 4,
  },
  itemContent: {
    alignItems:     'center',
    justifyContent: 'center',
    gap:            3,
  },
  label: {
    fontSize:      10,
    color:         '#FFFFFF',
    letterSpacing: 0.1,
    textAlign:     'center',
  },
});
