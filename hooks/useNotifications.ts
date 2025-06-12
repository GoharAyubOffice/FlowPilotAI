import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export interface NotificationPermission {
  granted: boolean;
  canAskAgain: boolean;
}

export interface TaskNotification {
  id: string;
  taskId: string;
  title: string;
  body: string;
  scheduledTime: Date;
  isScheduled: boolean;
}

// Mock notification system for web compatibility
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    canAskAgain: true,
  });
  const [scheduledNotifications, setScheduledNotifications] = useState<TaskNotification[]>([]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      // Web notification API
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        const granted = result === 'granted';
        setPermission({ granted, canAskAgain: result !== 'denied' });
        return granted;
      }
    }
    
    // For mobile, we'd use expo-notifications here
    // For now, simulate permission granted
    setPermission({ granted: true, canAskAgain: true });
    return true;
  }, []);

  const scheduleTaskNotification = useCallback(async (
    taskId: string,
    title: string,
    scheduledTime: Date
  ): Promise<string | null> => {
    if (!permission.granted) {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    const notificationId = `task-${taskId}-${Date.now()}`;
    const notification: TaskNotification = {
      id: notificationId,
      taskId,
      title: 'Task Reminder',
      body: `Time to: ${title}`,
      scheduledTime,
      isScheduled: true,
    };

    if (Platform.OS === 'web') {
      // Schedule web notification
      const timeUntilNotification = scheduledTime.getTime() - Date.now();
      if (timeUntilNotification > 0) {
        setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.body,
              icon: '/assets/images/icon.png',
              badge: '/assets/images/icon.png',
            });
          }
        }, timeUntilNotification);
      }
    }

    setScheduledNotifications(prev => [...prev, notification]);
    return notificationId;
  }, [permission.granted, requestPermission]);

  const cancelNotification = useCallback((notificationId: string) => {
    setScheduledNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  const cancelTaskNotifications = useCallback((taskId: string) => {
    setScheduledNotifications(prev => 
      prev.filter(notification => notification.taskId !== taskId)
    );
  }, []);

  return {
    permission,
    requestPermission,
    scheduleTaskNotification,
    cancelNotification,
    cancelTaskNotifications,
    scheduledNotifications,
  };
}