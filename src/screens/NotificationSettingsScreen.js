import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    messages: true,
    likes: true,
    matches: true,
    city: true,
    events: true
  });

  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

  const SettingRow = ({ icon, title, settingKey }) => (
    <View style={styles.settingRow}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color="#000" style={styles.rowIcon} />
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      <Switch
        trackColor={{ false: "#D3D3D3", true: "#E94057" }}
        thumbColor={"#FFF"}
        ios_backgroundColor="#D3D3D3"
        onValueChange={() => toggle(settingKey)}
        value={settings[settingKey]}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <View style={styles.content}>
        <SettingRow icon="chatbubble-ellipses-outline" title="Messages off icon" settingKey="messages" />
        <SettingRow icon="heart-outline" title="Likes" settingKey="likes" />
        <SettingRow icon="person-add-outline" title="New Matches" settingKey="matches" />
        <SettingRow icon="map-outline" title="New in City" settingKey="city" />
        <SettingRow icon="pricetags-outline" title="Viraag Events & Offers" settingKey="events" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { paddingRight: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  
  content: { paddingHorizontal: 20, paddingTop: 10 },
  
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { width: 34 },
  rowTitle: { fontSize: 16, color: '#333', fontWeight: '500' }
});
