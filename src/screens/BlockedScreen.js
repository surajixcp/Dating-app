import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import apiClient from '../services/api';

export default function BlockedScreen({ navigation }) {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchBlockedUsers();
    }, [])
  );

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/block/blocked-users');
      if (res.data && res.data.data) {
        setBlockedUsers(res.data.data);
      }
    } catch (e) {
      console.log('Error fetching blocked users:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockId) => {
    try {
      const res = await apiClient.put('/block/unblock-user', { id: blockId, status: "0" });
      if (res.data) {
        Alert.alert('Unblocked', 'User has been successfully unblocked.');
        fetchBlockedUsers();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to unblock user.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Contacts</Text>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {blockedUsers.map(blockRecord => {
              const user = blockRecord.blockedUserId || {};
              return (
                <View key={blockRecord._id} style={styles.userCard}>
                  <Image source={user.profile_url_1 ? { uri: user.profile_url_1 } : require('../../public/images/img_13.png')} style={styles.avatar} />
                  <Text style={styles.userName}>{user.name || 'Unknown User'}</Text>
                  <TouchableOpacity style={styles.unblockBtn} onPress={() => handleUnblock(blockRecord._id)}>
                    <Text style={styles.unblockText}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
            
            {blockedUsers.length === 0 && (
              <Text style={styles.emptyText}>You haven't blocked anyone yet.</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundOff },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  iconBtnPlaceholder: { width: 44 },
  
  list: { padding: 20, gap: 16 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.white, borderRadius: SIZES.radiusLarge, ...SHADOWS.light },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  userName: { flex: 1, fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  
  unblockBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(233, 64, 87, 0.1)' },
  unblockText: { color: COLORS.primary, fontWeight: '800', fontSize: 13 },
  emptyText: { textAlign: 'center', color: COLORS.textLight, marginTop: 40, fontWeight: '500' }
});
