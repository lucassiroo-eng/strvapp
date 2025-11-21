import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTopics } from '../hooks/useTopics';
import { api } from '../services/api';

export default function SettingsScreen() {
  const { topics, updateTopics } = useTopics(['running', 'cycling', 'fitness']);
  const [input, setInput] = useState(topics.join(', '));

  useEffect(() => {
    setInput(topics.join(', '));
  }, [topics]);

  const saveTopics = () => {
    const parsed = input.split(',').map((t) => t.trim()).filter(Boolean);
    updateTopics(parsed);
  };

  const disconnect = async () => {
    await AsyncStorage.removeItem('tokens');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Feed topics (comma separated)</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="running, cycling, fitness"
        />
        <Button title="Save topics" onPress={saveTopics} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Strava connection</Text>
        <Button title="Connect" onPress={() => Linking.openURL(`${api.defaults.baseURL}/auth/strava/login`)} />
        <View style={{ height: 8 }} />
        <Button title="Disconnect" onPress={disconnect} color="#ef4444" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#e2e8f0' },
  heading: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  label: { fontWeight: '700', color: '#0f172a' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10
  }
});
