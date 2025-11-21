import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebviewModal() {
  const { url, title } = useLocalSearchParams();
  const router = useRouter();

  if (!url || Array.isArray(url)) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Invalid article URL.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: (title as string) || 'Preview' }} />
      <WebView source={{ uri: url }} startInLoadingState onError={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
