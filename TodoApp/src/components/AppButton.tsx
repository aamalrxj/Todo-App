import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// Primary button with a built-in loading spinner
const AppButton = ({ title, onPress, loading = false, disabled = false }: Props) => (
  <TouchableOpacity
    style={[styles.button, (disabled || loading) && styles.disabled]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.8}>
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.text}>{title}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disabled: { opacity: 0.6 },
  text: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default AppButton;