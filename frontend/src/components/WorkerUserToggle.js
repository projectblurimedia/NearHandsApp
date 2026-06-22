import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { StyledText } from './StyledText';
import { useApp } from '../hooks/useApp';

const PILL_WIDTH = 120;
const THUMB_WIDTH = 58;

export function WorkerUserToggle() {
  const { mode, toggleMode } = useApp();
  const offset = useSharedValue(mode === 'user' ? 2 : PILL_WIDTH - THUMB_WIDTH - 2);

  useEffect(() => {
    offset.value = withSpring(mode === 'user' ? 2 : PILL_WIDTH - THUMB_WIDTH - 2, {
      damping: 18,
      stiffness: 180,
    });
  }, [mode]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={toggleMode} style={styles.pill}>
      <Animated.View style={[styles.thumb, thumbStyle]} />
      <View style={styles.labels}>
        <StyledText
          weight="600"
          style={[styles.label, mode === 'user' && styles.labelActive]}
        >
          User
        </StyledText>
        <StyledText
          weight="600"
          style={[styles.label, mode === 'worker' && styles.labelActive]}
        >
          Worker
        </StyledText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: PILL_WIDTH,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_WIDTH,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    top: 2,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    width: THUMB_WIDTH,
    textAlign: 'center',
  },
  labelActive: {
    color: '#1D9BF0',
  },
});
