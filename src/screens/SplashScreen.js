import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('@viraag_auth_token');
        const step = await AsyncStorage.getItem('@viraag_onboarding_step');
        
        // Add a slight delay for the splash animation
        setTimeout(() => {
          if (token) {
            if (step && step !== 'MainTabs') {
               navigation.replace(step);
            } else {
               navigation.replace('MainTabs');
            }
          } else {
            navigation.replace('Onboarding');
          }
        }, 3000);
      } catch (err) {
        navigation.replace('Onboarding');
      }
    };
    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../public/images/gifSplash.gif')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
});
