import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Pressable, Switch, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import { SIDEBAR_HEADER_GRADIENT } from '../constants/colors';
import { SPACING, RADIUS, SIDEBAR_WIDTH } from '../constants/layout';

const NAV_SECTIONS = [
  {
    key: 'nav',
    items: [
      { key: 'home',     label: 'Home',              icon: 'home',               color: '#1CB5E0' },
      { key: 'search',   label: 'Search Workers',    icon: 'search',             color: '#8b5cf6' },
      { key: 'problems', label: 'Problems',          icon: 'alert-circle',       color: '#f59e0b' },
      { key: 'earnings', label: 'Wallet & Earnings', icon: 'wallet',             color: '#10b981' },
      { key: 'profile',  label: 'My Profile',        icon: 'person-circle',      color: '#ec4899' },
    ],
  },
  {
    key: 'more',
    items: [
      { key: 'settings', label: 'Settings',        icon: 'settings',          color: '#64748b' },
      { key: 'help',     label: 'Help & Support',  icon: 'help-circle',       color: '#06b6d4' },
      { key: 'about',    label: 'About NearHands', icon: 'information-circle', color: '#3b82f6' },
    ],
  },
];

function NavItem({ item, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[styles.navItem, { backgroundColor: colors.inputBg }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={18} color={item.color} />
      </View>
      <StyledText weight="500" style={[styles.navLabel, { color: colors.text }]}>
        {item.label}
      </StyledText>
      <Ionicons name="chevron-forward" size={12} color={colors.border} />
    </TouchableOpacity>
  );
}

export function Sidebar() {
  const { sidebarOpen, closeSidebar, showConfirm } = useApp();
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const translateX = useSharedValue(SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(sidebarOpen ? 0 : SIDEBAR_WIDTH, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
    overlayOpacity.value = withTiming(sidebarOpen ? 1 : 0, { duration: 200 });
  }, [sidebarOpen]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

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

      <Animated.View style={[styles.drawer, { backgroundColor: colors.card }, drawerStyle]}>

        {/* ── Header: user info only, no app logo ─────────── */}
        <LinearGradient
          colors={SIDEBAR_HEADER_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 18 }]}
        >
          {/* Close button row */}
          <TouchableOpacity
            onPress={closeSidebar}
            hitSlop={14}
            style={styles.closeBtn}
          >
            <View style={styles.closeBtnCircle}>
              <Ionicons name="close" size={14} color="rgba(255,255,255,0.9)" />
            </View>
          </TouchableOpacity>

          {/* User card */}
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color="#1CB5E0" />
            </View>
            <View style={{ flex: 1 }}>
              <StyledText weight="700" style={styles.userName}>Guest User</StyledText>
              <StyledText weight="400" style={styles.userSub}>Hyderabad, India</StyledText>
            </View>
          </View>

          {/* Quick stats row */}
          <View style={styles.statsRow}>
            {[
              { label: 'Wallet', value: '₹280' },
              { label: 'Reveals', value: '28' },
              { label: 'Rating', value: '4.8 ★' },
            ].map(s => (
              <View key={s.label} style={styles.statChip}>
                <StyledText weight="700" style={styles.statValue}>{s.value}</StyledText>
                <StyledText weight="400" style={styles.statLabel}>{s.label}</StyledText>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── Nav body ─────────────────────────────────────── */}
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bodyContent}
        >
          {NAV_SECTIONS.map((section, si) => (
            <View key={section.key} style={si > 0 && styles.sectionGap}>
              {section.items.map(item => (
                <NavItem key={item.key} item={item} onPress={closeSidebar} colors={colors} />
              ))}
            </View>
          ))}

          {/* Dark / Light mode toggle */}
          <View style={[styles.sectionGap, styles.toggleWrap, { backgroundColor: colors.inputBg }]}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#fbbf2420' : '#f59e0b20' }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={isDark ? '#fbbf24' : '#f59e0b'} />
            </View>
            <StyledText weight="500" style={[styles.navLabel, { color: colors.text }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </StyledText>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d1d5db', true: '#1CB5E0' }}
              thumbColor="#ffffff"
            />
          </View>
        </ScrollView>

        {/* ── Logout ───────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.logoutRow, { borderTopColor: colors.border, paddingBottom: insets.bottom + 10 }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#ef444420' }]}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          </View>
          <StyledText weight="600" style={styles.logoutText}>Log Out</StyledText>
        </TouchableOpacity>

      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 24,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md + 4,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  closeBtnCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 15,
  },
  userSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    paddingVertical: 7,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statValue: {
    color: '#fff',
    fontSize: 13,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    marginTop: 1,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    gap: 4,
  },
  sectionGap: {
    marginTop: SPACING.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    marginBottom: 3,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLabel: {
    flex: 1,
    fontSize: 13,
  },
  toggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SPACING.md + 4,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  logoutText: {
    flex: 1,
    fontSize: 14,
    color: '#ef4444',
  },
});
