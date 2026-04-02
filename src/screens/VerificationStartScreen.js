import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

export default function VerificationStartScreen({ navigation }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { id: 'center', label: 'Center your face', sub: 'Look directly at the camera' },
    { id: 'left', label: 'Turn your head left', sub: 'Slowly tilt till your left profile shows' },
    { id: 'right', label: 'Turn your head right', sub: 'Slowly tilt till your right profile shows' },
    { id: 'complete', label: 'Perfect!', sub: 'Ready to capture the verification selfie' }
  ];

  React.useEffect(() => {
    // Simulated face detection sequence
    let currentStep = 0;
    const runSequence = () => {
      setStepIndex(currentStep);
      setIsScanning(true);
      
      const timer = setTimeout(() => {
        setIsScanning(false);
        if (currentStep < steps.length - 1) {
          currentStep++;
          runSequence();
        } else {
          setFaceDetected(true);
        }
      }, 2000);
      
      return timer;
    };

    const timerClean = runSequence();
    return () => clearTimeout(timerClean);
  }, []);

  const handleVerify = async () => {
    if (!faceDetected && !capturedImage) {
        Alert.alert("Position Your Face", "Please wait until your face is detected in the circle.");
        return;
    }
    // Request permission first
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
       Alert.alert('Permission Denied', 'We need camera access to verify your identity!');
       return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCapturedImage(result.assets[0].uri);
      // Pass the URI to the processing screen for actual API upload
      setTimeout(() => {
        navigation.navigate('VerificationProcessing', { photoUri: result.assets[0].uri });
      }, 1000);
    }
  };

  return (
    <ImageBackground source={require('../../public/images/background_img.png')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressPill} />
            <View style={styles.progressPill} />
            <View style={styles.progressPill} />
            <View style={[styles.progressPill, { backgroundColor: '#960D1E' }]} />
          </View>
          
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
             <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>{steps[stepIndex].label}</Text>
          <Text style={styles.subtitle}>
            {steps[stepIndex].sub}
          </Text>
 
          <View style={{ flex: 1, justifyContent: 'center', marginVertical: 40 }}>
            <TouchableOpacity 
                style={[
                    styles.circularGraphic, 
                    { borderColor: faceDetected ? '#4CAF50' : (isScanning ? '#FFC107' : '#FF5252') }
                ]} 
                activeOpacity={0.8} 
                onPress={handleVerify}
            >
               <View style={styles.graphicBox}>
                 {capturedImage ? (
                    <Image 
                      source={{ uri: capturedImage }} 
                      style={styles.capturedImg} 
                      resizeMode="cover" 
                    />
                 ) : (
                    <View style={styles.cameraIconWrapper}>
                      <Ionicons 
                        name={faceDetected ? "checkmark-circle" : (
                          stepIndex === 1 ? "arrow-back-circle-outline" : 
                          stepIndex === 2 ? "arrow-forward-circle-outline" : "camera-outline"
                        )} 
                        size={64} 
                        color={faceDetected ? "#4CAF50" : COLORS.primary} 
                      />
                      <Text style={[styles.cameraText, { color: faceDetected ? "#4CAF50" : COLORS.primary }]}>
                        {faceDetected ? "Scan Now" : (isScanning ? "Processing..." : "Ready")}
                      </Text>
                    </View>
                 )}
               </View>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleVerify}>
            <LinearGradient colors={['#960D1E', '#DC143C']} style={styles.gradientFill} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={styles.nextText}>{capturedImage ? "Verified - Continue" : "Scan Now"}</Text>
            </LinearGradient> 
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, marginBottom: 20 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressPill: { width: 30, height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.7)' },
  
  skipText: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 30, paddingBottom: 20, alignItems: 'center' },
  
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: COLORS.textDark, textAlign: 'center', lineHeight: 24, fontWeight: '500' },
  
  circularGraphic: { width: 280, height: 280, borderRadius: 140, borderWidth: 3, borderColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.large },
  graphicBox: { width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 130, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  
  cameraIconWrapper: { alignItems: 'center', justifyContent: 'center' },
  cameraText: { marginTop: 12, fontSize: 16, fontWeight: '700', color: COLORS.primary },
  
  capturedImg: { width: '100%', height: '100%', borderRadius: 130 },

  bottomSection: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10, width: '100%' },
  nextBtn: { height: 56, borderRadius: SIZES.radiusLarge, overflow: 'hidden', ...SHADOWS.medium },
  gradientFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nextText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});

