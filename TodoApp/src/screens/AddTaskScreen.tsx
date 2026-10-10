import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import DateTimeField from '../components/DateTimeField';
import ErrorBanner from '../components/ErrorBanner';
import { useAppDispatch } from '../store';
import { addTask } from '../store/tasksSlice';
import { AppStackParamList } from '../types/navigation';
import { Priority, Category } from '../types';
import { colors, priorityColors, prioritySoft, cardShadow } from '../utils/theme';
import { showTaskAddedNotification } from '../utils/notifications';
import { CATEGORIES } from '../utils/categories';

type Props = NativeStackScreenProps<AppStackParamList, 'AddTask'>;

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const AddTaskScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [deadline, setDeadline] = useState(() => new Date(Date.now() + ONE_DAY_MS)); // default: tomorrow
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('other');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    // Validate before calling the API
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (deadline < dateTime) {
      setError('Deadline cannot be earlier than the task date-time');
      return;
    }

    setError('');
    setSaving(true);
    try {
      // unwrap() throws if the request failed, so we can show the error
      await dispatch(
        addTask({
          title: title.trim(),
          description: description.trim(),
          dateTime: dateTime.toISOString(),
          deadline: deadline.toISOString(),
          priority,
          category,
        }),
      ).unwrap();
      showTaskAddedNotification(title.trim(), deadline);
      navigation.goBack(); // back to the list, which now shows the new task
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Failed to save task');
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <AppInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Submit assignment"
        />

        <AppInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Add some details (optional)"
          multiline
          numberOfLines={4}
          style={styles.multiline}
        />

        <DateTimeField label="Date & time" value={dateTime} onChange={setDateTime} />
        <DateTimeField label="Deadline" value={deadline} onChange={setDeadline} />

        {/* Priority selector: three buttons, one active at a time */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map(p => {
            const active = p === priority;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.priorityBtn,
                  { backgroundColor: active ? priorityColors[p] : prioritySoft[p] },
                ]}>
                <Text style={[styles.priorityText, { color: active ? '#fff' : priorityColors[p] }]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Category selector */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map(c => {
            const active = c.key === category;
            return (
              <TouchableOpacity
                key={c.key}
                onPress={() => setCategory(c.key)}
                style={[styles.categoryBtn, { backgroundColor: active ? c.color : c.soft }]}>
                <Text style={[styles.categoryText, { color: active ? '#fff' : c.color }]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ErrorBanner message={error} />

        <AppButton title="Save Task" onPress={handleSave} loading={saving} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 18, paddingBottom: 40 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, ...cardShadow },
  multiline: { height: 96, textAlignVertical: 'top' },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 },
  priorityRow: { flexDirection: 'row', marginBottom: 16 },
  priorityBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  priorityText: { fontWeight: '800', fontSize: 13 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: { fontWeight: '800', fontSize: 13 },
});

export default AddTaskScreen;