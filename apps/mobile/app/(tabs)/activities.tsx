import { StravaActivity } from '@stride-hub/shared';
import * as Linking from 'expo-linking';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard } from '../components/ActivityCard';
import { api } from '../services/api';

export default function ActivitiesScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<StravaActivity[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/strava/activities', { params: { perPage: 20 } });
      setActivities(response.data.activities);
    } catch (err) {
      setError('Connect Strava to view activities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Recent Activities</Text>
        <Text style={styles.description}>{error}</Text>
        <Button title="Connect Strava" onPress={() => Linking.openURL(`${api.defaults.baseURL}/auth/strava/login`)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Recent Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ActivityCard activity={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e2e8f0'
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    color: '#0f172a'
  },
  description: {
    color: '#475569',
    marginBottom: 12
  }
});
