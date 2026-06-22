import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from './StyledText';
import { WorkerUserToggle } from './WorkerUserToggle';
import { useApp } from '../hooks/useApp';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';
import { SPACING } from '../constants/layout';

export function GradientHeader() {
  const { openSidebar } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={GRADIENT}
      start={GRADIENT_START}
      end={GRADIENT_END}
      style={[styles.container, { paddingTop: insets.top + 16 }]}
    >
      {/* Left: Logo mark + Title */}
      <View style={styles.titleGroup}>
        <View style={styles.logoMark}>
          <StyledText weight="800" style={styles.logoLetter}>N</StyledText>
        </View>
        <View>
          <StyledText weight="800" style={styles.title}>NearHands</StyledText>
          <StyledText weight="400" style={styles.tagline}>Find workers nearby</StyledText>
        </View>
      </View>

      {/* Right: Notif + Toggle + Menu */}
      <View style={styles.rightGroup}>
        <TouchableOpacity hitSlop={12} style={styles.ghostBtn}>
          <Ionicons name="notifications-outline" size={21} color="rgba(255,255,255,0.92)" />
        </TouchableOpacity>
        <WorkerUserToggle />
        <TouchableOpacity onPress={openSidebar} hitSlop={12} style={styles.menuBtn}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* bottom separator — subtle white hairline */}
      <View style={styles.bottomBorder} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md + 2,
    gap: SPACING.sm,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  titleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 22,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  tagline: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 10,
    letterSpacing: 0.2,
    lineHeight: 14,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ghostBtn: {
    padding: 5,
  },
  menuBtn: {
    padding: 5,
    marginLeft: 2,
  },
});
