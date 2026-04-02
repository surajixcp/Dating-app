import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView, TextInput, Modal, Dimensions, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Purchases from '../services/revenuecat';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';

const { width } = Dimensions.get('window');

export default function FeedScreen({ navigation }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/profile/getmatches');
      if (response.data && response.data.data) {
        const backendMatches = response.data.data.map(user => ({
          id: user._id,
          name: user.name || 'Unknown',
          age: user.age || 20,
          image: user.profile_url_1 ? { uri: user.profile_url_1 } : require('../../public/images/img_15.png'),
          active: user.is_active || false,
          location: user.location || '',
          distance: 'Nearby',
          bio: user.lookingFor || 'Enjoying life and looking for someone to share beautiful moments with.',
          is_verified: user.is_verified || false
        }));
        setMatches(backendMatches);
      }
    } catch (error) {
      console.log('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleLike = async (match) => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = typeof customerInfo.entitlements.active['pro'] !== "undefined";

      const response = await apiClient.post('/like/profile-like', { profile_id: match.id, isPremium });
      
      setMatches(prevMatches => prevMatches.filter(m => m.id !== match.id));

      if (response.data && response.data.isMatch) {
        navigation.navigate('MatchOverlay', { userName: match.name, userImage: match.image }); 
      }
    } catch (error) {
      console.log('Error liking profile:', error);
      if (error.response && error.response.status === 402) {
         Alert.alert(
           "Out of Swipes! 🛑",
           "You've hit your daily limit of 50 likes. Upgrade to Viraag Premium to keep swiping!",
           [
             { text: "No Thanks", style: "cancel" },
             { text: "Upgrade", onPress: () => navigation.navigate('Premium') }
           ]
         );
      }
    }
  };

  const handleSuperLike = async (match) => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = typeof customerInfo.entitlements.active['pro'] !== "undefined";

      const response = await apiClient.post('/like/profile-like', { profile_id: match.id, isPremium, is_super_like: true });
      
      setMatches(prevMatches => prevMatches.filter(m => m.id !== match.id));

      if (response.data && response.data.isMatch) {
        navigation.navigate('MatchOverlay', { userName: match.name, userImage: match.image }); 
      }
    } catch (error) {
      console.log('Error super liking profile:', error);
      if (error.response && error.response.status === 402) {
         Alert.alert(
           "Out of Super Likes! ⭐",
           "You've used your daily Super Like! Upgrade to Viraag Premium to send unlimited priority matching Super Likes!",
           [
             { text: "No Thanks", style: "cancel" },
             { text: "Upgrade", onPress: () => navigation.navigate('Premium') }
           ]
         );
      }
    }
  };

  const renderCard = (match) => {
    const isExpanded = expandedId === match.id;
    return (
      <TouchableOpacity 
        key={match.id} 
        style={[styles.card, isExpanded && styles.cardExpanded]} 
        activeOpacity={0.9} 
        onPress={() => navigation.navigate('UserProfile')}
      >
        <ImageBackground source={match.image} style={styles.cardInfo} imageStyle={styles.cardImage}>
          
          <View style={styles.topOverlay}>
            {match.active && (
              <View style={styles.glassBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.expandIcon} 
              onPress={(e) => { 
                e.stopPropagation(); 
                setExpandedId(isExpanded ? null : match.id); 
              }}
            >
              <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={styles.expandCircle}>
                <Ionicons name={isExpanded ? "contract" : "expand"} size={16} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={[styles.bottomGradient, isExpanded && styles.bottomGradientExpanded]}>
            <View style={styles.infoRow}>
              <View>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>{match.name}, {match.age}</Text>
                  {match.is_verified && (
                     <Ionicons name="checkmark-circle" size={16} color="#4AA9FF" style={{ marginLeft: 6 }} />
                  )}
                </View>
                <Text style={styles.distanceText}>{match.distance}</Text>
              </View>
            </View>

            {isExpanded && (
               <View style={styles.expandedContent}>
                  <Text style={styles.bioText} numberOfLines={0}>
                    {match.bio}
                  </Text>
               </View>
            )}
            
            <View style={styles.actionRow}>
               <TouchableOpacity style={styles.floatingAction} onPress={(e) => { e.stopPropagation(); navigation.navigate('Chat'); }}>
                  <Ionicons name="chatbubble-ellipses" size={20} color="#FFF" />
               </TouchableOpacity>
               <TouchableOpacity 
                style={[styles.floatingAction, { backgroundColor: '#4AA9FF' }]} 
                onPress={(e) => { 
                  e.stopPropagation(); 
                  handleSuperLike(match);
                }}
               >
                  <Ionicons name="star" size={22} color="#FFF" />
               </TouchableOpacity>
               <TouchableOpacity 
                style={[styles.floatingAction, { backgroundColor: '#E94057' }]} 
                onPress={(e) => { 
                  e.stopPropagation(); 
                  handleLike(match);
                }}
               >
                  <Ionicons name="heart" size={24} color="#FFF" />
               </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const leftCol = matches.filter((_, i) => i % 2 === 0);
  const rightCol = matches.filter((_, i) => i % 2 !== 0);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {isSearchActive ? (
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => { setIsSearchActive(false); setSearchQuery(''); }}>
                <Ionicons name="close" size={22} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.headerTitle}>Matches</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIconBtn}>
                  <Ionicons name="notifications-outline" size={26} color="#333" />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconBtn} onPress={() => setIsSearchActive(true)}>
                  <Ionicons name="search-outline" size={26} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconBtn} onPress={toggleMenu}>
                  <Ionicons name="options-outline" size={26} color="#333" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Floating Menu */}
        {menuVisible && (
          <Modal transparent visible={menuVisible} animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleMenu}>
              <View style={styles.dropdownMenu}>
                 <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('Filters'); }}>
                   <Ionicons name="funnel-outline" size={18} color="#333" />
                   <Text style={styles.menuText}>Discovery Filters</Text>
                 </TouchableOpacity>
                 <View style={styles.separator} />
                 <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); Alert.alert('Viraag Contest', 'Coming soon!'); }}>
                   <Ionicons name="trophy-outline" size={18} color="#333" />
                   <Text style={styles.menuText}>Viraag Contest</Text>
                 </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        {/* Masonry Content */}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} overScrollMode="never">
            {matches.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                 <Text style={{ fontSize: 16, color: '#999', textAlign: 'center' }}>No matches found near you right now.</Text>
              </View>
            ) : (
              <View style={styles.masonryContainer}>
                <View style={styles.column}>{leftCol.map(renderCard)}</View>
                <View style={styles.column}>{rightCol.map(renderCard)}</View>
              </View>
            )}
            <View style={{ height: 120 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  safeArea: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 16, 
    zIndex: 10 
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#000', letterSpacing: -1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerIconBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FAF5F5', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#32CD32', borderWidth: 1.5, borderColor: '#FFF' },

  searchBarContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 16, paddingHorizontal: 14, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownMenu: { 
    position: 'absolute', 
    top: 70, 
    right: 20, 
    backgroundColor: '#FFF', 
    borderRadius: 18, 
    width: 190, 
    ...SHADOWS.medium,
    elevation: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuText: { fontSize: 14, fontWeight: '700', color: '#333' },
  separator: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 16 },

  scrollContent: { paddingHorizontal: 18, paddingTop: 6 },
  masonryContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: (width - 36 - 16) / 2 },
  
  card: { 
    width: '100%', 
    aspectRatio: 0.72, 
    borderRadius: SIZES.radiusLarge, 
    overflow: 'hidden', 
    marginBottom: 16, 
    backgroundColor: '#F5F5F5',
    ...SHADOWS.light
  },
  cardExpanded: { aspectRatio: 0.55 },
  cardImage: { borderRadius: SIZES.radiusLarge },
  cardInfo: { flex: 1, justifyContent: 'space-between' },
  
  topOverlay: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  glassBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#32CD32', marginRight: 6 },
  activeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  
  expandCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  expandIcon: { padding: 4 },

  bottomGradient: { height: '60%', justifyContent: 'flex-end', padding: 16, paddingBottom: 20 },
  bottomGradientExpanded: { height: '85%' },
  infoRow: { marginBottom: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  nameText: { fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  distanceText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  
  expandedContent: { marginBottom: 16 },
  bioText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 18, fontWeight: '500' },
  
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  floatingAction: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  }
});
