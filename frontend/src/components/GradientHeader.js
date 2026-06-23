import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';
import { GRADIENT, GRADIENT_START, GRADIENT_END } from '../constants/colors';
import { SPACING } from '../constants/layout';

// Brand assets
const ICON_IMG   = require('../../assets/brand/Icon.png');
const BANNER_IMG = require('../../assets/brand/Banner.png');

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
      {/* Logo image + Banner title image */}
      <View style={styles.titleGroup}>

        {/* Icon.png — replaces the "N" box, same 38×38 size */}
        <View style={styles.logoMark}>
          <Image
            source={ICON_IMG}
            style={styles.iconImg}
            resizeMode="cover"
          />
        </View>

        <View style={styles.titleStack}>
          {/* Banner.png — replaces "NearHands" text, same 22px height */}
          <Image
            source={BANNER_IMG}
            style={styles.bannerImg}
            resizeMode="contain"
          />
          <StyledText weight="400" style={styles.tagline}>
            Find workers nearby
          </StyledText>
        </View>
      </View>

      {/* Right: Notif + Menu */}
      <View style={styles.rightGroup}>
        <TouchableOpacity hitSlop={12} style={styles.ghostBtn}>
          <Ionicons name="notifications-outline" size={24} color="rgba(255,255,255,0.92)" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openSidebar} hitSlop={12} style={styles.menuBtn}>
          <Ionicons name="menu" size={27} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* bottom separator */}
      <View style={styles.bottomBorder} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: SPACING.md,
    paddingBottom:     SPACING.md + 2,
    gap:               SPACING.sm,
  },
  titleGroup: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           11,
  },

  // Wrapper keeps the rounded border styling; image fills it
  logoMark: {
    width:        38,
    height:       38,
    borderRadius: 11,
    overflow:     'hidden',      // clips Icon.png to rounded corners
    borderWidth:  1.5,
    borderColor:  'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  iconImg: {
    width:  38,
    height: 38,
  },

  titleStack: {
    justifyContent: 'center',
    gap:            2,
  },
  // Banner.png at the same pixel height as the old "NearHands" title text
  bannerImg: {
    height:    22,               // matches old fontSize 18 / lineHeight 22
    width:     130,              // wide enough to show full banner
  },
  tagline: {
    color:         'rgba(255,255,255,0.68)',
    fontSize:      11,
    letterSpacing: 0.2,
    lineHeight:    15,
  },

  rightGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ghostBtn:   { padding: 5 },
  menuBtn:    { padding: 5, marginLeft: 2 },
  bottomBorder: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(255,255,255,0.18)',
  },
});
