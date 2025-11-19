import { StyleSheet, TouchableWithoutFeedback, FlatList, Pressable, Image, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useVet } from '../../contexts/VetContext'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'


const Patients = () => {
  const router = useRouter()
  const { patients } = useVet()

  return (
    <TouchableWithoutFeedback>
      <ThemedView style={styles.container} safe={true}>

        <ThemedText title={true} style={styles.heading}>
          Your Patients
        </ThemedText>

        <Spacer />

        <FlatList
          data={patients}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ alignSelf: 'flex-start', alignItems: 'center' }}
          numColumns={2}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          width={'80%'}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/patients/${item.$id}`)} style={{ flex: 1, margin: 1, minWidth: '50%' }}>
              <ThemedCard style={styles.card}>
                <View style={[styles.patientImagePlaceholder, { backgroundColor: Colors.light.uiBackground }]}>
                  <Ionicons name="paw-outline" size={40} color={Colors.light.text} />
                </View>
                <ThemedText style={styles.title}>{item.name}</ThemedText>
                <ThemedText>{item.species}</ThemedText>
                <ThemedText style={styles.owner}>{item.ownerName}</ThemedText>
              </ThemedCard>
            </Pressable>
          )}
        />

        {patients.length === 0 && (
          <ThemedText style={styles.noPatients}>No patients yet</ThemedText>
        )}

        <ThemedButton
          style={styles.button}
          //onPress={() => router.push('/addPet')}
        >
          <ThemedText style={styles.buttonText}>
            Add Pet
          </ThemedText>
        </ThemedButton>

      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Patients

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
  list: {
    marginTop: 40,
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  patientImagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  owner: {
    fontSize: 12,
    opacity: 0.7,
  },
  noPatients: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 20,
  },
  button: {
    width: '40%',
    alignItems: 'center'
  },
})