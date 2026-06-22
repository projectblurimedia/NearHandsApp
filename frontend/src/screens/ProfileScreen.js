import React from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity,
  Switch, RefreshControl, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { useRefresh } from '../hooks/useRefresh';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';

const { width: SW } = Dimensions.get('window');

const WORKER_SKILLS = ['Electrician', 'Wiring', 'Panel Install', 'Inverter Setup'];

const AVATAR_GRADIENTS = [
  ['#4158D0', '#C850C0'],
  ['#1D9BF0', '#264B96'],
  ['#11998e', '#38ef7d'],
  ['#FF416C', '#FF4B2B'],
];

/* ─── reusable section card ───────────────────────────────── */
function SectionCard({ iconName, iconColor, iconBg, title, children, colors }) {
  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconBox, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
        </View>
        <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </StyledText>
      </View>
      {children}
    </View>
  );
}

/* ─── 2-column detail card ────────────────────────────────── */
function DetailCard({ icon, iconColor, iconBg, label, value, fullWidth, colors }) {
  return (
    <View
      style={[
        styles.detailCard,
        fullWidth && styles.fullWidthCard,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <View style={[styles.detailIconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <StyledText weight="500" style={[styles.detailLabel, { color: colors.subtext }]}>
          {label}
        </StyledText>
        <StyledText weight="600" style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
          {value || '—'}
        </StyledText>
      </View>
    </View>
  );
}

/* ─── settings menu row ───────────────────────────────────── */
function MenuRow({ icon, iconColor, iconBg, label, right, onPress, colors, last }) {
  return (
    <TouchableOpacity
      style={[
        styles.menuRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={17} color={iconColor} />
      </View>
      <StyledText weight="500" style={[styles.menuLabel, { color: colors.text }]}>{label}</StyledText>
      {right ?? <Ionicons name="chevron-forward" size={15} color={colors.subtext} />}
    </TouchableOpacity>
  );
}

/* ─── main screen ─────────────────────────────────────────── */
export function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { mode, showConfirm, showToast } = useApp();
  const { refreshing, onRefresh } = useRefresh();

  const initials = mode === 'worker' ? 'RK' : 'GU';
  const gradientColors = AVATAR_GRADIENTS[1];

  const handleLogout = () =>
    showConfirm('Log Out', 'Are you sure you want to log out of NearHands?',
      () => showToast('Logged out', 'info'));

  const handleDelete = () =>
    showConfirm('Delete Account',
      'This permanently deletes your account and all data. Cannot be undone.',
      () => showToast('Account deletion requested', 'error'));

  return (
    <ScreenLayout title="Profile">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
            tintColor="#1D9BF0" colors={['#1D9BF0', '#264B96']} progressBackgroundColor="#fff" />
        }
      >
        {/* ── profile card ── */}
        <View style={[styles.profileCard, SHADOW, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LinearGradient colors={gradientColors} start={GRADIENT_START} end={GRADIENT_END} style={styles.avatar}>
            <StyledText weight="800" style={styles.avatarText}>{initials}</StyledText>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <StyledText weight="700" style={[styles.profileName, { color: colors.text }]}>
              {mode === 'worker' ? 'Raju Kumar' : 'Guest User'}
            </StyledText>
            <View style={styles.badgeRow}>
              <View style={[styles.roleBadge, { backgroundColor: '#1D9BF015' }]}>
                <Ionicons name="briefcase-outline" size={12} color="#1D9BF0" />
                <StyledText weight="600" style={[styles.badgeText, { color: '#1D9BF0' }]}>
                  {mode === 'worker' ? 'Electrician' : 'User'}
                </StyledText>
              </View>
              <View style={[styles.activeBadge, { backgroundColor: '#10b98120' }]}>
                <View style={styles.activeDot} />
                <StyledText weight="600" style={[styles.badgeText, { color: '#10b981' }]}>Active</StyledText>
              </View>
            </View>
            <StyledText weight="400" style={[styles.profileLocation, { color: colors.subtext }]}>
              Hyderabad, India
            </StyledText>
          </View>
        </View>

        {/* ── stats grid ── */}
        <SectionCard
          iconName="chart-bar"
          iconColor="#8b5cf6"
          iconBg="#8b5cf610"
          title={mode === 'worker' ? 'Work Stats' : 'Account Stats'}
          colors={colors}
        >
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <DetailCard icon="wallet-outline"   iconColor="#10b981" iconBg="#10b98110" label="Wallet"   value="₹280"   colors={colors} />
              <DetailCard icon="eye-outline"       iconColor="#1D9BF0" iconBg="#1D9BF010" label="Reveals"  value="28"     colors={colors} />
            </View>
            <View style={styles.detailRow}>
              <DetailCard icon="star-outline"      iconColor="#f59e0b" iconBg="#f59e0b10" label="Rating"   value="4.8★"   colors={colors} />
              <DetailCard icon="calendar-outline"  iconColor="#ec4899" iconBg="#ec489910" label="Member"   value="Jun 2026" colors={colors} />
            </View>
            {mode === 'worker' && (
              <View style={styles.detailRow}>
                <DetailCard icon="checkmark-circle-outline" iconColor="#10b981" iconBg="#10b98110" label="Bookings" value="38" colors={colors} />
                <DetailCard icon="people-outline"            iconColor="#8b5cf6" iconBg="#8b5cf610" label="Reviews"  value="24" colors={colors} />
              </View>
            )}
          </View>
        </SectionCard>

        {/* ── worker skills ── */}
        {mode === 'worker' && (
          <SectionCard
            iconName="hammer-wrench"
            iconColor="#f59e0b"
            iconBg="#f59e0b10"
            title="Skills"
            colors={colors}
          >
            <View style={styles.skillsWrap}>
              {WORKER_SKILLS.map(s => (
                <View key={s} style={[styles.skillChip, { backgroundColor: '#1D9BF015', borderColor: '#bfdbfe' }]}>
                  <StyledText weight="500" style={{ color: '#1e40af', fontSize: 12 }}>{s}</StyledText>
                </View>
              ))}
            </View>
          </SectionCard>
        )}

        {/* ── contact details ── */}
        <SectionCard
          iconName="card-account-details"
          iconColor="#2196F3"
          iconBg="#2196F310"
          title="Contact"
          colors={colors}
        >
          <View style={styles.detailsGrid}>
            <DetailCard icon="call-outline"     iconColor="#2196F3" iconBg="#2196F310" label="Phone"    value="+91 9876543210" colors={colors} fullWidth />
            <DetailCard icon="mail-outline"     iconColor="#f59e0b" iconBg="#f59e0b10" label="Email"    value="user@nearhand.in" colors={colors} fullWidth />
            <DetailCard icon="location-outline" iconColor="#10b981" iconBg="#10b98110" label="Location" value="Hyderabad, Telangana" colors={colors} fullWidth />
          </View>
        </SectionCard>

        {/* ── settings ── */}
        <SectionCard
          iconName="cog-outline"
          iconColor="#64748b"
          iconBg="#64748b10"
          title="Settings"
          colors={colors}
        >
          <View style={[styles.menuGroup, { borderColor: colors.border }]}>
            <MenuRow icon="create-outline"       iconColor="#1D9BF0" iconBg="#1D9BF015" label="Edit Profile"       onPress={() => showToast('Coming soon', 'info')} colors={colors} />
            <MenuRow icon="shield-outline"       iconColor="#8b5cf6" iconBg="#8b5cf615" label="Privacy Settings"   onPress={() => showToast('Coming soon', 'info')} colors={colors} />
            <MenuRow icon="notifications-outline" iconColor="#f59e0b" iconBg="#f59e0b15" label="Notifications"     onPress={() => showToast('Coming soon', 'info')} colors={colors} />
            <MenuRow icon="language-outline"     iconColor="#10b981" iconBg="#10b98115" label="Language"           onPress={() => showToast('Coming soon', 'info')} colors={colors} />
            <MenuRow icon="help-circle-outline"  iconColor="#06b6d4" iconBg="#06b6d415" label="Help & Support"     onPress={() => showToast('Coming soon', 'info')} colors={colors} last />
          </View>
        </SectionCard>

        {/* ── appearance ── */}
        <SectionCard
          iconName={isDark ? 'weather-night' : 'white-balance-sunny'}
          iconColor={isDark ? '#fbbf24' : '#f59e0b'}
          iconBg={isDark ? '#fbbf2415' : '#f59e0b15'}
          title="Appearance"
          colors={colors}
        >
          <View style={[styles.menuGroup, { borderColor: colors.border }]}>
            <MenuRow
              icon={isDark ? 'moon-outline' : 'sunny-outline'}
              iconColor={isDark ? '#6366f1' : '#f59e0b'}
              iconBg={isDark ? '#6366f115' : '#f59e0b15'}
              label={isDark ? 'Dark Mode' : 'Light Mode'}
              onPress={toggleTheme}
              colors={colors}
              last
              right={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#d1d5db', true: '#1D9BF0' }}
                  thumbColor="#fff"
                />
              }
            />
          </View>
        </SectionCard>

        {/* ── logout ── */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <StyledText weight="600" style={{ color: '#ef4444', fontSize: 14 }}>Log Out</StyledText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <StyledText weight="400" style={{ color: colors.subtext, fontSize: 12 }}>Delete Account</StyledText>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding:       SPACING.md,
    paddingBottom: SPACING.xl,
    gap:           SPACING.md,
  },

  /* profile card */
  profileCard: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            14,
    borderRadius:   20,
    padding:        16,
    borderWidth:    1.5,
  },
  avatar: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  avatarText:      { color: '#fff', fontSize: 26 },
  profileInfo:     { flex: 1, gap: 4 },
  profileName:     { fontSize: 18 },
  badgeRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  roleBadge:       { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  activeBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  activeDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  badgeText:       { fontSize: 11 },
  profileLocation: { fontSize: 12, marginTop: 1 },

  /* section card */
  sectionCard: {
    borderRadius: 16,
    padding:      14,
    borderWidth:  1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
    marginBottom:  12,
  },
  sectionIconBox: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, letterSpacing: 0.2 },

  /* detail grid */
  detailsGrid: { gap: 8 },
  detailRow:   { flexDirection: 'row', gap: 8 },
  detailCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    gap: 8, padding: 10, borderRadius: 12, borderWidth: 1,
  },
  fullWidthCard: { flex: undefined, width: '100%' },
  detailIconBox: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  detailLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3 },
  detailValue: { fontSize: 13, marginTop: 1 },

  /* skills */
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip:  { paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full, borderWidth: 1.5 },

  /* settings menu */
  menuGroup: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 11, gap: 12,
  },
  menuIconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  menuLabel:   { flex: 1, fontSize: 13.5 },

  /* logout */
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, padding: 13, borderRadius: RADIUS.lg, borderWidth: 1.5,
  },
  deleteBtn: { alignItems: 'center', padding: SPACING.sm },
});
