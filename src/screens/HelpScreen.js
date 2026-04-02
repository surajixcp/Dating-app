import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

export default function HelpScreen({ navigation }) {
  const MenuItem = ({ icon, title, isLast }) => (
    <TouchableOpacity style={[styles.menuItem, !isLast && styles.borderBottom]}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <View style={styles.iconWrapper}>
             <Ionicons name="help-buoy" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.bannerTitle}>How can we help?</Text>
          <Text style={styles.bannerSubtitle}>We are available 24/7 to assist you</Text>
        </View>

        <View style={styles.cardGroup}>
          <MenuItem icon="mail-outline" title="Contact Executive" />
          <MenuItem icon="chatbox-ellipses-outline" title="Submit Feedback" />
          <MenuItem icon="star-outline" title="Rate Us" />
          <MenuItem icon="logo-twitter" title="Follow on Socials" isLast />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundOff },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 16 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  iconBtnPlaceholder: { width: 44 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  
  content: { paddingHorizontal: 20 },
  
  banner: { alignItems: 'center', marginVertical: 32 },
  iconWrapper: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...SHADOWS.medium },
  bannerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 },
  bannerSubtitle: { fontSize: 16, color: COLORS.textLight, textAlign: 'center' },

  cardGroup: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusLarge, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8, ...SHADOWS.light },
  
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: '600', color: COLORS.textDark, marginLeft: 16 }
});

