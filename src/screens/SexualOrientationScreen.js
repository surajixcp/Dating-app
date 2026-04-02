import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../theme/theme';

const OPTIONS = [
  'Straight boy',
  'Straight girl',
  'Gay',
  'Lesbian',
  'Tom boy',
  'Bisexual',
  'Queer',
  'Asexual',
  'Pansexual',
  'Other'
];

export default function SexualOrientationScreen({ navigation }) {
  const [selected, setSelected] = useState('Straight boy');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Sexual Orientation</Text>
          <Text style={styles.headerSubtitle}>( Select up to 1 )</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {OPTIONS.map((opt) => {
          const isActive = selected === opt;
          return (
            <TouchableOpacity 
              key={opt}
              style={[styles.row, isActive && styles.rowActive]}
              activeOpacity={0.7}
              onPress={() => setSelected(opt)}
            >
              <Text style={[styles.rowText, isActive && styles.rowTextActive]}>{opt}</Text>
              
              <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                {isActive && (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} style={{ marginTop: 1, marginLeft: 1 }} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 24 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  headerTitles: { flex: 1, alignItems: 'flex-start', paddingLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  headerSubtitle: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  saveText: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  
  listContainer: { paddingHorizontal: 24, paddingTop: 10 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, borderRadius: SIZES.radiusLarge, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, backgroundColor: COLORS.white, ...SHADOWS.light },
  rowActive: { backgroundColor: 'rgba(233, 64, 87, 0.05)', borderColor: COLORS.primary, elevation: 0, shadowOpacity: 0 },
  
  rowText: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },
  rowTextActive: { color: COLORS.primary, fontWeight: '700' },
  
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.textLight, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white },
  radioOuterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
});
