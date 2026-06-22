import React, { useEffect } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Pressable,
  Switch, ScrollView, Dimensions, Platform, BackHandler,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/layout';

const { width: SW } = Dimensions.get('window');
const DRAWER_WIDTH = SW * 0.78;

/* ── only non-tab items live in the sidebar ─────────────────── */
const SECTIONS = [
  {
    title: 'Features',      // problems + earnings (open as modal pages)
    items: [
      {
        key: 'problems',
        label: 'Problems',
        sub: 'Reports & issues',
        icon: 'bell-badge',
        gradient: ['#f59e0b', '#d97706'],
        page: 'problems',
      },
      {
        key: 'earnings',
        label: 'Wallet & Earnings',
        sub: 'Transactions & balance',
        icon: 'wallet',
        gradient: ['#10b981', '#059669'],
        page: 'earnings',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        key: 'settings',
        label: 'App Settings',
        sub: 'Preferences',
        icon: 'cog',
        gradient: ['#64748b', '#475569'],
        page: 'settings',
      },
      {
        key: 'help',
        label: 'Help & Support',
        sub: 'FAQs & contact',
        icon: 'help-circle',
        gradient: ['#06b6d4', '#0891b2'],
        page: 'help',
      },
      {
        key: 'about',
        label: 'About NearHands',
        sub: 'Version & info',
        icon: 'information',
        gradient: ['#3b82f6', '#2563eb'],
        page: 'about',
      },
    ],
  },
];

/* ── nav item: icon fills full height, left rounded, right sharp ── */
function NavItem({ item, onPress, colors }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      {/* gradient block flush-left, full-height, left-rounded, right-sharp */}
      <LinearGradient colors={item.gradient} style={styles.iconBlock}>
        <MaterialCommunityIcons name={item.icon} size={22} color="#fff" />
      </LinearGradient>

      <View style={styles.itemText}>
        <StyledText weight="600" style={[styles.itemTitle, { color: colors.text }]}>
          {item.label}
        </StyledText>
        <StyledText weight="400" style={[styles.itemSub, { color: colors.subtext }]}>
          {item.sub}
        </StyledText>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.subtext} style={styles.chevron} />
    </TouchableOpacity>
  );
}

export function Sidebar() {
  const { sidebarOpen, closeSidebar, showConfirm, mode, openMenuPage } = useApp();
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const translateX = useSharedValue(DRAWER_WIDTH);
  const overlayOp  = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(sidebarOpen ? 0 : DRAWER_WIDTH, {
      duration: 220, easing: Easing.out(Easing.quad),
    });
    overlayOp.value = withTiming(sidebarOpen ? 1 : 0, { duration: 220 });
  }, [sidebarOpen]);

  // Android hardware back button closes sidebar
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sidebarOpen) { closeSidebar(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [sidebarOpen]);

  const drawerStyle  = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOp.value }));

  const handleLogout = () => {
    closeSidebar();
    showConfirm('Log Out', 'Are you sure you want to log out of NearHands?', () => {});
  };

  return (
    <>
      <Animated.View
        style={[styles.overlay, overlayStyle]}
        pointerEvents={sidebarOpen ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar} />
      </Animated.View>

      <Animated.View style={[styles.drawer, { backgroundColor: colors.background }, drawerStyle]}>

        {/* gradient header */}
        <LinearGradient
          colors={GRADIENT}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={[styles.header, { paddingTop: insets.top + 18 }]}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={28} color="#1D9BF0" />
              </View>
              <View style={styles.headerText}>
                <StyledText weight="700" style={styles.userName}>Guest User</StyledText>
                <StyledText weight="400" style={styles.userSub}>
                  {mode === 'worker' ? 'Worker Account' : 'Hyderabad, India'}
                </StyledText>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeSidebar} hitSlop={12}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {[
              { label: 'Wallet', value: '₹280' },
              { label: 'Reveals', value: '28' },
              { label: 'Rating', value: '4.8★' },
            ].map(s => (
              <View key={s.label} style={styles.chip}>
                <StyledText weight="700" style={styles.chipVal}>{s.value}</StyledText>
                <StyledText weight="400" style={styles.chipLabel}>{s.label}</StyledText>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* scrollable body */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {SECTIONS.map(section => (
            <View key={section.title} style={styles.section}>
              <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </StyledText>
              <View style={styles.itemsGroup}>
                {section.items.map(item => (
                  <NavItem
                    key={item.key}
                    item={item}
                    colors={colors}
                    onPress={() => openMenuPage(item.page)}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Appearance toggle */}
          <View style={styles.section}>
            <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
              Appearance
            </StyledText>
            <View style={styles.itemsGroup}>
              <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <LinearGradient
                  colors={isDark ? ['#fbbf24', '#d97706'] : ['#6366f1', '#4f46e5']}
                  style={styles.iconBlock}
                >
                  <MaterialCommunityIcons
                    name={isDark ? 'weather-night' : 'white-balance-sunny'}
                    size={22}
                    color="#fff"
                  />
                </LinearGradient>
                <View style={styles.itemText}>
                  <StyledText weight="600" style={[styles.itemTitle, { color: colors.text }]}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </StyledText>
                  <StyledText weight="400" style={[styles.itemSub, { color: colors.subtext }]}>
                    Toggle appearance
                  </StyledText>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#d1d5db', true: '#1D9BF0' }}
                  thumbColor="#fff"
                  style={styles.chevron}
                />
              </View>
            </View>
          </View>

          {/* Full-width gradient logout */}
          <TouchableOpacity
            style={[styles.logoutWrap, Platform.select({
              ios: { shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
              android: { elevation: 4 },
            })]}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.logoutGrad}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
              <StyledText weight="700" style={styles.logoutText}>Log Out</StyledText>
            </LinearGradient>
          </TouchableOpacity>

          {/* footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <StyledText weight="400" style={[styles.footerLine, { color: colors.subtext }]}>
              NearHands v1.0.0
            </StyledText>
            <StyledText weight="400" style={[styles.footerCopy, { color: colors.subtext }]}>
              © 2026 Bluri Developers
            </StyledText>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const ITEM_RADIUS = 14;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 101,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 20 },
      android: { elevation: 20 },
    }),
    overflow: 'hidden',
  },

  /* ── header ── */
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: SPACING.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  avatarCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
  },
  headerText: { flex: 1 },
  userName:  { color: '#fff', fontSize: 16 },
  userSub:   { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },
  closeBtn: {
    width: 42, height: 42,
    borderRadius: 21,                          // full circle
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.md, paddingVertical: 8, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
  },
  chipVal:   { color: '#fff', fontSize: 14 },
  chipLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 1 },

  /* ── body ── */
  body:        { flex: 1 },
  bodyContent: { paddingBottom: SPACING.md },
  section:     { marginTop: SPACING.md, paddingHorizontal: SPACING.md },
  sectionTitle:{ fontSize: 15, marginBottom: 8 },
  itemsGroup:  { gap: 10 },

  /* ── nav item ── */
  item: {
    flexDirection:  'row',
    alignItems:     'stretch',   // icon block fills full height
    borderRadius:   ITEM_RADIUS,
    borderWidth:    1,
    overflow:       'hidden',    // clips icon block's left corners to ITEM_RADIUS, right stays square
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  iconBlock: {
    width:          58,
    justifyContent: 'center',
    alignItems:     'center',
    // NO borderRadius — parent overflow:hidden clips left corners naturally
  },
  itemText: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical:   9,        // reduced from 13 → compact rows
    justifyContent:    'center',
  },
  itemTitle: { fontSize: 13.5 },
  itemSub:   { fontSize: 11, marginTop: 1, opacity: 0.7 },
  chevron:   { marginRight: 12, alignSelf: 'center' }, // vertically centered

  /* ── logout ── */
  logoutWrap: {
    marginHorizontal: SPACING.md,
    marginTop:        SPACING.lg,
    borderRadius:     ITEM_RADIUS,
    overflow:         'hidden',
  },
  logoutGrad: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: 15,
    gap:             8,
  },
  logoutText: { fontSize: 15, color: '#fff' },

  /* ── footer ── */
  footer:     { alignItems: 'center', paddingTop: SPACING.md },
  footerLine: { fontSize: 12 },
  footerCopy: { fontSize: 11, opacity: 0.5, marginTop: 2 },
});
