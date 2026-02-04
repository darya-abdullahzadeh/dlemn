import { View, ViewProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';

interface ScreenProps extends ViewProps {
  /** Whether to use safe area insets */
  safe?: boolean;
  /** Whether to use themed background */
  themed?: boolean;
}

/**
 * Screen component - Base layout for all screens
 * Handles safe areas and theming automatically
 */
export function Screen({ children, safe = true, themed = true, style, ...props }: ScreenProps) {
  const Component = themed ? ThemedView : View;
  const content = <Component style={[styles.screen, style]} {...props}>{children}</Component>;

  if (safe) {
    return <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>{content}</SafeAreaView>;
  }

  return content;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
