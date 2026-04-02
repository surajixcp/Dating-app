import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, ScrollView, Platform, Modal, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function ProfileDetailsScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', dob: '', maritalStatus: '', contactNo: '', city: '', gender: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMobile = async () => {
      try {
        const mobile = await AsyncStorage.getItem('@viraag_user_mobile');
        if (mobile) {
          setForm(prev => ({ ...prev, contactNo: mobile }));
        }
      } catch (e) {
        console.log('Failed to fetch user mobile', e);
      }
    };
    fetchMobile();
  }, []);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobDate, setDobDate] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownConfig, setDropdownConfig] = useState({ key: '', options: [] });

  const MARITAL_OPTIONS = ['Single', 'Married', 'Widow', 'Divorced', 'Separated'];
  const GENDER_OPTIONS = ['Male', 'Female', 'Other']; // Ensure schema match

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDobDate(selectedDate);
      // Backend expects a parseable Date strings, YYYY-MM-DD is safest
      const formattedDate = selectedDate.toISOString().split('T')[0]; 
      setForm({ ...form, dob: formattedDate });
    }
  };

  const openDropdown = (key, options) => {
    setDropdownConfig({ key, options });
    setShowDropdown(true);
  };

  const selectOption = (opt) => {
    setForm({ ...form, [dropdownConfig.key]: opt });
    setShowDropdown(false);
  };

  const handleNext = async () => {
    if (!form.name || !form.dob || !form.city || !form.gender) {
      Alert.alert('Incomplete', 'Please fill all required fields marked with *');
      return;
    }

    setIsLoading(true);
    try {
      let lat = '28.6139'; // fallback
      let lon = '77.2090';

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          lat = location.coords.latitude.toString();
          lon = location.coords.longitude.toString();
          await AsyncStorage.setItem('@viraag_latitude', lat);
          await AsyncStorage.setItem('@viraag_longitude', lon);
        }
      } catch(e) { console.log('Location error:', e) }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('dob', form.dob);
      formData.append('location', form.city);
      formData.append('gender', form.gender);
      formData.append('latitude', lat);
      formData.append('longitude', lon);
      formData.append('pageNumber', '1');

      const response = await apiClient.put('/profile/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data && response.data.success) {
        await AsyncStorage.setItem('@viraag_onboarding_step', 'Interests');
        navigation.navigate('Interests');
      } else {
        Alert.alert('Wait', response.data?.message || 'Failed to save profile');
      }
    } catch (error) {
      console.log('Profile save error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save details.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (label, key, isDropdown = false, keyboardType = 'default', onPress = null) => {
    const inputElt = (
        <TextInput
          style={styles.input}
          value={form[key]}
          placeholder={`Enter ${label.replace(' *', '')}`}
          placeholderTextColor={COLORS.textLight}
          onChangeText={isDropdown || onPress ? undefined : (v) => setForm({ ...form, [key]: v })}
          editable={!isDropdown && !onPress && !isLoading}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          autoCorrect={keyboardType !== 'email-address'}
          pointerEvents={isDropdown || onPress || isLoading ? 'none' : 'auto'}
        />
    );
    
    return (
      <View style={styles.inputWrapper} key={key}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TouchableOpacity 
           activeOpacity={isDropdown || onPress ? 0.7 : 1} 
           style={styles.inputBox}
           onPress={!isLoading && (isDropdown || onPress) ? onPress : undefined}
        >
          {inputElt}
          {isDropdown && <Ionicons name="chevron-down" size={20} color={COLORS.primary} />}
        </TouchableOpacity>
      </View>
    );
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
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* Stepper Progress */}
            <View style={styles.stepperRow}>
              <View style={[styles.stepDot, styles.stepActive]} />
              <View style={styles.stepDot} />
              <View style={styles.stepDot} />
              <View style={styles.stepDot} />
            </View>

            <Text style={styles.title}>Create Your <Text style={styles.titleItalic}>Profile</Text></Text>

            {renderInput('Full name *', 'name')}
            {renderInput('Email Address', 'email', false, 'email-address')}
            {renderInput('DOB *', 'dob', false, 'default', () => setShowDatePicker(true))}
            {renderInput('Maritial status *', 'maritalStatus', true, 'default', () => openDropdown('maritalStatus', MARITAL_OPTIONS))}
            {renderInput('Contact No.', 'contactNo', false, 'phone-pad')}
            {renderInput('Your City *', 'city')}
            {renderInput('Gender Identity *', 'gender', true, 'default', () => openDropdown('gender', GENDER_OPTIONS))}

            <View style={{ height: 20 }} />
          </ScrollView>

          {showDatePicker && (
            <DateTimePicker
              value={dobDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Custom Dropdown Modal */}
          <Modal visible={showDropdown} transparent animationType="fade">
             <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDropdown(false)}>
                <View style={styles.modalContent}>
                   {dropdownConfig.options.map((opt, i) => (
                      <TouchableOpacity key={i} style={[styles.modalOption, i === dropdownConfig.options.length - 1 && { borderBottomWidth: 0 }]} onPress={() => selectOption(opt)}>
                         <Text style={[styles.modalOptionText, form[dropdownConfig.key] === opt && styles.modalOptionActive]}>{opt}</Text>
                         {form[dropdownConfig.key] === opt && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
                      </TouchableOpacity>
                   ))}
                </View>
             </TouchableOpacity>
          </Modal>

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
  header: { paddingHorizontal: 24, paddingTop: 10, marginBottom: -40, zIndex: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  
  keyboardView: { flex: 1, justifyContent: 'space-between' },
  content: { paddingHorizontal: 24, paddingTop: 60 },
  
  stepperRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 },
  stepDot: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(233, 64, 87, 0.2)' },
  stepActive: { backgroundColor: COLORS.primary },
  
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 30 },
  titleItalic: { fontFamily: 'serif', fontStyle: 'italic', fontWeight: '400', color: COLORS.primary },
  
  inputWrapper: { marginBottom: 24 },
  inputLabel: { marginLeft: 4, marginBottom: 8, fontSize: 13, fontWeight: '800', color: COLORS.primary },
  inputBox: { flexDirection: 'row', alignItems: 'center', height: 56, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusLarge, backgroundColor: COLORS.white, paddingHorizontal: 16, ...SHADOWS.light },
  input: { flex: 1, fontSize: 16, color: COLORS.textDark, fontWeight: '600' },

  bottomSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  nextBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', backgroundColor: COLORS.white, borderRadius: SIZES.radiusLarge, padding: 16, ...SHADOWS.medium },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalOptionText: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },
  modalOptionActive: { color: COLORS.primary, fontWeight: '800' }
});
