import React, { useEffect, useRef } from 'react';
import {
  View, StyleSheet, Animated, TouchableOpacity,
  PanResponder, Dimensions, Modal,
} from 'react-native';
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

  const slideY    = useRef(new Animated.Value(120)).current;
  const opacity   = useRef(new Animated.Value(0)).current;
  const slideX    = useRef(new Animated.Value(0)).current;
  const opX       = useRef(new Animated.Value(1)).current;
  const progress  = useRef(new Animated.Value(1)).current;
  const autoTimer = useRef(null);

  const slideOut = () => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 120, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.spring(opacity, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start(() => dismissToast());
  };

  useEffect(() => {
    if (toast) {
      slideX.setValue(0);
      opX.setValue(1);
      slideY.setValue(120);
      opacity.setValue(0);
      progress.setValue(1);

      Animated.parallel([
        Animated.spring(slideY,  { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.spring(opacity, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]).start();

      Animated.timing(progress, {
        toValue: 0, duration: 3000, useNativeDriver: false,
      }).start();

      autoTimer.current = setTimeout(slideOut, 3000);
      return () => clearTimeout(autoTimer.current);
    }
  }, [toast]);

  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderMove: (_, g) => {
      slideX.setValue(g.dx);
      opX.setValue(1 - Math.abs(g.dx) / 200);
    },
    onPanResponderRelease: (_, g) => {
      if (Math.abs(g.dx) > 100 || Math.abs(g.vx) > 0.5) {
        clearTimeout(autoTimer.current);
        Animated.parallel([
          Animated.timing(slideX,  { toValue: g.dx > 0 ? SW : -SW, duration: 200, useNativeDriver: true }),
          Animated.timing(opX,     { toValue: 0,                    duration: 200, useNativeDriver: true }),
        ]).start(() => dismissToast());
      } else {
        Animated.parallel([
          Animated.spring(slideX, { toValue: 0, friction: 5, useNativeDriver: true }),
          Animated.spring(opX,    { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();
      }
    },
  });

  if (!toast) return null;

  const cfg = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info;
  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={() => {}}>
      <View style={styles.backdrop} pointerEvents="box-none">
        <Animated.View
          {...pan.panHandlers}
          style={[
            styles.container,
            {
              backgroundColor: cfg.bg,
              transform: [{ translateX: slideX }, { translateY: slideY }],
              opacity: Animated.multiply(opacity, opX),
            },
          ]}
        >
          <View style={styles.content}>
            <Ionicons name={cfg.icon} size={28} color="#fff" />
            <View style={styles.texts}>
              <StyledText weight="700" style={styles.title}>{cfg.title}</StyledText>
              <StyledText weight="400" style={styles.message}>{toast.message}</StyledText>
            </View>
            <TouchableOpacity
              onPress={() => { clearTimeout(autoTimer.current); slideOut(); }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* progress bar — shrinks left to right */}
          <View style={styles.progressBg}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems:     'center',
    paddingBottom:  24,
    paddingHorizontal: 16,
    pointerEvents:  'box-none',
  },
  container: {
    width:         '100%',
    maxWidth:      SW - 32,
    borderRadius:  20,
    paddingVertical:   14,
    paddingHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           12,
    marginBottom:  10,
  },
  texts: { flex: 1 },
  title: { fontSize: 15, color: '#fff' },
  message: { fontSize: 12, color: 'rgba(255,255,255,0.92)', lineHeight: 18, marginTop: 1 },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center', alignItems: 'center',
  },
  progressBg: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 3, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    backgroundColor: '#fff',
  },
});
