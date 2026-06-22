import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { StyledText } from '../components/StyledText';
import { PullRefreshScroll } from '../components/PullRefreshScroll';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';

const PROBLEM_CATEGORIES = ['Overcharging', 'No-show', 'Poor Quality', 'Rude Behavior', 'Other'];

const MOCK_COMPLAINTS = [
  { id: '1', title: 'Overcharging', desc: 'Worker charged double the agreed amount.', status: 'Open', date: '20 Jun 2026', worker: 'Suresh Babu' },
  { id: '2', title: 'No-show', desc: 'Worker did not arrive at the scheduled time.', status: 'Resolved', date: '15 Jun 2026', worker: 'Mohan Lal' },
  { id: '3', title: 'Poor Quality', desc: 'Work was not completed properly.', status: 'In Review', date: '10 Jun 2026', worker: 'Venkat Rao' },
];

const STATUS_COLOR = {
  Open: { bg: '#fef9c3', text: '#92400e' },
  Resolved: { bg: '#dcfce7', text: '#15803d' },
  'In Review': { bg: '#dbeafe', text: '#1e40af' },
};

export function ProblemsScreen() {
  const { colors } = useTheme();
  const { mode, showToast } = useApp();
  const onRefresh = () => new Promise(r => setTimeout(r, 800));
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!selectedCategory || !description.trim()) {
      showToast('Please fill all fields', 'warning');
      return;
    }
    setSheetVisible(false);
    setSelectedCategory('');
    setDescription('');
    showToast('Problem reported successfully!', 'success');
  };

  if (mode === 'worker') {
    return (
      <ScreenLayout title="Complaints">
        <PullRefreshScroll onRefresh={onRefresh} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
            Complaints Against You
          </StyledText>
          {MOCK_COMPLAINTS.map(c => (
            <View key={c.id} style={[styles.complaintCard, SHADOW, { backgroundColor: colors.card }]}>
              <View style={styles.complaintHeader}>
                <View style={{ flex: 1 }}>
                  <StyledText weight="600" style={[styles.complaintTitle, { color: colors.text }]}>
                    {c.title}
                  </StyledText>
                  <StyledText weight="400" style={[styles.complaintDate, { color: colors.subtext }]}>
                    {c.date}
                  </StyledText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[c.status]?.bg }]}>
                  <StyledText weight="600" style={[styles.statusText, { color: STATUS_COLOR[c.status]?.text }]}>
                    {c.status}
                  </StyledText>
                </View>
              </View>
              <StyledText weight="400" style={[styles.complaintDesc, { color: colors.subtext }]}>
                {c.desc}
              </StyledText>
            </View>
          ))}
          {MOCK_COMPLAINTS.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="shield-checkmark-outline" size={52} color={colors.border} />
              <StyledText weight="500" style={[{ color: colors.subtext, fontSize: 14, marginTop: SPACING.sm }]}>
                No complaints so far. Keep up the great work!
              </StyledText>
            </View>
          )}
        </PullRefreshScroll>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Problems">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.reportBanner, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
          <Ionicons name="alert-circle" size={24} color="#1D9BF0" />
          <View style={{ flex: 1 }}>
            <StyledText weight="600" style={{ color: '#1e40af', fontSize: 14 }}>
              Had a bad experience?
            </StyledText>
            <StyledText weight="400" style={{ color: '#3b82f6', fontSize: 12, marginTop: 2 }}>
              Report it and we'll look into it within 48 hours.
            </StyledText>
          </View>
          <TouchableOpacity style={styles.reportBtn} onPress={() => setSheetVisible(true)}>
            <StyledText weight="600" style={{ color: '#fff', fontSize: 12 }}>Report</StyledText>
          </TouchableOpacity>
        </View>

        <StyledText weight="600" style={[styles.sectionTitle, { color: colors.text }]}>
          My Reports
        </StyledText>
        {MOCK_COMPLAINTS.map(c => (
          <View key={c.id} style={[styles.complaintCard, SHADOW, { backgroundColor: colors.card }]}>
            <View style={styles.complaintHeader}>
              <View style={{ flex: 1 }}>
                <StyledText weight="600" style={[styles.complaintTitle, { color: colors.text }]}>
                  {c.title}
                </StyledText>
                <StyledText weight="400" style={[styles.complaintDate, { color: colors.subtext }]}>
                  {c.worker} • {c.date}
                </StyledText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[c.status]?.bg }]}>
                <StyledText weight="600" style={[styles.statusText, { color: STATUS_COLOR[c.status]?.text }]}>
                  {c.status}
                </StyledText>
              </View>
            </View>
            <StyledText weight="400" style={[styles.complaintDesc, { color: colors.subtext }]}>
              {c.desc}
            </StyledText>
          </View>
        ))}
      </PullRefreshScroll>

      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setSheetVisible(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.card }]}>
            <View style={styles.sheetHandle} />
            <StyledText weight="700" style={[styles.sheetTitle, { color: colors.text }]}>
              Report a Problem
            </StyledText>

            <StyledText weight="500" style={[styles.sheetLabel, { color: colors.subtext }]}>
              Category
            </StyledText>
            <View style={styles.categoryGrid}>
              {PROBLEM_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: selectedCategory === cat ? '#1D9BF0' : colors.inputBg,
                      borderColor: selectedCategory === cat ? '#1D9BF0' : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <StyledText
                    weight="500"
                    style={{ fontSize: 12, color: selectedCategory === cat ? '#fff' : colors.text }}
                  >
                    {cat}
                  </StyledText>
                </TouchableOpacity>
              ))}
            </View>

            <StyledText weight="500" style={[styles.sheetLabel, { color: colors.subtext }]}>
              Description
            </StyledText>
            <TextInput
              style={[styles.descInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
              placeholder="Describe the issue..."
              placeholderTextColor={colors.subtext}
              multiline
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <StyledText weight="700" style={{ color: '#fff', fontSize: 14 }}>Submit Report</StyledText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  reportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  reportBtn: {
    backgroundColor: '#1D9BF0',
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: SPACING.sm,
  },
  complaintCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  complaintHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  complaintTitle: {
    fontSize: 14,
  },
  complaintDate: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: 11,
  },
  complaintDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl + 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    fontSize: 17,
    marginBottom: SPACING.md,
  },
  sheetLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: SPACING.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  catChip: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  descInput: {
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: SPACING.sm,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    minHeight: 100,
    marginBottom: SPACING.lg,
  },
  submitBtn: {
    backgroundColor: '#1D9BF0',
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
});
