import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"

const Pets = () => {
  return (
    <TouchableWithoutFeedback>
    <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading} safe={true}>
        Your Pets
      </ThemedText>
      <Spacer />

      <ThemedText>Add Pet</ThemedText>
      <Spacer />

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
})