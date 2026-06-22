import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';

export function ConfirmationModal() {
  const { confirm, closeConfirm } = useApp();
  const { colors } = useTheme();
  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (confirm) {
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      opacity.value = withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      scale.value = withSpring(0.88, { damping: 20, stiffness: 300 });
      opacity.value = withSpring(0, { damping: 20, stiffness: 300 });
    }
  }, [confirm]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleConfirm = () => { confirm?.onConfirm?.(); closeConfirm(); };
  const handleCancel = () => { confirm?.onCancel?.(); closeConfirm(); };

  return (
    <Modal
      visible={!!confirm}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Animated.View style={[styles.card, { backgroundColor: colors.card }, SHADOW, animStyle]}>
          <Pressable>
            <StyledText weight="700" style={[styles.title, { color: colors.text }]}>
              {confirm?.title}
            </StyledText>
            <StyledText weight="400" style={[styles.message, { color: colors.subtext }]}>
              {confirm?.message}
            </StyledText>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}
                onPress={handleCancel}
              >
                <StyledText weight="600" style={[styles.cancelText, { color: colors.subtext }]}>
                  Cancel
                </StyledText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.confirmBtn]} onPress={handleConfirm}>
                <StyledText weight="600" style={styles.confirmText}>Confirm</StyledText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  card: {
    width: '100%',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  title: { fontSize: 18, marginBottom: SPACING.sm },
  message: { fontSize: 14, lineHeight: 22, marginBottom: SPACING.lg },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  btn: { flex: 1, paddingVertical: SPACING.sm + 2, borderRadius: RADIUS.lg, alignItems: 'center' },
  cancelBtn: { borderWidth: 1.5 },
  cancelText: { fontSize: 14 },
  confirmBtn: { backgroundColor: '#1CB5E0' },
  confirmText: { fontSize: 14, color: '#fff' },
});
