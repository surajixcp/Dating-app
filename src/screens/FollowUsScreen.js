import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const APPS = [
  { id: '1', name: 'Instagram', icon: 'logo-instagram' },
  { id: '2', name: 'Facebook', icon: 'logo-facebook' },
  { id: '3', name: 'Twitter', icon: 'logo-twitter' },
  { id: '4', name: 'LinkedIn', icon: 'logo-linkedin' }
];

export default function FollowUsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follow on Other apps</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {APPS.map((app) => (
          <TouchableOpacity key={app.id} style={styles.rowItem} activeOpacity={0.7}>
             <View style={styles.rowLeft}>
               <Ionicons name={app.icon} size={24} color="#333" style={{ width: 34 }} />
               <Text style={styles.appName}>{app.name}</Text>
             </View>
             
             <View style={styles.openBadge}>
               <Text style={styles.openText}>Open</Text>
             </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  
  listContainer: { paddingHorizontal: 20, paddingTop: 10 },
  
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  appName: { fontSize: 16, color: '#333', fontWeight: '500' },
  
  openBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  openText: { fontSize: 12, fontWeight: '700', color: '#555' }
});
