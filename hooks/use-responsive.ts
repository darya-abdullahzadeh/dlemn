import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Screen } from '@/constants/layout';

/**
 * Hook for responsive design utilities
 * Returns breakpoint information and responsive values
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isSmall = width < 375;
    const isMedium = width >= 375 && width < 768;
    const isLarge = width >= 768;
    const isTablet = width >= 768;

    return {
      width,
      height,
      isSmall,
      isMedium,
      isLarge,
      isTablet,
      // Helper to get responsive value
      getValue: <T,>(values: { small?: T; medium?: T; large?: T; default: T }): T => {
        if (isSmall && values.small !== undefined) return values.small;
        if (isMedium && values.medium !== undefined) return values.medium;
        if (isLarge && values.large !== undefined) return values.large;
        return values.default;
      },
    };
  }, [width, height]);
}
