import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';

const USER_MENU = [
  { key: 'edit', label: 'Edit Profile', icon: 'create-outline' },
  { key: 'privacy', label: 'Privacy Settings', icon: 'shield-outline' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { key: 'language', label: 'Language', icon: 'language-outline', value: 'English' },
  { key: 'help', label: 'Help & Support', icon: 'help-circle-outline' },
  { key: 'about', label: 'About NearHands', icon: 'information-circle-outline' },
];

const WORKER_SKILLS = ['Electrician', 'Wiring', 'Panel Installation', 'Inverter Setup'];

const WORKER_STATS = [
  { label: 'Bookings', value: '38' },
  { label: 'Reviews', value: '24' },
  { label: 'Rating', value: '4.8' },
];

export function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { mode, showConfirm, showToast } = useApp();

  const handleDeleteAccount = () => {
    showConfirm(
      'Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      () => showToast('Account deletion requested', 'error'),
    );
  };

  const handleLogout = () => {
    showConfirm(
      'Log Out',
      'Are you sure you want to log out of NearHands?',
      () => showToast('Logged out', 'info'),
    );
  };

  return (
    <ScreenLayout title="Profile">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, SHADOW, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarLarge, { backgroundColor: '#1D9BF0' }]}>
            <StyledText weight="700" style={styles.avatarLargeText}>
              {mode === 'worker' ? 'R' : 'U'}
            </StyledText>
          </View>
          <StyledText weight="700" style={[styles.profileName, { color: colors.text }]}>
            {mode === 'worker' ? 'Raju Kumar' : 'User Account'}
          </StyledText>
          <StyledText weight="400" style={[styles.profileSub, { color: colors.subtext }]}>
            {mode === 'worker' ? 'Electrician • Hyderabad' : 'Hyderabad, Telangana'}
          </StyledText>

          {mode === 'worker' && (
            <View style={styles.statsRow}>
              {WORKER_STATS.map(s => (
                <View key={s.label} style={styles.statItem}>
                  <StyledText weight="700" style={[styles.statValue, { color: colors.text }]}>
                    {s.value}
                  </StyledText>
                  <StyledText weight="400" style={[styles.statLabel, { color: colors.subtext }]}>
                    {s.label}
                  </StyledText>
                </View>
              ))}
            </View>
          )}
        </View>

        {mode === 'worker' && (
          <>
            <View style={[styles.subscriptionBadge, { backgroundColor: '#fef9c3', borderColor: '#fde68a' }]}>
              <Ionicons name="star" size={16} color="#d97706" />
              <View style={{ flex: 1 }}>
                <StyledText weight="600" style={{ color: '#92400e', fontSize: 13 }}>Premium Listing</StyledText>
                <StyledText weight="400" style={{ color: '#b45309', fontSize: 11 }}>
                  Appears 3× higher in search results
                </StyledText>
              </View>
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => showToast('Upgrade flow coming soon', 'info')}
              >
                <StyledText weight="600" style={{ color: '#fff', fontSize: 11 }}>Upgrade</StyledText>
              </TouchableOpacity>
            </View>

            <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
              Skills
            </StyledText>
            <View style={styles.skillsRow}>
              {WORKER_SKILLS.map(skill => (
                <View key={skill} style={[styles.skillChip, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                  <StyledText weight="500" style={{ color: '#1e40af', fontSize: 12 }}>
                    {skill}
                  </StyledText>
                </View>
              ))}
            </View>
          </>
        )}

        <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
          Settings
        </StyledText>

        <View style={[styles.menuCard, SHADOW, { backgroundColor: colors.card }]}>
          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#1f2937' : '#f0f9ff' }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={17} color="#1D9BF0" />
            </View>
            <StyledText weight="500" style={[styles.menuLabel, { color: colors.text }]}>
              Dark Mode
            </StyledText>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#e5e7eb', true: '#1D9BF0' }}
              thumbColor="#fff"
            />
          </View>

          {USER_MENU.map((item, idx) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuItem,
                idx < USER_MENU.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
              ]}
              onPress={() => showToast(`${item.label} coming soon`, 'info')}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#1f2937' : '#f0f9ff' }]}>
                <Ionicons name={item.icon} size={17} color="#1D9BF0" />
              </View>
              <StyledText weight="500" style={[styles.menuLabel, { color: colors.text }]}>
                {item.label}
              </StyledText>
              {item.value ? (
                <StyledText weight="400" style={[styles.menuValue, { color: colors.subtext }]}>
                  {item.value}
                </StyledText>
              ) : (
                <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <StyledText weight="600" style={{ color: '#ef4444', fontSize: 14 }}>Log Out</StyledText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <StyledText weight="500" style={{ color: '#9ca3af', fontSize: 13 }}>
            Delete Account
          </StyledText>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  profileCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarLargeText: {
    color: '#fff',
    fontSize: 32,
  },
  profileName: {
    fontSize: 20,
  },
  profileSub: {
    fontSize: 13,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  upgradeBtn: {
    backgroundColor: '#d97706',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.full,
  },
  sectionTitle: {
    fontSize: 15,
    marginBottom: SPACING.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  skillChip: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  menuCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIconBg: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
  },
  menuValue: {
    fontSize: 13,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
  },
  deleteBtn: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
});
