import { View, ViewProps, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/layout';

interface StackProps extends ViewProps {
  /** Spacing between children */
  spacing?: keyof typeof Spacing;
  /** Horizontal alignment */
  align?: 'left' | 'center' | 'right' | 'stretch';
  /** Vertical alignment */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
}

/**
 * Stack component - Vertical layout with consistent spacing
 * Similar to VStack in other UI libraries
 */
export function Stack({
  children,
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  style,
  ...props
}: StackProps) {
  const spacingValue = Spacing[spacing];
  const alignItemsMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    stretch: 'stretch',
  } as const;

  const justifyContentMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    'space-between': 'space-between',
    'space-around': 'space-around',
  } as const;

  return (
    <View
      style={[
        styles.stack,
        {
          gap: spacingValue,
          alignItems: alignItemsMap[align],
          justifyContent: justifyContentMap[justify],
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'column',
  },
});
