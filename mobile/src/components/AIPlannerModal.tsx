import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, typography, radius, shadows } from '../styles/tokens';

interface AIPlannerModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onGenerate: (instructions: string) => void;
}

export function AIPlannerModal({ visible, loading, onClose, onGenerate }: AIPlannerModalProps) {
  const [instructions, setInstructions] = useState('');

  const handleGenerate = () => {
    if (!instructions.trim()) return;
    onGenerate(instructions.trim());
    setInstructions('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modal}>
            <Text style={styles.title}>AI Week Planner</Text>
            <Text style={styles.subtitle}>
              Describe the training week you want to generate
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g., Focus on swim technique, 3 bike sessions, 2 runs, 1 rest day"
              placeholderTextColor={colors.textLight}
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={4}
              editable={!loading}
            />

            <View style={styles.buttons}>
              <Pressable onPress={onClose} style={styles.cancelButton} disabled={loading}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleGenerate}
                disabled={!instructions.trim() || loading}
                style={[styles.generateButton, (!instructions.trim() || loading) && styles.disabled]}
              >
                <Text style={styles.generateText}>
                  {loading ? 'Generating...' : 'Generate'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 480,
    ...shadows.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  cancelText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  disabled: { opacity: 0.5 },
  generateText: {
    ...typography.label,
    color: colors.surface,
  },
});
