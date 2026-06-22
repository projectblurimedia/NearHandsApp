import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';

/* ── better icons, relevant to NearHands ────────────────────── */
const ICONS = {
  Home:     { on: 'home',                  off: 'home-outline' },
  Search:   { on: 'map-search',            off: 'map-search-outline' },
  Messages: { on: 'forum',                 off: 'forum-outline' },
  Profile:  { on: 'account-circle',        off: 'account-circle-outline' },
};

const INACTIVE  = '#94A3B8';
const FAB_SIZE  = 62;
const FAB_RISE  = 22;

/* ── tab item: icon + label stacked vertically for ALL tabs ─── */
function TabItem({ route, isFocused, label, navigation, pillScale }) {
  const { colors } = useTheme();
  const icons = ICONS[route.name] ?? { on: 'circle', off: 'circle-outline' };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => { if (!isFocused) navigation.navigate(route.name); }}
      activeOpacity={0.75}
    >
      {/* icon zone — pill slides behind it */}
      <View style={styles.iconZone}>
        <MaterialCommunityIcons
          name={isFocused ? icons.on : icons.off}
          size={20}
          color={isFocused ? '#FFFFFF' : INACTIVE}
        />
      </View>
      {/* label — white when active (matches icon on gradient pill) */}
      <StyledText
        weight={isFocused ? '600' : '400'}
        numberOfLines={1}
        style={[styles.label, { color: isFocused ? '#FFFFFF' : INACTIVE }]}
      >
        {label}
      </StyledText>
    </TouchableOpacity>
  );
}

/* ── tab bar ─────────────────────────────────────────────────── */
export function CustomTabBar({ state, descriptors, navigation }) {
  const { colors, isDark } = useTheme();
  const { openMenuPage } = useApp();
  const insets    = useSafeAreaInsets();

  const [barW, setBarW] = useState(0);
  const firstLayout     = useRef(true);
  const tabCount        = state.routes.length;   // 4
  const slotW           = barW > 0 ? barW / 5 : 0;  // 5 slots (4 tabs + center FAB)

  // Slot mapping: tabs 0,1 → slots 0,1; tabs 2,3 → slots 3,4; slot 2 = FAB gap
  const slotForIndex = (i) => (i < 2 ? i : i + 1);

  const pillX = useSharedValue(0);

  useEffect(() => {
    if (slotW <= 0) return;
    const target = slotForIndex(state.index) * slotW;
    if (firstLayout.current) { pillX.value = target; firstLayout.current = false; }
    else pillX.value = withSpring(target, { damping: 24, stiffness: 260, mass: 0.9 });
  }, [state.index, slotW]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: slotW,
  }));

  const barBg = isDark ? '#0F172A' : '#FFFFFF';

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.background,
          paddingBottom: Math.max(insets.bottom, 12),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: isDark ? '#30363d' : '#e5e7eb',
        },
      ]}
    >
      {/* shadow shell */}
      <View style={[styles.shadow, { backgroundColor: barBg, shadowColor: '#1D9BF0' }]}>
        <View
          style={[styles.bar, { backgroundColor: barBg }]}
          onLayout={e => setBarW(e.nativeEvent.layout.width)}
        >
          {/* sliding gradient pill */}
          {slotW > 0 && (
            <Animated.View style={[styles.pill, pillStyle]} pointerEvents="none">
              <LinearGradient colors={GRADIENT} start={GRADIENT_START} end={GRADIENT_END} style={StyleSheet.absoluteFill} />
            </Animated.View>
          )}

          {/* Left 2: Home, Search */}
          {state.routes.slice(0, 2).map((route, i) => {
            const isFocused = state.index === i;
            const { options } = descriptors[route.key];
            const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name;
            return <TabItem key={route.key} route={route} isFocused={isFocused} label={label} navigation={navigation} />;
          })}

          {/* FAB slot space */}
          <View style={styles.fabSlot} />

          {/* Right 2: Messages, Profile */}
          {state.routes.slice(2).map((route, i) => {
            const realIndex = i + 2;
            const isFocused = state.index === realIndex;
            const { options } = descriptors[route.key];
            const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name;
            return <TabItem key={route.key} route={route} isFocused={isFocused} label={label} navigation={navigation} />;
          })}
        </View>
      </View>

      {/* PhonePe-style FAB — no shadow ─────────────────── */}
      <View style={styles.fabWrap} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => openMenuPage('problems')}
          style={styles.fabOuter}
        >
          <LinearGradient
            colors={GRADIENT}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={styles.fab}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={30} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BAR_RADIUS = 26;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop:        10,
  },
  shadow: {
    borderRadius:  BAR_RADIUS,
    shadowOffset:  { width: 0, height: -3 },
    shadowOpacity: 0.22,
    shadowRadius:  22,
    elevation:     20,
  },
  bar: {
    flexDirection:   'row',
    borderRadius:    BAR_RADIUS,
    overflow:        'hidden',
    paddingVertical: 7,
    alignItems:      'center',
  },
  pill: {
    position:     'absolute',
    top:          5,
    bottom:       5,
    borderRadius: 100,
    overflow:     'hidden',
    zIndex:       0,
  },

  // tab item: vertical stack (icon top, label bottom)
  item: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: 4,
    zIndex:          1,
    overflow:        'hidden',
  },
  iconZone: {
    width:          44,
    height:         24,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   0,       // no gap — label touches icon
  },
  label: {
    fontSize:      9.5,
    textAlign:     'center',
    letterSpacing: 0.1,
    flexShrink:    1,
  },

  fabSlot: { flex: 1 },

  // FAB — no shadow/elevation
  fabWrap: {
    position:   'absolute',
    left:       0,
    right:      0,
    top:        10 - FAB_RISE,
    alignItems: 'center',
    zIndex:     50,
  },
  fabOuter: {
    width:        FAB_SIZE,
    height:       FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    borderWidth:  3,
    borderColor:  '#FFFFFF',
    overflow:     'hidden',
    // intentionally no shadow/elevation
  },
  fab: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
});
