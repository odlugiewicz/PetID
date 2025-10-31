import { StyleSheet, TouchableWithoutFeedback} from 'react-native'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"

const Calendar = () => {
  return (
    <TouchableWithoutFeedback>
    <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading} safe={true}>
        Clendar
      </ThemedText>
      <Spacer />

      <ThemedText>Add Visit</ThemedText>
      <Spacer />

    </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Calendar

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