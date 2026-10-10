import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

// Red message box shown above buttons when something goes wrong
const ErrorBanner = ({ message }: { message?: string | null }) =>
  message ? (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
    </View>
  ) : null;

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.dangerSoft,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  text: { color: colors.danger, fontSize: 13, fontWeight: '600' },
});

export default ErrorBanner;