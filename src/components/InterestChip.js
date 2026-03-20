import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

export default function InterestChip({ title, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? COLORS.primary : COLORS.white,
          borderColor: selected ? COLORS.primary : COLORS.border,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: selected ? COLORS.white : COLORS.textDark },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
