import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import apiClient, { BASE_URL } from '../services/api';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function ChatScreen({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const socketRef = useRef(null);
  const scrollViewRef = useRef(null);

  const { recipientId, recipientName, recipientAvatar } = route.params || {};

  useEffect(() => {
    initChat();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initChat = async () => {
    try {
      const token = await AsyncStorage.getItem('@viraag_auth_token');
      if (!token) return;

      const payload = jwtDecode(token);
      const userId = payload.id || payload._id;
      setMyUserId(userId);

      if (recipientId) {
        // Fetch chat history
        try {
          // The backend gets matching toUserId -> :id from our user ID
          const resp = await apiClient.get(`/message/getDataById/${recipientId}`);
          if (resp.data && resp.data.data) {
            const history = resp.data.data.map(m => ({
              id: m._id,
              text: m.content,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: m.fromUserId === userId
            }));
            setMessages(history);
          }
        } catch (err) {
          console.log('Error fetching chat history', err);
        }
      }

      // Initialize Socket
      const socket = io(BASE_URL);
      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('user_connected', userId);
      });

      socket.on('new_message', (data) => {
        if (data.fromUserId === recipientId) {
          setMessages(prev => [...prev, {
            id: data.id || Date.now().toString(),
            text: data.content,
            time: new Date(data.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
          }]);
        }
      });

    } catch (e) {
      console.error('Error initializing chat:', e);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() && myUserId && socketRef.current && recipientId) {
      const msgObj = {
        fromUserId: myUserId,
        toUserId: recipientId,
        content: inputText,
        fileName: '',
        filePath: ''
      };
      
      socketRef.current.emit('private_message', msgObj);
      
      const now = new Date();
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: inputText, 
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        isMe: true 
      }]);
      setInputText('');
    }
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerProfile} onPress={() => navigation.navigate('UserProfile')}>
            <View style={styles.avatarWrapper}>
              <Image source={recipientAvatar || require('../../public/images/img_19.png')} style={styles.avatar} />
              <View style={styles.onlineBadge} />
            </View>
            <View>
              <Text style={styles.userName}>{recipientName || 'Loading...'}</Text>
              <Text style={styles.statusText}>Online</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerIconBtn} 
              onPress={() => Alert.alert('Voice Call', 'Connecting voice call with Grace...')}
            >
              <View style={styles.actionCircle}>
                <Ionicons name="call-outline" size={20} color={COLORS.primary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.headerIconBtn} 
              onPress={() => navigation.navigate('VideoCall', { recipientId, recipientName })}
            >
              <View style={styles.actionCircle}>
                <Ionicons name="videocam-outline" size={20} color={COLORS.primary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtn} onPress={toggleMenu}>
              <View style={styles.optionCircle}>
                <Ionicons name="ellipsis-vertical" size={20} color="#333" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Options Menu */}
          {menuVisible && (
            <View style={styles.dropdownMenu}>
               <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); Alert.alert('Search', 'Search feature coming soon'); }}>
                 <Ionicons name="search-outline" size={18} color="#333" />
                 <Text style={styles.menuText}>Search</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={async () => { 
                    toggleMenu(); 
                    try {
                      const res = await apiClient.post('/block/block-user', { blockedUserId: recipientId });
                      if(res.data) {
                         Alert.alert('Blocked', 'This user has been securely blocked.');
                         navigation.replace('MainTabs');
                      }
                    } catch(e) {
                      Alert.alert('Error', 'Could not block user. Try again later.');
                    }
                  }}
               >
                 <Ionicons name="ban-outline" size={18} color="#FF6B6B" />
                 <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Block User</Text>
               </TouchableOpacity>
            </View>
          )}
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.chatArea}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView 
            style={styles.messagesContainer} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.dateLabelWrapper}>
               <View style={styles.dateLine} />
               <Text style={styles.dateLabel}>Today</Text>
               <View style={styles.dateLine} />
            </View>

            {messages.map((msg) => (
              <View key={msg.id} style={[styles.bubbleWrapper, msg.isMe ? styles.myWrapper : styles.theirWrapper]}>
                {!msg.isMe && <Image source={recipientAvatar || require('../../public/images/img_19.png')} style={styles.smallAvatar} />}
                <View style={styles.bubbleContent}>
                  {msg.isMe ? (
                    <LinearGradient colors={[COLORS.primary, '#F27121']} style={styles.myBubble}>
                      <Text style={styles.myMessageText}>{msg.text}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.theirBubble}>
                      <Text style={styles.theirMessageText}>{msg.text}</Text>
                    </View>
                  )}
                  <View style={[styles.timeRow, msg.isMe ? styles.myTimeRow : styles.theirTimeRow]}>
                    <Text style={styles.timeText}>{msg.time}</Text>
                    {msg.isMe && <Ionicons name="checkmark-done" size={16} color={COLORS.primary} style={{ marginLeft: 4 }} />}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Floating Input Area */}
          <View style={styles.inputAreaOuter}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.inputActionBtn}>
                <Ionicons name="happy-outline" size={24} color="#999" />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor="#A0A0A0"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxHeight={100}
              />
              <TouchableOpacity style={styles.inputActionBtn}>
                <Ionicons name="attach-outline" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && styles.disabledSend]} 
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <LinearGradient 
                colors={inputText.trim() ? [COLORS.primary, '#F27121'] : ['#E0E0E0', '#D0D0D0']} 
                style={styles.sendInner}
              >
                <Ionicons name={inputText.trim() ? "send" : "mic"} size={22} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  safeArea: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5',
    zIndex: 100 
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FAF5F5', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  headerProfile: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { position: 'relative', marginRight: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  onlineBadge: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#32CD32', borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  statusText: { fontSize: 11, color: '#32CD32', fontWeight: '700' },
  
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIconBtn: { marginLeft: 8 },
  actionCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FAF5F5', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FEE' },
  optionCircle: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center' },

  dropdownMenu: { 
    position: 'absolute', 
    top: 65, 
    right: 16, 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    width: 160, 
    ...SHADOWS.medium,
    elevation: 10,
    zIndex: 200,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuText: { fontSize: 14, fontWeight: '700', color: '#333' },

  chatArea: { flex: 1 },
  messagesContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  
  dateLabelWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  dateLine: { flex: 1, height: 1, backgroundColor: '#F0F0F0' },
  dateLabel: { marginHorizontal: 12, fontSize: 12, color: '#AAA', fontWeight: '700', textTransform: 'uppercase' },
  
  bubbleWrapper: { marginBottom: 16, flexDirection: 'row', maxWidth: '85%' },
  myWrapper: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  theirWrapper: { alignSelf: 'flex-start', justifyContent: 'flex-start' },
  
  smallAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8, alignSelf: 'flex-end' },
  bubbleContent: { flexShrink: 1 },
  
  myBubble: { 
    padding: 16, 
    borderRadius: 24, 
    borderBottomRightRadius: 4, 
    ...SHADOWS.light 
  },
  theirBubble: { 
    padding: 16, 
    borderRadius: 24, 
    borderBottomLeftRadius: 4, 
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  
  myMessageText: { fontSize: 15, color: '#FFF', lineHeight: 22, fontWeight: '500' },
  theirMessageText: { fontSize: 15, color: COLORS.textDark, lineHeight: 22, fontWeight: '500' },
  
  timeRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center' },
  myTimeRow: { justifyContent: 'flex-end' },
  theirTimeRow: { paddingLeft: 4 },
  timeText: { fontSize: 11, color: '#B0B0B0', fontWeight: '600' },

  inputAreaOuter: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 18, 
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5'
  },
  inputContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9F9F9', 
    borderRadius: 20, 
    paddingHorizontal: 12, 
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  textInput: { flex: 1, fontSize: 15, color: '#333', paddingVertical: 12, paddingHorizontal: 8 },
  inputActionBtn: { padding: 4 },
  
  sendBtn: { marginLeft: 12 },
  sendInner: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium },
  disabledSend: { opacity: 1 }
});
