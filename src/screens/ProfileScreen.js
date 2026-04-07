import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';

const { height, width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const response = await apiClient.get('/profile/me');
          if (response.data && response.data.success) {
            setProfile(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const userData = profile || {};
  const lifestyle = userData.lifestyle || {};

  const images = [
    userData.profile_url_1,
    userData.profile_url_2,
    userData.profile_url_3,
    userData.profile_url_4,
    userData.profile_url_5
  ].filter(url => typeof url === 'string' && url.trim().length > 0);

  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80');
  }

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1 }}>
      
      <View style={{ height: height * 0.55 }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
        >
          {images.map((imgUri, index) => (
            <ImageBackground 
              key={index}
              source={{ uri: imgUri }} 
              style={[styles.heroImage, { width }]}
            >
              <LinearGradient colors={['rgba(255,255,255,0.7)', 'transparent']} style={styles.topGradient}>
                <SafeAreaView>
                  <View style={styles.header}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                      <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={styles.headerRightGroup}>
                       <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('EditProfile')}>
                         <Ionicons name="pencil-outline" size={24} color={COLORS.textDark} />
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}>
                         <Ionicons name="settings-outline" size={24} color={COLORS.textDark} />
                       </TouchableOpacity>
                    </View>
                  </View>
                </SafeAreaView>
              </LinearGradient>
            </ImageBackground>
          ))}
        </ScrollView>

        <View style={styles.dotContainerOverlay}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, activeIndex === i ? styles.dotActive : null]} />
          ))}
        </View>
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.nameContainer}>
          <View style={styles.nameLeft}>
            <Text style={styles.nameText}>{userData.name || 'User'}, {userData.age || 'N/A'}</Text>
            <Text style={styles.jobText}>{userData.lookingFor || 'Dating App Member'}</Text>
          </View>
          <TouchableOpacity style={styles.sendIconBtn} onPress={() => navigation.navigate('Premium')}>
            <Ionicons name="star" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userData.is_verified ? '100%' : '80%'}</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userData.likeCount || 0}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.rowCentered}>
             <Ionicons name="location-outline" size={20} color={COLORS.primary} />
             <Text style={styles.sectionBody}>{userData.location || 'Not Specified'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionBodyText}>
            {lifestyle.selfDescription || 'No description provided yet.'}
          </Text>
          {lifestyle.selfDescription && lifestyle.selfDescription.length > 100 && (
            <TouchableOpacity>
              <Text style={styles.readMore}>Read more</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Extra spacing for Bottom Tab Bar overlap safety */}
        <View style={{ height: 120 }} />
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  heroImage: { height: height * 0.55, justifyContent: 'space-between' },
  topGradient: { height: 140 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }, 
  headerRightGroup: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  
  dotContainerOverlay: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: COLORS.white, width: 24, height: 8, borderRadius: 4 },

  bottomCard: { backgroundColor: COLORS.white, marginTop: -24, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 32 },
  
  nameContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  nameLeft: { flex: 1 },
  nameText: { fontSize: 28, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  jobText: { fontSize: 16, color: COLORS.textLight, fontWeight: '500' },
  
  sendIconBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { flex: 1, backgroundColor: COLORS.backgroundOff, borderRadius: SIZES.radiusMedium, paddingVertical: 16, alignItems: 'center', marginHorizontal: 4, ...SHADOWS.light },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  statLabel: { fontSize: 13, color: COLORS.textLight, fontWeight: '600' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: 12 },
  rowCentered: { flexDirection: 'row', alignItems: 'center' },
  sectionBody: { fontSize: 16, color: COLORS.textLight, marginLeft: 8 },
  sectionBodyText: { fontSize: 16, color: COLORS.textLight, lineHeight: 26 },
  readMore: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginTop: 8 }
});

