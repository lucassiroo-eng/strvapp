import { StravaActivity } from '@stride-hub/shared';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  activity: StravaActivity;
}

export const ActivityCard = ({ activity }: Props) => {
  const distanceKm = (activity.distance / 1000).toFixed(2);
  const pace = activity.pace ? `${activity.pace.toFixed(2)} min/km` : '—';
  return (
    <Link href={{ pathname: '/activities/[id]', params: { id: activity.id } }} asChild>
      <View style={styles.card}>
        <Text style={styles.title}>{activity.name}</Text>
        <Text style={styles.meta}>{activity.type}</Text>
        <Text style={styles.detail}>{distanceKm} km · {pace}</Text>
        <Text style={styles.date}>{new Date(activity.startDateLocal).toLocaleString()}</Text>
      </View>
    </Link>
  );
};

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
  meta: {
    color: '#475569',
    marginTop: 4
  },
  detail: {
    marginTop: 8,
    fontWeight: '600',
    color: '#0f172a'
  },
  date: {
    marginTop: 6,
    color: '#475569'
  }
});
