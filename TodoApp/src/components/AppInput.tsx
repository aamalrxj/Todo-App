import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

interface Props extends TextInputProps {
  label: string;
}

// Labelled input with a highlighted border on focus and a show/hide toggle for passwords
const AppInput = ({ label, style, secureTextEntry, onFocus, onBlur, ...rest }: Props) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, focused && styles.boxFocused]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={hidden}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden(h => !h)}>
            <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  boxFocused: { borderColor: colors.primary, backgroundColor: colors.card },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 12 },
  toggle: { color: colors.primary, fontWeight: '700', fontSize: 13, marginLeft: 8 },
});

export default AppInput;