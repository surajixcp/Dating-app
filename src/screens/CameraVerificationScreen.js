import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

export default function CameraVerificationScreen({ navigation }) {
  // Simulate active facial scan logic before manually clicking shutter
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80' }} 
      style={styles.container}
    >
      {/* Dark overlay for contrast */}
      <View style={styles.overlay}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Focus on your face</Text>
          <View style={{ width: 44 }} /> 
        </View>

        {/* Center Mock Wireframe Group */}
        <View style={styles.centerTarget}>
           <View style={styles.wireframeNode} />
           <View style={[styles.wireframeNode, { top: 60, left: 120 }]} />
           <View style={[styles.wireframeNode, { top: 120, right: 80 }]} />
           <View style={[styles.wireframeNode, { bottom: 40, left: 100 }]} />
           
           {/* Abstract Face Ring */}
           <View style={styles.faceRing} />
        </View>

        <View style={styles.bottomSection}>
          {/* Shutter Button */}
          <TouchableOpacity style={styles.shutterBtnOuter} onPress={() => navigation.navigate('VerificationProcessing')}>
             <View style={styles.shutterBtnInner}>
                <Ionicons name="camera" size={32} color={COLORS.primary} />
             </View>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, backgroundColor: 'rgba(233, 64, 87, 0.4)', justifyContent: 'space-between' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.white },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.white },

  centerTarget: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  faceRing: { width: 300, height: 400, borderRadius: 150, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', borderStyle: 'dashed' },
  wireframeNode: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.white, shadowColor: COLORS.white, shadowOffset: {width:0,height:0}, shadowOpacity: 1, shadowRadius: 10 },

  bottomSection: { paddingBottom: 60, alignItems: 'center' },
  shutterBtnOuter: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  shutterBtnInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', elevation: 8 }
});

