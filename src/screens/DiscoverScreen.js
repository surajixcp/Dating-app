import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function DiscoverScreen({ navigation }) {
  const CATEGORIES = [
    { 
      id: '1', 
      title: 'Free Tonight', 
      icon: 'moon', 
      color: '#8A2387', 
      image: require('../../public/images/freetonight.png') 
    },
    { 
      id: '2', 
      title: 'Let\'s be friends', 
      icon: 'people', 
      color: '#E94057', 
      image: require('../../public/images/friends_category.png') 
    },
    { 
      id: '3', 
      title: 'Coffee Date', 
      icon: 'cafe', 
      color: '#F27121', 
      image: require('../../public/images/coffee_date.png') 
    },
    { 
      id: '4', 
      title: 'Sports', 
      icon: 'tennisball', 
      color: '#3A1C71', 
      image: require('../../public/images/sports_category.png') 
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>Discover</Text>
            <Text style={styles.subtitle} numberOfLines={1}>Connect with people who share your interests.</Text>
          </View>
          <TouchableOpacity 
            style={styles.searchBtn} 
            activeOpacity={0.7} 
            onPress={() => navigation.navigate('Filters')}
          >
            <View style={styles.searchIconOuter}>
              <Ionicons name="search" size={24} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={true}
        >
          <View style={styles.grid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.card} 
                activeOpacity={0.8} 
                onPress={() => navigation.navigate('MainTabs', { screen: 'Feed', params: { category: cat.title } })}
              >
                <ImageBackground source={cat.image} style={styles.cardBg} resizeMode="cover">
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.gradientOverlay}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: cat.color }]}>
                      <Ionicons name={cat.icon} size={22} color={COLORS.white} />
                    </View>
                    <Text style={styles.cardTitle}>{cat.title}</Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.bannerContainer} 
            activeOpacity={0.9} 
            onPress={() => navigation.navigate('Chat')}
          >
            <ImageBackground 
              source={require('../../public/images/blind_date.png')} 
              style={styles.bannerBg}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.95)']}
                style={styles.bannerGradient}
              >
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>Blind Date</Text>
                  <Text style={styles.bannerSubtitle}>Chat before you match. Find your spark today.</Text>
                  <View style={styles.badge}>
                    <Ionicons name="flash" size={12} color="#FFF" style={{ marginRight: 4 }} />
                    <Text style={styles.badgeText}>TRENDING</Text>
                  </View>
                </View>
                <View style={styles.arrowWrapper}>
                  <Ionicons name="chevron-forward-circle" size={48} color={COLORS.white} />
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  safeArea: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10,
    marginBottom: 24,
    width: '100%'
  },
  headerTextContainer: { flex: 1, paddingRight: 10 },
  headerTitle: { fontSize: 34, fontWeight: '800', color: COLORS.textDark, letterSpacing: -1.2 },
  subtitle: { fontSize: 13, color: COLORS.textLight, fontWeight: '700', marginTop: 2 },
  searchBtn: { 
    width: 52, 
    height: 52, 
    borderRadius: 16, 
    backgroundColor: '#FFF',
    borderWidth: 1.5, 
    borderColor: '#F0F0F0', 
    alignItems: 'center', 
    justifyContent: 'center',
    ...SHADOWS.light,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1
  },
  searchIconOuter: { 
    width: '100%', 
    height: '100%', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: (width - 40 - 14) / 2, 
    height: 250, 
    borderRadius: 24, 
    overflow: 'hidden', 
    backgroundColor: '#F7F7F7',
    marginBottom: 14,
    ...SHADOWS.medium,
    elevation: 6
  },
  cardBg: { flex: 1 },
  gradientOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    padding: 16 
  },
  iconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10,
    ...SHADOWS.light
  },
  cardTitle: { color: COLORS.white, fontSize: 17, fontWeight: '900', letterSpacing: -0.4 },

  bannerContainer: { 
    marginTop: 20, 
    height: 190, 
    borderRadius: 24, 
    backgroundColor: '#1A1A1A', 
    overflow: 'hidden',
    ...SHADOWS.medium,
    elevation: 8
  },
  bannerBg: { flex: 1 },
  bannerGradient: { 
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 24,
  },
  bannerContent: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.primary, 
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 12
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  bannerTitle: { color: COLORS.white, fontSize: 32, fontWeight: '900', letterSpacing: -1.2 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginTop: 4, width: '90%' },
  arrowWrapper: { alignSelf: 'flex-end', marginBottom: -10 }
});
