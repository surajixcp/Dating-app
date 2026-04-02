import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

export default function OnboardingScreen({ navigation }) {
  return (
    <ImageBackground 
      source={require('../../public/images/background_img.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} showsVerticalScrollIndicator={false}>
          {/* Logo and Titles */}
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../public/images/logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
            </View>
            
            <Text style={styles.brandTitle}>Viraag</Text>
            
            <Text style={styles.subtitle}>
              Welcome to viraag the ultimate key of love, friendship, and happiness.
            </Text>
            <Text style={styles.bodyText}>
              Start your journey with us please take a moment to share a bit about yourself.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('ProfileDetails')}>
              <View style={styles.btnContent}>
                <Image source={require('../../public/images/google.png')} style={styles.loginIcon} />
                <Text style={styles.loginText}>Sign in with Google</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('ProfileDetails')}>
              <View style={styles.btnContent}>
                <Image source={require('../../public/images/facebook.png')} style={styles.loginIcon} />
                <Text style={styles.loginText}>Sign in with Facebook</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('PhoneNumber')}>
              <View style={styles.btnContent}>
                <Image source={require('../../public/images/phone.png')} style={[styles.loginIcon, { tintColor: COLORS.primary }]} />
                <Text style={styles.loginText}>Sign in with Phone number</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.privacyBtn} onPress={() => Alert.alert('Privacy Policy', 'We value your privacy. Your data is strictly protected and encrypted.')}>
              <Text style={styles.privacyText}>Please check the Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  topSection: { alignItems: 'center', marginTop: 40, paddingHorizontal: 32 },
  logoContainer: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center', marginBottom: 24, ...SHADOWS.medium },
  logoImage: { width: 110, height: 110 },
  brandTitle: { fontSize: 36, fontFamily: 'serif', fontWeight: '800', color: COLORS.primary, marginBottom: 24, fontStyle: 'italic', textAlign: 'center' },
  subtitle: { fontSize: 15, color: COLORS.textDark, textAlign: 'center', fontWeight: '600', marginBottom: 16, lineHeight: 22 },
  bodyText: { fontSize: 13, color: COLORS.textLight, textAlign: 'center', fontWeight: '500', lineHeight: 20 },

  bottomSection: { paddingHorizontal: 32, paddingBottom: 40 },
  loginBtn: { height: 56, borderRadius: SIZES.radiusLarge, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...SHADOWS.light },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  loginIcon: { width: 24, height: 24, marginRight: 16 },
  loginText: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  
  privacyBtn: { marginTop: 24, alignItems: 'center' },
  privacyText: { fontSize: 14, fontWeight: '800', color: COLORS.primary }
});

