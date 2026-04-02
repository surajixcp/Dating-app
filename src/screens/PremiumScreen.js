import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Modal, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Purchases from '../services/revenuecat';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

const { height } = Dimensions.get('window');

export default function PremiumScreen({ navigation }) {
  const [showPremiumModal, setShowPremiumModal] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [packages, setPackages] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const fallbackPlans = [
    { identifier: 'fallback_1', title: '3 Months', price: '₹80.99', badge: 'Best Value', save: 'Save 10%' },
    { identifier: 'fallback_2', title: '1 Month', price: '₹30.99', badge: 'Mostly Purchased', save: 'Save 5%' },
    { identifier: 'fallback_3', title: '1 Week', price: '₹8.99', badge: 'Popular', save: 'Save 10%' },
  ];

  useEffect(() => {
    const fetchOfferings = async () => {
      if (Platform.OS === 'web') {
        setSelectedPlan(fallbackPlans[0]);
        return;
      }

      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
          setSelectedPlan(offerings.current.availablePackages[0]);
        } else {
          setSelectedPlan(fallbackPlans[0]);
        }
      } catch (e) {
        console.warn("RevenueCat Fetch Error:", e.message);
        setSelectedPlan(fallbackPlans[0]);
      }
    };
    fetchOfferings();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    
    // If it's a fallback string (no revenueCat mapping), just mock it
    if (selectedPlan.identifier && selectedPlan.identifier.startsWith('fallback')) {
        Alert.alert("Prototype Mode", "Simulated Subscription Activated!");
        setShowPremiumModal(false); 
        navigation.goBack();
        return;
    }

    try {
      setIsPurchasing(true);
      const { customerInfo } = await Purchases.purchasePackage(selectedPlan);
      // 'premium' is the default RevenueCat entitlement identifier, update to match your dashboard
      if (typeof customerInfo.entitlements.active['premium'] !== "undefined" || typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
        Alert.alert("Success", "Welcome to Viraag Premium!");
        setShowPremiumModal(false);
        navigation.goBack();
      }
    } catch (e) {
      if (!e.userCancelled) {
         Alert.alert("Purchase Error", e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const displayList = packages.length > 0 ? packages : fallbackPlans;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Background UI behind modal */}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.goBack()}>
               <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Subscription Status</Text>
            <TouchableOpacity style={styles.headerIconBtn}>
               <Ionicons name="settings-outline" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileMeta}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBorder}>
                <Image source={require('../../public/images/img_13.png')} style={styles.avatarImg} />
              </View>
              <LinearGradient colors={[COLORS.primary, '#F27121']} style={styles.percentBadge}>
                <Text style={styles.percentText}>PREMIUM</Text>
              </LinearGradient>
            </View>
            <View style={styles.metaInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.metaName}>Harshil, 24</Text>
                <Ionicons name="checkmark-circle" size={18} color="#007AFF" style={{ marginLeft: 6 }} />
              </View>
              <TouchableOpacity style={styles.editRow} onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.metaEdit}>Manage Account Settings</Text>
                <Ionicons name="chevron-forward" size={12} color="#999" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addCircle}>
               <Ionicons name="star" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.benefitSection}>
             <Text style={styles.benefitTitle}>Why Go Premium?</Text>
             <View style={styles.benefitItem}>
                <Ionicons name="heart-half-outline" size={20} color={COLORS.primary} />
                <Text style={styles.benefitText}>Unlimited Likes & Swipes</Text>
             </View>
             <View style={styles.benefitItem}>
                <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
                <Text style={styles.benefitText}>See who already liked you</Text>
             </View>
             <View style={styles.benefitItem}>
                <Ionicons name="map-outline" size={20} color={COLORS.primary} />
                <Text style={styles.benefitText}>Passport to any location</Text>
             </View>
          </View>
        </View>

        {/* The Bottom Sheet Modal Component */}
        <Modal transparent visible={showPremiumModal} animationType="slide">
          <View style={styles.modalBg}>
             <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowPremiumModal(false)} />
             <View style={styles.modalContent}>
                <View style={styles.modalPill} />
                
                <View style={styles.modalHeader}>
                   <Text style={styles.modalMainTitle}>Viraag Star Plans</Text>
                   <TouchableOpacity onPress={() => setShowPremiumModal(false)} style={{ padding: 10 }}>
                     <Ionicons name="close" size={24} color="#333" />
                   </TouchableOpacity>
                </View>

                <View style={styles.plansContainer}>
                   {displayList.map((p, i) => {
                     // Check if it's a RevenueCat object or fallback object
                     const title = p.product ? p.product.title : p.title;
                     const price = p.product ? p.product.priceString : p.price;
                     const badge = p.badge || (i === 0 ? 'Best Value' : '');
                     const save = p.save || (i === 0 ? 'Save 10%' : '');
                     
                     // Compare by identifier to find the strict equality match
                     const pIdentifier = p.identifier;
                     const sIdentifier = selectedPlan ? selectedPlan.identifier : null;
                     const isActive = pIdentifier === sIdentifier;
                     
                     return (
                       <TouchableOpacity 
                         key={pIdentifier || i} 
                         style={[styles.planCard, isActive && styles.planCardActive]}
                         activeOpacity={0.8}
                         onPress={() => setSelectedPlan(p)}
                       >
                          {isActive && (
                             <LinearGradient 
                               colors={[COLORS.primary, '#960D1E']} 
                               style={StyleSheet.absoluteFill} 
                               borderRadius={20} 
                             />
                          )}
                          
                          <View style={styles.badgeRow}>
                             <View style={[styles.badgePill, isActive ? {backgroundColor: 'rgba(255,255,255,0.2)'} : {backgroundColor: '#FFF0F0'}]}>
                                <Text style={[styles.badgeText, isActive ? {color: '#FFF'} : {color: COLORS.primary}]}>{badge}</Text>
                             </View>
                             <View style={[styles.savePill, isActive ? {backgroundColor: 'rgba(255,255,255,0.2)'} : {backgroundColor: 'rgba(233, 64, 87, 0.05)'}]}>
                                <Text style={[styles.badgeText, isActive ? {color: '#FFF'} : {color: COLORS.primary}]}>{save}</Text>
                             </View>
                          </View>
                          
                          <View style={styles.planDetailsRow}>
                             <Text style={[styles.planTitle, isActive && {color: '#FFF'}]}>{title}</Text>
                             <Text style={[styles.planPrice, isActive && {color: '#FFF'}]}>{price}</Text>
                          </View>
                       </TouchableOpacity>
                     );
                   })}
                </View>

                <Text style={styles.disclaimerText}>
                   Charged to selected payment method. Subscription auto-renews at the same price. Cancel anytime in Store Settings.
                </Text>

                <TouchableOpacity 
                   style={styles.continueBtn} 
                   onPress={handlePurchase}
                   disabled={isPurchasing}
                >
                   <LinearGradient 
                    colors={isPurchasing ? ['#ccc', '#ccc'] : [COLORS.primary, '#F27121']} 
                    style={styles.continueGradient} 
                    start={{x:0,y:0}} 
                    end={{x:1,y:0}}
                   >
                     {isPurchasing ? (
                        <ActivityIndicator color="#FFF" />
                     ) : (
                        <Text style={styles.continueText}>Activate Viraag Star</Text>
                     )}
                   </LinearGradient>
                </TouchableOpacity>
                
                <View style={{ height: 50 }} />
             </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  safeArea: { flex: 1 },
  mainContent: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 24 
  },
  headerIconBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.5 },
  
  profileMeta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  avatarWrapper: { position: 'relative', width: 90, height: 90 },
  avatarBorder: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: '#FFF', ...SHADOWS.medium, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  percentBadge: { position: 'absolute', bottom: -5, alignSelf: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, ...SHADOWS.light },
  percentText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  
  metaInfo: { flex: 1, paddingLeft: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  metaName: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  editRow: { flexDirection: 'row', alignItems: 'center' },
  metaEdit: { fontSize: 13, color: '#999', fontWeight: '600' },
  
  addCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },

  benefitSection: { marginTop: 40, paddingHorizontal: 20 },
  benefitTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: 20 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#FFF', padding: 16, borderRadius: 16, ...SHADOWS.light },
  benefitText: { fontSize: 15, fontWeight: '700', color: '#555', marginLeft: 16 },

  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 12 },
  modalPill: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalMainTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.5 },
  
  plansContainer: { paddingVertical: 10 },
  planCard: { 
    width: '100%', 
    borderRadius: 20, 
    backgroundColor: '#FFF', 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...SHADOWS.light 
  },
  planCardActive: { borderColor: 'transparent', borderWidth: 0 },
  
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, zIndex: 2 },
  badgePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  savePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  
  planDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 },
  planTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  planPrice: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  
  disclaimerText: { fontSize: 13, color: '#999', textAlign: 'center', lineHeight: 20, marginVertical: 24, fontWeight: '500' },
  
  continueBtn: { 
    height: 60, 
    borderRadius: 20, 
    overflow: 'hidden', 
    ...SHADOWS.medium 
  },
  continueGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  continueText: { color: '#FFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
});
