import React, { useEffect } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Pressable,
  Switch, ScrollView, Dimensions, Platform,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/layout';

const { width: SW } = Dimensions.get('window');
const DRAWER_WIDTH = SW * 0.85;

/* ── nav sections mirroring CampuSphere layout ─── */
const SECTIONS = [
  {
    title: 'Main',
    items: [
      { key: 'home',     label: 'Home',              sub: 'Dashboard overview',  icon: 'home-variant',    lib: 'MCI',  gradient: ['#1D9BF0', '#264B96'] },
      { key: 'search',   label: 'Search Workers',    sub: 'Find nearby talent',  icon: 'account-search',  lib: 'MCI',  gradient: ['#8b5cf6', '#7c3aed'] },
      { key: 'problems', label: 'Problems',          sub: 'Reports & issues',    icon: 'bell-badge',      lib: 'MCI',  gradient: ['#f59e0b', '#d97706'] },
      { key: 'earnings', label: 'Wallet & Earnings', sub: 'Transactions & funds', icon: 'wallet',          lib: 'MCI',  gradient: ['#10b981', '#059669'] },
      { key: 'profile',  label: 'My Profile',        sub: 'Account & settings',  icon: 'account-circle',  lib: 'MCI',  gradient: ['#ec4899', '#d946ef'] },
    ],
  },
  {
    title: 'Support',
    items: [
      { key: 'settings', label: 'App Settings',    sub: 'Preferences',         icon: 'cog',             lib: 'MCI',  gradient: ['#64748b', '#475569'] },
      { key: 'help',     label: 'Help & Support',  sub: 'FAQs & contact',      icon: 'help-circle',     lib: 'MCI',  gradient: ['#06b6d4', '#0891b2'] },
      { key: 'about',    label: 'About NearHands', sub: 'Version & info',      icon: 'information',     lib: 'MCI',  gradient: ['#3b82f6', '#2563eb'] },
    ],
  },
];

function NavItem({ item, onPress, colors }) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <LinearGradient colors={item.gradient} style={styles.iconBox}>
        <MaterialCommunityIcons name={item.icon} size={18} color="#fff" />
      </LinearGradient>
      <View style={styles.itemText}>
        <StyledText weight="600" style={[styles.itemTitle, { color: colors.text }]}>
          {item.label}
        </StyledText>
        <StyledText weight="400" style={[styles.itemSub, { color: colors.subtext }]}>
          {item.sub}
        </StyledText>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
    </TouchableOpacity>
  );
}

export function Sidebar() {
  const { sidebarOpen, closeSidebar, showConfirm, mode } = useApp();
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

  const drawerStyle  = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOp.value }));

  const handleLogout = () => {
    closeSidebar();
    showConfirm('Log Out', 'Are you sure you want to log out of NearHands?', () => {});
  };

  return (
    <>
      {/* backdrop */}
      <Animated.View
        style={[styles.overlay, overlayStyle]}
        pointerEvents={sidebarOpen ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar} />
      </Animated.View>

      {/* drawer */}
      <Animated.View style={[styles.drawer, { backgroundColor: colors.background }, drawerStyle]}>

        {/* ── gradient header: icon+title left, close right ── */}
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

          {/* stats chips */}
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

        {/* ── scrollable nav body ── */}
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
                  <NavItem key={item.key} item={item} onPress={closeSidebar} colors={colors} />
                ))}
              </View>
            </View>
          ))}

          {/* Appearance section */}
          <View style={styles.section}>
            <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
              Appearance
            </StyledText>
            <View style={styles.itemsGroup}>
              <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <LinearGradient
                  colors={isDark ? ['#fbbf24', '#d97706'] : ['#6366f1', '#4f46e5']}
                  style={styles.iconBox}
                >
                  <MaterialCommunityIcons
                    name={isDark ? 'weather-night' : 'white-balance-sunny'}
                    size={18}
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
                />
              </View>
            </View>
          </View>

          {/* Logout button — full-width gradient like CampuSphere */}
          <TouchableOpacity
            style={[styles.logoutWrap, Platform.select({ ios: styles.shadowIOS, android: styles.shadowAndroid })]}
            onPress={handleLogout}
            activeOpacity={0.88}
          >
            <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.logoutGradient}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
              <StyledText weight="700" style={styles.logoutText}>Log Out</StyledText>
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <StyledText weight="400" style={[styles.footerText, { color: colors.subtext }]}>
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

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  drawer: {
    position:  'absolute',
    top:       0,
    right:     0,
    bottom:    0,
    width:     DRAWER_WIDTH,
    zIndex:    101,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 20 },
      android: { elevation: 20 },
    }),
    overflow: 'hidden',
  },

  /* header */
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  headerRow: {
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'space-between',
    marginBottom:  SPACING.md,
  },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  avatarCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  headerText:  { flex: 1 },
  userName:    { color: '#fff', fontSize: 16 },
  userSub:     { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },
  closeBtn:    {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  statsRow:    { flexDirection: 'row', gap: 8 },
  chip:        {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.md, paddingVertical: 8, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
  },
  chipVal:     { color: '#fff', fontSize: 14 },
  chipLabel:   { color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 1 },

  /* body */
  body:        { flex: 1 },
  bodyContent: { paddingBottom: SPACING.md },
  section:     { marginTop: SPACING.md, paddingHorizontal: SPACING.md },
  sectionTitle:{ fontSize: 16, marginBottom: SPACING.xs + 2 },
  itemsGroup:  { gap: 8 },

  /* nav item */
  item: {
    flexDirection: 'row',
    alignItems:    'center',
    borderRadius:  RADIUS.lg,
    borderWidth:   1,
    padding:       14,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  iconBox: {
    width: 42, height: 42, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  itemText:    { flex: 1, marginRight: 8 },
  itemTitle:   { fontSize: 14 },
  itemSub:     { fontSize: 11, marginTop: 1, opacity: 0.7 },

  /* logout */
  logoutWrap:  { marginHorizontal: SPACING.md, marginTop: SPACING.lg, borderRadius: RADIUS.lg, overflow: 'hidden' },
  shadowIOS:   { shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
  shadowAndroid: { elevation: 4 },
  logoutGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, paddingHorizontal: 20, gap: 8,
  },
  logoutText:  { fontSize: 15, color: '#fff' },

  /* footer */
  footer:      { alignItems: 'center', paddingTop: SPACING.md },
  footerText:  { fontSize: 12 },
  footerCopy:  { fontSize: 11, opacity: 0.5, marginTop: 2 },
});
