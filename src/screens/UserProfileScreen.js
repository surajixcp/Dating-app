import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { COLORS } from '../theme/theme';
import apiClient from '../services/api';
import Purchases from '../services/revenuecat';

const { height, width } = Dimensions.get('window');
const ICEBREAKERS = ["Hiii 👋🏼", "Join Me 😍", "What's up 😉"];

export default function UserProfileScreen({ navigation, route }) {
  const [expanded, setExpanded] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const { user } = route.params || {};
  const activeImage = user?.image || require('../../public/images/img_13.png');

  // Dynamically map lifestyle elements into active Tag lists
  const TAGS = {};
  if (user?.lifestyle?.drinking) {
    TAGS["Drink"] = [{ label: user.lifestyle.drinking, active: true }];
  }
  if (user?.lifestyle?.smoking) {
    TAGS["Smoke"] = [{ label: user.lifestyle.smoking, active: true }];
  }
  if (user?.lifestyle?.exercise) {
    TAGS["Exercise"] = [{ label: user.lifestyle.exercise, active: true }];
  }
  if (user?.lifestyle?.interests?.length > 0) {
    TAGS["Interests"] = user.lifestyle.interests.map(i => ({ label: i, active: true }));
  }
  // Add fallback if empty
  if (Object.keys(TAGS).length === 0) {
    TAGS["General"] = [{ label: "N/A", active: false }];
  }

  const playLikeSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
         require('../../public/sounds/like.wav')
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch(err) {
      console.log('Error playing sound', err);
    }
  };

  const handleLike = async () => {
    if (!isLiked) {
       setIsLiked(true);
       await playLikeSound();
       try {
         const customerInfo = await Purchases.getCustomerInfo();
         const isPremium = typeof customerInfo.entitlements.active['pro'] !== "undefined";
         const response = await apiClient.post('/like/profile-like', { profile_id: user?.id, isPremium });
         if (response.data && response.data.isMatch) {
           navigation.navigate('MatchOverlay', { userName: user?.name, userImage: activeImage }); 
         } else {
           // Subtle popup confirmation instead of full block alert if they want a fluid experience
           Alert.alert("Liked ❤️", `You liked ${user?.name || 'this user'}!`);
         }
       } catch (error) {
         if (error.response && error.response.status === 402) {
            setIsLiked(false); // revert locally
            Alert.alert("Out of Swipes! 🛑", "You've hit your daily limit of likes. Upgrade to Viraag Premium to keep swiping!", [
              { text: "No Thanks", style: "cancel" },
              { text: "Upgrade", onPress: () => navigation.navigate('Premium') }
            ]);
         }
       }
    } else {
       // user actively clicked to UNLIKE
       setIsLiked(false);
       try {
         await apiClient.post(`/like/profile-dislike/${user?.id}`);
       } catch (error) {
         // Silently revert if api disconnects
         console.log("Unlike failed", error);
         setIsLiked(true);
       }
    }
  };

  const handleSuperLike = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = typeof customerInfo.entitlements.active['pro'] !== "undefined";
      const response = await apiClient.post('/like/profile-like', { profile_id: user?.id, isPremium, is_super_like: true });
      if (response.data && response.data.isMatch) {
        navigation.navigate('MatchOverlay', { userName: user?.name, userImage: activeImage }); 
      } else {
        Alert.alert("Super Liked ⭐", `You super liked ${user?.name || 'this user'}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 402) {
         Alert.alert("Out of Super Likes! ⭐", "You've used your daily Super Like! Upgrade to Viraag Premium to send unlimited priority matching Super Likes!", [
           { text: "No Thanks", style: "cancel" },
           { text: "Upgrade", onPress: () => navigation.navigate('Premium') }
         ]);
      }
    }
  };

  const navigateToChat = () => {
     navigation.navigate('Chat', { recipientId: user?.id, recipientName: user?.name, recipientAvatar: activeImage });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1 }}>
        {/* 50% Top Hero Map */}
      <ImageBackground 
        source={activeImage} 
        style={styles.heroImage}
      >
        <LinearGradient colors={['rgba(0,0,0,0.3)', 'transparent']} style={styles.topGradient}>
          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                <Ionicons name="chevron-back" size={28} color="#000" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.dotContainer}>
           <View style={[styles.dot, styles.dotActive]} />
           <View style={styles.dot} />
           <View style={styles.dot} />
           <View style={styles.dot} />
           <View style={styles.dot} />
        </View>
      </ImageBackground>

      {/* Floating Action Bar positioned on top of the seam */}
      <View style={styles.floatingActionWrapper}>
        <LinearGradient colors={['#960D1E', '#C61A28']} style={styles.actionBarGradient} start={{x:0, y:0}} end={{x:1, y:0}}>
          <TouchableOpacity style={styles.actionIconCell} onPress={handleLike}>
             <Ionicons name={isLiked ? "heart" : "heart-outline"} size={isLiked ? 28 : 26} color={isLiked ? "#FF3B30" : "white"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconCell} onPress={navigateToChat}><Ionicons name="chatbubble-ellipses-outline" size={26} color="white" /></TouchableOpacity>
          <TouchableOpacity style={styles.actionIconCell} onPress={handleSuperLike}><Ionicons name="sparkles-outline" size={26} color="white" /></TouchableOpacity>
          <TouchableOpacity style={styles.actionIconCell} onPress={handleLike}><Ionicons name="person-add-outline" size={26} color="white" /></TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Bottom Sheet Card */}
      <View style={styles.bottomCardWrapper}>
        <View style={styles.scrollPadding}>
          
          {/* Icebreakers horizontally */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.icebreakerList}>
            {ICEBREAKERS.map((text, idx) => (
              <TouchableOpacity key={idx} style={styles.icebreakerBtn}>
                <Text style={styles.icebreakerText}>{text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Name & Title */}
          <View style={styles.nameRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.nameText}>{user?.name || "Unknown"}, {user?.age || "N/A"}</Text>
              {user?.is_verified && (
                <Image source={require('../../public/images/verified.png')} style={{ width: 20, height: 20, marginLeft: 6 }} resizeMode="contain" />
              )}
            </View>
            <TouchableOpacity style={styles.sendIconBtn} onPress={navigateToChat}>
              <Ionicons name="paper-plane-outline" size={20} color="#E94057" style={{ marginLeft: -2 }} />
            </TouchableOpacity>
          </View>
          <Text style={styles.jobText}>Dating App Member</Text>

          {/* Location Block */}
          <View style={styles.sectionLarge}>
            <View style={styles.locationHeaderRow}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.distanceBadgeRound}>
                <Ionicons name="location-outline" size={12} color="#E94057" />
                <Text style={styles.distanceText}>{user?.distance || "Nearby"}</Text>
              </View>
            </View>
            <Text style={styles.sectionBody}>{user?.location || "Not Specified"}</Text>
          </View>

          {/* About Block */}
          <View style={styles.sectionLarge}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionBody}>
              {user?.bio || "No description provided yet."}
            </Text>
            {user?.bio && user.bio.length > 100 && (
              <TouchableOpacity>
                <Text style={styles.readMoreText}>Read more</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Expandable Lifestyle segment */}
          <TouchableOpacity style={styles.expandHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
            <Text style={styles.sectionTitle}>Talk his lifestyle & habits</Text>
            <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={22} color="#000" />
          </TouchableOpacity>

          {expanded && (
            <View style={styles.expandedContentBox}>
              {Object.keys(TAGS).map((category, idx) => (
                <View key={idx} style={styles.tagGroupBlock}>
                  <Text style={styles.tagGroupTitle}>{category}</Text>
                  <View style={styles.tagPillsList}>
                    {TAGS[category].map((tag, i) => (
                      <View key={i} style={[styles.tagPillContainer, tag.active && styles.tagPillActiveBorder]}>
                         {tag.active && <Ionicons name="checkmark" size={16} color="red" style={{ marginRight: 6 }} />}
                         <Text style={[styles.tagPillText, tag.active && styles.tagPillTextActive]}>{tag.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
          
          <View style={{ height: 60 }} />
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  
  heroImage: { height: height * 0.52, justifyContent: 'space-between' },
  topGradient: { paddingBottom: 60 },
  header: { paddingHorizontal: 12, paddingTop: 6 },
  
  dotContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingBottom: 50 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#FFF', elevation: 2, shadowOpacity: 0.3, shadowRadius: 3 },
  dotActive: { backgroundColor: '#FF1F1F' },

  floatingActionWrapper: { zIndex: 10, marginTop: -36, width: '100%', alignItems: 'center', pointerEvents: 'box-none' },
  actionBarGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: width * 0.72, height: 72, borderRadius: 36, elevation: 12, shadowColor: '#000', shadowOffset: {width:0, height:6}, shadowOpacity: 0.25, shadowRadius: 10 },
  actionIconCell: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  bottomCardWrapper: { backgroundColor: COLORS.white, marginTop: -36, paddingTop: 36, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  scrollPadding: { paddingHorizontal: 24, paddingTop: 50, paddingBottom: 40 },
  
  icebreakerList: { paddingBottom: 32 },
  icebreakerBtn: { backgroundColor: '#7B3A36', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginRight: 10 },
  icebreakerText: { color: COLORS.white, fontSize: 13, fontWeight: '600' },

  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  nameText: { fontSize: 24, fontWeight: '800', color: '#000' },
  jobText: { fontSize: 13, color: '#666', marginBottom: 26, fontWeight: '500' },
  
  sendIconBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#F0F0F0', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, marginTop: -4 },

  sectionLarge: { marginBottom: 28 },
  locationHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#000' },
  distanceBadgeRound: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEEED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  distanceText: { color: '#E94057', fontSize: 11, fontWeight: '800', marginLeft: 4 },
  sectionBody: { fontSize: 14, color: '#555', lineHeight: 22, fontWeight: '400' },
  readMoreText: { fontSize: 13, fontWeight: '800', color: '#FF1F1F', marginTop: 4 },

  expandHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  expandedContentBox: { paddingTop: 6 },
  
  tagGroupBlock: { marginBottom: 24 },
  tagGroupTitle: { fontSize: 13, fontWeight: '800', color: '#000', marginBottom: 14 },
  tagPillsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tagPillContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#DADADA' },
  tagPillActiveBorder: { borderColor: 'red' },
  tagPillText: { fontSize: 12, color: '#333', fontWeight: '500' },
  tagPillTextActive: { color: 'red', fontWeight: '800' }
});
