import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ACTIVITIES_MOCK = [];

const NEW_MATCHES = [
  { id: '1', name: 'Isabella', avatar: require('../../public/images/img_17.png') },
  { id: '2', name: 'Olivia', avatar: require('../../public/images/img_28.png') },
];

const MESSAGES_MOCK = [];
export default function MessagesScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMatches, setNewMatches] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
      fetchStories();
    }, [])
  );

  const fetchStories = async () => {
    try {
      const response = await apiClient.get('/story/getFriendListStory');
      if (response.data && response.data.data) {
        setActivities(response.data.data.map(story => {
          const user = story.user_id || {};
          return {
            id: story._id,
            name: user.name ? user.name.split(' ')[0] : 'Friends',
            thumb: story.mediaUrls && story.mediaUrls.length > 0 ? { uri: story.mediaUrls[0] } : require('../../public/images/img_13.png'),
            storyUrl: story.mediaUrls && story.mediaUrls.length > 0 ? story.mediaUrls[0] : null
          };
        }));
      }
    } catch (e) {
      console.log('Error fetching stories:', e);
    }
  };

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/message/getUserswithLastMsg');
      if (response.data && response.data.data) {
        const backendMessages = response.data.data.map(conv => {
          const otherUser = Array.isArray(conv.users) && conv.users.length > 0 ? conv.users[0] : {};
          return {
            id: conv._id,
            otherUserId: otherUser._id,
            name: otherUser.name || 'Unknown',
            msg: conv.lastMessage?.content || 'Started a conversation',
            time: conv.lastMessage?.created_at ? new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            avatar: otherUser.profile_url_1 ? { uri: otherUser.profile_url_1 } : require('../../public/images/img_13.png'),
            unread: 0,
          };
        });
        
        // Dynamically sort into new matches (no messages yet) vs active chats
        setNewMatches(backendMessages.filter(m => m.msg === 'Started a conversation'));
        setMessages(backendMessages.filter(m => m.msg !== 'Started a conversation'));
      }
    } catch (error) {
      console.log('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActivity = ({ item }) => (
    <TouchableOpacity style={styles.activityItem} onPress={() => navigation.navigate('Status')}>
      <LinearGradient colors={[COLORS.primary, '#F27121']} style={styles.activityRingOuter}>
        <View style={styles.activityInner}>
          <Image source={item.thumb} style={styles.activityImage} />
        </View>
      </LinearGradient>
      <Text style={styles.activityName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderNewMatch = ({ item }) => (
    <TouchableOpacity style={styles.newMatchItem} onPress={() => navigation.navigate('Chat')}>
      <Image source={item.avatar} style={styles.newMatchAvatar} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.newMatchOverlay}>
        <Text style={styles.newMatchName}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} activeOpacity={0.7} onPress={() => navigation.navigate('Chat', { recipientId: item.otherUserId, recipientName: item.name, recipientAvatar: item.avatar })}>
      <View style={styles.avatarWrapper}>
        <Image source={item.avatar} style={styles.messageAvatar} />
        {item.unread > 0 && <View style={styles.onlineStatus} />}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageRow}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={[styles.messageMsg, { 
            color: item.unread ? COLORS.textDark : COLORS.textLight, 
            fontWeight: item.unread ? '700' : '400',
            flex: 1
          }]} numberOfLines={1}>
            {item.msg}
          </Text>
          {item.unread > 0 && (
            <LinearGradient colors={[COLORS.primary, '#DC143C']} style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchText.toLowerCase()) || 
    msg.msg.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.headerIconBtn}>
             <Ionicons name="options-outline" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search messages..." 
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activities</Text>
          </View>
          <FlatList
            data={activities}
            horizontal
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={() => (
              <TouchableOpacity style={styles.activityItem} onPress={() => navigation.navigate('AddStatus')}>
                <View style={styles.addStatusRing}>
                  <Ionicons name="add" size={28} color={COLORS.primary} />
                </View>
                <Text style={styles.activityName}>My Status</Text>
              </TouchableOpacity>
            )}
            renderItem={renderActivity}
            contentContainerStyle={styles.activitiesList}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Matches</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <FlatList
            data={newMatches}
            horizontal
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={renderNewMatch}
            contentContainerStyle={styles.newMatchesList}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Messages</Text>
          </View>
          <View style={styles.messagesListContainer}>
            {filteredMessages.map(m => (
              <React.Fragment key={m.id}>
                {renderMessage({ item: m })}
              </React.Fragment>
            ))}
            {filteredMessages.length === 0 && (
              <Text style={styles.noResultsText}>No conversations found.</Text>
            )}
          </View>
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
    paddingHorizontal: 24, 
    marginTop: 10,
    marginBottom: 16 
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, letterSpacing: -1 },
  headerIconBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FAF5F5', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFE4E1' },
  
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F7F7F7', 
    marginHorizontal: 24, 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    height: 52, 
    marginBottom: 24 
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: COLORS.textDark, fontWeight: '500' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark },
  seeAll: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  activitiesList: { paddingHorizontal: 24, marginBottom: 24 },
  activityItem: { alignItems: 'center', marginRight: 20, width: 68 },
  activityRingOuter: { width: 68, height: 68, borderRadius: 34, padding: 2 },
  activityInner: { flex: 1, borderRadius: 32, backgroundColor: '#FFF', padding: 2 },
  activityImage: { width: '100%', height: '100%', borderRadius: 30 },
  activityName: { fontSize: 12, fontWeight: '700', color: COLORS.textDark, marginTop: 8 },
  addStatusRing: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: '#EEE', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },

  newMatchesList: { paddingHorizontal: 24, marginBottom: 28 },
  newMatchItem: { width: 90, height: 120, borderRadius: 16, overflow: 'hidden', marginRight: 14, backgroundColor: '#F0F0F0' },
  newMatchAvatar: { width: '100%', height: '100%' },
  newMatchOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, justifyContent: 'flex-end', padding: 8 },
  newMatchName: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  messagesListContainer: { borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  messageItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  avatarWrapper: { position: 'relative' },
  messageAvatar: { width: 64, height: 64, borderRadius: 32, marginRight: 18 },
  onlineStatus: { position: 'absolute', top: 2, right: 18, width: 14, height: 14, borderRadius: 7, backgroundColor: '#32CD32', borderWidth: 2, borderColor: '#FFF' },
  messageContent: { flex: 1 },
  messageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  messageName: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  messageTime: { fontSize: 12, color: COLORS.textLight, fontWeight: '600' },
  messageMsg: { fontSize: 14, lineHeight: 20 },
  unreadBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  unreadText: { color: COLORS.white, fontSize: 11, fontWeight: '900' },
  
  noResultsText: { textAlign: 'center', color: COLORS.textLight, marginTop: 40, fontSize: 15, fontWeight: '600' },
});
