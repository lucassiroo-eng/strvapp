import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useTopics = (initial: string[]) => {
  const [topics, setTopics] = useState<string[]>(initial);

  useEffect(() => {
    AsyncStorage.getItem('topics').then((stored) => {
      if (stored) setTopics(JSON.parse(stored));
    });
  }, []);

  const updateTopics = async (next: string[]) => {
    setTopics(next);
    await AsyncStorage.setItem('topics', JSON.stringify(next));
  };

  return { topics, updateTopics };
};
