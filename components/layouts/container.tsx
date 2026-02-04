import { View, ViewProps, StyleSheet } from 'react-native';
import { ContainerWidth, Spacing } from '@/constants/layout';

interface ContainerProps extends ViewProps {
  /** Container max width preset */
  maxWidth?: keyof typeof ContainerWidth | 'full';
  /** Horizontal padding */
  paddingX?: keyof typeof Spacing;
  /** Vertical padding */
  paddingY?: keyof typeof Spacing;
  /** Center content horizontally */
  center?: boolean;
}

/**
 * Container component for consistent content width and padding
 * Use this to wrap page content for consistent layouts
 */
export function Container({
  children,
  maxWidth = 'full',
  paddingX = 'md',
  paddingY = 'md',
  center = false,
  style,
  ...props
}: ContainerProps) {
  const maxWidthValue = maxWidth === 'full' ? ContainerWidth.full : ContainerWidth[maxWidth];
  const paddingXValue = Spacing[paddingX];
  const paddingYValue = Spacing[paddingY];

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: maxWidthValue,
          paddingHorizontal: paddingXValue,
          paddingVertical: paddingYValue,
          alignSelf: center ? 'center' : 'stretch',
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
