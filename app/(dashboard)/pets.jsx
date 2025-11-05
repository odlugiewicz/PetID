import { StyleSheet, TouchableWithoutFeedback, FlatList, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { usePets } from '../../hooks/usePets'
import { Colors } from '../../constants/Colors'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'


const Pets = () => {
  const router = useRouter()
  const { pets } = usePets()

  return (
    <TouchableWithoutFeedback>
    <ThemedView style={styles.container} safe={true}>

      <ThemedText title={true} style={styles.heading}>
        Your Pets
      </ThemedText>

      <Spacer />

      <FlatList 
        data={pets}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <Pressable>
            <ThemedCard style={styles.card}>
              <ThemedText style={styles.title}>{item.name}</ThemedText>
              <ThemedText >{item.species}</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      />


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
    marginTop: 40
  },
  button: {
    width: '40%',
    alignItems: 'center'
  },
  list: {
    marginTop: 40
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
})