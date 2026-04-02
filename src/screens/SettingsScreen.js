import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

export default function SettingsScreen({ navigation }) {
  const [callsOff, setCallsOff] = useState(true);

  const SettingRow = ({ icon, imageUrl, title, action, isSwitch, switchValue, onSwitchChange, isLast, isDestructive }) => (
    <TouchableOpacity 
      style={[styles.settingRow, !isLast && styles.borderBottom]} 
      activeOpacity={isSwitch ? 1 : 0.7} 
      onPress={action}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          {imageUrl ? (
            <Image 
              source={imageUrl} 
              style={{ width: 20, height: 20, tintColor: isDestructive ? '#FF4D4D' : COLORS.primary }} 
              resizeMode="contain" 
            />
          ) : (
            <Ionicons name={icon} size={20} color={isDestructive ? '#FF4D4D' : COLORS.primary} />
          )}
        </View>
        <Text style={[styles.rowTitle, isDestructive && { color: '#FF4D4D' }]}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch
          trackColor={{ false: "#D1D1D1", true: COLORS.primary }}
          thumbColor="#FFF"
          onValueChange={onSwitchChange}
          value={switchValue}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Direct Activity</Text>
        <SettingRow 
          imageUrl={require('../../public/images/user-block-svgrepo-com 1.png')} 
          title="Blocked Contact List" 
          action={() => navigation.navigate('Blocked')} 
        />
        <SettingRow 
          icon="notifications-outline" 
          title="Notification Settings" 
          action={() => navigation.navigate('NotificationSettings')} 
          isLast 
        />

        <Text style={styles.sectionTitle}>Privacy & Communications</Text>
        <SettingRow 
          icon="call-outline" 
          title="Mute Incoming Calls" 
          isSwitch 
          switchValue={callsOff} 
          onSwitchChange={setCallsOff} 
        />
        <SettingRow 
          imageUrl={require('../../public/images/support-svgrepo-com 1.png')} 
          title="Official Viraag Support" 
          action={() => navigation.navigate('Help')} 
          isLast 
        />

        <Text style={styles.sectionTitle}>Help & Information</Text>
        <SettingRow icon="chatbubble-ellipses-outline" title="Live Chat Support" action={() => navigation.navigate('Help')} />
        <SettingRow icon="headset-outline" title="Request Call Back 24*7" action={() => navigation.navigate('CallExecutive')} />
        <SettingRow icon="people-circle-outline" title="Follow Community" action={() => navigation.navigate('FollowUs')} />
        <SettingRow icon="star-outline" title="Rate on Store" action={() => navigation.navigate('RateUs')} />
        <SettingRow icon="chatbubble-outline" title="Send Feedback" action={() => navigation.navigate('Feedback')} isLast />

        <Text style={styles.sectionTitle}>Legal Documents</Text>
        <SettingRow icon="document-text-outline" title="Terms of Services" action={() => Alert.alert('Legal', 'Check website for details.')} />
        <SettingRow icon="shield-checkmark-outline" title="Data Privacy Policy" action={() => Alert.alert('Privacy', 'Your data is encrypted.')} isLast />

        <Text style={styles.sectionTitle}>Account Management</Text>
        <SettingRow 
          imageUrl={require('../../public/images/trash-2.png')} 
          title="Delete Account Permanently" 
          action={() => navigation.navigate('DeleteAccount')} 
          isDestructive
        />
        <SettingRow 
          icon="log-out-outline" 
          title="Logout session" 
          action={() => navigation.navigate('LogoutModal')} 
          isLast 
          isDestructive
        />

        <View style={styles.footer}>
          <Text style={styles.versionText}>Viraag Version 1.0.52 (Stable)</Text>
          <Text style={styles.copyrightText}>© 2026 Viraag India Pvt Ltd.</Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  iconBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  
  scrollContent: { paddingHorizontal: 24, paddingTop: 10 },
  sectionTitle: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginTop: 24, marginBottom: 8, textTransform: 'uppercase' },
  
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { marginRight: 15 },
  rowTitle: { fontSize: 16, color: COLORS.textDark, fontWeight: '500' },

  footer: { marginTop: 40, alignItems: 'center', marginBottom: 20 },
  versionText: { fontSize: 12, color: COLORS.textLight },
  copyrightText: { fontSize: 11, color: '#CCC', marginTop: 4 }
});
