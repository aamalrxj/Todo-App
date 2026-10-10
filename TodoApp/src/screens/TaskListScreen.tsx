import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet,
  TextInput, ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TaskItem from '../components/TaskItem';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchTasks, toggleTask, removeTask } from '../store/tasksSlice';
import { logout } from '../store/authSlice';
import { AppStackParamList } from '../types/navigation';
import { Task, Category } from '../types';
import { colors, cardShadow } from '../utils/theme';
import { isOverdue } from '../utils/date';
import { requestNotificationPermission } from '../utils/notifications';
import { sortTasks, SortMode, SORT_OPTIONS } from '../utils/sort';
import { CATEGORIES } from '../utils/categories';

type Props = NativeStackScreenProps<AppStackParamList, 'Tasks'>;
type Filter = 'all' | 'pending' | 'completed';
type CategoryFilter = 'all' | Category;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

// "All" chip followed by the real categories
const CATEGORY_CHIPS = [
  { key: 'all', label: 'All', color: colors.primary, soft: colors.primarySoft },
  ...CATEGORIES,
];

// Small summary tile at the top of the screen
const Stat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <View style={styles.stat}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TaskListScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(s => s.tasks);
  const user = useAppSelector(s => s.auth.user);
  const [filter, setFilter] = useState<Filter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortMode>('smart');
  const [search, setSearch] = useState('');

  // Load tasks when the screen opens
  useEffect(() => {
    dispatch(fetchTasks());
    requestNotificationPermission();
  }, [dispatch]);

  // Log out button in the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => dispatch(logout())}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, dispatch]);

  const pending = items.filter(t => !t.completed).length;
  const completed = items.length - pending;
  const overdue = items.filter(t => isOverdue(t.deadline, t.completed)).length;

  // Apply status filter, category filter and search, then sort
  const visibleTasks = useMemo(() => {
    let list = items;
    if (filter === 'pending') list = list.filter(t => !t.completed);
    if (filter === 'completed') list = list.filter(t => t.completed);
    if (categoryFilter !== 'all') {
      // Older tasks have no category, so treat them as "other"
      list = list.filter(t => (t.category ?? 'other') === categoryFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      );
    }
    return sortTasks(list, sort);
  }, [items, filter, categoryFilter, search, sort]);

  // Shows an alert if a request fails (thunk rejects with the message string)
  const showError = (e: unknown) =>
    Alert.alert('Error', typeof e === 'string' ? e : 'Something went wrong');

  const handleToggle = useCallback(
    (task: Task) => {
      dispatch(toggleTask(task)).unwrap().catch(showError);
    },
    [dispatch],
  );

  // Ask before deleting
  const handleDelete = useCallback(
    (task: Task) => {
      Alert.alert('Delete task', `Delete "${task.title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(removeTask(task._id)).unwrap().catch(showError),
        },
      ]);
    },
    [dispatch],
  );

  const name = user?.email.split('@')[0] ?? '';

  const header = (
    <View>
      <Text style={styles.greeting}>Hello, {name} 👋</Text>
      <Text style={styles.greetingSub}>
        {pending === 0 ? 'You are all caught up!' : `You have ${pending} task${pending === 1 ? '' : 's'} to finish`}
      </Text>

      <View style={styles.stats}>
        <Stat label="Pending" value={pending} color={colors.primary} />
        <Stat label="Completed" value={completed} color={colors.success} />
        <Stat label="Overdue" value={overdue} color={colors.danger} />
      </View>

      {/* Segmented status filter */}
      <View style={styles.segment}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.segmentBtn, filter === f.key && styles.segmentActive]}>
            <Text style={[styles.segmentText, filter === f.key && styles.segmentTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search tasks..."
        placeholderTextColor="#9CA3AF"
      />

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {CATEGORY_CHIPS.map(c => {
          const active = categoryFilter === c.key;
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => setCategoryFilter(c.key as CategoryFilter)}
              style={[styles.catChip, { backgroundColor: active ? c.color : c.soft }]}>
              <Text style={[styles.catChipText, { color: active ? '#fff' : c.color }]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort selector */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        {SORT_OPTIONS.map(o => (
          <TouchableOpacity
            key={o.key}
            onPress={() => setSort(o.key)}
            style={[styles.sortChip, sort === o.key && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sort === o.key && styles.sortChipTextActive]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.screen}>
      {loading && items.length === 0 ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={visibleTasks}
          keyExtractor={t => t._id}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} />
          )}
          ListHeaderComponent={header}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshing={loading}                          // pull down to refresh
          onRefresh={() => dispatch(fetchTasks())}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>
                {items.length === 0 ? 'No tasks yet' : 'No matching tasks'}
              </Text>
              <Text style={styles.emptySub}>
                {items.length === 0
                  ? 'Tap the + button to add your first task.'
                  : 'Try changing the filters or search.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  logout: { color: colors.primary, fontWeight: '800', fontSize: 14 },
  list: { paddingHorizontal: 18, paddingBottom: 110 },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 6 },
  greetingSub: { fontSize: 14, color: colors.muted, marginTop: 2, marginBottom: 18 },
  stats: { flexDirection: 'row', marginBottom: 18 },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
    ...cardShadow,
  },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 2 },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  segmentBtn: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.card, ...cardShadow },
  segmentText: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  segmentTextActive: { color: colors.primary },
  search: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    marginBottom: 14,
  },
  catScroll: { marginBottom: 14, flexGrow: 0 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  catChipText: { fontSize: 13, fontWeight: '800' },
  sortRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sortLabel: { fontSize: 13, fontWeight: '700', color: colors.muted, marginRight: 10 },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  sortChipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  sortChipText: { fontSize: 12, fontWeight: '700', color: colors.muted },
  sortChipTextActive: { color: colors.primary },
  loader: { marginTop: 60 },
  error: { color: colors.danger, marginBottom: 10 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { fontSize: 44, marginBottom: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  emptySub: { fontSize: 14, color: colors.muted, marginTop: 4, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 26,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 36, fontWeight: '300' },
});

export default TaskListScreen;