import { StyleSheet, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { usePets } from '../../../hooks/usePets'
import { Colors } from '../../../constants/Colors'

import ThemedText from "../../../components/ThemedText"
import ThemedButton from "../../../components/ThemedButton"
import ThemedView from "../../../components/ThemedView"
import ThemedCard from "../../../components/ThemedCard"
import ThemedLoader from '../../../components/ThemedLoader'


const PetDetails = () => {
    const [pet, setPet] = useState(null)

    const { id } = useLocalSearchParams()
    const { fetchPetById, deletePet } = usePets()
    const router = useRouter()

    const handleDelete = async () => {
        await deletePet(id)
        setPet(null)
        router.replace('/pets')
    }

     const handleCancel = async () => {
        try {
            router.replace("/pets")
        } catch (error) {
            console.log("Canceling pet info:", error)
        }
    }

    useEffect(() => {
        async function loadPet() {
            const petData = await fetchPetById(id)
            setPet(petData)
        }

        loadPet()

        return () => setPet(null)
    }, [id])

    if (!pet) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    return (
        <ThemedView safe={true} style={styles.container}>
            <ThemedCard style={styles.card}>
                <ThemedText style={styles.title}>{pet.name}</ThemedText>
                <ThemedText>{pet.species} {pet.breed}</ThemedText>
            </ThemedCard>

            <ThemedButton onPress={handleDelete} style={styles.delete} >
                <Text style={{ color: '#fff', textAlign: 'center'}}>
                    Delete Pet
                </Text>
            </ThemedButton>

            <ThemedButton onPress={handleCancel} style={styles.cancel}>
                    <Text style={{ color: '#fff' }}>
                        Cancel
                    </Text>
            </ThemedButton>

        </ThemedView>
    )
}

export default PetDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
    },
    title: {
    fontSize: 22,
    marginVertical: 10,
  },
  card: {
    margin: 20
  },
  delete: {
    marginTop: 40,
    backgroundColor: Colors.warning,
    width: '50%',
    alignSelf: "center",
  },
  cancel: {
    marginTop: 40,
    backgroundColor: Colors.primary,
    width: '50%',
    alignSelf: "center",
    alignItems: 'center',
  },
})