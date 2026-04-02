import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SIZES } from '../theme/theme';

export default function MatchOverlayScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['rgba(233,64,87,0.85)', 'rgba(242,113,33,0.95)']}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <View style={styles.topSpacer} />
        
        <View style={styles.matchTextContainer}>
          <Text style={styles.matchTitle}>It's a Match!</Text>
          <Text style={styles.matchSubtitle}>You and Jessica have liked each other.</Text>
        </View>

        <View style={styles.avatarsContainer}>
          <View style={[styles.avatarWrapper, styles.leftAvatar]}>
            <Image source={require('../../public/images/img_13.png')} style={styles.avatar} />
          </View>
          <View style={[styles.avatarWrapper, styles.rightAvatar]}>
            <Image source={require('../../public/images/img_19.png')} style={styles.avatar} />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <PrimaryButton 
            title="Send a Message" 
            onPress={() => navigation.replace('Chat')} 
            style={styles.btnPrimary} 
          />
          <TouchableOpacity activeOpacity={0.8} style={styles.keepSwipingBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: SIZES.paddingLarge },
  
  topSpacer: { flex: 1 },
  matchTextContainer: { alignItems: 'center', marginBottom: 60 },
  matchTitle: { fontSize: 44, fontWeight: '800', color: COLORS.white, marginBottom: 12, textAlign: 'center' },
  matchSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  
  avatarsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 180, marginBottom: 80 },
  avatarWrapper: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: COLORS.white, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  avatar: { width: '100%', height: '100%', borderRadius: 70 },
  leftAvatar: { zIndex: 2, transform: [{ translateX: 20 }, { rotate: '-5deg' }] },
  rightAvatar: { zIndex: 1, transform: [{ translateX: -20 }, { rotate: '5deg' }] },

  bottomContainer: { flex: 1, justifyContent: 'flex-end', paddingBottom: SIZES.paddingLarge },
  btnPrimary: { backgroundColor: COLORS.white },
  keepSwipingBtn: { paddingVertical: 18, marginTop: 12, alignItems: 'center' },
  keepSwipingText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
});
