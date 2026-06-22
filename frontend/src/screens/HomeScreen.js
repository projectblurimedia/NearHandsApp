import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { useRefresh } from '../hooks/useRefresh';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';

const CATEGORIES = [
  { key: 'electrician', label: 'Electrician', icon: 'flash' },
  { key: 'plumber', label: 'Plumber', icon: 'water' },
  { key: 'carpenter', label: 'Carpenter', icon: 'hammer' },
  { key: 'painter', label: 'Painter', icon: 'color-palette' },
  { key: 'cleaner', label: 'Cleaner', icon: 'sparkles' },
  { key: 'ac_repair', label: 'AC Repair', icon: 'snow' },
  { key: 'driver', label: 'Driver', icon: 'car' },
  { key: 'mason', label: 'Mason', icon: 'construct' },
];

const MOCK_WORKERS = [
  {
    id: '1',
    name: 'Raju Kumar',
    skill: 'Electrician',
    rating: 4.8,
    reviews: 124,
    location: 'Hyderabad, 2.3 km',
    experience: '5 yrs',
    revealed: false,
  },
  {
    id: '2',
    name: 'Suresh Babu',
    skill: 'Plumber',
    rating: 4.6,
    reviews: 89,
    location: 'Secunderabad, 3.1 km',
    experience: '7 yrs',
    revealed: false,
  },
  {
    id: '3',
    name: 'Mohan Lal',
    skill: 'Carpenter',
    rating: 4.9,
    reviews: 201,
    location: 'Kukatpally, 1.8 km',
    experience: '12 yrs',
    revealed: false,
  },
  {
    id: '4',
    name: 'Venkat Rao',
    skill: 'Painter',
    rating: 4.5,
    reviews: 67,
    location: 'KPHB, 4.2 km',
    experience: '4 yrs',
    revealed: false,
  },
];

const WORKER_STATS = [
  { label: 'Bookings', value: '38', icon: 'calendar', color: '#1D9BF0' },
  { label: 'Earnings', value: '₹12.4K', icon: 'wallet', color: '#10b981' },
  { label: 'Rating', value: '4.8', icon: 'star', color: '#f59e0b' },
];

const ACTIVITY_FEED = [
  { id: '1', action: 'Profile viewed', time: '5 min ago', icon: 'eye-outline' },
  { id: '2', action: 'Contact revealed', time: '1 hr ago', icon: 'call-outline' },
  { id: '3', action: 'New review received', time: '2 hrs ago', icon: 'star-outline' },
  { id: '4', action: 'Profile viewed', time: '4 hrs ago', icon: 'eye-outline' },
];

export function HomeScreen() {
  const { colors } = useTheme();
  const { mode, showToast, showConfirm } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [workerActive, setWorkerActive] = useState(true);
  const { refreshing, onRefresh } = useRefresh();

  const handleReveal = (workerId) => {
    showConfirm(
      'Reveal Contact',
      'Pay ₹10 to unlock this worker\'s WhatsApp & phone number. Proceed?',
      () => {
        setWorkers(prev =>
          prev.map(w => (w.id === workerId ? { ...w, revealed: true } : w))
        );
        showToast('Contact revealed! Check WhatsApp.', 'success');
      },
    );
  };

  if (mode === 'worker') {
    return (
      <ScreenLayout title="NearHands">
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1D9BF0"
              colors={['#1D9BF0', '#264B96']}
              progressBackgroundColor="#fff"
            />
          }
        >
          <TouchableOpacity
            style={[
              styles.activeBanner,
              { backgroundColor: workerActive ? '#dcfce7' : colors.card, borderColor: workerActive ? '#10b981' : colors.border },
            ]}
            onPress={() => setWorkerActive(p => !p)}
            activeOpacity={0.8}
          >
            <View style={[styles.activeDot, { backgroundColor: workerActive ? '#10b981' : '#9ca3af' }]} />
            <StyledText weight="600" style={{ color: workerActive ? '#15803d' : colors.subtext, fontSize: 14 }}>
              {workerActive ? 'You are Active — Visible to clients' : 'You are Inactive — Hidden from clients'}
            </StyledText>
            <Ionicons
              name={workerActive ? 'toggle' : 'toggle-outline'}
              size={28}
              color={workerActive ? '#10b981' : '#9ca3af'}
            />
          </TouchableOpacity>

          <View style={styles.statsRow}>
            {WORKER_STATS.map(s => (
              <View key={s.label} style={[styles.statCard, SHADOW, { backgroundColor: colors.card }]}>
                <View style={[styles.statIcon, { backgroundColor: s.color + '20' }]}>
                  <Ionicons name={s.icon} size={20} color={s.color} />
                </View>
                <StyledText weight="700" style={[styles.statValue, { color: colors.text }]}>{s.value}</StyledText>
                <StyledText weight="400" style={[styles.statLabel, { color: colors.subtext }]}>{s.label}</StyledText>
              </View>
            ))}
          </View>

          <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </StyledText>
          {ACTIVITY_FEED.map(item => (
            <View key={item.id} style={[styles.activityItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.activityIcon, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name={item.icon} size={16} color="#1D9BF0" />
              </View>
              <View style={{ flex: 1 }}>
                <StyledText weight="500" style={[styles.activityAction, { color: colors.text }]}>
                  {item.action}
                </StyledText>
                <StyledText weight="400" style={[styles.activityTime, { color: colors.subtext }]}>
                  {item.time}
                </StyledText>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="NearHands">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StyledText weight="700" style={[styles.greeting, { color: colors.text }]}>
          Find Skilled Workers Near You
        </StyledText>
        <StyledText weight="400" style={[styles.subtitle, { color: colors.subtext }]}>
          Trusted blue-collar professionals in your area
        </StyledText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    selectedCategory === cat.key ? '#1D9BF0' : colors.card,
                  borderColor:
                    selectedCategory === cat.key ? '#1D9BF0' : colors.border,
                },
                SHADOW,
              ]}
              onPress={() =>
                setSelectedCategory(prev => (prev === cat.key ? null : cat.key))
              }
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={selectedCategory === cat.key ? '#fff' : '#1D9BF0'}
              />
              <StyledText
                weight="500"
                style={[
                  styles.chipLabel,
                  { color: selectedCategory === cat.key ? '#fff' : colors.text },
                ]}
              >
                {cat.label}
              </StyledText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
          Workers Near You
        </StyledText>

        {workers.map(worker => (
          <View key={worker.id} style={[styles.workerCard, SHADOW, { backgroundColor: colors.card }]}>
            <View style={styles.workerHeader}>
              <View style={styles.avatarCircle}>
                <StyledText weight="700" style={styles.avatarInitial}>
                  {worker.name[0]}
                </StyledText>
              </View>
              <View style={{ flex: 1 }}>
                <StyledText weight="600" style={[styles.workerName, { color: colors.text }]}>
                  {worker.name}
                </StyledText>
                <StyledText weight="400" style={[styles.workerSkill, { color: colors.subtext }]}>
                  {worker.skill} • {worker.experience}
                </StyledText>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <StyledText weight="600" style={styles.ratingText}>{worker.rating}</StyledText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.workerFooter}>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color={colors.subtext} />
                <StyledText weight="400" style={[styles.locationText, { color: colors.subtext }]}>
                  {worker.location}
                </StyledText>
              </View>
              {worker.revealed ? (
                <View style={styles.revealedContact}>
                  <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                  <StyledText weight="600" style={styles.revealedText}>Contact Unlocked</StyledText>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.revealBtn}
                  onPress={() => handleReveal(worker.id)}
                >
                  <Ionicons name="lock-closed" size={13} color="#fff" />
                  <StyledText weight="700" style={styles.revealBtnText}>₹10 Reveal</StyledText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
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
  greeting: {
    fontSize: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: SPACING.md,
  },
  chipRow: {
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    gap: 5,
  },
  chipLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  workerCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1D9BF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 18,
  },
  workerName: {
    fontSize: 15,
  },
  workerSkill: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  ratingText: {
    fontSize: 12,
    color: '#92400e',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: SPACING.sm,
  },
  workerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1D9BF0',
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  revealBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  revealedContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  revealedText: {
    fontSize: 12,
    color: '#15803d',
  },
  // Worker mode styles
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 4,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 17,
  },
  statLabel: {
    fontSize: 11,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.sm,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityAction: {
    fontSize: 13,
  },
  activityTime: {
    fontSize: 11,
    marginTop: 2,
  },
});
