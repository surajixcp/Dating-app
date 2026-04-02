import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

export default function RateUsScreen({ navigation }) {
  const [rating, setRating] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Viraag</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.starRow}>
           {[1, 2, 3, 4, 5].map((star) => (
             <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7} style={{ paddingHorizontal: 6 }}>
               <Ionicons 
                 name={star <= rating ? "star" : "star-outline"} 
                 size={54} 
                 color={star <= rating ? "#FFD700" : COLORS.border} 
               />
             </TouchableOpacity>
           ))}
        </View>

        <Text style={styles.subtitle}>Are you enjoying{'\n'}the Viraag experience?</Text>
        <Text style={styles.subtext}>Your feedback helps us grow.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -80, paddingHorizontal: 40 },
  
  starRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  subtitle: { fontSize: 22, color: COLORS.textDark, textAlign: 'center', fontWeight: '800', lineHeight: 32, marginBottom: 12 },
  subtext: { fontSize: 15, color: COLORS.textLight, textAlign: 'center', fontWeight: '500' }
});
