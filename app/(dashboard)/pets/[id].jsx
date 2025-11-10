import { StyleSheet, Text, Image, useColorScheme, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { usePets } from '../../../hooks/usePets'
import { Colors } from '../../../constants/Colors'
import { getPetImagePreview } from '../../../lib/appwrite'

import ThemedText from "../../../components/ThemedText"
import ThemedButton from "../../../components/ThemedButton"
import ThemedView from "../../../components/ThemedView"
import ThemedCard from "../../../components/ThemedCard"
import ThemedLoader from '../../../components/ThemedLoader'
import Spacer from '../../../components/Spacer'

const PetDetails = () => {
    const [pet, setPet] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [loading, setLoading] = useState(true)

    const { id } = useLocalSearchParams()
    const { fetchPetById, deletePet } = usePets()
    const router = useRouter()
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    const handleDelete = async () => {
        setLoading(true)
        await deletePet(id)
        setPet(null)
        setLoading(false)
        router.replace('/pets')
    }

    useEffect(() => {
        const loadPet = async () => {
            try {
                const petData = await fetchPetById(id)
                setPet(petData)

                if (petData?.imageId) {
                    const url = getPetImagePreview(petData.imageId, 200, 200);
                    setImageUrl(url)
                }
            } catch (error) {
                console.error("Failed to load pet details:", error)
            } finally {
                setLoading(false)
            }
        }

        loadPet()

        return () => {
            setPet(null)
            setImageUrl(null)
            setLoading(true)
        }
    }, [id, fetchPetById])

    if (loading || !pet) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    return (
        <ThemedView safe={true} style={styles.container}>

            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.petImageLarge}
                    />
                ) : (
                    // Placeholder, jeśli brak zdjęcia
                    <View style={[styles.petImageLarge, styles.placeholder, { backgroundColor: theme.uiBackground, borderColor: theme.text }]}>
                        <ThemedText style={{ fontSize: 16 }}>No Photo</ThemedText>
                    </View>
                )}
            </View>

            <Spacer />

            <ThemedCard style={styles.card}>
                <ThemedText style={styles.title}>{pet.name}</ThemedText>
                <ThemedText>Species: {pet.species}</ThemedText>
                <ThemedText>Breed: {pet.breed}</ThemedText>
                <ThemedText>Date of Birth: {pet.birthDate}</ThemedText>
                {pet.chipId && <ThemedText>Chip ID: {pet.chipId}</ThemedText>}
                {pet.passportId && <ThemedText>Passport ID: {pet.passportId}</ThemedText>}
            </ThemedCard>

            <Spacer />

            <ThemedButton onPress={handleDelete} style={styles.delete} >
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                    Delete Pet
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
    heading: {
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
        marginBottom: 10,
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
        width: 200,
        alignSelf: "center",
    },
    imageContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 20
    },
    petImageLarge: {
        width: 200, 
        height: 200, 
        borderRadius: 100, 
        borderWidth: 1,
        borderColor: '#ccc'
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
})