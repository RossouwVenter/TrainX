import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAthletes } from '../../src/hooks/useAthletes';
import { AthleteCard } from '../../src/components/AthleteCard';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { EmptyState } from '../../src/components/EmptyState';
import { createAthlete, deleteAthlete } from '../../src/services/athlete.service';
import { showAlert, showConfirm } from '../../src/utils/alert';
import { colors, spacing, typography, radius, shadows } from '../../src/styles/tokens';

export default function AthletesScreen() {
  const { athletes, loading, refetch } = useAthletes();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = athletes.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      showAlert('Missing Fields', 'Please enter both name and email.');
      return;
    }
    setSubmitting(true);
    try {
      await createAthlete(newName.trim(), newEmail.trim());
      setNewName('');
      setNewEmail('');
      setShowAddModal(false);
      refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to add athlete';
      showAlert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = (id: string, name: string) => {
    showConfirm(
      'Remove Athlete',
      `Are you sure you want to remove ${name}? All their sessions and feedback will be deleted.`,
      async () => {
        try {
          await deleteAthlete(id);
          refetch();
        } catch {
          showAlert('Error', 'Failed to remove athlete');
        }
      },
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search athletes..."
        placeholderTextColor={colors.textLight}
        value={search}
        onChangeText={setSearch}
      />
      {filtered.length === 0 ? (
        <EmptyState message="No athletes found" icon="people-outline" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AthleteCard
              athlete={item}
              onRemove={() => handleRemove(item.id, item.name)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Add Athlete FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="person-add" size={24} color={colors.surface} />
      </Pressable>

      {/* Add Athlete Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowAddModal(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add Athlete</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={colors.textLight}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={colors.textLight}
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.addButton, submitting && { opacity: 0.6 }]}
                onPress={handleAdd}
                disabled={submitting}
              >
                <Text style={styles.addText}>{submitting ? 'Adding...' : 'Add'}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    margin: spacing.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  list: {
    paddingBottom: spacing.xxl + 60,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  modalButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  cancelText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  addText: {
    ...typography.label,
    color: colors.surface,
  },
});
