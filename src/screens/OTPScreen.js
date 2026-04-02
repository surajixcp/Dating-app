import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';

export default function OTPScreen({ route, navigation }) {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);
  
  const mobile = route.params?.mobile; // Passed from PhoneNumberScreen

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-advance
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = code.join('');
    if (otpString.length < 4) {
      Alert.alert('Incomplete OTP', 'Please enter all 4 digits.');
      return;
    }

    if (!mobile) {
      Alert.alert('Error', 'Mobile number is missing. Please go back and re-enter your number.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/verifyOtp', {
        mobile: mobile,
        otp: otpString
      });
      
      if (response.data && response.data.token) {
        // Save Token Securely
        await AsyncStorage.setItem('@viraag_auth_token', response.data.token);
        await AsyncStorage.setItem('@viraag_user_mobile', String(mobile));
        
        let nextRoute = 'ProfileDetails';
        const st = response.data.status;
        if (st) {
          if (st.is_profile_5) nextRoute = 'MainTabs';
          else if (st.is_profile_4) nextRoute = 'AddPhotos';
          else if (st.is_profile_3) nextRoute = 'DescribeYourself';
          else if (st.is_profile_2) nextRoute = 'Lifestyle';
          else if (st.is_profile_1) nextRoute = 'Interests';
          else nextRoute = 'ProfileDetails';
          
          if (st.is_oldUser && nextRoute !== 'MainTabs') {
            nextRoute = 'MainTabs';
          }
        }
        
        await AsyncStorage.setItem('@viraag_onboarding_step', nextRoute);
        navigation.navigate(nextRoute);
      } else {
        Alert.alert('Wait', response.data?.message || 'OTP Valid but no token received.');
      }
    } catch (error) {
      console.log('OTP Verification Error:', error);
      const msg = error.response?.data?.message || 'Invalid OTP or Network Error.';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!mobile) return;
    try {
      await apiClient.post('/auth/sendOtptoRegister', {
        mobile: mobile,
        role_type: 'User'
      });
      Alert.alert('OTP Resent', 'A new verification code has been sent to your device.');
    } catch (error) {
      Alert.alert('Error', 'Could not resend OTP.');
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
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>Please enter the verification code sent to your phone number.</Text>

            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
                <View key={index} style={styles.otpBox}>
                  <TextInput
                    ref={ref => inputs.current[index] = ref}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    cursorColor={COLORS.primary}
                    editable={!isLoading}
                  />
                </View>
              ))}
            </View>

            <View style={styles.resendContainer}>
              <Text style={styles.resendBaseText}>Didn't receive OTP? </Text>
              <TouchableOpacity onPress={handleResend} disabled={isLoading}>
                <Text style={styles.resendHighlightText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify} disabled={isLoading}>
              <LinearGradient colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.verifyText}>Verify</Text>
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
  content: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 40 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, marginBottom: 12 },
  subtitle: { fontSize: 16, color: COLORS.textDark, textAlign: 'center', lineHeight: 26, marginBottom: 40, fontWeight: '500' },
  
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, width: '100%', marginBottom: 40 },
  otpBox: { width: 64, height: 64, borderRadius: SIZES.radiusMedium, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  otpInput: { width: '100%', height: '100%', textAlign: 'center', fontSize: 24, fontWeight: '800', color: COLORS.primary },

  resendContainer: { flexDirection: 'row', alignItems: 'center' },
  resendBaseText: { fontSize: 15, color: COLORS.textDark, fontWeight: '600' },
  resendHighlightText: { fontSize: 15, color: COLORS.primary, fontWeight: '800', textDecorationLine: 'underline' },

  bottomSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  verifyBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  verifyText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});

