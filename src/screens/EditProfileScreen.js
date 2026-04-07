import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Switch, Dimensions, Alert, Modal, ImageBackground, TextInput, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../services/api';

const { width } = Dimensions.get('window');

export default function EditProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Photos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [switches, setSwitches] = useState({ age: false, prof: false, dist: false });
  
  const [activeGridIndex, setActiveGridIndex] = useState(null);

  const [userId, setUserId] = useState(null);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80');
  const [gridImages, setGridImages] = useState([null, null, null, null]);
  const [bioText, setBioText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/profile/me');
        if (response.data && response.data.success) {
          const userData = response.data.data;
          setUserId(userData._id);
          
          if (userData.profile_url_1) setProfileImage(userData.profile_url_1);
          
          setGridImages([
            userData.profile_url_2 || null,
            userData.profile_url_3 || null,
            userData.profile_url_4 || null,
            userData.profile_url_5 || null
          ]);

          const lifestyle = userData.lifestyle || {};
          setBioText(lifestyle.selfDescription || userData.description || '');
          
          if (userData.preferences) {
            try {
              let parsedPrefs = userData.preferences;
              if (typeof parsedPrefs === 'string') {
                parsedPrefs = JSON.parse(parsedPrefs);
              }
              setSwitches(s => ({...s, ...parsedPrefs}));
            } catch (e) {
              console.error('Error parsing preferences', e);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching profile in EditProfile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggle = (key) => setSwitches(s => ({ ...s, [key]: !s[key] }));

  const pickImage = async (type, index = null) => {
    let result;
    const options = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    if (type === 'camera') {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Please allow camera access to take photos.");
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (index !== null) {
        const newGrid = [...gridImages];
        newGrid[index] = uri;
        setGridImages(newGrid);
      } else {
        setProfileImage(uri);
      }
    }
    setShowUploadModal(false);
    setActiveGridIndex(null);
  };

  const openGridPicker = (index) => {
    setActiveGridIndex(index);
    setShowUploadModal(true);
  };

  const NavRow = ({ title, showCheck, action }) => (
    <TouchableOpacity style={styles.navRow} onPress={action}>
      <View style={styles.navRowLeft}>
        <Ionicons name="person-outline" size={20} color="#E94057" style={styles.navIcon} />
        <Text style={styles.navTitle}>{title}</Text>
        {showCheck && <Ionicons name="checkmark-circle" size={16} color="#32CD32" style={{ marginLeft: 6 }} />}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#E94057" />
    </TouchableOpacity>
  );

  const ControlRow = ({ title, stateKey }) => (
    <View style={styles.controlRow}>
      <Text style={styles.controlTitle}>{title}</Text>
      <Switch
        trackColor={{ false: "#FFE4E1", true: "#960D1E" }}
        thumbColor={"#FFF"}
        ios_backgroundColor="#FFE4E1"
        onValueChange={() => toggle(stateKey)}
        value={switches[stateKey]}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E94057" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* Dynamic Header Image inside ScrollView */}
        <ImageBackground 
          source={require('../../public/images/topimage.png')} 
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={26} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={async () => {
                  try {
                      setIsLoading(true); // show loader during save
                      
                      const formData = new FormData();
                      if (profileImage && !profileImage.startsWith('http')) {
                        formData.append('profile_url_1', { uri: profileImage, name: `photo1_${Date.now()}.jpg`, type: 'image/jpeg' });
                      } else {
                        formData.append('profile_url_1', profileImage || '');
                      }

                      gridImages.forEach((img, i) => {
                        const key = `profile_url_${i+2}`;
                        if (img && !img.startsWith('http')) {
                          formData.append(key, { uri: img, name: `photo${i+2}_${Date.now()}.jpg`, type: 'image/jpeg' });
                        } else {
                          formData.append(key, img || '');
                        }
                      });

                      // First, upload/sync images mapping to User model
                      await apiClient.put('/profile/picture-upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      });
                      
                      // Then, sync preferences and text mapping to LifeStyle model
                      const payload = { 
                          selfDescription: bioText,
                          description: bioText, // sending both to ensure compatibility
                          preferences: JSON.stringify(switches),
                      };
                      
                      await apiClient.put(`/profile/updateById/${userId}`, payload);
                      setIsLoading(false);
                      Alert.alert("Success", "Your profile has been synchronized successfully.");
                      navigation.goBack();
                  } catch (e) {
                      setIsLoading(false);
                      console.error("Save Error", e);
                      Alert.alert("Error", "Could not sync profile settings");
                  }
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* Overlapping Avatar positioned accurately */}
        <View style={styles.avatarSection}>
           <View style={styles.avatarWrapper}>
             <Image source={{ uri: profileImage }} style={styles.avatarImg} />
             <TouchableOpacity style={styles.editPencil} onPress={() => setShowUploadModal(true)}>
               <Ionicons name="pencil" size={18} color="#FFF" />
             </TouchableOpacity>
           </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Photos')} activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'Photos' && styles.tabTextActive]}>Photos</Text>
            {activeTab === 'Photos' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Details')} activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'Details' && styles.tabTextActive]}>Details</Text>
            {activeTab === 'Details' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {activeTab === 'Photos' ? (
             <View style={styles.mediaSection}>
               <View style={styles.mediaGrid}>
                 {gridImages.map((img, i) => (
                   <View key={i} style={styles.mediaSlot}>
                     {img ? (
                        <Image source={{ uri: img }} style={styles.mediaImg} />
                     ) : (
                        <View style={[styles.mediaImg, { backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' }]}>
                           <Ionicons name="image-outline" size={36} color="#DDD" />
                        </View>
                     )}
                     <TouchableOpacity style={styles.mediaPencilSquare} onPress={() => openGridPicker(i)} activeOpacity={0.7}>
                       <Ionicons name="pencil" size={16} color="#FFF" />
                     </TouchableOpacity>
                   </View>
                 ))}
               </View>
               
               <TouchableOpacity style={styles.addMoreBtn} onPress={() => {
                   const firstEmpty = gridImages.findIndex(img => img === null);
                   openGridPicker(firstEmpty !== -1 ? firstEmpty : 0);
               }} activeOpacity={0.8}>
                 <LinearGradient colors={['#960D1E', '#7A0A17']} style={styles.addMoreGradient} start={{x:0,y:0}} end={{x:1,y:0}}>
                   <Text style={styles.addMoreText}>Add More Image</Text>
                 </LinearGradient>
               </TouchableOpacity>
             </View>
          ) : (
             <View style={styles.profileList}>
               <Text style={styles.sectionHeading}>Account</Text>
               <View style={styles.navBlock}><NavRow title="Basic Details" action={() => navigation.navigate('ProfileDetails')} /></View>

               <Text style={styles.sectionHeading}>Other Details</Text>
               <View style={styles.navBlock}>
                 <NavRow title="Sexual orientation" action={() => navigation.navigate('SexualOrientation')} />
                 <View style={styles.separator} />
                 <NavRow title="Interested in" action={() => navigation.navigate('Interests')} />
                 <View style={styles.separator} />
                 <NavRow title="Looking for" action={() => navigation.navigate('Interests')} />
                 <View style={styles.separator} />
                 <NavRow title="Profile verified" showCheck action={() => navigation.navigate('VerificationStart')} />
               </View>

               <Text style={styles.sectionHeading}>Describe yourself</Text>
               <View style={styles.bioBox}>
                  <TextInput
                    style={styles.bioInput}
                    multiline
                    placeholder="Describe yourself here.."
                    value={bioText}
                    onChangeText={setBioText}
                    maxLength={500}
                  />
                  <Text style={styles.charCount}>{bioText.length} / 500</Text>
               </View>

               <View style={styles.navBlock}><NavRow title="Lifestyle & habits" action={() => navigation.navigate('Lifestyle')} /></View>

               <Text style={styles.sectionHeading}>Control your profile</Text>
               <View style={[styles.navBlock, { paddingVertical: 8 }]}>
                 <ControlRow title="Don't show my age" stateKey="age" />
                 <View style={styles.separator} />
                 <ControlRow title="Don't show my profession" stateKey="prof" />
                 <View style={styles.separator} />
                 <ControlRow title="Don't show my distance" stateKey="dist" />
               </View>
             </View>
          )}
        </View>
      </ScrollView>

      {/* Upload Photo Modal */}
      <Modal visible={showUploadModal} transparent animationType="slide">
         <View style={styles.modalBg}>
            <View style={styles.modalContent}>
               <View style={styles.modalPill} />
               <View style={styles.modalHeader}>
                 <View style={{ flex: 1 }} />
                 <Text style={styles.modalTitle}>Create New</Text>
                 <TouchableOpacity onPress={() => { setShowUploadModal(false); setActiveGridIndex(null); }} style={{ flex: 1, alignItems: 'flex-end', padding: 4 }}>
                    <Text style={styles.cancelText}>Cancel</Text>
                 </TouchableOpacity>
               </View>

               <TouchableOpacity style={[styles.modalBtn, { marginTop: 20 }]} onPress={() => pickImage('gallery', activeGridIndex)}>
                  <LinearGradient colors={['#960D1E', '#B30000']} style={styles.btnGradient} start={{x:0,y:0}} end={{x:1,y:0}}>
                    <Ionicons name="images" size={20} color="#FFF" style={{ marginRight: 12 }} />
                    <Text style={styles.btnText}>Select Photos from Gallery</Text>
                  </LinearGradient>
               </TouchableOpacity>

               <View style={styles.orRow}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.orLine} />
               </View>

               <TouchableOpacity style={styles.modalBtn} onPress={() => pickImage('camera', activeGridIndex)}>
                  <LinearGradient colors={['#B30000', '#DC143C']} style={styles.btnGradient} start={{x:0,y:0}} end={{x:1,y:0}}>
                    <Ionicons name="camera" size={24} color="#FFF" style={{ marginRight: 12 }} />
                    <Text style={styles.btnText}>Open Camera & Take Photo</Text>
                  </LinearGradient>
               </TouchableOpacity>

               <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
            </View>
         </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerBackground: { width: width, height: width * 0.60 },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { width: 40 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#FFF' },
  saveBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  saveText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  
  avatarSection: { alignItems: 'center', marginTop: -75, marginBottom: 20, zIndex: 10 },
  avatarWrapper: { width: 150, height: 150, borderRadius: 75, padding: 3, backgroundColor: '#FFF', elevation: 8, shadowColor: '#000', shadowOffset: {width:0, height:6}, shadowOpacity: 0.15, shadowRadius: 8, borderWidth: 1, borderColor: '#B30000' },
  avatarImg: { flex: 1, borderRadius: 72 },
  editPencil: { position: 'absolute', bottom: 4, right: 4, width: 36, height: 36, borderRadius: 18, backgroundColor: '#B30000', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF', elevation: 4 },

  tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16, position: 'relative' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#333' },
  tabTextActive: { color: '#B30000', fontWeight: '800' },
  activeIndicator: { position: 'absolute', bottom: -1, width: '100%', height: 3, backgroundColor: '#B30000' },

  content: { paddingHorizontal: 20, paddingTop: 20 },
  
  // Media Tab
  mediaSection: { paddingBottom: 20 },
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  mediaSlot: { width: '47.5%', aspectRatio: 0.85, borderRadius: 12, marginBottom: 16, overflow: 'hidden', position: 'relative' },
  mediaImg: { width: '100%', height: '100%', borderRadius: 12 },
  mediaPencilSquare: { position: 'absolute', bottom: 0, right: 0, width: 34, height: 34, borderTopLeftRadius: 10, backgroundColor: '#C00000', alignItems: 'center', justifyContent: 'center' },
  
  addMoreBtn: { width: '100%', height: 50, borderRadius: 8, overflow: 'hidden', marginTop: 10 },
  addMoreGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  addMoreText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  // Profile Tab
  profileList: { flex: 1 },
  sectionHeading: { fontSize: 14, fontWeight: '800', color: '#333', marginBottom: 12, marginTop: 16, paddingLeft: 4 },
  navBlock: { borderWidth: 1, borderColor: '#FFE4E1', borderRadius: 16, backgroundColor: '#FFF', overflow: 'hidden', shadowColor: '#960D1E', shadowOpacity: 0.05, shadowOffset: {width:0,height:2}, shadowRadius: 8, elevation: 1 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 18 },
  navRowLeft: { flexDirection: 'row', alignItems: 'center' },
  navIcon: { width: 32 },
  navTitle: { fontSize: 15, color: '#333', fontWeight: '600' },
  separator: { height: 1, backgroundColor: '#FFE4E1', marginHorizontal: 16 },

  bioBox: { borderWidth: 1, borderColor: '#FFE4E1', borderRadius: 16, backgroundColor: '#FAF5F5', padding: 16, minHeight: 120, justifyContent: 'space-between' },
  bioInput: { fontSize: 14, color: '#666', textAlignVertical: 'top', minHeight: 80 },
  charCount: { alignSelf: 'flex-end', fontSize: 11, color: '#E94057', fontWeight: '700', marginTop: 10 },

  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  controlTitle: { fontSize: 14, color: '#333', fontWeight: '500' },

  // Bottom Sheet Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 10 },
  modalPill: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { flex: 4, textAlign: 'center', fontSize: 20, fontWeight: '800', color: '#000' },
  cancelText: { color: '#E94057', fontSize: 15, fontWeight: '700' },

  modalBtn: { height: 60, borderRadius: 30, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: {width:0, height:4}, shadowOpacity: 0.2, shadowRadius: 6 },
  btnGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, paddingHorizontal: 40 },
  orLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  orText: { marginHorizontal: 16, color: '#DC143C', fontSize: 16, fontWeight: '500' }
});
