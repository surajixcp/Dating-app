import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../services/api';

export default function StoryEditorScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed', 'Please grant camera access.');
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadStory = async () => {
    if (!imageUri) return Alert.alert('No Media', 'Please capture or select a photo first');
    setIsUploading(true);

    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('document', { uri: imageUri, name: filename, type });

    try {
      const response = await apiClient.post('/story/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
         Alert.alert('Success', 'Story published successfully!');
         navigation.goBack();
      } else {
         throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err) {
      Alert.alert('Upload Error', err.response?.data?.message || err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <ImageBackground source={{ uri: imageUri }} style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.topGradient}>
              <View style={styles.topHeaderRows}>
                <TouchableOpacity onPress={() => setImageUri(null)} style={styles.iconBtn}>
                  <Ionicons name="close" size={32} color="#FFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.interactiveArea} />

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.bottomGradient}>
              {isUploading ? (
                <ActivityIndicator size="large" color="#FFF" />
              ) : (
                <TouchableOpacity style={styles.setBtn} onPress={uploadStory}>
                  <Text style={styles.setBtnText}>Post Story</Text>
                  <Ionicons name="send" size={18} color="#000" />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </SafeAreaView>
        </ImageBackground>
      ) : (
        <SafeAreaView style={styles.pickerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
             <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.pickerOptions}>
             <TouchableOpacity style={styles.pickerBtn} onPress={takePhoto}>
               <Ionicons name="camera" size={64} color="#FFF" />
               <Text style={styles.pickerText}>Take Photo</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.pickerBtn} onPress={pickImage}>
               <Ionicons name="images" size={64} color="#FFF" />
               <Text style={styles.pickerText}>Camera Roll</Text>
             </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  pickerContainer: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  pickerOptions: { flexDirection: 'row', gap: 40 },
  pickerBtn: { alignItems: 'center', padding: 20 },
  pickerText: { color: '#FFF', marginTop: 16, fontSize: 16, fontWeight: '600' },
  
  topGradient: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 40 },
  topHeaderRows: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: { padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4 },

  interactiveArea: { flex: 1, position: 'relative' },

  bottomGradient: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 30, alignItems: 'flex-end', justifyContent: 'flex-end' },
  setBtn: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  setBtnText: { color: '#000', fontSize: 16, fontWeight: '800', marginRight: 8 }
});
