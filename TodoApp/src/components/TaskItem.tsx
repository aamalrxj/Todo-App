import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { colors, priorityColors, prioritySoft, cardShadow } from '../utils/theme';
import { formatDateTime, isOverdue } from '../utils/date';
import { getCategory } from '../utils/categories';

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// One card in the task list
const TaskItem = ({ task, onToggle, onDelete }: Props) => {
  const overdue = isOverdue(task.deadline, task.completed);
  const accent = priorityColors[task.priority];
  const category = getCategory(task.category);

  // Status pill: Completed / Overdue / Pending
  const status = task.completed
    ? { label: 'Completed', bg: colors.successSoft, fg: colors.success }
    : overdue
    ? { label: 'Overdue', bg: colors.dangerSoft, fg: colors.danger }
    : { label: 'Pending', bg: colors.primarySoft, fg: colors.primary };

  return (
    <View style={styles.card}>
      {/* Coloured strip on the left shows the priority at a glance */}
      <View style={[styles.accent, { backgroundColor: accent }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => onToggle(task)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.checkbox, task.completed && styles.checkboxDone]}>
            {task.completed && <Text style={styles.tick}>✓</Text>}
          </TouchableOpacity>

          <View style={styles.textBlock}>
            <Text style={[styles.title, task.completed && styles.titleDone]}>{task.title}</Text>
            {!!task.description && (
              <Text style={styles.description} numberOfLines={2}>
                {task.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.dates}>
          <Text style={styles.meta}>📅  {formatDateTime(task.dateTime)}</Text>
          <Text style={[styles.meta, overdue && styles.overdue]}>
            ⏰  Due {formatDateTime(task.deadline)}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.pills}>
            <View style={[styles.pill, { backgroundColor: category.soft }]}>
              <Text style={[styles.pillText, { color: category.color }]}>{category.label}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: prioritySoft[task.priority] }]}>
              <Text style={[styles.pillText, { color: accent }]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Text>
            </View>
            <View style={[styles.pill, { backgroundColor: status.bg }]}>
              <Text style={[styles.pillText, { color: status.fg }]}>{status.label}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => onDelete(task)}>
            <Text style={styles.delete}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    ...cardShadow,
  },
  accent: { width: 6 },
  content: { flex: 1, padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  checkboxDone: { backgroundColor: colors.success, borderColor: colors.success },
  tick: { color: '#fff', fontWeight: '800', fontSize: 14 },
  textBlock: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  titleDone: { textDecorationLine: 'line-through', color: colors.muted },
  description: { fontSize: 13, color: colors.muted, marginTop: 4, lineHeight: 18 },
  dates: { marginTop: 12, marginLeft: 38 },
  meta: { fontSize: 12, color: colors.muted, marginBottom: 3 },
  overdue: { color: colors.danger, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 38,
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginRight: 6, marginBottom: 4 },
  pillText: { fontSize: 11, fontWeight: '800' },
  delete: { color: colors.danger, fontWeight: '700', fontSize: 13, marginLeft: 8 },
});

export default TaskItem;