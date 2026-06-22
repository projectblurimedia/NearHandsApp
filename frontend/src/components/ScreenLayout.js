import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GradientHeader } from './GradientHeader';
import { Sidebar } from './Sidebar';
import { Toast } from './Toast';
import { ConfirmationModal } from './ConfirmationModal';
import { MenuPageModal } from './MenuPageModal';
import { useTheme } from '../hooks/useTheme';

export function ScreenLayout({ children, title }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <GradientHeader title={title} />
      <View style={styles.content}>{children}</View>
      <Sidebar />
      <Toast />
      <ConfirmationModal />
      <MenuPageModal />
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  content: { flex: 1 },
});
