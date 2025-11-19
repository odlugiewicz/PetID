import { useUser } from '../../hooks/useUser'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import ThemedLoader from '../ThemedLoader'

const UserOnly = ({ children }) => {
  const { user, authChecked } = useUser()
  const router = useRouter()
  
  useEffect(() => {
    if (authChecked && (!user || user.role !== 'user') ) {
      router.replace("/login")
    }
  }, [user, authChecked])


  if (!authChecked || !user || user.role !== 'user') {
    return (
      <ThemedLoader />
    )
  }
  
  return children
}

export default UserOnly