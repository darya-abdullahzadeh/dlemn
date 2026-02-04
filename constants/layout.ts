import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Layout Constants
 * Centralized spacing, sizing, and breakpoint system for consistent layouts
 */

// Spacing Scale (8px base unit)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Border Radius Scale
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Screen Dimensions
export const Screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768,
  isLarge: SCREEN_WIDTH >= 768,
  isTablet: SCREEN_WIDTH >= 768,
} as const;

// Container Max Widths
export const ContainerWidth = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  full: '100%',
} as const;

// Z-Index Scale
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Layout Presets for Dating App
export const LayoutPresets = {
  // Card dimensions for profile cards
  profileCard: {
    width: SCREEN_WIDTH - Spacing.md * 2,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: BorderRadius.xl,
  },
  // Match card (smaller)
  matchCard: {
    width: 120,
    height: 160,
    borderRadius: BorderRadius.lg,
  },
  // Swipe container
  swipeContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
} as const;

// Safe Area Insets (will be used with react-native-safe-area-context)
export const SafeArea = {
  top: Platform.OS === 'ios' ? 44 : 0,
  bottom: Platform.OS === 'ios' ? 34 : 0,
} as const;
