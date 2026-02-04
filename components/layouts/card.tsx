import { View, ViewProps, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing } from '@/constants/layout';

interface CardProps extends ViewProps {
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Padding inside card */
  padding?: keyof typeof Spacing;
  /** Border radius */
  radius?: keyof typeof BorderRadius;
}

/**
 * Card component - Reusable card container with variants
 */
export function Card({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'lg',
  style,
  ...props
}: CardProps) {
  const paddingValue = Spacing[padding];
  const radiusValue = BorderRadius[radius];

  return (
    <ThemedView
      style={[
        styles.card,
        styles[variant],
        {
          padding: paddingValue,
          borderRadius: radiusValue,
        },
        style,
      ]}
      {...props}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  default: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  elevated: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});
