import { createContext, useContext, useEffect, useCallback, useRef } from 'react'
import { useUser } from '../hooks/useUser'
import { databases } from '../lib/appwrite'
import { Query } from 'react-native-appwrite'
import { scheduleRemindersForNearEvents } from '../lib/notifications'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const { user } = useUser()
  const isScheduling = useRef(false)

  const refreshNotifications = useCallback(async () => {
    if (!user || isScheduling.current) return
    
    isScheduling.current = true
    
    try {
      const response = await databases.listDocuments(
        "69051e15000f0c86fdb1",
        "events",
        [Query.equal('userId', user.$id)]
      )
      
      // Schedule notifications automatically
      await scheduleRemindersForNearEvents(response.documents, user.$id)
    } catch (error) {
      console.error('Failed to setup notifications:', error)
    } finally {
      isScheduling.current = false
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    refreshNotifications()

    // Refresh notifications every hour
    const interval = setInterval(refreshNotifications, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [user, refreshNotifications])

  return (
    <NotificationContext.Provider value={{ refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
