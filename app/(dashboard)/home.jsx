import { StyleSheet, Text } from 'react-native'
import { useUser } from '../../hooks/useUser'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'

const Home = () => {
const {logout, user} = useUser()

  return (
    <ThemedView style={styles.container} safe={true}>

      <ThemedText title={true} style={styles.heading}>
        Welcome, {user.email}
      </ThemedText>

      <Spacer />
      <ThemedText title={true} style={styles.heading}>
        Home
      </ThemedText>
      <Spacer />

      <ThemedButton onPress={logout}>
        <Text style={{ color: 'white' }}>Logout</Text>
      </ThemedButton>

    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    marginTop: 20,  
    width: '80%',
    padding: 15,
  }
})