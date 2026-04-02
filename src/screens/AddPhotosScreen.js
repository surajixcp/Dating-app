import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddPhotosScreen({ navigation }) {
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    null, null, null, null, null
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      let uploadCount = 0;
      images.forEach((imgUri, index) => {
        // Only upload local files picked by the user (ignore http/dummy images)
        // Backend supports up to 5 images: profile_url_1 to profile_url_5
        if (imgUri && !imgUri.startsWith('http') && uploadCount < 5) {
          uploadCount++;
          const filename = imgUri.split('/').pop() || `photo_${uploadCount}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          formData.append(`profile_url_${uploadCount}`, {
            uri: imgUri,
            name: filename,
            type,
          });
        }
      });
      
      let lat = (await AsyncStorage.getItem('@viraag_latitude')) || '28.6139';
      let lon = (await AsyncStorage.getItem('@viraag_longitude')) || '77.2090';

      formData.append('latitude', lat);
      formData.append('longitude', lon);
      formData.append('pageNumber', '5');

      const response = await apiClient.put('/profile/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.success) {
        await AsyncStorage.setItem('@viraag_onboarding_step', 'VerificationStart');
        navigation.navigate('VerificationStart');
      } else {
        Alert.alert('Wait', response.data?.message || 'Failed to upload photos');
      }
    } catch (error) {
      console.log('Photos upload error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to finish profile setup.');
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
          <TouchableOpacity onPress={() => navigation.navigate('VerificationStart')} disabled={isLoading}>
             <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.stepperRow}>
            <View style={[styles.stepDot, styles.stepActive]} />
            <View style={styles.stepDot} />
            <View style={styles.stepDot} />
            <View style={styles.stepDot} />
          </View>

          <Text style={styles.title}>Add your <Text style={styles.titleItalic}>recent pics</Text></Text>
          <Text style={styles.subtitle}>
            We'd love to see you. Upload a photo for your dating journey.
          </Text>

          <View style={styles.grid}>
            {images.map((img, idx) => (
              <TouchableOpacity 
                 key={idx} 
                 style={[styles.photoSlot, idx === 0 && styles.firstSlot]} 
                 activeOpacity={0.8}
                 onPress={() => !isLoading && pickImage(idx)}
              >
                {img ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: img }} style={styles.imageFill} />
                    <View style={styles.editBadge}>
                       <Ionicons name="pencil" size={12} color={COLORS.white} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.dashedBox}>
                     <View style={styles.addBtnCircle}>
                       <Ionicons name="add" size={20} color={COLORS.white} />
                     </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
  
  content: { paddingHorizontal: 32, paddingTop: 60, paddingBottom: 20 },
  
  stepperRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 },
  stepDot: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(233, 64, 87, 0.2)' },
  stepActive: { backgroundColor: COLORS.primary },
  
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 12 },
  titleItalic: { fontFamily: 'serif', fontStyle: 'italic', fontWeight: '400', color: COLORS.primary },
  subtitle: { fontSize: 15, color: COLORS.textDark, textAlign: 'center', lineHeight: 22, marginBottom: 40, fontWeight: '600' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  photoSlot: { width: '47%', aspectRatio: 1, borderRadius: SIZES.radiusLarge, overflow: 'hidden' },
  firstSlot: { width: '47%', aspectRatio: 1 },
  imageContainer: { flex: 1, position: 'relative' },
  imageFill: { width: '100%', height: '100%', borderRadius: SIZES.radiusLarge },
  editBadge: { position: 'absolute', bottom: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white },
  
  dashedBox: { flex: 1, borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: 'dashed', borderRadius: SIZES.radiusLarge, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  addBtnCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },

  bottomSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  nextBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});
