import { StyleSheet, Text, useColorScheme} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { usePets } from '../../../hooks/usePets'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

import ThemedText from "../../../components/ThemedText"
import ThemedButton from "../../../components/ThemedButton"
import ThemedView from "../../../components/ThemedView"
import ThemedCard from "../../../components/ThemedCard"
import ThemedLoader from '../../../components/ThemedLoader'
import ThemedScroll from '../../../components/ThemedScroll'
import Spacer from '../../../components/Spacer'


const PetDetails = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    const [pet, setPet] = useState(null)

    const { id } = useLocalSearchParams()
    const { fetchPetById, deletePet } = usePets()
    const router = useRouter()

    const handleDelete = async () => {
        await deletePet(id)
        setPet(null)
        router.replace('/pets')
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
        <ThemedScroll safe={true} style={styles.container}>
            <ThemedCard style={styles.card}>
                <ThemedText style={styles.header}>{pet.name}</ThemedText>

                <ThemedText style={styles.title}>Species:</ThemedText>

                <ThemedText style={styles.text}>{pet.species}</ThemedText>

                <Spacer height={20} />

                <ThemedText style={styles.title}>Breed:</ThemedText>

                <ThemedText style={styles.text}>{pet.breed}</ThemedText>

                {pet.passportId && (
                    <ThemedView style={{ backgroundColor: null }}>
                        <Spacer height={20} />
                        <ThemedText style={styles.title}>
                            Passport Number:
                        </ThemedText>
                        <ThemedText style={styles.text}>
                            {pet.passportId}
                        </ThemedText>
                    </ThemedView>
                )}

                {pet.chipId && (
                    <ThemedView style={{ backgroundColor: null }}>
                        <Spacer height={20} />
                        <ThemedText style={styles.title}>
                            Chip Number:
                        </ThemedText>
                        <ThemedText style={styles.text}>
                            {pet.chipId}
                        </ThemedText>
                    </ThemedView>
                )}

            </ThemedCard>

            <ThemedButton onPress={() => router.push({
                pathname: '/pets/medicalRecord',
                params: {petId: pet.$id}
                })} style={[styles.options, {backgroundColor: theme.uiBackground}]} >
                <ThemedText style={{ fontSize: 20 }}>
                    View Medical Records
                </ThemedText>
                <Ionicons name="chevron-forward-outline" size={20} color={theme.text} />
            </ThemedButton>

            <ThemedButton onPress={handleDelete} style={styles.delete} >
                <ThemedText style={{ color: '#fff', textAlign: 'center' }}>
                    Delete Pet
                </ThemedText>
            </ThemedButton>

            <ThemedButton onPress={() => router.push('/pets')} style={styles.button}>
                <Text style={{ color: '#fff' }}>
                    Cancel
                </Text>
            </ThemedButton>

        </ThemedScroll >
    )
}

export default PetDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 40,
        marginVertical: 10,
        fontWeight: "bold",
        color: Colors.primary,
        alignSelf: 'center'
    },
    title: {
        fontSize: 20,
        color: Colors.primary,
    },
    text: {
        fontSize: 20,
        marginVertical: 5,
        fontWeight: "bold",
    },
    card: {
        margin: 20
    },
    delete: {
        marginTop: 20,
        backgroundColor: Colors.warning,
        width: '50%',
        alignSelf: "center",
    },
    options: {
        marginTop: 20,
        width: '90%',
        alignSelf: "center",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        marginTop: 20,
        backgroundColor: Colors.primary,
        width: '50%',
        alignSelf: "center",
        alignItems: 'center',
    }
})