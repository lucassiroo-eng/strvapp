import { ContentItem } from '@stride-hub/shared';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  item: ContentItem;
}

export const FeedCard = ({ item }: Props) => {
  const router = useRouter();
  const handlePress = () => {
    if (item.source === 'news') {
      router.push({ pathname: '/modals/webview', params: { url: item.url, title: item.title } });
    } else {
      Linking.openURL(item.url);
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      {item.thumbnail ? <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.source}>{item.source.toUpperCase()}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.snippet}>
          {item.snippet}
        </Text>
        <Text style={styles.date}>{new Date(item.publishedAt).toLocaleString()}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10
  },
  source: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700'
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a'
  },
  snippet: {
    color: '#475569',
    marginTop: 4
  },
  date: {
    marginTop: 6,
    color: '#64748b'
  }
});
