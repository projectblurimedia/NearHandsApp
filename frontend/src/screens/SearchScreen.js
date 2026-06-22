import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { StyledText } from '../components/StyledText';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';

const CATEGORIES = [
  'All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Cleaner', 'AC Repair', 'Driver', 'Mason',
];

const DISTANCES = ['< 1 km', '< 3 km', '< 5 km', '< 10 km', 'Any'];

const MOCK_RESULTS = [
  { id: '1', name: 'Raju Kumar', skill: 'Electrician', rating: 4.8, reviews: 124, location: '2.3 km', experience: '5 yrs', available: true },
  { id: '2', name: 'Suresh Babu', skill: 'Plumber', rating: 4.6, reviews: 89, location: '3.1 km', experience: '7 yrs', available: true },
  { id: '3', name: 'Mohan Lal', skill: 'Carpenter', rating: 4.9, reviews: 201, location: '1.8 km', experience: '12 yrs', available: false },
  { id: '4', name: 'Venkat Rao', skill: 'Painter', rating: 4.5, reviews: 67, location: '4.2 km', experience: '4 yrs', available: true },
  { id: '5', name: 'Ramesh Yadav', skill: 'Mason', rating: 4.7, reviews: 155, location: '2.9 km', experience: '9 yrs', available: true },
];

export function SearchScreen() {
  const { colors } = useTheme();
  const { showToast } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDistance, setActiveDistance] = useState('Any');

  const filtered = MOCK_RESULTS.filter(w => {
    const matchesCategory = activeCategory === 'All' || w.skill === activeCategory;
    const matchesQuery = w.name.toLowerCase().includes(query.toLowerCase()) || w.skill.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <ScreenLayout title="Search">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.searchBar, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.subtext} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search workers, skills..."
            placeholderTextColor={colors.subtext}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.subtext} />
            </TouchableOpacity>
          )}
        </View>

        <StyledText weight="600" style={[styles.filterLabel, { color: colors.subtext }]}>
          Category
        </StyledText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeCategory === cat ? '#1D9BF0' : colors.card,
                  borderColor: activeCategory === cat ? '#1D9BF0' : colors.border,
                },
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <StyledText
                weight="500"
                style={[styles.filterChipText, { color: activeCategory === cat ? '#fff' : colors.text }]}
              >
                {cat}
              </StyledText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <StyledText weight="600" style={[styles.filterLabel, { color: colors.subtext }]}>
          Distance
        </StyledText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {DISTANCES.map(d => (
            <TouchableOpacity
              key={d}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeDistance === d ? '#132E63' : colors.card,
                  borderColor: activeDistance === d ? '#132E63' : colors.border,
                },
              ]}
              onPress={() => setActiveDistance(d)}
            >
              <StyledText
                weight="500"
                style={[styles.filterChipText, { color: activeDistance === d ? '#fff' : colors.text }]}
              >
                {d}
              </StyledText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <StyledText weight="600" style={[styles.resultsLabel, { color: colors.text }]}>
          {filtered.length} Workers Found
        </StyledText>

        {filtered.map(worker => (
          <TouchableOpacity
            key={worker.id}
            style={[styles.resultCard, SHADOW, { backgroundColor: colors.card }]}
            activeOpacity={0.8}
            onPress={() => showToast(`Viewing ${worker.name}'s profile`, 'info')}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, { backgroundColor: worker.available ? '#1D9BF0' : '#9ca3af' }]}>
                <StyledText weight="700" style={styles.avatarText}>{worker.name[0]}</StyledText>
              </View>
              <View style={{ flex: 1 }}>
                <StyledText weight="600" style={[styles.workerName, { color: colors.text }]}>
                  {worker.name}
                </StyledText>
                <StyledText weight="400" style={[styles.workerMeta, { color: colors.subtext }]}>
                  {worker.skill} • {worker.experience}
                </StyledText>
              </View>
              <View style={[styles.availBadge, { backgroundColor: worker.available ? '#dcfce7' : '#f3f4f6' }]}>
                <View style={[styles.availDot, { backgroundColor: worker.available ? '#10b981' : '#9ca3af' }]} />
                <StyledText weight="500" style={[styles.availText, { color: worker.available ? '#15803d' : '#6b7280' }]}>
                  {worker.available ? 'Active' : 'Busy'}
                </StyledText>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={12} color={colors.subtext} />
                <StyledText weight="400" style={[styles.infoText, { color: colors.subtext }]}>
                  {worker.location}
                </StyledText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <StyledText weight="500" style={[styles.infoText, { color: colors.text }]}>
                  {worker.rating} ({worker.reviews})
                </StyledText>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.border} />
            <StyledText weight="500" style={[styles.emptyText, { color: colors.subtext }]}>
              No workers found
            </StyledText>
          </View>
        )}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    padding: 0,
  },
  filterLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  filterRow: {
    gap: SPACING.xs,
    paddingBottom: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
  filterChipText: {
    fontSize: 12,
  },
  resultsLabel: {
    fontSize: 15,
    marginBottom: SPACING.sm,
  },
  resultCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 17,
  },
  workerName: {
    fontSize: 14,
  },
  workerMeta: {
    fontSize: 12,
    marginTop: 1,
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyText: {
    fontSize: 14,
  },
});
