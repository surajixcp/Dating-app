import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InterestsScreen({ navigation }) {
  const [gender, setGender] = useState('');
  const [orientation, setOrientation] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectionType, setCurrentSelectionType] = useState(null);

  const OPTIONS = {
    gender: ['Male', 'Female', 'Non-Binary', 'Other'],
    orientation: ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Other'],
    lookingFor: ['Long-term partner', 'Short-term relationship', 'New friends', 'Still figuring it out']
  };

  const openModal = (type) => {
    setCurrentSelectionType(type);
    setModalVisible(true);
  };

  const selectOption = (item) => {
    if (currentSelectionType === 'gender') setGender(item);
    if (currentSelectionType === 'orientation') setOrientation(item);
    if (currentSelectionType === 'lookingFor') setLookingFor(item);
    setModalVisible(false);
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      let lat = (await AsyncStorage.getItem('@viraag_latitude')) || '28.6139';
      let lon = (await AsyncStorage.getItem('@viraag_longitude')) || '77.2090';

      const formData = new FormData();
      formData.append('gender', gender);
      formData.append('sexual_orientation', orientation);
      formData.append('lookingFor', lookingFor);
      formData.append('latitude', lat);
      formData.append('longitude', lon);
      formData.append('pageNumber', '2');

      const response = await apiClient.put('/profile/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.success) {
        navigation.navigate('Lifestyle');
      } else {
        Alert.alert('Wait', response.data?.message || 'Failed to save interests');
      }
    } catch (error) {
      console.log('Interests save error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save details.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDropdown = (label, value, type) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity style={styles.dropdownBtn} onPress={() => !isLoading && openModal(type)} activeOpacity={0.7}>
        <Text style={[styles.dropdownText, !value && { color: COLORS.textLight }]}>
          {value || `Select ${label}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressPill} />
          <View style={[styles.progressPill, { backgroundColor: COLORS.primary }]} />
          <View style={styles.progressPill} />
          <View style={styles.progressPill} />
        </View>
        
        <TouchableOpacity onPress={async () => {
             await AsyncStorage.setItem('@viraag_onboarding_step', 'Lifestyle');
             navigation.navigate('Lifestyle');
          }} disabled={isLoading}>
           <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.mainTitle}>Create Your <Text style={styles.titleItalic}>Profile</Text></Text>
        <Text style={styles.subtitle}>Help us find the right matches by telling us a bit more about you.</Text>

        {renderDropdown('Gender Identity', gender, 'gender')}
        {renderDropdown('Sexual Orientation', orientation, 'orientation')}
        {renderDropdown('What are you looking for?', lookingFor, 'lookingFor')}

      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} disabled={isLoading}>
          <LinearGradient colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.nextText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {currentSelectionType === 'gender' ? 'Gender' : currentSelectionType === 'orientation' ? 'Orientation' : 'Goal'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currentSelectionType ? OPTIONS[currentSelectionType] : []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOption} onPress={() => selectOption(item)}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                  {((currentSelectionType === 'gender' && gender === item) ||
                    (currentSelectionType === 'orientation' && orientation === item) ||
                    (currentSelectionType === 'lookingFor' && lookingFor === item)) && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressPill: { width: 30, height: 6, borderRadius: 3, backgroundColor: 'rgba(233, 64, 87, 0.2)' },
  
  skipText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  
  content: { paddingHorizontal: 24, paddingTop: 20 },
  
  mainTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 12 },
  titleItalic: { fontFamily: 'serif', fontStyle: 'italic', fontWeight: '400', color: COLORS.primary },
  subtitle: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  
  dropdownContainer: { marginBottom: 24 },
  dropdownLabel: { marginLeft: 4, marginBottom: 8, fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 56, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusLarge, backgroundColor: '#FAFAFA' },
  dropdownText: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },
  
  bottomSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  nextBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.background },
  modalOptionText: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' }
});

