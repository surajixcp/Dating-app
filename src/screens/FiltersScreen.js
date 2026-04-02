import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../src/services/api';
import { COLORS, SHADOWS, SIZES } from '../theme/theme';

const GENDERS = [
  'Straight Boy', 'Straight Girl', 
  'Gay', 'Lesbian', 
  'Toms Boys', 'Bisexual', 
  'Queer', 'Asexual', 
  'Pansexual', 'Open To All'
];

export default function FiltersScreen({ navigation }) {
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [maxAge, setMaxAge] = useState(60);
  
  const toggleGender = (g) => {
    if (selectedGenders.includes(g)) {
      setSelectedGenders(selectedGenders.filter(item => item !== g));
    } else {
      setSelectedGenders([...selectedGenders, g]);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('@viraag_auth_token');
      await apiClient.put('/profile/filters', {
        discoverySettings: {
          maxDistance,
          minAge: 18,
          maxAge
        },
        interested_in: selectedGenders
      });
      Alert.alert("Filters Updated", "Your Discovery feed has been calibrated.");
      navigation.goBack();
    } catch (e) {
      console.log('Error updating filters:', e);
      Alert.alert("Error", "Could not apply filters.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dragHandleContainer}>
         <View style={styles.dragHandle} />
      </View>

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setSelectedGenders([])}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Interested in</Text>
        <View style={styles.grid}>
          {GENDERS.map((g) => {
            const isActive = selectedGenders.includes(g);
            return (
              <TouchableOpacity key={g} style={[styles.gridItem, isActive ? styles.gridItemActiveBorder : styles.gridItemInactive]} onPress={() => toggleGender(g)}>
                {isActive ? (
                   <LinearGradient colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]} style={styles.gridGradientWrapper} start={{x:0, y:0}} end={{x:1, y:0}}>
                     <Text style={styles.gridTextActive}>{g}</Text>
                   </LinearGradient>
                ) : (
                   <View style={styles.gridInnerBox}>
                     <Text style={styles.gridText}>{g}</Text>
                   </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Distance Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderSectionTitle}>Max Distance</Text>
            <Text style={styles.sliderValue}>{maxDistance} km</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={1}
            maximumValue={150}
            step={1}
            value={maxDistance}
            onValueChange={setMaxDistance}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.border}
            thumbTintColor={COLORS.primary}
          />
        </View>

        {/* Age Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderSectionTitle}>Maximum Age</Text>
            <Text style={styles.sliderValue}>18 - {maxAge}</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={18}
            maximumValue={65}
            step={1}
            value={maxAge}
            onValueChange={setMaxAge}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.border}
            thumbTintColor={COLORS.primary}
          />
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} activeOpacity={0.8}>
          <LinearGradient colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]} style={styles.updateGradient} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={styles.updateText}>Update Match Feed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, borderTopLeftRadius: 40, borderTopRightRadius: 40 },
  
  dragHandleContainer: { alignItems: 'center', paddingTop: 10, paddingBottom: 5 },
  dragHandle: { width: 44, height: 5, borderRadius: 2.5, backgroundColor: COLORS.border },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12 },
  headerBtn: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4 },
  clearText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textDark },
  
  content: { paddingHorizontal: 24, paddingTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: 24 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 36, justifyContent: 'space-between' },
  gridItem: { width: '48%', height: 52, borderRadius: SIZES.radiusMedium, overflow: 'hidden' },
  gridItemInactive: { borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  gridItemActiveBorder: { borderWidth: 0, ...SHADOWS.light },
  gridInnerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white },
  gridGradientWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gridText: { fontSize: 15, fontWeight: '600', color: COLORS.textDark },
  gridTextActive: { fontSize: 15, fontWeight: '700', color: COLORS.white },

  locationContainer: { marginBottom: 40 },
  locationLabel: { fontSize: 12, color: COLORS.textLight, marginBottom: -9, zIndex: 1, marginLeft: 16, backgroundColor: COLORS.white, width: 64, textAlign: 'center', fontWeight: '600' },
  locationBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusLarge, paddingHorizontal: 16, height: 60, backgroundColor: COLORS.white, ...SHADOWS.light },
  locationText: { fontSize: 16, fontWeight: '600', color: COLORS.textDark },

  sliderContainer: { marginBottom: 48, paddingHorizontal: 4 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  sliderSectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  sliderValue: { fontSize: 15, color: COLORS.textDark, fontWeight: '700' },
  
  sliderTrackBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, position: 'relative' },
  sliderFillActive: { position: 'absolute', height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  sliderThumbRound: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, top: -11, elevation: 4, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, marginLeft: -14 },
  
  bottom: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  updateBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  updateGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  updateText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});

