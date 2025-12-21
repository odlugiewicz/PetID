import { createContext, useContext, useEffect, useCallback, useRef } from 'react'
import { useUser } from '../hooks/useUser'
import { databases } from '../lib/appwrite'
import { Query } from 'react-native-appwrite'
import {
  scheduleRemindersForNearEvents,
  requestNotificationPermissions,
  setupNotificationListeners,
  cleanupNotificationReferences,
  scheduleEventNotifications,
  cancelEventNotifications,
} from '../lib/notifications'

const NotificationContext = createContext()

const DATABASE_ID = "69051e15000f0c86fdb1"
const EVENTS_TABLE_ID = "events"

export const NotificationProvider = ({ children }) => {
  const { user } = useUser()
  const isScheduling = useRef(false)

  useEffect(() => {
    const requestPermissions = async () => {
      await requestNotificationPermissions()
    }
    requestPermissions()
  }, [])

  useEffect(() => {
    const subscription = setupNotificationListeners(({ eventId, userId }) => {
      console.log(`Notification triggered for event: ${eventId}, user: ${userId}`)
    })

    return () => subscription.remove()
  }, [])

  const refreshNotifications = useCallback(async () => {
    if (!user || isScheduling.current) return
    
    isScheduling.current = true
    
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        EVENTS_TABLE_ID,
        [Query.equal('userId', user.$id)]
      )
      
      await scheduleRemindersForNearEvents(response.documents, user.$id)
      
      await cleanupNotificationReferences()
    } catch (error) {
      console.error('Failed to setup notifications:', error)
    } finally {
      isScheduling.current = false
    }
  }, [user])

  const scheduleNotificationForEvent = useCallback(async (event) => {
    if (!user) return null
    
    try {
      return await scheduleEventNotifications(event)
    } catch (error) {
      console.error('Failed to schedule notifications:', error)
      return null
    }
  }, [user])

  const cancelNotificationsForEvent = useCallback(async (eventId) => {
    if (!user) return
    
    try {
      await cancelEventNotifications(eventId, user.$id)
    } catch (error) {
      console.error('Failed to cancel notifications:', error)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    refreshNotifications()

    const interval = setInterval(refreshNotifications, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [user, refreshNotifications])

  return (
    <NotificationContext.Provider
      value={{
        refreshNotifications,
        scheduleNotificationForEvent,
        cancelNotificationsForEvent,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
