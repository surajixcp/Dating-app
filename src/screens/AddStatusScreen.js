import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function AddStatusScreen({ navigation }) {
  const mockGallery = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add to Status</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Top Action Circles */}
      <View style={styles.actionRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionScroll}>
          <TouchableOpacity style={styles.actionCircleOuter}>
             <View style={styles.actionCircleInner}>
               <Ionicons name="camera-outline" size={28} color={COLORS.primary} />
             </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCircleOuter} onPress={() => navigation.navigate('StoryEditor')}>
             <View style={[styles.actionCircleInner, { backgroundColor: COLORS.primary }]}>
               <Ionicons name="add" size={28} color={COLORS.white} />
             </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCircleOuter}>
             <View style={styles.actionCircleInner}>
               <Ionicons name="image-outline" size={28} color={COLORS.primary} />
             </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCircleOuter}>
             <View style={styles.actionCircleInner}>
               <Ionicons name="videocam-outline" size={28} color={COLORS.primary} />
             </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Gallery Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {mockGallery.map((img, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.gridItem} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('StoryEditor')}
            >
              <Image source={{ uri: img }} style={styles.imageFill} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>0:15</Text>
              </View>
            </TouchableOpacity>
          ))}
          {/* Duplicate mock array for visual scrolling density */}
          {mockGallery.map((img, idx) => (
            <TouchableOpacity 
              key={`dup-${idx}`} 
              style={styles.gridItem} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('StoryEditor')}
            >
              <Image source={{ uri: img }} style={styles.imageFill} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>0:15</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24 },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
  
  actionRow: { paddingBottom: 20 },
  actionScroll: { paddingHorizontal: 20, gap: 16 },
  actionCircleOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  actionCircleInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: COLORS.backgroundOff, alignItems: 'center', justifyContent: 'center' },

  gridContainer: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: width / 3, aspectRatio: 1, borderWidth: 1, borderColor: COLORS.white },
  imageFill: { flex: 1, width: '100%', height: '100%' },
  
  durationBadge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  durationText: { color: COLORS.white, fontSize: 10, fontWeight: '700' }
});
