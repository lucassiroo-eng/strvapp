import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

import { StravaActivity } from '@stride-hub/shared';

import { api } from '../services/api';

export default function ActivityDetail() {
  const { id } = useLocalSearchParams();
  const [activity, setActivity] = useState<StravaActivity | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await api.get('/strava/activities', { params: { perPage: 50 } });
        const found = response.data.activities.find((a: StravaActivity) => a.id.toString() === id);
        setActivity(found ?? null);
      } catch (error) {
        setActivity(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading || !activity) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const distanceKm = (activity.distance / 1000).toFixed(2);
  const pace = activity.pace ? `${activity.pace.toFixed(2)} min/km` : '—';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{activity.name}</Text>
      <Text style={styles.meta}>{activity.type} · {distanceKm} km · {pace}</Text>
      {activity.mapPolyline ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
        >
          <Polyline
            coordinates={[]}
            strokeColor="#6366f1"
            strokeWidth={4}
          />
        </MapView>
      ) : (
        <View style={styles.placeholder}><Text>No map available</Text></View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: '#e2e8f0'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a'
  },
  meta: {
    color: '#475569'
  },
  map: {
    flex: 1,
    borderRadius: 12
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12
  }
});
