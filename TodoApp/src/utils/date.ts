// Formats a date for display, using the phone's locale
export const formatDateTime = (value: string | Date): string =>
  new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

// A task is overdue when its deadline has passed and it isn't completed
export const isOverdue = (deadline: string, completed: boolean): boolean =>
  !completed && new Date(deadline).getTime() < Date.now();