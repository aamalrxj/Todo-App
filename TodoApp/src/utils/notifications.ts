import notifee, { AndroidImportance } from '@notifee/react-native';
import { formatDateTime } from './date';

// Asks for notification permission (shows the system dialog on Android 13+)
export const requestNotificationPermission = async (): Promise<void> => {
  try {
    await notifee.requestPermission();
  } catch {
    // Not critical: the app works without notifications
  }
};

// Shows a notification confirming that a task was added
export const showTaskAddedNotification = async (title: string, deadline: Date): Promise<void> => {
  try {
    // Android requires a channel; this creates it once and reuses it afterwards
    const channelId = await notifee.createChannel({
      id: 'tasks',
      name: 'Task updates',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: 'Task added ✅',
      body: `"${title}" is due ${formatDateTime(deadline)}`,
      android: {
        channelId,
        pressAction: { id: 'default' }, // tapping opens the app
      },
    });
  } catch {
    // A notification failure must never block saving the task
  }
};