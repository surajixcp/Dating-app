import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SIZES } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../services/api';

export default function VerificationScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleTakeSelfie = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please allow camera access to verify your identity.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLoading(true);
      try {
        const localUri = result.assets[0].uri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        formData.append('profile_picture', { uri: localUri, name: filename, type });

        const response = await apiClient.put('/profile/verify', formData);

        if (response.data && response.data.success) {
            Alert.alert("Verified! ✅", "You've successfully secured the Blue Checkmark!");
            navigation.navigate('Interests');
        } else {
            Alert.alert("Error", "Could not verify profile. Please try again.");
        }
      } catch (err) {
        console.error("Verification Error:", err);
        Alert.alert("Error", "A network error occurred while uploading your selfie.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.skipText} onPress={() => navigation.navigate('Interests')}>Skip</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Get Verified</Text>
        <Text style={styles.subtitle}>Help us keep Match Maker authentic. Verify your identity to show potential matches you're the real deal.</Text>
        
        <View style={styles.illustrationContainer}>
          <View style={styles.cameraBox}>
             <Ionicons name="scan-outline" size={100} color={COLORS.primary} />
          </View>
          <Text style={styles.instructionText}>Take a quick selfie to get the blue checkmark.</Text>
        </View>
        
        <View style={styles.bottom}>
          {loading ? (
             <ActivityIndicator size="large" color={COLORS.primary} style={{ marginBottom: 20 }} />
          ) : (
             <PrimaryButton title="Take Selfie" onPress={handleTakeSelfie} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.paddingLarge, marginTop: SIZES.paddingSmall, marginBottom: SIZES.paddingLarge },
  backBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  
  content: { flex: 1, paddingHorizontal: SIZES.paddingLarge },
  title: { fontSize: 34, fontWeight: '700', color: COLORS.textDark },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginTop: 8, marginBottom: 40, lineHeight: 24 },
  
  illustrationContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraBox: { width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(233, 64, 87, 0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', marginBottom: 24 },
  instructionText: { fontSize: 16, color: COLORS.textDark, textAlign: 'center', fontWeight: '600', paddingHorizontal: 20 },

  bottom: { justifyContent: 'flex-end', paddingBottom: SIZES.paddingLarge },
});
