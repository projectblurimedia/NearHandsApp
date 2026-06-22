import React, { useRef, useState, useCallback } from 'react';
import {
  Animated, PanResponder, ScrollView,
  View, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from './StyledText';
import { useTheme } from '../hooks/useTheme';

const THRESHOLD = 70;   // px needed to trigger refresh
const MAX_PULL  = 85;   // max translateY during drag

/**
 * Instagram / Snapchat style pull-to-refresh:
 * – Content slides down as you drag, revealing the indicator above
 * – On release past THRESHOLD the refresh fires
 * – Content springs back when done
 */
export function PullRefreshScroll({
  onRefresh,
  children,
  contentContainerStyle,
  style,
  ...scrollProps
}) {
  const { colors } = useTheme();

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);

  const pullY   = useRef(new Animated.Value(0)).current;
  const isAtTop = useRef(true);

  const snapBack = useCallback(() => {
    setRefreshing(false);
    Animated.spring(pullY, {
      toValue:         0,
      friction:        7,
      tension:         55,
      useNativeDriver: true,
    }).start();
  }, [pullY]);

  const triggerRefresh = useCallback(() => {
    setRefreshing(true);
    // stay at a steady indicator height while loading
    Animated.spring(pullY, {
      toValue:         THRESHOLD * 0.65,
      friction:        8,
      tension:         50,
      useNativeDriver: true,
    }).start();

    const p = onRefresh?.();
    if (p && typeof p.then === 'function') {
      p.then(snapBack).catch(snapBack);
    } else {
      setTimeout(snapBack, 1000);
    }
  }, [onRefresh, pullY, snapBack]);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder:        () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        isAtTop.current &&
        !refreshing &&
        g.dy > 10 &&
        g.dy > Math.abs(g.dx) * 1.5,

      onPanResponderGrant: () => {
        setScrollEnabled(false);
      },

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          // resistance: pull harder = diminishing returns
          const pull = Math.min(g.dy * 0.52, MAX_PULL);
          pullY.setValue(pull);
        }
      },

      onPanResponderRelease: (_, g) => {
        setScrollEnabled(true);
        const effectivePull = g.dy * 0.52;
        if (effectivePull >= THRESHOLD * 0.8) {
          triggerRefresh();
        } else {
          Animated.spring(pullY, {
            toValue: 0, friction: 7, tension: 55, useNativeDriver: true,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        setScrollEnabled(true);
        Animated.spring(pullY, {
          toValue: 0, friction: 7, tension: 55, useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // Indicator fades/scales in as content moves down
  const indicatorOp = pullY.interpolate({
    inputRange:  [0, THRESHOLD * 0.4, THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  const indicatorScale = pullY.interpolate({
    inputRange:  [0, THRESHOLD],
    outputRange: [0.6, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.root, style]} {...pan.panHandlers}>

      {/* ── indicator sits above the sliding content ── */}
      <Animated.View
        style={[styles.indicator, { opacity: indicatorOp, transform: [{ scale: indicatorScale }] }]}
        pointerEvents="none"
      >
        {refreshing ? (
          <ActivityIndicator color="#1D9BF0" size="small" />
        ) : (
          <Ionicons name="arrow-down-circle" size={22} color="#1D9BF0" />
        )}
        <StyledText weight="500" style={[styles.indicatorText, { color: colors.subtext }]}>
          {refreshing ? 'Refreshing…' : 'Pull to refresh'}
        </StyledText>
      </Animated.View>

      {/* ── content slides down revealing the indicator ── */}
      <Animated.View style={[styles.content, { transform: [{ translateY: pullY }] }]}>
        <ScrollView
          {...scrollProps}
          scrollEnabled={scrollEnabled}
          contentContainerStyle={contentContainerStyle}
          onScroll={e => {
            isAtTop.current = e.nativeEvent.contentOffset.y <= 2;
            scrollProps.onScroll?.(e);
          }}
          scrollEventThrottle={scrollProps.scrollEventThrottle ?? 16}
        >
          {children}
        </ScrollView>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:     1,
    overflow: 'hidden',
  },
  indicator: {
    position:       'absolute',
    top:            8,
    left:           0,
    right:          0,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            6,
    zIndex:         0,
  },
  indicatorText: {
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
});
