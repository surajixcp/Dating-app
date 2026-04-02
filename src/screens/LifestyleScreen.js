import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LifestyleScreen({ navigation }) {
  const [selections, setSelections] = useState({
    drink: '',
    interests: [],
    smoke: '',
    travel: [],
    loveStyle: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const DRINK_OPTIONS = ['Nondrinker', 'Drink Socially', 'Others'];
  const INTERESTS_OPTIONS = ['Travelling', 'Books', 'Music', 'Dancing', 'Modeling'];
  const SMOKE_OPTIONS = ['Non smoker', 'Smoke Socially', 'Others'];
  const TRAVEL_OPTIONS = ['Beach', 'Mountain', 'Silent places', 'Long drive others'];
  const LOVE_OPTIONS = ['Passionate love', 'Deeply love', 'Casual love'];

  const toggleSingle = (category, value) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const toggleMultiple = (category, value) => {
    setSelections(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      let lat = (await AsyncStorage.getItem('@viraag_latitude')) || '28.6139';
      let lon = (await AsyncStorage.getItem('@viraag_longitude')) || '77.2090';

      const formData = new FormData();
      if (selections.drink) formData.append('drinking', selections.drink);
      if (selections.smoke) formData.append('smoking', selections.smoke);
      if (selections.loveStyle) formData.append('loveStyle', selections.loveStyle);
      
      const combinedInterests = [...selections.interests, ...selections.travel];
      combinedInterests.forEach(item => {
        formData.append('interests', item); // Same key appends multiple values to the array in multer
      });
      formData.append('latitude', lat);
      formData.append('longitude', lon);
      formData.append('pageNumber', '3');

      const response = await apiClient.put('/profile/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.success) {
        await AsyncStorage.setItem('@viraag_onboarding_step', 'DescribeYourself');
        navigation.navigate('DescribeYourself');
      } else {
        Alert.alert('Wait', response.data?.message || 'Failed to save lifestyle');
      }
    } catch (error) {
      console.log('Lifestyle save error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save details.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChip = (label, isSelected, onPress) => (
    <TouchableOpacity 
      key={label} 
      style={[styles.chip, isSelected && styles.chipSelected]} 
      onPress={!isLoading ? onPress : undefined}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../public/images/background_img.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressPill} />
            <View style={[styles.progressPill, { backgroundColor: '#960D1E' }]} />
            <View style={styles.progressPill} />
          </View>
          
          <TouchableOpacity onPress={() => navigation.navigate('DescribeYourself')} disabled={isLoading}>
             <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.mainTitle}>
            Talk Your <Text style={styles.whiteBold}>lifestyle</Text>{'\n'}
            & <Text style={styles.whiteBold}>habits</Text>
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How often do you drink?</Text>
            <View style={styles.chipContainer}>
              {DRINK_OPTIONS.map(opt => renderChip(
                opt, 
                selections.drink === opt, 
                () => toggleSingle('drink', opt)
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What are your interests?</Text>
            <View style={styles.chipContainer}>
              {INTERESTS_OPTIONS.map(opt => renderChip(
                opt, 
                selections.interests.includes(opt), 
                () => toggleMultiple('interests', opt)
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How often do you smoke?</Text>
            <View style={styles.chipContainer}>
              {SMOKE_OPTIONS.map(opt => renderChip(
                opt, 
                selections.smoke === opt, 
                () => toggleSingle('smoke', opt)
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Which type you like Traveling Destination?</Text>
            <View style={styles.chipContainer}>
              {TRAVEL_OPTIONS.map(opt => renderChip(
                opt, 
                selections.travel.includes(opt), 
                () => toggleMultiple('travel', opt)
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is your love style?</Text>
            <View style={styles.chipContainer}>
              {LOVE_OPTIONS.map(opt => renderChip(
                opt, 
                selections.loveStyle === opt, 
                () => toggleSingle('loveStyle', opt)
              ))}
            </View>
          </View>

          <View style={{ height: 40 }} />
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} disabled={isLoading}>
            <LinearGradient colors={['#960D1E', '#DC143C']} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.nextText}>Continue</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <View style={{ height: 40 }} />

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 10, marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressPill: { width: 30, height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.7)' },
  
  skipText: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  
  content: { paddingHorizontal: 24, paddingBottom: 20 },
  
  mainTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 40, lineHeight: 42 },
  whiteBold: { color: COLORS.white, fontWeight: '900' },
  
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 16 },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: COLORS.white, borderRadius: 12, ...SHADOWS.light },
  chipText: { fontSize: 15, color: COLORS.textDark, fontWeight: '500' },
  
  chipSelected: { backgroundColor: '#960D1E' },
  chipTextSelected: { color: COLORS.white, fontWeight: '700' },
  
  nextBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});
