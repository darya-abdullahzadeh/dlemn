import { View, ViewProps, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/layout';

interface RowProps extends ViewProps {
  /** Spacing between children */
  spacing?: keyof typeof Spacing;
  /** Horizontal alignment */
  align?: 'left' | 'center' | 'right' | 'stretch';
  /** Vertical alignment */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  /** Wrap children to next line */
  wrap?: boolean;
}

/**
 * Row component - Horizontal layout with consistent spacing
 * Similar to HStack in other UI libraries
 */
export function Row({
  children,
  spacing = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  style,
  ...props
}: RowProps) {
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
        styles.row,
        {
          gap: spacingValue,
          alignItems: alignItemsMap[align],
          justifyContent: justifyContentMap[justify],
          flexWrap: wrap ? 'wrap' : 'nowrap',
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
