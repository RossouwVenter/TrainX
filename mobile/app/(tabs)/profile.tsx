import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { colors, spacing, typography, radius, shadows } from '../../src/styles/tokens';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, role, switchRole } = useAuth();

  const handleSwitchRole = () => {
    switchRole();
    router.replace('/');
  };

  if (!currentUser) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name={role === 'COACH' ? 'clipboard' : 'body'}
              size={14}
              color={colors.primary}
            />
            <Text style={styles.roleText}>{role}</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleSwitchRole}
        style={({ pressed }) => [styles.switchButton, pressed && styles.pressed]}
      >
        <Ionicons name="swap-horizontal" size={20} color={colors.error} />
        <Text style={styles.switchText}>Switch Role</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  roleText: {
    ...typography.label,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  pressed: { opacity: 0.8 },
  switchText: {
    ...typography.label,
    color: colors.error,
    marginLeft: spacing.sm,
  },
});
