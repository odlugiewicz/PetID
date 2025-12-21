import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { databases } from './appwrite'
import { Query } from 'react-native-appwrite'

const NOTIFICATION_TIMES = [
  7 * 24 * 60,
  24 * 60,
  60,
]

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const getScheduledNotifications = async (userId) => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    return scheduled.filter(n => n.content.data?.userId === userId)
  } catch (error) {
    console.error('Error fetching scheduled notifications:', error)
    return []
  }
}

export const scheduleEventNotifications = async (event) => {
  try {
    const notificationIds = []
    
    for (const minutesBefore of NOTIFICATION_TIMES) {
      const eventDate = new Date(event.eventDate)
      const [hours, minutes] = (event.eventTime || '12:00').split(':').map(Number)
      
      eventDate.setHours(hours, minutes, 0, 0)
      const notificationTime = new Date(eventDate.getTime() - minutesBefore * 60 * 1000)
      
      if (notificationTime > new Date()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Upcoming Event',
            body: event.title,
            data: {
              eventId: event.$id,
              userId: event.userId,
              minutesBefore,
            },
            sound: 'default',
            badge: 1,
          },
          trigger: {
            type: 'date',
            date: notificationTime,
          },
        })

        await saveNotificationReference({
          notificationId,
          eventId: event.$id,
          userId: event.userId,
          scheduledFor: notificationTime.toISOString(),
          minutesBefore,
        })

        notificationIds.push(notificationId)
      }
    }

    return notificationIds
  } catch (error) {
    console.error('Error scheduling notifications:', error)
    return []
  }
}

export const cancelEventNotifications = async (eventId, userId) => {
  try {
    const scheduled = await getScheduledNotifications(userId)
    for (const notification of scheduled) {
      if (notification.content.data?.eventId === eventId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier)
        await removeNotificationReference(notification.identifier)
      }
    }
  } catch (error) {
    console.error('Error canceling notifications:', error)
  }
}

export const scheduleRemindersForNearEvents = async (events, userId) => {
  try {
    const existingNotifications = await getScheduledNotifications(userId)
    const existingEventIds = new Set(
      existingNotifications.map(n => n.content.data?.eventId)
    )

    for (const event of events) {
      if (!existingEventIds.has(event.$id)) {
        await scheduleEventNotifications(event)
      }
    }

    const eventIds = new Set(events.map(e => e.$id))
    for (const notification of existingNotifications) {
      if (!eventIds.has(notification.content.data?.eventId)) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        )
        await removeNotificationReference(notification.identifier)
      }
    }
  } catch (error) {
    console.error('Error scheduling reminders:', error)
  }
}

export const saveNotificationReference = async (notificationData) => {
  try {
    const key = `notification_${notificationData.notificationId}`
    await AsyncStorage.setItem(key, JSON.stringify(notificationData))
  } catch (error) {
    console.error('Error saving notification reference:', error)
  }
}

export const removeNotificationReference = async (notificationId) => {
  try {
    const key = `notification_${notificationId}`
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing notification reference:', error)
  }
}

export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
  } catch (error) {
    console.error('Error requesting notification permissions:', error)
    return false
  }
}

export const setupNotificationListeners = (onNotificationResponse) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    response => {
      const { eventId, userId } = response.notification.content.data
      onNotificationResponse?.({ eventId, userId, response })
    }
  )

  return subscription
}

export const cleanupNotificationReferences = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys()
    const notificationKeys = allKeys.filter(key => key.startsWith('notification_'))
    
    for (const key of notificationKeys) {
      const data = JSON.parse(await AsyncStorage.getItem(key))
      const scheduledTime = new Date(data.scheduledFor)
      
      if (Date.now() - scheduledTime.getTime() > 24 * 60 * 60 * 1000) {
        await AsyncStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.error('Error cleaning up notification references:', error)
  }
}
