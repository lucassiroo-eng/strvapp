import { ContentItem } from '@stride-hub/shared';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { FeedCard } from '../components/FeedCard';
import { useTopics } from '../hooks/useTopics';
import { api } from '../services/api';

const DEFAULT_TOPICS = ['running', 'cycling', 'fitness'];

export default function FeedScreen() {
  const [feed, setFeed] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { topics } = useTopics(DEFAULT_TOPICS);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/feed', { params: { topics: topics.join(',') } });
      setFeed(response.data.feed);
    } catch (error) {
      setFeed([]);
    } finally {
      setLoading(false);
    }
  }, [topics]);

  const emptyState = (
    <View style={styles.empty}>
      <Text style={styles.heading}>Feed</Text>
      <Text>No items yet. Adjust your topics in Settings.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.heading}>Feed</Text>}
        renderItem={({ item }) => <FeedCard item={item} />}
        ListEmptyComponent={!loading ? emptyState : undefined}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 80, gap: 10 }}
        onLayout={load}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e8f0'
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    color: '#0f172a'
  },
  empty: {
    padding: 16,
    alignItems: 'center'
  }
});
