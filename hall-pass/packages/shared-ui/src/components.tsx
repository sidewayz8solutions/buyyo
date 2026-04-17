import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

// Design tokens
export const colors = {
  // Primary palette
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',
  
  // Backgrounds
  bgPrimary: '#0f0f1a',
  bgSecondary: '#1a1a2e',
  bgCard: '#16162a',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  
  // Accents
  accentGold: '#fbbf24',
  accentPink: '#f472b6',
  accentCyan: '#22d3ee',
  accentGreen: '#4ade80',
  accentRed: '#f87171',
  
  // Archetype colors
  jock: '#ef4444',
  nerd: '#3b82f6',
  popular: '#ec4899',
  goth: '#6366f1',
  artist: '#f59e0b',
  rebel: '#10b981',
  
  // UI states
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
};

// Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  style,
  icon,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${size}`],
    styles[`button_${variant}`],
    (disabled || loading) && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`buttonText_${variant}`],
    (disabled || loading) && styles.buttonTextDisabled,
  ];

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={buttonStyles}>
      {icon && <View style={styles.buttonIcon}>{icon}</View>}
      <Text style={textStyles}>{loading ? 'Loading...' : title}</Text>
    </TouchableOpacity>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} style={[styles.card, style]}>
      {children}
    </Wrapper>
  );
};

// Stat Badge Component
interface StatBadgeProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ label, value, max = 100, color = colors.accentCyan }) => {
  const percentage = (value / max) * 100;
  
  return (
    <View style={styles.statBadge}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={styles.statBarBg}>
        <View style={[styles.statBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

// Currency Display
interface CurrencyProps {
  amount: number;
  type: 'cool' | 'hallpass' | 'points';
  size?: 'sm' | 'md' | 'lg';
}

export const Currency: React.FC<CurrencyProps> = ({ amount, type, size = 'md' }) => {
  const config = {
    cool: { icon: '❄️', color: colors.accentCyan },
    hallpass: { icon: '🎟️', color: colors.accentGold },
    points: { icon: '⭐', color: colors.accentPink },
  };

  const { icon, color } = config[type];

  return (
    <View style={styles.currency}>
      <Text style={[styles.currencyIcon, { fontSize: size === 'sm' ? 12 : size === 'lg' ? 20 : 16 }]}>
        {icon}
      </Text>
      <Text style={[styles.currencyAmount, { color, fontSize: size === 'sm' ? 12 : size === 'lg' ? 20 : 16 }]}>
        {amount.toLocaleString()}
      </Text>
    </View>
  );
};

// Archetype Badge
interface ArchetypeBadgeProps {
  archetype: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ArchetypeBadge: React.FC<ArchetypeBadgeProps> = ({ archetype, size = 'md' }) => {
  const color = colors[archetype as keyof typeof colors] || colors.textSecondary;
  
  return (
    <View style={[styles.archetypeBadge, { backgroundColor: `${color}20`, borderColor: color }]}>
      <Text style={[styles.archetypeText, { color, fontSize: size === 'sm' ? 10 : size === 'lg' ? 16 : 12 }]}>
        {archetype.toUpperCase()}
      </Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  button_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  button_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  button_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.bgSecondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.button,
  },
  buttonText_primary: {
    color: colors.textPrimary,
  },
  buttonText_secondary: {
    color: colors.textPrimary,
  },
  buttonText_outline: {
    color: colors.primary,
  },
  buttonText_ghost: {
    color: colors.primary,
  },
  buttonTextDisabled: {
    color: colors.textMuted,
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statBadge: {
    marginVertical: spacing.sm,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  statValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statBarBg: {
    height: 6,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  currencyIcon: {
    fontSize: 16,
  },
  currencyAmount: {
    fontWeight: '700',
  },
  archetypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  archetypeText: {
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  Button,
  Card,
  StatBadge,
  Currency,
  ArchetypeBadge,
};
