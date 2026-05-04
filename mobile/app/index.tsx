import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { colors, spacing, typography, radius, shadows } from '../src/styles/tokens';
import type { User } from '../src/types';

export default function RolePicker() {
  const router = useRouter();
  const {
    selectRole,
    selectAthlete,
    loginAsCoach,
    signupAsCoach,
    athletes,
    loading,
    role,
    currentUser,
    error,
    clearError,
  } = useAuth();
  const [showAthletes, setShowAthletes] = useState(false);
  const [showCoachAuth, setShowCoachAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // If already authenticated, go to tabs
  React.useEffect(() => {
    if (currentUser && role) {
      router.replace('/(tabs)/schedule');
    }
  }, [currentUser, role]);

  const handleCoachSubmit = async () => {
    try {
      if (isSignup) {
        await signupAsCoach(email, password, name);
      } else {
        await loginAsCoach(email, password);
      }
      router.replace('/(tabs)/schedule');
    } catch {
      // error is set in context
    }
  };

  const handleAthlete = async () => {
    await selectRole('ATHLETE');
    setShowAthletes(true);
  };

  const handlePickAthlete = (athlete: User) => {
    selectAthlete(athlete);
    router.replace('/(tabs)/schedule');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Coach auth form
  if (showCoachAuth) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
          <View style={styles.headerSection}>
            <Pressable
              onPress={() => {
                setShowCoachAuth(false);
                clearError();
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </Pressable>
            <Text style={styles.title}>{isSignup ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.subtitle}>
              {isSignup ? 'Sign up as a Coach' : 'Sign in to your Coach account'}
            </Text>
          </View>

          <View style={styles.formSection}>
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {isSignup && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textLight}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="coach@example.com"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable
              onPress={handleCoachSubmit}
              disabled={loading}
              style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
            >
              <Text style={styles.submitText}>{isSignup ? 'Sign Up' : 'Sign In'}</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsSignup(!isSignup);
                clearError();
              }}
              style={styles.toggleLink}
            >
              <Text style={styles.toggleText}>
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (showAthletes && athletes.length > 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Pressable onPress={() => setShowAthletes(false)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.title}>Select Athlete</Text>
          <Text style={styles.subtitle}>Choose your profile</Text>
        </View>
        <FlatList
          data={athletes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePickAthlete(item)}
              style={({ pressed }) => [styles.athleteItem, pressed && styles.pressed]}
            >
              <View style={styles.athleteAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.athleteInfo}>
                <Text style={styles.athleteName}>{item.name}</Text>
                <Text style={styles.athleteEmail}>{item.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </Pressable>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.logoCircle}>
          <Ionicons name="fitness" size={48} color={colors.surface} />
        </View>
        <Text style={styles.heroTitle}>Ventri</Text>
        <Text style={styles.heroSubtitle}>Your training companion</Text>
      </View>
      <View style={styles.cardsSection}>
        <Text style={styles.chooseLabel}>I am a...</Text>
        <Pressable
          onPress={() => setShowCoachAuth(true)}
          style={({ pressed }) => [styles.roleCard, styles.coachCard, pressed && styles.pressed]}
        >
          <View style={styles.roleIcon}>
            <Ionicons name="clipboard-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.roleTitle}>Coach</Text>
          <Text style={styles.roleDesc}>Create programs & manage athletes</Text>
        </Pressable>
        <Pressable
          onPress={handleAthlete}
          style={({ pressed }) => [styles.roleCard, styles.athleteCard, pressed && styles.pressed]}
        >
          <View style={[styles.roleIcon, { backgroundColor: colors.secondary + '15' }]}>
            <Ionicons name="body-outline" size={32} color={colors.secondary} />
          </View>
          <Text style={styles.roleTitle}>Athlete</Text>
          <Text style={styles.roleDesc}>View schedule & submit feedback</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: spacing.xl,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  cardsSection: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  chooseLabel: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.md,
  },
  coachCard: {},
  athleteCard: {},
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  roleTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  roleDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Athlete picker
  headerSection: {
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  list: {
    padding: spacing.md,
  },
  athleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  athleteAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: colors.primary,
  },
  athleteInfo: { flex: 1 },
  athleteName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  athleteEmail: {
    ...typography.caption,
    color: colors.textLight,
  },
  // Coach auth form
  authScroll: {
    flexGrow: 1,
  },
  formSection: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  submitText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
  toggleLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  toggleText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    flex: 1,
  },
});
