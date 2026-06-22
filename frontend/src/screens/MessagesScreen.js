import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { StyledText } from '../components/StyledText';
import { PullRefreshScroll } from '../components/PullRefreshScroll';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';
import { SPACING, RADIUS, SHADOW } from '../constants/layout';

const MOCK_CHATS = [
  {
    id: '1',
    name: 'Raju Kumar',
    skill: 'Electrician',
    lastMsg: 'I can come tomorrow at 10 AM, is that fine?',
    time: '2m ago',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Suresh Babu',
    skill: 'Plumber',
    lastMsg: 'Work is done. Please confirm the payment.',
    time: '1h ago',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Mohan Lal',
    skill: 'Carpenter',
    lastMsg: 'Sure, I will bring the required tools.',
    time: '3h ago',
    unread: 1,
    online: true,
  },
  {
    id: '4',
    name: 'Venkat Rao',
    skill: 'Painter',
    lastMsg: 'The estimate for your work is ₹3,500.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Ramesh Yadav',
    skill: 'Mason',
    lastMsg: 'Hello, I saw your request on NearHands.',
    time: '2d ago',
    unread: 0,
    online: false,
  },
];

export function MessagesScreen() {
  const { colors } = useTheme();
  const { showToast } = useApp();
  const onRefresh = () => new Promise(r => setTimeout(r, 800));
  const [chats] = useState(MOCK_CHATS);

  const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0);

  return (
    <ScreenLayout title="Messages">
      <PullRefreshScroll
        onRefresh={onRefresh}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* summary strip */}
        {totalUnread > 0 && (
          <View style={[styles.unreadStrip, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <View style={styles.unreadDot} />
            <StyledText weight="600" style={{ color: '#1e40af', fontSize: 13 }}>
              {totalUnread} unread message{totalUnread > 1 ? 's' : ''}
            </StyledText>
          </View>
        )}

        {chats.map(chat => (
          <TouchableOpacity
            key={chat.id}
            style={[styles.chatRow, SHADOW, { backgroundColor: colors.card }]}
            activeOpacity={0.8}
            onPress={() => showToast(`Opening chat with ${chat.name}`, 'info')}
          >
            {/* avatar */}
            <View style={[styles.avatar, { backgroundColor: '#1D9BF0' }]}>
              <StyledText weight="700" style={styles.avatarLetter}>
                {chat.name[0]}
              </StyledText>
              {chat.online && <View style={styles.onlineDot} />}
            </View>

            {/* content */}
            <View style={styles.chatContent}>
              <View style={styles.chatTop}>
                <StyledText weight="600" style={[styles.chatName, { color: colors.text }]}>
                  {chat.name}
                </StyledText>
                <StyledText weight="400" style={[styles.chatTime, { color: colors.subtext }]}>
                  {chat.time}
                </StyledText>
              </View>
              <View style={styles.chatBottom}>
                <StyledText
                  weight={chat.unread > 0 ? '500' : '400'}
                  numberOfLines={1}
                  style={[
                    styles.chatPreview,
                    { color: chat.unread > 0 ? colors.text : colors.subtext },
                  ]}
                >
                  {chat.lastMsg}
                </StyledText>
                {chat.unread > 0 && (
                  <View style={styles.badge}>
                    <StyledText weight="700" style={styles.badgeText}>{chat.unread}</StyledText>
                  </View>
                )}
              </View>
              <StyledText weight="400" style={[styles.chatSkill, { color: colors.subtext }]}>
                {chat.skill}
              </StyledText>
            </View>
          </TouchableOpacity>
        ))}

        {/* empty hint */}
        <View style={styles.hint}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.border} />
          <StyledText weight="400" style={[styles.hintText, { color: colors.subtext }]}>
            Contacts unlocked via ₹10 reveal appear here
          </StyledText>
        </View>
      </PullRefreshScroll>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  unreadStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    marginBottom: SPACING.xs,
  },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#1D9BF0',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  avatarLetter: { color: '#fff', fontSize: 20 },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#10b981', borderWidth: 2, borderColor: '#fff',
  },
  chatContent: { flex: 1 },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 14 },
  chatTime: { fontSize: 11 },
  chatBottom: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 2,
  },
  chatPreview: { flex: 1, fontSize: 12, marginRight: 6 },
  badge: {
    backgroundColor: '#1D9BF0', width: 20, height: 20,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10 },
  chatSkill: { fontSize: 10, marginTop: 2, opacity: 0.7 },
  hint: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingTop: SPACING.md,
  },
  hintText: { fontSize: 11 },
});
