import React from 'react';
import { View, Text } from 'react-native';

// Universal Zego Mock to prevent "prefix of null" crashes in Expo Go
const ZegoMock = {
  getInstance: () => ({
    on: () => {},
    off: () => {},
    login: async () => ({}),
    logout: async () => ({}),
    destroy: () => {},
  }),
  createEngine: async () => ({
    on: () => {},
    off: () => {},
    destroy: () => {},
  }),
  destroyEngine: async () => {},
  setEngineConfig: () => {},
  setRoomMode: () => {},
  getVersion: () => '0.0.0',
};

// Mock for ZegoUIKitPrebuiltCall component
export const ZegoUIKitPrebuiltCall = () => (
  <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#E94057' }}>ZegoCloud Video Tunnel (Mock Mode - Use Dev Build for Real Video)</Text>
  </View>
);

export const ONE_ON_ONE_VIDEO_CALL_CONFIG = {};

// Mock for ZIM Engine
export const ZIM = {
    create: () => ({ on: () => {}, off: () => {}, login: async () => {} }),
    getInstance: () => ({ on: () => {}, off: () => {} }),
};

export default ZegoMock;
export const ZegoExpressEngine = ZegoMock;
