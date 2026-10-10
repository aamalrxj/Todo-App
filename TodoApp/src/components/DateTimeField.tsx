import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { colors } from '../utils/theme';
import { formatDateTime } from '../utils/date';

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

// Tap to pick a date, then a time (Android shows two native dialogs)
const DateTimeField = ({ label, value, onChange }: Props) => {
  const openPicker = () => {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      onChange: (event, pickedDate) => {
        if (event.type !== 'set' || !pickedDate) return; // user cancelled

        // Date chosen, now ask for the time
        DateTimePickerAndroid.open({
          value: pickedDate,
          mode: 'time',
          onChange: (timeEvent, pickedTime) => {
            if (timeEvent.type !== 'set' || !pickedTime) return;
            const result = new Date(pickedDate);
            result.setHours(pickedTime.getHours(), pickedTime.getMinutes(), 0, 0);
            onChange(result);
          },
        });
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.field} onPress={openPicker} activeOpacity={0.7}>
        <Text style={styles.icon}>📅</Text>
        <Text style={styles.value}>{formatDateTime(value)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  icon: { fontSize: 16, marginRight: 10 },
  value: { fontSize: 15, color: colors.text, fontWeight: '500' },
});

export default DateTimeField;