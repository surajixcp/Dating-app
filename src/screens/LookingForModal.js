import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_GUTTER = 12;
const CARD_WIDTH = (width - 40 - (GRID_GUTTER * 2)) / 3; 

const OPTIONS = [
  { id: '1', emoji: '😍', text: 'Long-term\nRelationship' },
  { id: '2', emoji: '😘', text: 'short-term\nRelationship' },
  { id: '3', emoji: '🥰', text: 'Long Distance\nRelationship' },
  { id: '4', emoji: '💕', text: 'Marriage' },
  { id: '5', emoji: '👋', text: 'Friendship' },
  { id: '6', emoji: '🤞', text: 'Travel' },
  { id: '7', emoji: '😜', text: 'Other' },
];

export default function LookingForModal({ navigation }) {
  const [selected, setSelected] = useState('2');

  const handleDismiss = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Tap outside to dismiss */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleDismiss} />
      
      {/* Bottom Sheet Modal */}
      <View style={styles.sheet}>
        <View style={styles.dragHandleOuter}>
           <View style={styles.dragHandle} />
        </View>
        
        <Text style={styles.title}>What are you looking for?</Text>
        <Text style={styles.subtitle}>
          All good if it changes. There's something for{'\n'}everyone.
        </Text>
        
        <View style={styles.gridContainer}>
          {OPTIONS.map((opt) => {
            const isActive = selected === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.card, isActive && styles.cardActive]}
                activeOpacity={0.7}
                onPress={() => setSelected(opt.id)}
              >
                <Text style={styles.emojiText}>{opt.emoji}</Text>
                <Text style={[styles.cardText, isActive && styles.cardTextActive]}>{opt.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },
  
  dragHandleOuter: { width: '100%', alignItems: 'center', height: 20, marginTop: -10 },
  dragHandle: { width: 50, height: 6, borderRadius: 3, backgroundColor: '#E0E0E0' },
  
  title: { fontSize: 24, fontWeight: '800', color: '#000', marginTop: 10, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#333', textAlign: 'center', lineHeight: 22, fontWeight: '500', marginBottom: 24 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginLeft: -GRID_GUTTER/2 },
  
  card: { width: CARD_WIDTH, aspectRatio: 0.85, borderWidth: 1, borderColor: '#D3D3D3', borderRadius: 8, alignItems: 'center', justifyContent: 'center', padding: 8, marginHorizontal: GRID_GUTTER/2, marginBottom: GRID_GUTTER, backgroundColor: '#FFF' },
  cardActive: { borderColor: '#DC143C' },
  
  emojiText: { fontSize: 36, marginBottom: 10 },
  cardText: { fontSize: 11, color: '#333', textAlign: 'center', fontWeight: '500', lineHeight: 14 },
  cardTextActive: { color: '#000', fontWeight: '600' }
});
