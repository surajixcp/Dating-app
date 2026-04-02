import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../theme/theme';
import apiClient from '../services/api';

export default function VerificationProcessingScreen({ route, navigation }) {
  const [errorMSG, setErrorMSG] = useState(null);

  useEffect(() => {
    const uploadVerification = async () => {
       const photoUri = route.params?.photoUri;
       if (!photoUri) {
         navigation.replace('MainTabs');
         return;
       }

       try {
         const formData = new FormData();
         const filename = photoUri.split('/').pop();
         const match = /\.(\w+)$/.exec(filename);
         const type = match ? `image/${match[1]}` : `image`;
         formData.append('profile_picture', { uri: photoUri, name: filename, type });

         const response = await apiClient.put('/profile/verify', formData);

         if (response.data.success || response.status === 200) {
            // Processing complete
            setTimeout(() => {
              navigation.replace('MainTabs');
            }, 1000);
         } else {
            setErrorMSG('Verification failed: ' + (response.data.message || 'Unknown error'));
         }
       } catch (err) {
         const detailedMsg = err.response?.data?.message || err.message;
         setErrorMSG('Verification error: ' + detailedMsg);
       }
    };

    uploadVerification();
  }, [navigation, route.params]);

  return (
    <ImageBackground source={require('../../public/images/background_img.png')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.stepperRow}>
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={[styles.stepDot, styles.stepActive]} />
        </View>

        <Text style={styles.title}>Processing</Text>

        <View style={styles.centerContent}>
          {errorMSG ? (
            <>
              <Ionicons name="alert-circle" size={80} color="#DC143C" style={{ marginBottom: 20 }} />
              <Text style={styles.statusTitle}>Verification Failed</Text>
              <Text style={[styles.statusSubtitle, { color: '#DC143C', fontWeight: '700' }]}>{errorMSG}</Text>
              <TouchableOpacity 
                style={[styles.nextBtnDisabled, { backgroundColor: COLORS.primary, width: '100%', marginTop: 30 }]} 
                onPress={() => navigation.replace('VerificationStart')}
              >
                <Text style={styles.nextText}>Try Again</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ActivityIndicator size={100} color={COLORS.primary} style={styles.spinner} />
              <Text style={styles.statusTitle}>Please wait..</Text>
              <Text style={styles.statusSubtitle}>
                We're required by law to verify your identity before we can use your account securely.
              </Text>
            </>
          )}
        </View>

        {!errorMSG && (
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.nextBtnDisabled} disabled={true}>
              <Text style={styles.nextText}>Processing...</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  
  stepperRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 30 },
  stepDot: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(233, 64, 87, 0.2)' },
  stepActive: { backgroundColor: COLORS.primary },
  
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 40 },
  
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  spinner: { marginBottom: 40, transform: [{ scale: 1.5 }] },
  statusTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textDark, marginBottom: 12 },
  statusSubtitle: { fontSize: 15, color: COLORS.textLight, textAlign: 'center', lineHeight: 22, fontWeight: '600' },

  bottomSection: { paddingHorizontal: 24, paddingBottom: 40 },
  nextBtnDisabled: { height: 56, borderRadius: SIZES.radiusLarge, backgroundColor: 'rgba(233, 64, 87, 0.4)', alignItems: 'center', justifyContent: 'center' },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '800' }
});
