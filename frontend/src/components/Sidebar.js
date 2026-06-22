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
    title: 'Navigate',
    items: [
      { key: 'home', label: 'Home', icon: 'home', color: '#1D9BF0' },
      { key: 'search', label: 'Search Workers', icon: 'search', color: '#8b5cf6' },
      { key: 'problems', label: 'Problems', icon: 'alert-circle', color: '#f59e0b' },
      { key: 'earnings', label: 'Wallet & Earnings', icon: 'wallet', color: '#10b981' },
      { key: 'profile', label: 'My Profile', icon: 'person-circle', color: '#ec4899' },
    ],
  },
  {
    title: 'Support',
    items: [
      { key: 'settings', label: 'Settings', icon: 'settings', color: '#6b7280' },
      { key: 'help', label: 'Help & Support', icon: 'help-circle', color: '#06b6d4' },
      { key: 'about', label: 'About NearHands', icon: 'information-circle', color: '#3b82f6' },
    ],
  },
];

function NavItem({ item, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[styles.navItem, { backgroundColor: colors.background + 'aa' }]}
      onPress={onPress}
      activeOpacity={0.65}
    >
      <View style={[styles.navIconBox, { backgroundColor: item.color + '1A' }]}>
        <Ionicons name={item.icon} size={18} color={item.color} />
      </View>
      <StyledText weight="500" style={[styles.navLabel, { color: colors.text }]}>
        {item.label}
      </StyledText>
      <Ionicons name="chevron-forward" size={13} color={colors.border} />
    </TouchableOpacity>
  );
}

export function Sidebar() {
  const { sidebarOpen, closeSidebar, showConfirm } = useApp();
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  // Slides in from RIGHT: starts off-screen (translateX = SIDEBAR_WIDTH), opens to 0
  const translateX = useSharedValue(SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(sidebarOpen ? 0 : SIDEBAR_WIDTH, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    overlayOpacity.value = withTiming(sidebarOpen ? 1 : 0, { duration: 300 });
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
        {/* Dark gradient header — always dark for contrast */}
        <LinearGradient
          colors={SIDEBAR_HEADER_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          {/* Top row: app logo + close button */}
          <View style={styles.headerTopRow}>
            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <StyledText weight="800" style={styles.logoLetter}>N</StyledText>
              </View>
              <StyledText weight="700" style={styles.appName}>NearHands</StyledText>
            </View>
            <TouchableOpacity onPress={closeSidebar} hitSlop={12} style={styles.closeBtn}>
              <View style={styles.closeBtnCircle}>
                <Ionicons name="close" size={15} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* User info card */}
          <View style={styles.userCard}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={26} color="#1D9BF0" />
            </View>
            <View style={{ flex: 1 }}>
              <StyledText weight="700" style={styles.userName}>Guest User</StyledText>
              <StyledText weight="400" style={styles.userSub}>Hyderabad, India</StyledText>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <StyledText weight="500" style={styles.verifiedText}>Verified</StyledText>
            </View>
          </View>
        </LinearGradient>

        {/* Scrollable body */}
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bodyContent}
        >
          {NAV_SECTIONS.map(section => (
            <View key={section.title} style={styles.section}>
              <StyledText weight="600" style={[styles.sectionLabel, { color: colors.subtext }]}>
                {section.title}
              </StyledText>
              {section.items.map(item => (
                <NavItem key={item.key} item={item} onPress={closeSidebar} colors={colors} />
              ))}
            </View>
          ))}

          {/* Appearance toggle */}
          <View style={styles.section}>
            <StyledText weight="600" style={[styles.sectionLabel, { color: colors.subtext }]}>
              Appearance
            </StyledText>
            <View style={[styles.toggleRow, { backgroundColor: colors.background + 'aa' }]}>
              <View style={[styles.navIconBox, { backgroundColor: isDark ? '#fef9c31A' : '#1f29371A' }]}>
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={18}
                  color={isDark ? '#fbbf24' : '#f59e0b'}
                />
              </View>
              <StyledText weight="500" style={[styles.navLabel, { color: colors.text }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </StyledText>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#d1d5db', true: '#1D9BF0' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </ScrollView>

        {/* Logout at bottom */}
        <TouchableOpacity
          style={[styles.logoutRow, { borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={[styles.navIconBox, { backgroundColor: '#ef44441A' }]}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          </View>
          <StyledText weight="600" style={styles.logoutText}>Log Out</StyledText>
          <Ionicons name="chevron-forward" size={13} color="#ef444460" />
        </TouchableOpacity>
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
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 24,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md + 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
  },
  appName: {
    color: '#fff',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  closeBtn: {
    padding: 2,
  },
  closeBtnCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 14,
  },
  userSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  verifiedText: {
    color: '#10b981',
    fontSize: 10,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.md,
  },
  section: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm + 2,
  },
  sectionLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.xs,
    marginLeft: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: 2,
  },
  navIconBox: {
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
