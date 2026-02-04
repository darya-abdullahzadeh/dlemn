import { View, ViewProps, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { LayoutPresets, BorderRadius } from '@/constants/layout';
import { Card } from './card';

interface MatchCardProps extends ViewProps {
  /** Match image URL */
  imageUrl?: string;
  /** Match name */
  name?: string;
  /** On press handler */
  onPress?: () => void;
}

/**
 * MatchCard - Compact card for displaying matches
 * Used in matches list/grid
 */
export function MatchCard({ imageUrl, name, onPress, style, ...props }: MatchCardProps) {
  const content = (
    <Card
      variant="elevated"
      radius="lg"
      style={[styles.matchCard, style]}
      {...props}>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}
      {name && (
        <View style={styles.nameContainer}>
          <Card style={styles.nameCard} padding="xs" radius="sm">
            <Text>{name}</Text>
          </Card>
        </View>
      )}
    </Card>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
}

const styles = StyleSheet.create({
  matchCard: {
    width: LayoutPresets.matchCard.width,
    height: LayoutPresets.matchCard.height,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  nameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  nameCard: {
    alignSelf: 'flex-start',
  },
});
