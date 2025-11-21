import { RouteFeature } from '@stride-hub/shared';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  route: RouteFeature;
}

export const RouteCard = ({ route }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>Recommended loop</Text>
    <Text style={styles.detail}>{route.properties.distanceKm.toFixed(2)} km</Text>
    {route.properties.estimatedDurationMin ? (
      <Text style={styles.sub}>~{route.properties.estimatedDurationMin.toFixed(0)} min</Text>
    ) : null}
    <Text style={styles.sub}>Source: {route.properties.source}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a'
  },
  detail: {
    marginTop: 8,
    fontWeight: '600',
    color: '#0ea5e9'
  },
  sub: {
    color: '#475569',
    marginTop: 6
  }
});
