import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DescribeYourselfScreen({ navigation }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      let lat = (await AsyncStorage.getItem('@viraag_latitude')) || '28.6139';
      let lon = (await AsyncStorage.getItem('@viraag_longitude')) || '77.2090';

      const formData = new FormData();
      if (text) formData.append('selfDescription', text);
      formData.append('latitude', lat);
      formData.append('longitude', lon);
      formData.append('pageNumber', '4');

      const response = await apiClient.put('/profile/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.success) {
        await AsyncStorage.setItem('@viraag_onboarding_step', 'AddPhotos');
        navigation.navigate('AddPhotos');
      } else {
        Alert.alert('Wait', response.data?.message || 'Failed to save description');
      }
    } catch (error) {
      console.log('Description save error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../public/images/background_img.png')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AddPhotos')} disabled={isLoading}>
             <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.stepperRow}>
              <View style={styles.stepDot} />
              <View style={styles.stepDot} />
              <View style={styles.stepDot} />
              <View style={[styles.stepDot, styles.stepActive]} />
            </View>

            <Text style={styles.title}>Describe <Text style={styles.titleItalic}>yourself</Text></Text>
            <Text style={styles.subtitle}>
              Love is not about finding the right person, but creating the right relationship so Express your thoughts for love, friendship write some lines why someone looking you as a life partner or friend or others.
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Write your thoughts...</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                  multiline
                  textAlignVertical="top"
                  editable={!isLoading}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomSection}>
             <TouchableOpacity style={styles.nextBtn} onPress={handleNext} disabled={isLoading}>
              <LinearGradient colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.nextText}>Next</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, marginBottom: -40, zIndex: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  skipText: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginRight: 10 },
  
  keyboardView: { flex: 1 },
  content: { paddingHorizontal: 32, paddingTop: 60, paddingBottom: 20 },
  
  stepperRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 },
  stepDot: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(233, 64, 87, 0.2)' },
  stepActive: { backgroundColor: COLORS.primary },
  
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 16 },
  titleItalic: { fontFamily: 'serif', fontStyle: 'italic', fontWeight: '400', color: COLORS.primary },
  subtitle: { fontSize: 15, color: COLORS.textDark, textAlign: 'center', lineHeight: 22, marginBottom: 40, fontWeight: '600' },
  
  inputWrapper: { marginBottom: 20 },
  inputLabel: { marginLeft: 4, marginBottom: 8, fontSize: 13, fontWeight: '800', color: COLORS.primary },
  inputBox: { height: 220, borderWidth: 1, borderColor: COLORS.primary, borderRadius: SIZES.radiusLarge, backgroundColor: COLORS.white, padding: 20, ...SHADOWS.medium },
  input: { flex: 1, fontSize: 16, color: COLORS.textDark, fontWeight: '500', lineHeight: 24 },

  bottomSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  nextBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});
