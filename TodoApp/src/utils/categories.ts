import { Category } from '../types';

// The fixed list of categories, each with a colour and a soft background
export const CATEGORIES: { key: Category; label: string; color: string; soft: string }[] = [
  { key: 'work', label: 'Work', color: '#2563EB', soft: '#DBEAFE' },
  { key: 'personal', label: 'Personal', color: '#DB2777', soft: '#FCE7F3' },
  { key: 'study', label: 'Study', color: '#7C3AED', soft: '#EDE9FE' },
  { key: 'other', label: 'Other', color: '#6B7280', soft: '#F3F4F6' },
];

// Falls back to "Other" for older tasks that have no category
export const getCategory = (key?: Category) =>
  CATEGORIES.find(c => c.key === key) ?? CATEGORIES[3];