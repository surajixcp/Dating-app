import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export default function VideoCallScreen({ route, navigation }) {
    const { recipientId, recipientName } = route.params || {};
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        setupUser();
    }, []);

    const setupUser = async () => {
        const token = await AsyncStorage.getItem('@viraag_auth_token');
        if (token) {
            const payload = jwtDecode(token);
            setUserId(String(payload.id || payload._id));
            setUserName(payload.name || "Viraag User");
        }
    };

    if (!userId) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E94057" />
                <Text style={styles.loadingText}>Connecting Secure WebRTC Tunnel...</Text>
            </SafeAreaView>
        );
    }

    // Sort IDs alphabetically to generate a deterministic pseudo-room matching Both Users!
    const roomID = [userId, recipientId].sort().join('_');

    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                /**
                 * Viraag Mock Keys for Deployment Testing
                 * Swap with Production Keys inside .env
                 * Go to console.zegocloud.com to get your keys
                 */
                appID={920391238} // Placeholder AppID
                appSign={'d3a9bbxyz_mock_sign_replace_with_real_64_character_appSign_string_here'}
                userID={userId}
                userName={userName}
                callID={roomID}
                config={{
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onOnlySelfInRoom: () => { navigation.navigate('MainTabs'); },
                    onHangUp: () => { navigation.navigate('MainTabs'); },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // WebRTC native black canvas
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: '#E94057',
        marginTop: 20,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5
    }
});
