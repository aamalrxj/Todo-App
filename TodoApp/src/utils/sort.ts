import { Task } from '../types';

export type SortMode = 'smart' | 'deadline' | 'priority';

export const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'smart', label: 'Smart' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'priority', label: 'Priority' },
];

const HOUR_MS = 60 * 60 * 1000;

// How many hours of "urgency" each priority is worth
const PRIORITY_BONUS = { high: 24, medium: 8, low: 0 };
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

// Lower score = more urgent = shown first.
// Mixes deadline proximity, priority weight and scheduled start time.
const smartScore = (task: Task, now: number): number => {
  const hoursToDeadline = (new Date(task.deadline).getTime() - now) / HOUR_MS;
  const hoursToStart = (new Date(task.dateTime).getTime() - now) / HOUR_MS;

  // Tasks that start later are slightly less urgent (capped so it can't dominate)
  const startPenalty = Math.min(Math.max(hoursToStart, 0) * 0.25, 48);

  return hoursToDeadline - PRIORITY_BONUS[task.priority] + startPenalty;
};

// Returns a new sorted array. Completed tasks always come last.
export const sortTasks = (tasks: Task[], mode: SortMode): Task[] => {
  const now = Date.now();

  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);

    const byDeadline = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();

    switch (mode) {
      case 'deadline':
        return byDeadline;
      case 'priority':
        // High first; ties are broken by the earlier deadline
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || byDeadline;
      default:
        return smartScore(a, now) - smartScore(b, now);
    }
  });
};