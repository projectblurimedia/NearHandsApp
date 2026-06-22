import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';
import { TOAST_COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/layout';

const ICON_MAP = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
};

export function Toast() {
  const { toast } = useApp();
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (toast) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 140 });
    } else {
      translateY.value = withTiming(-80, { duration: 180 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [toast]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!toast) return null;

  const color = TOAST_COLORS[toast.type] || TOAST_COLORS.info;

  return (
    <Animated.View style={[styles.container, { borderLeftColor: color }, animStyle]}>
      <Ionicons name={ICON_MAP[toast.type] || 'information-circle'} size={20} color={color} />
      <StyledText weight="500" style={styles.message}>
        {toast.message}
      </StyledText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 70,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  message: {
    fontSize: 14,
    color: '#1f2937',
    marginLeft: SPACING.sm,
    flex: 1,
  },
});
