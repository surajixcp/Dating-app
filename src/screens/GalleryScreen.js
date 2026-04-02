import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../theme/theme';

const { width } = Dimensions.get('window');
const itemWidth = (width - SIZES.paddingLarge * 2 - 16) / 3;

export default function GalleryScreen({ navigation }) {
  const images = [
    require('../../public/images/img_13.png'),
    require('../../public/images/img_28.png'),
    require('../../public/images/img_15.png'),
    require('../../public/images/img_16.png'),
    require('../../public/images/img_17.png'),
    require('../../public/images/img_18.png'),
    require('../../public/images/img_19.png'),
    require('../../public/images/img_20.png'),
    require('../../public/images/img_22.png'),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerName}>Gallery</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {images.map((img, index) => (
          <TouchableOpacity key={index} style={styles.imageBox}>
            <Image source={img} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.paddingLarge, paddingVertical: SIZES.paddingSmall },
  iconBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  headerName: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SIZES.paddingLarge, gap: 8, paddingTop: 16, paddingBottom: 40 },
  imageBox: { width: itemWidth, height: itemWidth * 1.2, borderRadius: 12, overflow: 'hidden', backgroundColor: COLORS.backgroundOff },
  image: { width: '100%', height: '100%', resizeMode: 'cover' }
});
