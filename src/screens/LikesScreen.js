import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Image, Dimensions, Alert, Modal, Animated, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import Purchases from '../services/revenuecat';
import apiClient from '../services/api';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function LikesScreen({ navigation }) {
  const [activePage, setActivePage] = useState('Likes You');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [likesData, setLikesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchPremiumData = async () => {
        setIsLoading(true);
        try {
          // 1. Evaluate RevenueCat Entitlement
          if (Platform.OS !== 'web') {
            const customerInfo = await Purchases.getCustomerInfo();
            if (typeof customerInfo.entitlements.active['premium'] !== "undefined" || typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
              setIsPremium(true);
            } else {
              setIsPremium(false);
            }
          } else {
            setIsPremium(false);
          }

          // 2. Fetch the "Who Liked Me" Backend Pipeline
          const response = await apiClient.get('/like/who-liked-me');
          if (response.data && response.data.data) {
            const mappedLikes = response.data.data.map(user => ({
                id: user._id,
                name: user.name || 'Unknown',
                age: user.age || 20,
                image: user.profile_url_1 ? { uri: user.profile_url_1 } : require('../../public/images/img_19.png'),
                active: user.is_active || false,
                location: user.location || 'Nearby'
            }));
            setLikesData(mappedLikes);
          }
        } catch (e) {
          console.log("Routing Error (Premium Check or Likes Fetch):", e);
          setIsPremium(false);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPremiumData();
    }, [])
  );

  const handleSelect = (page) => {
    setActivePage(page);
    setMenuVisible(false);
  };

  const PageMenuRow = ({ title, icon }) => (
    <TouchableOpacity style={styles.menuRow} onPress={() => handleSelect(title)}>
       <View style={styles.menuRowLeft}>
         <View style={styles.menuIconCircle}>
           <Ionicons name={icon} size={20} color={COLORS.primary} />
         </View>
         <Text style={[styles.menuTitle, activePage === title && { color: COLORS.primary, fontWeight: '800' }]}>{title}</Text>
       </View>
       <Ionicons name="chevron-forward" size={18} color="#EEE" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.titleContainer} activeOpacity={0.7} onPress={() => setMenuVisible(true)}>
            <Text style={styles.headerTitle}>{activePage}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.textDark} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => setMenuVisible(true)}>
            <Ionicons name="options-outline" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>

        {/* Premium Bottom Sheet Modal */}
        <Modal transparent visible={menuVisible} animationType="slide">
          <View style={styles.modalBg}>
             <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setMenuVisible(false)} />
             <View style={styles.bottomSheet}>
                <View style={styles.dragHandle} />
                <Text style={styles.bottomSheetTitle}>Switch View</Text>
                <PageMenuRow title="Likes You" icon="heart-outline" />
                <PageMenuRow title="Visitors" icon="eye-outline" />
                <PageMenuRow title="New Add Profile" icon="person-add-outline" />
                <PageMenuRow title="New Matches" icon="people-outline" />
                <View style={{ height: 40 }} />
             </View>
          </View>
        </Modal>

        {/* Dynamic Content */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} overScrollMode="never">
          
          {isLoading ? (
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                 <ActivityIndicator size="large" color="#E94057" />
             </View>
          ) : likesData.length === 0 ? (
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                 <Ionicons name="heart-dislike-outline" size={60} color="#DDD" />
                 <Text style={{ marginTop: 16, fontSize: 18, color: '#AAA', fontWeight: '600' }}>No inbound likes yet.</Text>
                 <Text style={{ marginTop: 8, fontSize: 14, color: '#CCC', textAlign: 'center', marginHorizontal: 40 }}>Keep swiping! When someone likes you, their profile will appear here.</Text>
             </View>
          ) : activePage === 'New Add Profile' ? (
            // LIST VIEW: Connections logic
            <View style={styles.listArea}>
               {likesData.map((user, idx) => (
                  <TouchableOpacity key={idx} style={styles.listCard} activeOpacity={0.9} onPress={() => navigation.navigate('UserProfile', { userId: user.id })}>
                     <View style={styles.listAvatarWrapper}>
                       <Image source={user.image} style={styles.listAvatar} />
                       {user.active && <View style={styles.listActiveDot} />}
                     </View>
                     <View style={styles.listInfo}>
                        <Text style={styles.listName}>{user.name}, {user.age}</Text>
                        <Text style={styles.listSub}>{user.location}</Text>
                     </View>
                     <TouchableOpacity style={styles.connectMiniBtn} onPress={() => navigation.navigate('MatchOverlay', { userName: user.name, userImage: user.image })}>
                        <LinearGradient colors={[COLORS.primary, '#F27121']} style={styles.connectGradient}>
                           <Text style={styles.connectText}>Connect</Text>
                        </LinearGradient>
                     </TouchableOpacity>
                  </TouchableOpacity>
               ))}
            </View>
          ) : (
            // GRID VIEW: Modernized Masonry-inspired grid
            <View style={styles.gridRow}>
              {likesData.map((match, index) => (
                <TouchableOpacity 
                   key={index} 
                   style={styles.gridCard} 
                   activeOpacity={0.9} 
                   onPress={() => {
                     if (activePage === 'Likes You' && !isPremium) {
                       navigation.navigate('Premium');
                     } else {
                       navigation.navigate('UserProfile', { userId: match.id });
                     }
                   }}
                >
                  <ImageBackground source={match.image} style={styles.cardImageBg} imageStyle={{ borderRadius: 24 }}>
                    {activePage === 'Likes You' && !isPremium && (
                       <View style={styles.gatedBlurContainer}>
                          <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />
                          <View style={styles.lockCircle}>
                             <Ionicons name="lock-closed" size={24} color="#FFF" />
                          </View>
                       </View>
                    )}
                    
                    <View style={styles.cardTop}>
                      {match.active ? (
                        <View style={styles.glassBadge}>
                           <View style={styles.badgeActiveDot} />
                           <Text style={styles.badgeText}>Active</Text>
                        </View>
                      ) : <View />}
                    </View>

                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.cardBottom}>
                      <View style={styles.nameRow}>
                        <Text style={styles.nameText}>{match.name}, {match.age}</Text>
                        <Ionicons name="checkmark-circle" size={14} color="#1E90FF" style={{ marginLeft: 4 }} />
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  safeArea: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  headerBackBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  headerIconBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  titleContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, ...SHADOWS.light },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },

  // Bottom Sheet
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingBottom: 20, paddingTop: 10 },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 20 },
  bottomSheetTitle: { fontSize: 22, fontWeight: '900', color: COLORS.textDark, textAlign: 'center', marginBottom: 24, letterSpacing: -0.5 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F7F7F7' },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FAF5F5', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuTitle: { fontSize: 16, color: '#333', fontWeight: '700' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

  // Grid Array (Likes You, Visitors)
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: (width - 40 - 16) / 2, height: 260, borderRadius: 24, marginBottom: 16, ...SHADOWS.medium, elevation: 6 },
  cardImageBg: { flex: 1, justifyContent: 'space-between' },
  cardTop: { padding: 12 },
  glassBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 12, 
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  badgeActiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#32CD32', marginRight: 6 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  cardBottom: { height: '35%', justifyContent: 'flex-end', padding: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  nameText: { fontSize: 16, fontWeight: '800', color: '#FFF' },

  // Gated Blur UI
  gatedBlurContainer: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', borderRadius: 24, overflow: 'hidden' },
  lockCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(233, 64, 87, 0.8)', alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium },

  // List View
  listArea: { flex: 1 },
  listCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 14, 
    borderRadius: 20, 
    marginBottom: 12, 
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  listAvatarWrapper: { position: 'relative', marginRight: 14 },
  listAvatar: { width: 56, height: 56, borderRadius: 28 },
  listActiveDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#32CD32', borderWidth: 2, borderColor: '#FFF' },
  listInfo: { flex: 1 },
  listName: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
  listSub: { fontSize: 12, color: '#AAA', fontWeight: '500' },
  connectMiniBtn: { borderRadius: 10, overflow: 'hidden' },
  connectGradient: { paddingHorizontal: 14, paddingVertical: 8 },
  connectText: { color: '#FFF', fontSize: 12, fontWeight: '800' }
});
