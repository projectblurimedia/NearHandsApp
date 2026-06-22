import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';

const TYPE_CONFIG = {
  success: { bg: '#10b981', icon: 'checkmark-circle', title: 'Success' },
  error:   { bg: '#ef4444', icon: 'close-circle',     title: 'Error'   },
  warning: { bg: '#f59e0b', icon: 'warning',           title: 'Warning' },
  info:    { bg: '#1D9BF0', icon: 'information-circle', title: 'Info'   },
};

export function Toast() {
  const { toast, dismissToast } = useApp();

  const slideY    = useRef(new Animated.Value(150)).current;
  const opacity   = useRef(new Animated.Value(0)).current;
  const progress  = useRef(new Animated.Value(1)).current;
  const autoTimer = useRef(null);

  // Keep a local copy so the toast content doesn't vanish during hide animation
  const [snapshot, setSnapshot] = useState(null);
  const [mounted, setMounted]   = useState(false);

  const hide = () => {
    clearTimeout(autoTimer.current);
    Animated.parallel([
      Animated.spring(slideY, { toValue: 150, tension: 55, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setMounted(false);
      dismissToast();
    });
  };

  useEffect(() => {
    if (toast) {
      clearTimeout(autoTimer.current);
      setSnapshot(toast);
      setMounted(true);

      slideY.setValue(150);
      opacity.setValue(0);
      progress.setValue(1);

      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
        Animated.spring(opacity, { toValue: 1, tension: 60, friction: 9, useNativeDriver: true }),
      ]).start();

      Animated.timing(progress, { toValue: 0, duration: 3000, useNativeDriver: false }).start();

      autoTimer.current = setTimeout(hide, 3000);
    }
    return () => clearTimeout(autoTimer.current);
  }, [toast]);

  if (!mounted || !snapshot) return null;

  const cfg = TYPE_CONFIG[snapshot.type] ?? TYPE_CONFIG.info;
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: cfg.bg, transform: [{ translateY: slideY }], opacity },
      ]}
    >
      {/* main row */}
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Ionicons name={cfg.icon} size={30} color="#fff" />
        </View>

        <View style={styles.texts}>
          <StyledText weight="700" style={styles.title}>{cfg.title}</StyledText>
          <StyledText weight="400" style={styles.message} numberOfLines={2}>
            {snapshot.message}
          </StyledText>
        </View>

        <TouchableOpacity onPress={hide} style={styles.closeBtn} hitSlop={8}>
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* shrinking progress bar */}
      <View style={styles.progressBg}>
        <Animated.View style={[styles.progressFill, { width: barWidth }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position:     'absolute',
    bottom:       16,
    left:         14,
    right:        14,
    zIndex:       9999,
    elevation:    24,
    borderRadius: 18,
    overflow:     'hidden',
    paddingTop:        15,
    paddingBottom:     12,
    paddingHorizontal: 14,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 6 },
    shadowOpacity:  0.22,
    shadowRadius:   10,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           12,
    marginBottom:  10,
  },
  iconCircle: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems:     'center',
  },
  texts:   { flex: 1 },
  title:   { fontSize: 15, color: '#fff', lineHeight: 20 },
  message: { fontSize: 12, color: 'rgba(255,255,255,0.92)', lineHeight: 17, marginTop: 2 },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center', alignItems: 'center',
  },
  progressBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: '#ffffff',
  },
});
