import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useRouter } from 'expo-router'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'

const Pets = () => {
  const router = useRouter()

  return (
    <TouchableWithoutFeedback>
    <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading} safe={true}>
        Your Pets
      </ThemedText>
      <Spacer />

      <ThemedButton 
        style={styles.button}
        onPress={() => router.push('/addPet')}
      >
        <ThemedText style={styles.buttonText}>
          Add Pet
        </ThemedText>
      </ThemedButton>

    </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Pets

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
    width: '40%',
    alignItems: 'center'
  }
})