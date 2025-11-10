import { StyleSheet, Text } from 'react-native'
import { useUser } from '../../hooks/useUser'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'

const UserProfile = () => {
const {logout, user} = useUser()

  return (
    <ThemedView style={styles.container} safe={true}>

      <ThemedText title={true} style={styles.heading}>
        {user.email}
      </ThemedText>

      <Spacer />

      <ThemedText style={styles.info}>
        {user.name}
      </ThemedText>

      <Spacer />

      <Spacer />

      <ThemedButton onPress={logout}>
        <Text style={{ color: 'white' }}>Logout</Text>
      </ThemedButton>

    </ThemedView>
  )
}

export default UserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
  info: {
    fontSize: 18,
  },
  button: {
    marginTop: 20,  
    width: '80%',
    padding: 15,
  }
})