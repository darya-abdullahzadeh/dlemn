import { View, ViewProps, StyleSheet } from 'react-native';
import { LayoutPresets, Spacing } from '@/constants/layout';
import { Screen } from './screen';

interface SwipeContainerProps extends ViewProps {
  /** Whether to show safe area */
  safe?: boolean;
}

/**
 * SwipeContainer - Container for swipe-based profile screens
 * Provides consistent padding and layout for dating app swipe interface
 */
export function SwipeContainer({
  children,
  safe = true,
  style,
  ...props
}: SwipeContainerProps) {
  return (
    <Screen safe={safe} style={[styles.container, style]} {...props}>
      <View style={styles.content}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: LayoutPresets.swipeContainer.paddingHorizontal,
    paddingTop: LayoutPresets.swipeContainer.paddingTop,
  },
});
