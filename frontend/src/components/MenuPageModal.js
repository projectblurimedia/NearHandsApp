import React from 'react';
import {
  Modal, View, TouchableOpacity, ScrollView,
  StyleSheet, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import { useRefresh } from '../hooks/useRefresh';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';

/* ── page metadata ─────────────────────────────────────────── */
const PAGE_META = {
  problems: { title: 'Problems',        icon: 'bell-badge' },
  earnings: { title: 'Wallet & Earnings', icon: 'wallet' },
  settings: { title: 'App Settings',    icon: 'cog' },
  help:     { title: 'Help & Support',  icon: 'help-circle' },
  about:    { title: 'About NearHands', icon: 'information' },
};

/* ── simple page header ─────────────────────────────────────── */
function PageHeader({ page, onClose }) {
  const insets = useSafeAreaInsets();
  const meta = PAGE_META[page] ?? { title: page, icon: 'circle' };
  return (
    <LinearGradient
      colors={GRADIENT}
      start={GRADIENT_START}
      end={GRADIENT_END}
      style={[styles.pageHeader, { paddingTop: insets.top + 14 }]}
    >
      {/* Vegetable-Marketing-style squircle back button */}
      <TouchableOpacity onPress={onClose} hitSlop={12}>
        <View style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
      <MaterialCommunityIcons name={meta.icon} size={20} color="rgba(255,255,255,0.9)" />
      <StyledText weight="700" style={styles.pageTitle}>{meta.title}</StyledText>
      <View style={styles.headerBorder} />
    </LinearGradient>
  );
}

/* ── Problems page content ──────────────────────────────────── */
const COMPLAINTS = [
  { id: '1', title: 'Overcharging', desc: 'Worker charged double the agreed amount.', status: 'Open', date: '20 Jun 2026', worker: 'Suresh Babu' },
  { id: '2', title: 'No-show', desc: 'Worker did not arrive at the scheduled time.', status: 'Resolved', date: '15 Jun 2026', worker: 'Mohan Lal' },
  { id: '3', title: 'Poor Quality', desc: 'Work was not completed properly.', status: 'In Review', date: '10 Jun 2026', worker: 'Venkat Rao' },
];
const STATUS_STYLE = {
  Open:      { bg: '#fef9c3', text: '#92400e' },
  Resolved:  { bg: '#dcfce7', text: '#15803d' },
  'In Review': { bg: '#dbeafe', text: '#1e40af' },
};

function ProblemsContent({ colors }) {
  const { showToast } = useApp();
  return (
    <>
      <View style={[styles.banner, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
        <Ionicons name="alert-circle" size={22} color="#1D9BF0" />
        <View style={{ flex: 1 }}>
          <StyledText weight="600" style={{ color: '#1e40af', fontSize: 14 }}>Had a bad experience?</StyledText>
          <StyledText weight="400" style={{ color: '#3b82f6', fontSize: 12, marginTop: 2 }}>
            Report it — we respond within 48 hrs.
          </StyledText>
        </View>
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() => showToast('Report form coming soon', 'info')}
        >
          <StyledText weight="600" style={{ color: '#fff', fontSize: 12 }}>Report</StyledText>
        </TouchableOpacity>
      </View>
      <StyledText weight="600" style={[styles.subheading, { color: colors.text }]}>My Reports</StyledText>
      {COMPLAINTS.map(c => (
        <View key={c.id} style={[styles.card, SHADOW, { backgroundColor: colors.card }]}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <StyledText weight="600" style={{ fontSize: 14, color: colors.text }}>{c.title}</StyledText>
              <StyledText weight="400" style={{ fontSize: 11, color: colors.subtext, marginTop: 1 }}>
                {c.worker} · {c.date}
              </StyledText>
            </View>
            <View style={[styles.badge, { backgroundColor: STATUS_STYLE[c.status]?.bg }]}>
              <StyledText weight="600" style={{ fontSize: 10, color: STATUS_STYLE[c.status]?.text }}>{c.status}</StyledText>
            </View>
          </View>
          <StyledText weight="400" style={{ fontSize: 12, color: colors.subtext, marginTop: 6, lineHeight: 18 }}>
            {c.desc}
          </StyledText>
        </View>
      ))}
    </>
  );
}

/* ── Earnings page content ──────────────────────────────────── */
const TX = [
  { id: '1', label: 'Wallet top-up',              amount: '+₹200', date: 'Today, 10:00 AM', icon: 'add-circle', color: '#10b981' },
  { id: '2', label: 'Contact reveal – Raju Kumar', amount: '-₹10',  date: 'Today, 9:45 AM',  icon: 'lock-open',  color: '#1D9BF0' },
  { id: '3', label: 'Contact reveal – Suresh',     amount: '-₹10',  date: 'Yesterday',       icon: 'lock-open',  color: '#1D9BF0' },
  { id: '4', label: 'Wallet top-up',               amount: '+₹100', date: '19 Jun',          icon: 'add-circle', color: '#10b981' },
];

function EarningsContent({ colors }) {
  const { showToast } = useApp();
  return (
    <>
      <View style={[styles.walletCard, { backgroundColor: '#132E63' }]}>
        <StyledText weight="400" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Wallet Balance</StyledText>
        <StyledText weight="700" style={{ color: '#fff', fontSize: 36, marginVertical: 4 }}>₹280</StyledText>
        <StyledText weight="400" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>≈ 28 contact reveals left</StyledText>
        <TouchableOpacity
          style={styles.topupBtn}
          onPress={() => showToast('Redirecting to payment…', 'info')}
        >
          <Ionicons name="add" size={15} color="#1D9BF0" />
          <StyledText weight="700" style={{ color: '#1D9BF0', fontSize: 13 }}>Top Up Wallet</StyledText>
        </TouchableOpacity>
      </View>
      <StyledText weight="600" style={[styles.subheading, { color: colors.text }]}>Payment History</StyledText>
      {TX.map(tx => (
        <View key={tx.id} style={[styles.txRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.txIcon, { backgroundColor: tx.color + '18' }]}>
            <Ionicons name={tx.icon} size={17} color={tx.color} />
          </View>
          <View style={{ flex: 1 }}>
            <StyledText weight="500" style={{ fontSize: 13, color: colors.text }}>{tx.label}</StyledText>
            <StyledText weight="400" style={{ fontSize: 11, color: colors.subtext, marginTop: 1 }}>{tx.date}</StyledText>
          </View>
          <StyledText weight="700" style={{ fontSize: 14, color: tx.color }}>{tx.amount}</StyledText>
        </View>
      ))}
    </>
  );
}

/* ── Generic info page ──────────────────────────────────────── */
function GenericContent({ page, colors }) {
  return (
    <View style={styles.genericWrap}>
      <MaterialCommunityIcons name={PAGE_META[page]?.icon ?? 'circle'} size={64} color={colors.border} />
      <StyledText weight="600" style={{ color: colors.subtext, fontSize: 15, marginTop: SPACING.md }}>
        {PAGE_META[page]?.title} coming soon
      </StyledText>
    </View>
  );
}

/* ── Root modal ─────────────────────────────────────────────── */
export function MenuPageModal() {
  const { menuPage, closeMenuPage } = useApp();
  const { colors } = useTheme();
  const { refreshing, onRefresh } = useRefresh();

  const renderContent = () => {
    switch (menuPage) {
      case 'problems': return <ProblemsContent colors={colors} />;
      case 'earnings': return <EarningsContent colors={colors} />;
      default:         return <GenericContent page={menuPage} colors={colors} />;
    }
  };

  return (
    <Modal
      visible={!!menuPage}
      animationType="fade"
      statusBarTranslucent
      transparent={false}
      onRequestClose={closeMenuPage}
    >
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <PageHeader page={menuPage} onClose={closeMenuPage} />
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
          {renderContent()}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    gap: 12,
  },
  backBtn: {
    width: 42, height: 42,
    borderRadius: 21,                          // full circle
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  pageTitle: { flex: 1, color: '#fff', fontSize: 17 },
  headerBorder: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(255,255,255,0.18)',
  },

  scroll: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl },
  subheading: { fontSize: 15, marginBottom: SPACING.sm, marginTop: SPACING.sm },

  /* problems */
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    padding: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  reportBtn: {
    backgroundColor: '#1D9BF0', paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2, borderRadius: RADIUS.full,
  },
  card: { borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },

  /* earnings */
  walletCard: { borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  topupBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm + 4, paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full, marginTop: SPACING.sm,
  },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    padding: SPACING.sm + 4, borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth, marginBottom: SPACING.sm,
  },
  txIcon: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    justifyContent: 'center', alignItems: 'center',
  },

  /* generic */
  genericWrap: { alignItems: 'center', paddingTop: 80 },
});
