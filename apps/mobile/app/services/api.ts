import axios from 'axios';
import Constants from 'expo-constants';

const apiBaseUrl = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:4000';

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000
});
