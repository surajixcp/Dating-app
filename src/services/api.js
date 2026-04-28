import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Connection to live Render deployment
export const BASE_URL = 'https://virag-ehrp.onrender.com';
export const API_URL = `${BASE_URL}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if it exists
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@viraag_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Assuming Bearer strategy
      }
    } catch (e) {
      console.error('Error reading token inside API interceptor', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If we receive a 401 Unauthorized, we might want to automatically log the user out
    if (error.response && error.response.status === 401) {
      console.warn("API returned 401 Unauthorized. Token may be expired.");
      // Optional: await AsyncStorage.removeItem('@viraag_auth_token');
      // Optional: Dispatch event to navigation to reset to Auth stack
    }
    return Promise.reject(error);
  }
);

export default apiClient;
