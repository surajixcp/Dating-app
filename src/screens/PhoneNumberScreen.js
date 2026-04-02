import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';

export default function PhoneNumberScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (phoneNumber.trim().length < 5) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Call the API
      const response = await apiClient.post('/auth/sendOtptoRegister', {
        mobile: phoneNumber.trim(), // Use phoneNumber.trim() as mobileNumber
    
    
           role_type: 'User'
      });
      
      if (response.data && response.data.success) {
        // Pass the mobile number to the OTP screen so it knows what to verify
        navigation.navigate('OTP', { mobile: phoneNumber.trim() });
      } else {
        Alert.alert('Wait', response.data?.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.log('OTP Generation Error:', error);
      const msg = error.response?.data?.message || 'Network error ensuring OTP delivery.';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../public/images/background_img.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.content}>
            <Text style={styles.title}>My Number Is</Text>
            <Text style={styles.subtitle}>We'll need your phone number to{'\n'}send an OTP for verification.</Text>

            <View style={styles.inputContainer}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.flagText}>🇮🇳</Text>
                <Text style={styles.countryCodeText}>+91</Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.textLight} style={{ marginLeft: 2 }} />
              </View>
              <View style={styles.divider} />
              <TextInput 
                style={styles.numberInput} 
                placeholder="Enter phone number" 
                placeholderTextColor={COLORS.textLight} 
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={isLoading}>
              <LinearGradient colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.continueText}>Continue</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  
  keyboardView: { flex: 1, justifyContent: 'space-between' },
  content: { paddingHorizontal: 32, paddingTop: 40 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, marginBottom: 16 },
  subtitle: { fontSize: 16, color: COLORS.textDark, lineHeight: 26, marginBottom: 40, fontWeight: '500' },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: SIZES.radiusLarge, height: 60, paddingHorizontal: 16, width: '100%', ...SHADOWS.light },
  countryCodeBox: { flexDirection: 'row', alignItems: 'center' },
  flagText: { fontSize: 20, marginRight: 6 },
  countryCodeText: { fontSize: 16, color: COLORS.textDark, fontWeight: '600' },
  divider: { width: 1, height: 28, backgroundColor: COLORS.border, marginHorizontal: 16 },
  numberInput: { flex: 1, height: '100%', fontSize: 18, color: COLORS.textDark, fontWeight: '600' },

  bottomSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  continueBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  continueText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});

