import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from './src/services/revenuecat';
import AppNavigator from './src/navigation/AppNavigator';
import apiClient from './src/services/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E94057',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    // Generate token without explicit project ID dependency
    token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Seamlessly sync the token to MongoDB if they are logged in!
    try {
        const authToken = await AsyncStorage.getItem('@viraag_auth_token');
        if (authToken) {
            await apiClient.post('/profile/updatePushToken', { pushToken: token });
        }
    } catch (e) {
        console.log("Could not sync push token", e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Initialize RevenueCat for universal subscription unlocking
    // Guard: Native modules required, skip on web or if running in Expo Go without native side
    const initPurchases = async () => {
      try {
        if (Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: "appl_REVENUECAT_IOS_KEY" });
        } else if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: "goog_REVENUECAT_ANDROID_KEY" });
        }
      } catch (e) {
        console.warn("RevenueCat Configuration Error:", e.message);
      }
    };

    if (Platform.OS !== 'web') {
      initPurchases();
    } else {
      console.log("RevenueCat disabled in Browser Mode");
    }

    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Clicked:', response);
    });

    return () => {
      notificationListener.current && notificationListener.current.remove();
      responseListener.current && responseListener.current.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
