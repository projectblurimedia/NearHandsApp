import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';
import { SPACING } from '../constants/layout';

export function GradientHeader() {
  const { openSidebar, mode, toggleMode } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={GRADIENT}
      start={GRADIENT_START}
      end={GRADIENT_END}
      style={[styles.wrapper, { paddingTop: insets.top + 14 }]}
    >
      {/* ── Top row: logo + notif + menu ── */}
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View style={styles.logoMark}>
            <StyledText weight="800" style={styles.logoLetter}>N</StyledText>
          </View>
          <View>
            <StyledText weight="800" style={styles.title}>NearHands</StyledText>
            <StyledText weight="400" style={styles.tagline}>Find workers nearby</StyledText>
          </View>
        </View>

        <View style={styles.rightGroup}>
          <TouchableOpacity hitSlop={12} style={styles.ghostBtn}>
            <Ionicons name="notifications-outline" size={21} color="rgba(255,255,255,0.92)" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openSidebar} hitSlop={12} style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Mode toggle row — clearly visible, new line ── */}
      <View style={styles.modeRow}>
        <StyledText weight="400" style={styles.modeHint}>Viewing as:</StyledText>

        <View style={styles.modePill}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'user' && styles.modeBtnActive]}
            onPress={() => mode !== 'user' && toggleMode()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="person"
              size={13}
              color={mode === 'user' ? '#1D9BF0' : 'rgba(255,255,255,0.75)'}
            />
            <StyledText
              weight={mode === 'user' ? '700' : '500'}
              style={[styles.modeBtnText, { color: mode === 'user' ? '#1D9BF0' : 'rgba(255,255,255,0.75)' }]}
            >
              User
            </StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, mode === 'worker' && styles.modeBtnActive]}
            onPress={() => mode !== 'worker' && toggleMode()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="hammer-wrench"
              size={13}
              color={mode === 'worker' ? '#1D9BF0' : 'rgba(255,255,255,0.75)'}
            />
            <StyledText
              weight={mode === 'worker' ? '700' : '500'}
              style={[styles.modeBtnText, { color: mode === 'worker' ? '#1D9BF0' : 'rgba(255,255,255,0.75)' }]}
            >
              Worker
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>

      {/* bottom hairline */}
      <View style={styles.bottomBorder} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: SPACING.sm + 2,
  },

  /* top row */
  topRow: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: SPACING.md,
    paddingBottom:   SPACING.sm,
    gap:             SPACING.sm,
  },
  titleGroup: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  logoMark: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  logoLetter: { color: '#fff', fontSize: 18, lineHeight: 22 },
  title:      { color: '#fff', fontSize: 16, letterSpacing: 0.3, lineHeight: 20 },
  tagline:    { color: 'rgba(255,255,255,0.68)', fontSize: 10, letterSpacing: 0.2, lineHeight: 14 },
  rightGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ghostBtn:   { padding: 5 },
  menuBtn:    { padding: 5, marginLeft: 2 },

  /* mode row */
  modeRow: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: SPACING.md,
    paddingTop:      2,
    gap:             10,
  },
  modeHint: {
    color:    'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  modePill: {
    flexDirection:      'row',
    backgroundColor:    'rgba(255,255,255,0.15)',
    borderRadius:       20,
    padding:            3,
    gap:                2,
  },
  modeBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            5,
    paddingVertical:  5,
    paddingHorizontal: 12,
    borderRadius:   17,
  },
  modeBtnActive: {
    backgroundColor: '#ffffff',
  },
  modeBtnText: {
    fontSize: 12,
  },

  /* bottom separator */
  bottomBorder: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(255,255,255,0.18)',
  },
});
