import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/theme';

export default function StatusScreen({ navigation }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      setProgress(p => {
        if (p >= 1) {
          clearInterval(timer);
          navigation.goBack();
          return 1;
        }
        return p + 0.02;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../public/images/img_25.png')}
      style={styles.container}
    >
      <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.topGradient}>
        <SafeAreaView style={styles.safeTop}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarBorder}>
                <Image source={require('../../public/images/img_16.png')} style={styles.avatar} />
              </View>
              <Text style={styles.name}>Annabelle</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.bottomGradient}>
        <SafeAreaView style={styles.safeBottom}>
          <View style={styles.inputContainer}>
             <View style={styles.inputWrapper}>
                <TextInput placeholder="Your message" placeholderTextColor="rgba(255,255,255,0.8)" style={styles.input} />
                <TouchableOpacity>
                   <Ionicons name="flower-outline" size={24} color="white" />
                </TouchableOpacity>
             </View>
             <TouchableOpacity style={styles.sendIconBtn}>
                <Ionicons name="paper-plane-outline" size={20} color="white" />
             </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'space-between' },
  topGradient: { paddingBottom: 40 },
  safeTop: { paddingTop: 10, paddingHorizontal: 20 },
  progressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden', marginBottom: 20, marginTop: 10 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarBorder: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 24, padding: 2, marginRight: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  name: { color: COLORS.white, fontWeight: '700', fontSize: 18, textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 4 },
  
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  bottomGradient: { paddingTop: 60, paddingBottom: 20 },
  safeBottom: { paddingHorizontal: 20, marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 30, paddingHorizontal: 20, height: 56, marginRight: 12 },
  input: { flex: 1, color: COLORS.white, fontSize: 16 },
  sendIconBtn: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }
});
