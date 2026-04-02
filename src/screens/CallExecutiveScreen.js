import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CallExecutiveScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Call Our Executive</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.paragraph}>
          We foster genuine connections in a safe, respectful environment. Transparency and continuous improvement guide our actions.
        </Text>
        
        <Text style={styles.paragraph}>
          We uphold strict privacy policies to safeguard user data. Discrimination and harassment have no place here; we take swift action against violations.
        </Text>
        
        <Text style={styles.paragraph}>
          Our platform celebrates diversity, welcoming users from all backgrounds. We're committed to providing clear information about our policies, operating with accountability.
        </Text>
        
        <Text style={styles.paragraph}>
          Join us in building a space where everyone can find meaningful connections, knowing their safety and well-being are our top priorities.
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.callBtn}>
          <LinearGradient colors={['#960D1E', '#DC143C']} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
            <View style={styles.btnContent}>
              <View style={styles.iconCircle}>
                <Image source={require('../../public/images/phone.png')} style={{width: 20, height: 20}} resizeMode="contain" />
              </View>
              <Text style={styles.btnText}>Call To Executive</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  
  content: { paddingHorizontal: 20, paddingTop: 10 },
  paragraph: { fontSize: 15, color: '#333', lineHeight: 24, fontWeight: '500', marginBottom: 20 },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20, backgroundColor: '#FFF' },
  callBtn: { height: 56, borderRadius: 28, overflow: 'hidden', elevation: 6, shadowColor: '#DC143C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  gradientFill: { flex: 1, justifyContent: 'center' },
  btnContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});
