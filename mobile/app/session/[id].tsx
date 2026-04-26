import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useSession } from '../../src/hooks/useSession';
import { useFeedback } from '../../src/hooks/useFeedback';
import { DisciplineBadge } from '../../src/components/DisciplineBadge';
import { StatusBadge } from '../../src/components/StatusBadge';
import { FeedbackForm } from '../../src/components/FeedbackForm';
import { FeedbackDisplay } from '../../src/components/FeedbackDisplay';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { EmptyState } from '../../src/components/EmptyState';
import { getDisciplineColor } from '../../src/utils/discipline';
import { updateSessionStatus, deleteSession } from '../../src/services/session.service';
import { getComments, addComment } from '../../src/services/comment.service';
import { showAlert, showConfirm } from '../../src/utils/alert';
import { colors, spacing, typography, radius, shadows } from '../../src/styles/tokens';
import { useRouter } from 'expo-router';
import type { Comment } from '../../src/types';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser, role } = useAuth();
  const { session, loading, refetch } = useSession(id);
  const { feedback, loadFeedback, submitFeedback, submitting } = useFeedback(id);

  const isAthlete = role === 'ATHLETE';
  const isCoach = role === 'COACH';

  // Comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  const loadComments = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getComments(id);
      setComments(data);
    } catch {
      // silently fail
    }
  }, [id]);

  useEffect(() => {
    loadFeedback();
    loadComments();
  }, [loadFeedback, loadComments]);

  const handleSendComment = async () => {
    if (!id || !currentUser || !commentText.trim()) return;
    setSendingComment(true);
    try {
      await addComment(id, currentUser.id, commentText.trim());
      setCommentText('');
      loadComments();
    } catch {
      showAlert('Error', 'Failed to send comment');
    } finally {
      setSendingComment(false);
    }
  };

  const handleStatusChange = async (status: 'COMPLETED' | 'SKIPPED') => {
    if (!id) return;
    try {
      await updateSessionStatus(id, status);
      refetch();
      showAlert('Updated', `Session marked as ${status.toLowerCase()}`);
    } catch {
      showAlert('Error', 'Failed to update status');
    }
  };

  const handleDelete = () => {
    if (!id) return;
    showConfirm('Delete Session', 'Are you sure you want to delete this session?', async () => {
      try {
        await deleteSession(id);
        showAlert('Deleted', 'Session removed');
        router.back();
      } catch {
        showAlert('Error', 'Failed to delete session');
      }
    });
  };

  const handleFeedbackSubmit = async (data: { rpe: number; notes: string; completed: boolean }) => {
    if (!id || !currentUser) return;
    await submitFeedback({
      sessionId: id,
      athleteId: currentUser.id,
      ...data,
    });
    refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (!session) return <EmptyState message="Session not found" icon="alert-circle-outline" />;

  const borderColor = getDisciplineColor(session.discipline);
  const dateObj = new Date(session.date);
  const dateLabel = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: spacing.xxl + insets.bottom }]}>
      {/* Session info card */}
      <View style={styles.card}>
        <View style={[styles.topBorder, { backgroundColor: borderColor }]} />
        <Text style={styles.title}>{session.title}</Text>
        <View style={styles.badges}>
          <DisciplineBadge discipline={session.discipline} />
          <StatusBadge status={session.status} />
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{dateLabel}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{session.duration} minutes</Text>
        </View>
        {session.description && (
          <View style={styles.descSection}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.description}>{session.description}</Text>
          </View>
        )}
      </View>

      {/* Coach actions */}
      {isCoach && (
        <View style={styles.actionsCard}>
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete Session</Text>
          </Pressable>
        </View>
      )}

      {/* Athlete status buttons */}
      {isAthlete && session.status === 'PLANNED' && (
        <View style={styles.actionsCard}>
          <Pressable
            onPress={() => handleStatusChange('COMPLETED')}
            style={[styles.actionButton, { backgroundColor: colors.success }]}
          >
            <Text style={styles.actionText}>Mark Completed</Text>
          </Pressable>
          <Pressable
            onPress={() => handleStatusChange('SKIPPED')}
            style={[styles.actionButton, { backgroundColor: colors.warning }]}
          >
            <Text style={styles.actionText}>Mark Skipped</Text>
          </Pressable>
        </View>
      )}

      {/* Feedback */}
      {feedback || session.feedback ? (
        <FeedbackDisplay feedback={(feedback || session.feedback)!} />
      ) : isAthlete ? (
        <FeedbackForm onSubmit={handleFeedbackSubmit} submitting={submitting} />
      ) : null}

      {/* Comments Section */}
      <View style={styles.commentsCard}>
        <Text style={styles.commentsTitle}>Comments</Text>

        {comments.length === 0 ? (
          <View style={styles.noComments}>
            <Ionicons name="chatbubble-outline" size={32} color={colors.textLight} />
            <Text style={styles.noCommentsText}>No comments</Text>
          </View>
        ) : (
          comments.map((c) => (
            <View key={c.id} style={styles.commentBubble}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{c.author.name}</Text>
                <Text style={styles.commentRole}>
                  {c.author.role === 'COACH' ? 'Coach' : 'Athlete'}
                </Text>
              </View>
              <Text style={styles.commentText}>{c.text}</Text>
              <Text style={styles.commentTime}>
                {new Date(c.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        )}

        {/* Comment input */}
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor={colors.textLight}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <Pressable
            onPress={handleSendComment}
            disabled={!commentText.trim() || sendingComment}
            style={({ pressed }) => [
              styles.sendButton,
              (!commentText.trim() || sendingComment) && { opacity: 0.4 },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="send" size={20} color={colors.surface} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {},
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    margin: spacing.md,
    padding: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  topBorder: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
  },
  descSection: {
    marginTop: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  actionsCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  actionText: {
    ...typography.label,
    color: colors.surface,
  },
  deleteButton: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteText: {
    ...typography.label,
    color: colors.error,
  },
  commentsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    margin: spacing.md,
    ...shadows.md,
  },
  commentsTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noCommentsText: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.sm,
  },
  commentBubble: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  commentAuthor: {
    ...typography.label,
    color: colors.text,
    marginRight: spacing.sm,
  },
  commentRole: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  commentText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  commentTime: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 2,
    color: colors.text,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
