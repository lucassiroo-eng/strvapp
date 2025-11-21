import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

import { RouteFeature } from '@stride-hub/shared';

import { RouteCard } from '../components/RouteCard';
import { api } from '../services/api';

export default function RoutesScreen() {
  const [distanceKm, setDistanceKm] = useState(5);
  const [route, setRoute] = useState<RouteFeature | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    try {
      const response = await api.post('/routes/generate', {
        locationLatLng: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
        distanceKm,
        activityType: 'Run'
      });
      setRoute(response.data.route);
    } catch (error) {
      setRoute(null);
    } finally {
      setLoading(false);
    }
  }, [distanceKm]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.heading}>Routes</Text>
        <Text style={styles.label}>Distance: {distanceKm.toFixed(1)} km</Text>
        <View style={{ marginVertical: 12 }}>
          <Slider
            minimumValue={1}
            maximumValue={20}
            step={0.5}
            value={distanceKm}
            onValueChange={setDistanceKm}
          />
        </View>
        <Button title={loading ? 'Generating...' : 'Generate route'} onPress={generate} />
        {route ? <RouteCard route={route} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e2e8f0' },
  heading: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  label: { marginTop: 12, fontWeight: '600', color: '#475569' }
});
