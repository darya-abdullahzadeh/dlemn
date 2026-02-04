import { Card, Container, Row, Screen, Stack } from '@/components/layouts';
import { MatchCard } from '@/components/layouts/match-card';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/auth-context';
import { getMatches, Match } from '@/lib/matches-service';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function MatchesScreen() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getMatches();
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setMatches(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Screen>
        <Container>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ActivityIndicator size="large" />
            <ThemedText>Loading matches...</ThemedText>
          </Stack>
        </Container>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Container>
          <Stack spacing="lg" align="center" justify="center" className="flex-1">
            <ThemedText type="subtitle">Error loading matches</ThemedText>
            <ThemedText>{error.message || 'Please try again later'}</ThemedText>
          </Stack>
        </Container>
      </Screen>
    );
  }

  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <ThemedText type="title">Matches</ThemedText>
          <ThemedText type="subtitle">People you've matched with</ThemedText>

          {matches.length === 0 ? (
            <Card variant="outlined" padding="xl">
              <Stack spacing="md" align="center">
                <ThemedText type="subtitle">No matches yet</ThemedText>
                <ThemedText>Start swiping to find your match!</ThemedText>
              </Stack>
            </Card>
          ) : (
            <Row spacing="md" wrap>
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  imageUrl={match.matched_user?.profile_photo_url}
                  name={match.matched_user?.location || 'Match'}
                  onPress={() => {
                    router.push(`/(tabs)/match/${match.id}`);
                  }}
                />
              ))}
            </Row>
          )}
        </Stack>
      </Container>
    </Screen>
  );
}
