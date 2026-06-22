import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';

const { width: SW } = Dimensions.get('window');

const TYPE_CONFIG = {
  success: { bg: '#10b981', icon: 'checkmark-circle', title: 'Success' },
  error:   { bg: '#ef4444', icon: 'close-circle',     title: 'Error'   },
  warning: { bg: '#f59e0b', icon: 'warning',           title: 'Warning' },
  info:    { bg: '#1D9BF0', icon: 'information-circle', title: 'Info'   },
};

export function Toast() {
  const { toast, dismissToast } = useApp();

  const slideY    = useRef(new Animated.Value(150)).current;
  const baseOp    = useRef(new Animated.Value(0)).current;
  const dragX     = useRef(new Animated.Value(0)).current;
  const dragY     = useRef(new Animated.Value(0)).current;
  const dragOp    = useRef(new Animated.Value(1)).current;
  const progress  = useRef(new Animated.Value(1)).current;
  const autoTimer = useRef(null);

  const [snapshot, setSnapshot] = useState(null);
  const [mounted, setMounted]   = useState(false);

  const hide = (dx = 0, dy = 0) => {
    clearTimeout(autoTimer.current);
    Animated.parallel([
      Animated.timing(dragX, { toValue: dx, duration: 200, useNativeDriver: true }),
      Animated.timing(dragY, { toValue: dy, duration: 200, useNativeDriver: true }),
      Animated.timing(dragOp, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setMounted(false);
      dismissToast();
    });
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderMove: (_, g) => {
        dragX.setValue(g.dx);
        dragY.setValue(g.dy);
        dragOp.setValue(Math.max(0, 1 - (Math.abs(g.dx) + Math.abs(g.dy)) / 260));
      },
      onPanResponderRelease: (_, g) => {
        const swipedH  = Math.abs(g.dx) > 90  || Math.abs(g.vx) > 0.8;
        const swipedDn = g.dy > 70 || g.vy > 0.8;
        const swipedUp = g.dy < -70 || g.vy < -0.8;

        if (swipedH)  { hide(g.dx > 0 ? SW : -SW, 0);   return; }
        if (swipedDn) { hide(0, 200);                     return; }
        if (swipedUp) { hide(0, -200);                    return; }

        // snap back
        Animated.parallel([
          Animated.spring(dragX,  { toValue: 0, friction: 5, useNativeDriver: true }),
          Animated.spring(dragY,  { toValue: 0, friction: 5, useNativeDriver: true }),
          Animated.spring(dragOp, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();
      },
    })
  ).current;

  useEffect(() => {
    if (toast) {
      clearTimeout(autoTimer.current);
      setSnapshot(toast);
      setMounted(true);

      // reset drag values
      dragX.setValue(0);
      dragY.setValue(0);
      dragOp.setValue(1);

      // entrance
      slideY.setValue(150);
      baseOp.setValue(0);
      progress.setValue(1);

      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
        Animated.spring(baseOp, { toValue: 1, tension: 60, friction: 9, useNativeDriver: true }),
      ]).start();

      Animated.timing(progress, { toValue: 0, duration: 3000, useNativeDriver: false }).start();

      autoTimer.current = setTimeout(() => hide(0, 120), 3000);
    }
    return () => clearTimeout(autoTimer.current);
  }, [toast]);

  if (!mounted || !snapshot) return null;

  const cfg      = TYPE_CONFIG[snapshot.type] ?? TYPE_CONFIG.info;
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const opacity  = Animated.multiply(baseOp, dragOp);

  return (
    <Animated.View
      {...pan.panHandlers}
      style={[
        styles.container,
        {
          backgroundColor: cfg.bg,
          opacity,
          transform: [
            { translateY: Animated.add(slideY, dragY) },
            { translateX: dragX },
          ],
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Ionicons name={cfg.icon} size={28} color="#fff" />
        </View>

        <View style={styles.texts}>
          <StyledText weight="700" style={styles.title}>{cfg.title}</StyledText>
          <StyledText weight="400" style={styles.message} numberOfLines={2}>
            {snapshot.message}
          </StyledText>
        </View>

        <TouchableOpacity onPress={() => hide(0, 120)} style={styles.closeBtn} hitSlop={8}>
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

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
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
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
    height: 3, backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: 3, backgroundColor: '#fff' },
});
