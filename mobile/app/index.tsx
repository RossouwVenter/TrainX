import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
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
import type { Role } from '../src/types';

export default function RolePicker() {
  const router = useRouter();
  const { login, signup, loading, role, currentUser, error, clearError } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If already authenticated, go to tabs
  React.useEffect(() => {
    if (currentUser && role) {
      router.replace('/(tabs)/schedule');
    }
  }, [currentUser, role]);

  const handleSubmit = async () => {
    if (!selectedRole) return;
    try {
      if (isSignup) {
        await signup(email, password, name, selectedRole);
      } else {
        await login(email, password);
      }
      router.replace('/(tabs)/schedule');
    } catch {
      // error is set in context
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Auth form (for both Coach and Athlete)
  if (selectedRole) {
    const isCoach = selectedRole === 'COACH';
    const accentColor = isCoach ? colors.primary : colors.secondary;
    const roleLabel = isCoach ? 'Coach' : 'Athlete';

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.headerSection, { backgroundColor: accentColor }]}>
            <Pressable
              onPress={() => {
                setSelectedRole(null);
                setIsSignup(false);
                setEmail('');
                setPassword('');
                setName('');
                setShowPassword(false);
                clearError();
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={accentColor} />
            </Pressable>
            <Text style={styles.title}>{isSignup ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.subtitle}>
              {isSignup ? `Sign up as ${roleLabel}` : `Sign in as ${roleLabel}`}
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
                placeholder={isCoach ? 'coach@example.com' : 'athlete@example.com'}
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
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textLight}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.submitButton,
                { backgroundColor: accentColor },
                pressed && styles.pressed,
              ]}
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
              <Text style={[styles.toggleText, { color: accentColor }]}>
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
          onPress={() => setSelectedRole('COACH')}
          style={({ pressed }) => [styles.roleCard, styles.coachCard, pressed && styles.pressed]}
        >
          <View style={styles.roleIcon}>
            <Ionicons name="clipboard-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.roleTitle}>Coach</Text>
          <Text style={styles.roleDesc}>Create programs & manage athletes</Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedRole('ATHLETE')}
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
  // Auth form
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
  // Auth form
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  eyeButton: {
    padding: spacing.md,
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
