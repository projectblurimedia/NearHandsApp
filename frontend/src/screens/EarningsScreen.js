import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';

const BAR_DATA = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 800 },
  { day: 'Wed', amount: 2100 },
  { day: 'Thu', amount: 1500 },
  { day: 'Fri', amount: 3200 },
  { day: 'Sat', amount: 2600 },
  { day: 'Sun', amount: 900 },
];

const WORKER_TRANSACTIONS = [
  { id: '1', label: 'Profile reveal by client', amount: '+₹10', date: 'Today, 9:30 AM', icon: 'eye', color: '#10b981' },
  { id: '2', label: 'Profile reveal by client', amount: '+₹10', date: 'Today, 8:15 AM', icon: 'eye', color: '#10b981' },
  { id: '3', label: 'Withdrawal to UPI', amount: '-₹500', date: 'Yesterday', icon: 'arrow-up-circle', color: '#ef4444' },
  { id: '4', label: 'Profile reveal by client', amount: '+₹10', date: '20 Jun', icon: 'eye', color: '#10b981' },
  { id: '5', label: 'Profile reveal by client', amount: '+₹10', date: '19 Jun', icon: 'eye', color: '#10b981' },
];

const USER_TRANSACTIONS = [
  { id: '1', label: 'Wallet top-up', amount: '+₹200', date: 'Today, 10:00 AM', icon: 'add-circle', color: '#10b981' },
  { id: '2', label: 'Contact reveal – Raju Kumar', amount: '-₹10', date: 'Today, 9:45 AM', icon: 'lock-open', color: '#1D9BF0' },
  { id: '3', label: 'Contact reveal – Suresh Babu', amount: '-₹10', date: 'Yesterday', icon: 'lock-open', color: '#1D9BF0' },
  { id: '4', label: 'Wallet top-up', amount: '+₹100', date: '19 Jun', icon: 'add-circle', color: '#10b981' },
];

const MAX_BAR = Math.max(...BAR_DATA.map(d => d.amount));

export function EarningsScreen() {
  const { colors } = useTheme();
  const { mode, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('week');

  if (mode === 'worker') {
    return (
      <ScreenLayout title="Earnings">
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.summaryCard, { backgroundColor: '#1D9BF0' }]}>
            <StyledText weight="400" style={styles.summaryLabel}>Total Earnings</StyledText>
            <StyledText weight="700" style={styles.summaryAmount}>₹12,430</StyledText>
            <View style={styles.summaryRow}>
              <View style={styles.summaryChip}>
                <Ionicons name="trending-up" size={13} color="#dcfce7" />
                <StyledText weight="500" style={styles.summaryChipText}>+18% this week</StyledText>
              </View>
            </View>
          </View>

          <View style={styles.tabRow}>
            {['week', 'month', 'year'].map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, activeTab === t && { borderBottomColor: '#1D9BF0', borderBottomWidth: 2 }]}
                onPress={() => setActiveTab(t)}
              >
                <StyledText
                  weight={activeTab === t ? '600' : '400'}
                  style={{ fontSize: 13, color: activeTab === t ? '#1D9BF0' : colors.subtext, textTransform: 'capitalize' }}
                >
                  {t}
                </StyledText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.chartCard, SHADOW, { backgroundColor: colors.card }]}>
            <StyledText weight="600" style={[styles.chartTitle, { color: colors.text }]}>
              Daily Earnings (This Week)
            </StyledText>
            <View style={styles.barChart}>
              {BAR_DATA.map(d => (
                <View key={d.day} style={styles.barGroup}>
                  <StyledText weight="400" style={[styles.barAmount, { color: colors.subtext }]}>
                    ₹{d.amount >= 1000 ? (d.amount / 1000).toFixed(1) + 'K' : d.amount}
                  </StyledText>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: (d.amount / MAX_BAR) * 100,
                          backgroundColor: '#1D9BF0',
                        },
                      ]}
                    />
                  </View>
                  <StyledText weight="400" style={[styles.barDay, { color: colors.subtext }]}>
                    {d.day}
                  </StyledText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.txHeader}>
            <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
              Transactions
            </StyledText>
            <TouchableOpacity onPress={() => showToast('Withdrawal coming soon', 'info')}>
              <StyledText weight="600" style={{ color: '#1D9BF0', fontSize: 13 }}>Withdraw</StyledText>
            </TouchableOpacity>
          </View>
          {WORKER_TRANSACTIONS.map(tx => (
            <View key={tx.id} style={[styles.txItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.txIcon, { backgroundColor: tx.color + '18' }]}>
                <Ionicons name={tx.icon} size={17} color={tx.color} />
              </View>
              <View style={{ flex: 1 }}>
                <StyledText weight="500" style={[styles.txLabel, { color: colors.text }]}>{tx.label}</StyledText>
                <StyledText weight="400" style={[styles.txDate, { color: colors.subtext }]}>{tx.date}</StyledText>
              </View>
              <StyledText weight="700" style={[styles.txAmount, { color: tx.color }]}>{tx.amount}</StyledText>
            </View>
          ))}
        </ScrollView>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Wallet">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.summaryCard, { backgroundColor: '#132E63' }]}>
          <StyledText weight="400" style={styles.summaryLabel}>Wallet Balance</StyledText>
          <StyledText weight="700" style={styles.summaryAmount}>₹280</StyledText>
          <StyledText weight="400" style={[styles.summaryLabel, { marginTop: 4, fontSize: 12 }]}>
            ≈ 28 contact reveals left
          </StyledText>
          <TouchableOpacity
            style={styles.topupBtn}
            onPress={() => showToast('Redirecting to payment...', 'info')}
          >
            <Ionicons name="add" size={16} color="#1D9BF0" />
            <StyledText weight="700" style={{ color: '#1D9BF0', fontSize: 13 }}>Top Up Wallet</StyledText>
          </TouchableOpacity>
        </View>

        <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
          Payment History
        </StyledText>
        {USER_TRANSACTIONS.map(tx => (
          <View key={tx.id} style={[styles.txItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.txIcon, { backgroundColor: tx.color + '18' }]}>
              <Ionicons name={tx.icon} size={17} color={tx.color} />
            </View>
            <View style={{ flex: 1 }}>
              <StyledText weight="500" style={[styles.txLabel, { color: colors.text }]}>{tx.label}</StyledText>
              <StyledText weight="400" style={[styles.txDate, { color: colors.subtext }]}>{tx.date}</StyledText>
            </View>
            <StyledText weight="700" style={[styles.txAmount, { color: tx.color }]}>{tx.amount}</StyledText>
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
  summaryCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 34,
    marginVertical: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  summaryChipText: {
    color: '#fff',
    fontSize: 12,
  },
  topupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  chartCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  chartTitle: {
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 130,
    gap: 4,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barAmount: {
    fontSize: 8,
    marginBottom: 2,
  },
  barWrapper: {
    width: '80%',
    height: 100,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: RADIUS.sm,
    minHeight: 4,
  },
  barDay: {
    fontSize: 10,
    marginTop: 4,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: SPACING.sm,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.sm,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txLabel: {
    fontSize: 13,
  },
  txDate: {
    fontSize: 11,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
  },
});
