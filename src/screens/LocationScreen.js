import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

export default function LocationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Verification')}>
           <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.mapCircleOuter}>
            <View style={styles.mapCircleInner}>
              <Ionicons name="location" size={48} color={COLORS.primary} style={{ marginTop: 4 }} />
            </View>
          </View>
        </View>
        <Text style={styles.title}>Enable Location</Text>
        <Text style={styles.subtitle}>You'll need to enable your location in order to use Match Maker and find people nearby.</Text>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton title="Allow Location" onPress={() => navigation.navigate('Verification')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.backgroundOff, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  skipText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  illustrationContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  mapCircleOuter: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(233, 64, 87, 0.05)', alignItems: 'center', justifyContent: 'center' },
  mapCircleInner: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium },
  
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', lineHeight: 26, fontWeight: '500' },
  
  bottom: { paddingHorizontal: 24, paddingBottom: 40 },
});

