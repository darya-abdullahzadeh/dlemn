import { View, ViewProps, StyleSheet, Dimensions, Text } from 'react-native';
import { Image } from 'expo-image';
import { LayoutPresets, BorderRadius, Spacing } from '@/constants/layout';
import { Card } from './card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileCardProps extends ViewProps {
  /** Profile image URL */
  imageUrl?: string;
  /** Profile name */
  name?: string;
  /** Profile age */
  age?: number;
  /** Distance in km */
  distance?: number;
  /** Card height override */
  height?: number;
}

/**
 * ProfileCard - Main card component for displaying user profiles
 * Used in swipe/explore screens
 */
export function ProfileCard({
  imageUrl,
  name,
  age,
  distance,
  height,
  style,
  children,
  ...props
}: ProfileCardProps) {
  const cardHeight = height || LayoutPresets.profileCard.height;

  return (
    <Card
      variant="elevated"
      radius="xl"
      style={[styles.profileCard, { height: cardHeight }, style]}
      {...props}>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.info}>
          {name && (
            <View style={styles.nameRow}>
              <Card style={styles.nameCard} padding="sm" radius="md">
                <Text>
                  {name}
                  {age && `, ${age}`}
                </Text>
              </Card>
            </View>
          )}
          {distance !== undefined && (
            <View style={styles.distanceRow}>
              <Card style={styles.distanceCard} padding="xs" radius="sm">
                <Text>{distance} km away</Text>
              </Card>
            </View>
          )}
        </View>
      </View>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    width: LayoutPresets.profileCard.width,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  info: {
    padding: Spacing.md,
  },
  nameRow: {
    marginBottom: Spacing.xs,
  },
  nameCard: {
    alignSelf: 'flex-start',
  },
  distanceRow: {
    marginTop: Spacing.xs,
  },
  distanceCard: {
    alignSelf: 'flex-start',
  },
});
