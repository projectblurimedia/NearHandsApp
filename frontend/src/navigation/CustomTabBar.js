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
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';

const ICONS = {
  Home:     { on: 'home-variant',       off: 'home-variant-outline' },
  Search:   { on: 'magnify',            off: 'magnify' },
  Messages: { on: 'message-text',       off: 'message-text-outline' },
  Profile:  { on: 'account-circle',     off: 'account-circle-outline' },
};

const INACTIVE = '#94A3B8';

/* ─── single tab item — no animations, clean instant switch ───────── */
function TabItem({ route, isFocused, label, navigation }) {
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
          size={21}
          color={isFocused ? '#FFFFFF' : INACTIVE}
        />
        {/* label appears instantly beside icon when active, gone when inactive */}
        {isFocused && (
          <StyledText weight="600" numberOfLines={1} style={styles.label}>
            {label}
          </StyledText>
        )}
      </View>
    </TouchableOpacity>
  );
}

/* ─── tab bar ─────────────────────────────────────────────────────── */
export function CustomTabBar({ state, descriptors, navigation }) {
  const { colors, isDark } = useTheme();
  const insets    = useSafeAreaInsets();
  const [barW, setBarW] = useState(0);
  const firstLayout     = useRef(true);
  const tabCount        = state.routes.length;
  const tabW            = barW > 0 ? barW / tabCount : 0;

  // pill slides between positions — only animation kept
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

  const barBg = isDark ? '#0F172A' : '#FFFFFF';

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.background,
          paddingBottom: Math.max(insets.bottom, 10),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: isDark ? '#30363d' : '#e5e7eb',
        },
      ]}
    >
      {/* shadow shell — separate from overflow:hidden so glow isn't clipped */}
      <View style={[styles.shadow, { backgroundColor: barBg, shadowColor: '#1D9BF0' }]}>

        {/* inner — clips pill to bar's rounded corners */}
        <View
          style={[styles.bar, { backgroundColor: barBg }]}
          onLayout={e => setBarW(e.nativeEvent.layout.width)}
        >
          {/* gradient pill — inset top/bottom so all 4 corners are fully rounded */}
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

const BAR_RADIUS = 26;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop: 8,
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
  },
  // Pill inset 5px top/bottom → all 4 corners are visibly rounded (capsule shape)
  pill: {
    position:     'absolute',
    top:          5,
    bottom:       5,
    borderRadius: 100,   // fully rounded capsule — no sharp edges
    overflow:     'hidden',
    zIndex:       0,
  },
  item: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: 6,
    zIndex:          1,
    overflow:        'hidden',   // clip long labels to tab slot width
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
    maxWidth:      '100%',
  },
  label: {
    fontSize:      10.5,
    color:         '#FFFFFF',
    letterSpacing: 0.1,
    flexShrink:    1,            // shrinks before clipping
  },
});
