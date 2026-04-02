import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

export default function FeedbackScreen({ navigation }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Feature Request');

  const CATEGORIES = ['Feature Request', 'Bug Report', 'General Feedback'];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Feedback</Text>
              <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              
              <Text style={styles.greetingTitle}>How can we improve?</Text>
              <Text style={styles.subtitle}>We're always looking for ways to make Viraag better for you.</Text>

              <View style={styles.categorySection}>
                <Text style={styles.sectionLabel}>Select Category</Text>
                <View style={styles.chipContainer}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity 
                      key={cat} 
                      style={[styles.chip, category === cat && styles.chipActive]} 
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                 <Text style={styles.sectionLabel}>Write your thoughts</Text>
                 <TextInput
                   style={styles.textInput}
                   multiline
                   textAlignVertical="top"
                   placeholder="Tell us what's on your mind..."
                   placeholderTextColor={COLORS.textLight}
                   value={text}
                   onChangeText={setText}
                 />
              </View>

            </ScrollView>

            <View style={styles.bottomSection}>
               <TouchableOpacity style={styles.sendBtn} onPress={() => {
                  if (text.trim() === '') {
                    Alert.alert('Empty Feedback', 'Please write something before sending.');
                    return;
                  }
                  Alert.alert('Thank You!', 'Your feedback has been received and will help us grow. 💌');
                  navigation.goBack();
               }}>
                  <LinearGradient colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
                    <Text style={styles.sendBtnText}>Submit Feedback</Text>
                  </LinearGradient>
               </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  
  greetingTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, marginBottom: 8, lineHeight: 40 },
  subtitle: { fontSize: 16, color: COLORS.textLight, lineHeight: 24, marginBottom: 32, fontWeight: '500' },
  
  categorySection: { marginBottom: 32 },
  sectionLabel: { marginLeft: 4, marginBottom: 12, fontSize: 14, fontWeight: '800', color: COLORS.textDark, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.light },
  chipActive: { backgroundColor: 'rgba(233, 64, 87, 0.08)', borderColor: COLORS.primary },
  chipText: { fontSize: 14, color: COLORS.textDark, fontWeight: '600' },
  chipTextActive: { color: COLORS.primary, fontWeight: '800' },
  
  inputWrapper: { flex: 1 },
  textInput: { height: 180, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', borderRadius: SIZES.radiusLarge, padding: 20, fontSize: 16, color: COLORS.textDark, lineHeight: 24, backgroundColor: COLORS.white, ...SHADOWS.medium },

  bottomSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16, backgroundColor: COLORS.background },
  sendBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});
