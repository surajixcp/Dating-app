import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

const NOTIFICATIONS = [
  { id: '1', title: 'New Match!', desc: 'You and Jessica liked each other.', time: '10 min ago', icon: 'heart', color: COLORS.primaryGradientStart },
  { id: '2', title: 'System Warning', desc: 'Your profile picture needs verification.', time: '2 hrs ago', icon: 'warning', color: '#F2A154' },
  { id: '3', title: 'Premium Promotion', desc: 'Upgrade to Gold at 50% off today only!', time: '1 day ago', icon: 'star', color: '#8A2387' },
  { id: '4', title: 'Message from admin', desc: 'Welcome to the Match Maker community!', time: '2 days ago', icon: 'at', color: COLORS.primary },
];

export default function NotificationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map(note => (
          <TouchableOpacity key={note.id} style={styles.noteCard} activeOpacity={0.8}>
            <View style={[styles.iconBox, { backgroundColor: note.color + '20' }]}>
              <Ionicons name={note.icon} size={24} color={note.color} />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.noteDesc}>{note.desc}</Text>
              <Text style={styles.noteTime}>{note.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundOff },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  iconBtnPlaceholder: { width: 44 },
  
  list: { padding: 20, gap: 16 },
  noteCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: COLORS.white, borderRadius: SIZES.radiusLarge, ...SHADOWS.light },
  iconBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  textContent: { flex: 1, justifyContent: 'center' },
  noteTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  noteDesc: { fontSize: 14, color: COLORS.textLight, lineHeight: 20, fontWeight: '500' },
  noteTime: { fontSize: 12, color: COLORS.textLight, marginTop: 8, fontWeight: '700' }
});
