import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/api';

export default function DeleteAccountScreen({ navigation }) {
  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('@viraag_auth_token');
      if (token) {
        const payload = jwtDecode(token);
        const userId = payload.id || payload._id;
        
        if (userId) {
          await apiClient.delete(`/user/permanentDeleteDataById/${userId}`);
        }
      }
      
      await AsyncStorage.removeItem('@viraag_auth_token');
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } catch (err) {
      console.log('Error deleting account:', err);
      Alert.alert('Error', 'Failed to delete account from server. Logging out locally.');
      await AsyncStorage.removeItem('@viraag_auth_token');
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    }
  };

  const handleDeactivate = async () => {
    // For now, deactivate acts as a hard logout. 
    // Extend this to call a specific deactivate endpoint if it exists in the future.
    try {
      await AsyncStorage.removeItem('@viraag_auth_token');
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Are you sure want to delete your account?</Text>
        
        <Text style={styles.paragraph}>
          We're sad to see you go. Deleting your account would remove all your personal information, messages, photos, matches and purchases. this action cannot be undone.
        </Text>
        
        <Text style={styles.paragraph}>
          some information may be stored as per privacy policy for legal reasons, which will also be deleted after a grace period.
        </Text>
        
        <Text style={styles.paragraph}>
          If you decide to come back later and use the same profile, you can deactivate your profile instead.
        </Text>
      </View>

      <View style={styles.bottomSection}>
         {/* Deactivate Option */}
         <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleDeactivate}>
            <LinearGradient colors={['#960D1E', '#DC143C']} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={styles.btnTextPrimary}>Deactivate Account</Text>
            </LinearGradient>
         </TouchableOpacity>
         
         {/* Delete Option */}
         <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleDelete}>
             <Text style={styles.btnTextSecondary}>Delete Account</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { paddingRight: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: '800', color: '#000', textAlign: 'center', marginBottom: 30, lineHeight: 30 },
  paragraph: { fontSize: 13, color: '#444', textAlign: 'center', lineHeight: 22, marginBottom: 20, fontWeight: '500' },

  bottomSection: { paddingHorizontal: 30, paddingBottom: 40 },
  actionBtnPrimary: { height: 56, borderRadius: 14, overflow: 'hidden', elevation: 4, marginBottom: 16 },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnTextPrimary: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  
  actionBtnSecondary: { height: 56, alignItems: 'center', justifyContent: 'center' },
  btnTextSecondary: { color: '#960D1E', fontSize: 16, fontWeight: '700' }
});
