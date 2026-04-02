import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { COLORS } from '../theme/theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PhoneNumberScreen from '../screens/PhoneNumberScreen';
import OTPScreen from '../screens/OTPScreen';
import ProfileDetailsScreen from '../screens/ProfileDetailsScreen';
import AddPhotosScreen from '../screens/AddPhotosScreen';
import LocationScreen from '../screens/LocationScreen';
import VerificationScreen from '../screens/VerificationScreen';
import InterestsScreen from '../screens/InterestsScreen';
import LifestyleScreen from '../screens/LifestyleScreen';
import DescribeYourselfScreen from '../screens/DescribeYourselfScreen';
import VerificationStartScreen from '../screens/VerificationStartScreen';
import CameraVerificationScreen from '../screens/CameraVerificationScreen';
import VerificationProcessingScreen from '../screens/VerificationProcessingScreen';

import AddStatusScreen from '../screens/AddStatusScreen';
import StoryEditorScreen from '../screens/StoryEditorScreen';

import SettingsScreen from '../screens/SettingsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import DeleteAccountScreen from '../screens/DeleteAccountScreen';

import FeedScreen from '../screens/FeedScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import LikesScreen from '../screens/LikesScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import BlockedScreen from '../screens/BlockedScreen';
import HelpScreen from '../screens/HelpScreen';
import NotificationScreen from '../screens/NotificationScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

import MatchOverlayScreen from '../screens/MatchOverlayScreen';
import FiltersScreen from '../screens/FiltersScreen';
import PremiumScreen from '../screens/PremiumScreen';
import StatusScreen from '../screens/StatusScreen';
import GalleryScreen from '../screens/GalleryScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import SexualOrientationScreen from '../screens/SexualOrientationScreen';
import LookingForModal from '../screens/LookingForModal';
import LogoutModal from '../screens/LogoutModal';
import CallExecutiveScreen from '../screens/CallExecutiveScreen';
import RateUsScreen from '../screens/RateUsScreen';
import FollowUsScreen from '../screens/FollowUsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#D3D3D3',
        tabBarStyle: {
          height: 85,
          borderTopWidth: 1,
          borderTopColor: COLORS.backgroundOff,
          elevation: 0,
        },
      })}
    >
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../public/images/file.png')} style={{ width: size, height: size, tintColor: color }} resizeMode="contain" />
          ),
        }} 
      />
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../public/images/home.png')} style={{ width: size, height: size, tintColor: color }} resizeMode="contain" />
          ),
        }} 
      />
      <Tab.Screen 
        name="Likes" 
        component={LikesScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../public/images/layers.png')} style={{ width: size, height: size, tintColor: color }} resizeMode="contain" />
          ),
        }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../public/images/messanger.png')} style={{ width: size, height: size, tintColor: color }} resizeMode="contain" />
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../public/images/people.png')} style={{ width: size, height: size, tintColor: color }} resizeMode="contain" />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      {/* Onboarding Flow */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
      <Stack.Screen name="Interests" component={InterestsScreen} />
      <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
      <Stack.Screen name="DescribeYourself" component={DescribeYourselfScreen} />
      <Stack.Screen name="AddPhotos" component={AddPhotosScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="VerificationStart" component={VerificationStartScreen} />
      <Stack.Screen name="CameraVerification" component={CameraVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VerificationProcessing" component={VerificationProcessingScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      
      {/* Main Tab App */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      
      {/* Sub-screens pushed over Tabs */}
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Blocked" component={BlockedScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      
      {/* Modals */}
      <Stack.Screen name="MatchOverlay" component={MatchOverlayScreen} options={{ presentation: 'transparentModal' }} />
      <Stack.Screen name="Filters" component={FiltersScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Premium" component={PremiumScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ presentation: 'fullScreenModal', headerShown: false }} />
      <Stack.Screen name="Status" component={StatusScreen} options={{ presentation: 'fullScreenModal', headerShown: false }} />
      <Stack.Screen name="AddStatus" component={AddStatusScreen} />
      <Stack.Screen name="StoryEditor" component={StoryEditorScreen} options={{ presentation: 'fullScreenModal', headerShown: false }} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="SexualOrientation" component={SexualOrientationScreen} />
      <Stack.Screen name="LookingFor" component={LookingForModal} options={{ presentation: 'transparentModal', headerShown: false, animation: 'slide_from_bottom' }} />
      <Stack.Screen name="CallExecutive" component={CallExecutiveScreen} />
      <Stack.Screen name="RateUs" component={RateUsScreen} />
      <Stack.Screen name="FollowUs" component={FollowUsScreen} />
      <Stack.Screen name="LogoutModal" component={LogoutModal} options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
    </Stack.Navigator>
  );
}
