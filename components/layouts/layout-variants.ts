import { ViewStyle } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/layout';

/**
 * Layout Variants
 * Pre-defined style combinations for common layout patterns
 */

export const LayoutVariants = {
  // Screen layouts
  screen: {
    default: {
      flex: 1,
      padding: Spacing.md,
    },
    padded: {
      flex: 1,
      padding: Spacing.lg,
    },
    fullWidth: {
      flex: 1,
      paddingHorizontal: 0,
    },
  },

  // Card layouts
  card: {
    default: {
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
    },
    compact: {
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
    },
    spacious: {
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
    },
  },

  // Button containers
  buttonGroup: {
    horizontal: {
      flexDirection: 'row' as const,
      gap: Spacing.sm,
    },
    vertical: {
      flexDirection: 'column' as const,
      gap: Spacing.sm,
    },
    spaced: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      gap: Spacing.md,
    },
  },

  // Profile layouts
  profile: {
    header: {
      paddingBottom: Spacing.lg,
      marginBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    section: {
      marginBottom: Spacing.xl,
    },
    infoRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      paddingVertical: Spacing.sm,
    },
  },
} as const;

/**
 * Helper to merge layout variants
 */
export function mergeLayoutVariants(
  ...variants: (ViewStyle | undefined)[]
): ViewStyle {
  return Object.assign({}, ...variants.filter(Boolean));
}
