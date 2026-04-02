import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutModal({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@viraag_auth_token');
    } catch (e) {
      console.log('Error removing token on logout', e);
    }
    // Navigate back to splash/onboarding root
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => navigation.goBack()} />
      
      <View style={styles.sheet}>
        <View style={styles.dragHandleOuter}>
           <View style={styles.dragHandle} />
        </View>

        <View style={styles.headerRow}>
          <View style={{ width: 40 }} />
          <Text style={styles.title}>Logout</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconCircle}>
          <Ionicons name="log-out-outline" size={32} color="#DC143C" />
        </View>

        <Text style={styles.headline}>Should you need us, we'll be here</Text>
        <Text style={styles.subtext}>
          Use any of your linked sign-in methods, and feel free to return anytime
        </Text>

        <Text style={styles.sectionLabel}>Current sign-in methods</Text>
        
        <View style={styles.accountRow}>
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png' }} style={styles.googleIcon} />
          <View>
            <Text style={styles.methodTitle}>Google ID</Text>
            <Text style={styles.methodUser}>User_name</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.btnOuter} onPress={handleLogout}>
          <LinearGradient colors={['#960D1E', '#DC143C']} style={styles.btnGradient} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={styles.btnText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  
  dragHandleOuter: { width: '100%', alignItems: 'center', height: 20, marginTop: -10 },
  dragHandle: { width: 50, height: 6, borderRadius: 3, backgroundColor: '#E0E0E0' },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#000' },
  cancelText: { fontSize: 16, color: '#DC143C', fontWeight: '600' },
  
  iconCircle: { alignSelf: 'center', width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF0F5', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  
  headline: { fontSize: 22, fontWeight: '800', color: '#000', textAlign: 'center', marginBottom: 12 },
  subtext: { fontSize: 15, color: '#333', textAlign: 'center', lineHeight: 22, fontWeight: '500', marginBottom: 30 },
  
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 12 },
  
  accountRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  googleIcon: { width: 30, height: 30, marginRight: 16 },
  methodTitle: { fontSize: 15, fontWeight: '600', color: '#000' },
  methodUser: { fontSize: 13, color: '#000', fontWeight: '700' },
  
  btnOuter: { width: '100%', height: 56, borderRadius: 14, overflow: 'hidden' },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});
