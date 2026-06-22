import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';

const ICONS = {
  Home:     { on: 'home-variant',    off: 'home-variant-outline' },
  Search:   { on: 'magnify',         off: 'magnify' },
  Messages: { on: 'message-text',    off: 'message-text-outline' },
  Profile:  { on: 'account-circle',  off: 'account-circle-outline' },
};

const INACTIVE  = '#94A3B8';
const FAB_SIZE  = 56;
const FAB_RISE  = 20;       // how far the FAB floats above the bar

/* ─── regular tab item ─────────────────────────────────────── */
function TabItem({ route, isFocused, label, navigation }) {
  const { colors } = useTheme();
  const icons = ICONS[route.name] ?? { on: 'circle', off: 'circle-outline' };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => { if (!isFocused) navigation.navigate(route.name); }}
      activeOpacity={0.75}
    >
      <View style={styles.row}>
        <MaterialCommunityIcons
          name={isFocused ? icons.on : icons.off}
          size={22}
          color={isFocused ? '#FFFFFF' : INACTIVE}
        />
        {isFocused && (
          <StyledText weight="600" numberOfLines={1} style={styles.label}>
            {label}
          </StyledText>
        )}
      </View>
    </TouchableOpacity>
  );
}

/* ─── tab bar ──────────────────────────────────────────────── */
export function CustomTabBar({ state, descriptors, navigation }) {
  const { colors, isDark } = useTheme();
  const { openMenuPage } = useApp();
  const insets = useSafeAreaInsets();

  const [barW, setBarW]   = useState(0);
  const firstLayout       = useRef(true);
  const tabCount          = state.routes.length;   // 4
  // pill occupies one of 5 equal slots (4 tabs + 1 center FAB slot)
  const slotW             = barW > 0 ? barW / 5 : 0;

  // Map real tab index (0-3) to its slot position (0,1,3,4 — slot 2 is the FAB)
  const slotForIndex = (i) => (i < 2 ? i : i + 1);

  const pillX = useSharedValue(0);

  useEffect(() => {
    if (slotW <= 0) return;
    const target = slotForIndex(state.index) * slotW;
    if (firstLayout.current) {
      pillX.value = target;
      firstLayout.current = false;
    } else {
      pillX.value = withSpring(target, { damping: 24, stiffness: 260, mass: 0.9 });
    }
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
        {/* bar — overflow:hidden clips the pill */}
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

          {/* Left 2 tabs: Home, Search */}
          {state.routes.slice(0, 2).map((route, i) => {
            const isFocused = state.index === i;
            const { options } = descriptors[route.key];
            const label = typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel : options.title ?? route.name;
            return (
              <TabItem key={route.key} route={route} isFocused={isFocused} label={label} navigation={navigation} />
            );
          })}

          {/* Center FAB placeholder — same flex as a tab slot */}
          <View style={styles.fabSlot} />

          {/* Right 2 tabs: Messages, Profile */}
          {state.routes.slice(2).map((route, i) => {
            const realIndex = i + 2;
            const isFocused = state.index === realIndex;
            const { options } = descriptors[route.key];
            const label = typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel : options.title ?? route.name;
            return (
              <TabItem key={route.key} route={route} isFocused={isFocused} label={label} navigation={navigation} />
            );
          })}
        </View>
      </View>

      {/* ── PhonePe-style center FAB — floats above the bar ── */}
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
            <MaterialCommunityIcons name="alert-circle-outline" size={26} color="#fff" />
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
    paddingVertical: 11,   // slightly taller bar
  },
  pill: {
    position: 'absolute',
    top:      5,
    bottom:   5,
    borderRadius: 100,
    overflow: 'hidden',
    zIndex:   0,
  },
  item: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: 5,
    zIndex:          1,
    overflow:        'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:            4,
    maxWidth:       '100%',
  },
  label: {
    fontSize:   10.5,
    color:      '#FFFFFF',
    flexShrink: 1,
  },

  /* FAB placeholder space inside bar (same weight as a tab) */
  fabSlot: { flex: 1 },

  /* FAB floats above bar center */
  fabWrap: {
    position:       'absolute',
    left:           0,
    right:          0,
    // sits at top of wrapper; negative top moves it above the bar
    top:            10 - FAB_RISE,
    alignItems:     'center',
    zIndex:         50,
  },
  fabOuter: {
    width:  FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    // white ring border
    borderWidth:  3,
    borderColor:  '#FFFFFF',
    shadowColor:  '#1D9BF0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius:  12,
    elevation:     14,
    overflow:      'hidden',
  },
  fab: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
});
