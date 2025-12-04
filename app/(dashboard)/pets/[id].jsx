import { StyleSheet, Text, useColorScheme, Alert, Image } from 'react-native'
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


const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return 'N/A'
    try {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    } catch (error) {
        return dateString
    }
}

const PetDetails = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    const [pet, setPet] = useState(null)
    const [token, setToken] = useState(null)
    const [generatingToken, setGeneratingToken] = useState(false)
    const [tokenExpiry, setTokenExpiry] = useState(null)
    const [timeRemaining, setTimeRemaining] = useState(null)

    const { id } = useLocalSearchParams()
    const { fetchPetById, deletePet, generatePetToken, getPetImageUrl } = usePets()
    const router = useRouter()
    const imageUrl = pet && pet.imageId ? getPetImageUrl(pet.imageId) : null;

    const handleDelete = async () => {
        await deletePet(id)
        setPet(null)
        router.replace('/pets')
    }

    const handleGenerateToken = async () => {
        setGeneratingToken(true)
        try {
            const newToken = await generatePetToken(id)
            setToken(newToken)
            const expiryTime = Date.now() + 5 * 60 * 1000
            setTokenExpiry(expiryTime)
            setTimeRemaining(300)
        } catch (error) {
            Alert.alert('Error', 'Failed to generate token')
        } finally {
            setGeneratingToken(false)
        }
    }

    useEffect(() => {
        if (!tokenExpiry) return

        const interval = setInterval(() => {
            const now = Date.now()
            const remaining = Math.max(0, tokenExpiry - now)
            const seconds = Math.floor(remaining / 1000)

            setTimeRemaining(seconds)

            if (seconds === 0) {
                setToken(null)
                setTokenExpiry(null)
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [tokenExpiry])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        async function loadPet() {
            const petData = await fetchPetById(id)
            setPet(petData)
        }

        setToken(null)
        setTokenExpiry(null)
        setTimeRemaining(null)

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
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.petImage}
                />

                <ThemedText style={styles.header}>{pet.name}</ThemedText>

                <ThemedText style={styles.title}>Species:</ThemedText>
                <ThemedText style={styles.text}>{pet.species}</ThemedText>

                <Spacer height={20} />

                <ThemedText style={styles.title}>Breed:</ThemedText>
                <ThemedText style={styles.text}>{pet.breed}</ThemedText>

                <Spacer height={20} />

                <ThemedText style={styles.title}>Gender:</ThemedText>
                <ThemedText style={styles.text}>
                    {pet.gender ? (
                        pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
                    ) : (
                        'Unknown'
                    )}
                </ThemedText>

                <Spacer height={20} />

                <ThemedText style={styles.title}>Date of Birth:</ThemedText>
                <ThemedText style={styles.text}>{formatDateToDDMMYYYY(pet.birthDate)}</ThemedText>

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

            {token && (
                <ThemedCard style={[styles.card, { backgroundColor: Colors.primary }]}>
                    <ThemedText style={styles.tokenTitle}>Vet Invitation Token</ThemedText>
                    <ThemedText style={styles.tokenText}>{token}</ThemedText>
                    <ThemedText style={styles.tokenExpiry}>
                        Expires in {formatTime(timeRemaining)}
                    </ThemedText>
                </ThemedCard>
            )}

            {!token && (
                <ThemedButton onPress={handleGenerateToken} disabled={generatingToken} style={styles.generateTokenButton} >
                    <ThemedText style={{ fontSize: 20, color: '#fff' }}>
                        {generatingToken ? 'Generating...' : 'Generate Pets Code'}
                    </ThemedText>
                </ThemedButton>
            )}

            <ThemedButton onPress={() => router.push({
                pathname: '/pets/medicalRecord',
                params: { petId: pet.$id }
            })} style={[styles.options, { backgroundColor: theme.uiBackground }]} >
                <ThemedText style={{ fontSize: 20 }}>
                    Medical Records
                </ThemedText>
                <Ionicons name="chevron-forward-outline" size={20} color={theme.text} />
            </ThemedButton>

            {pet.passportId && (
                <ThemedButton onPress={() => router.push({
                    pathname: '/pets/passport',
                    params: { petId: pet.$id }
                })} style={[styles.options, { backgroundColor: theme.uiBackground }]} >
                    <ThemedText style={{ fontSize: 20 }}>
                        Passport
                    </ThemedText>
                    <Ionicons name="chevron-forward-outline" size={20} color={theme.text} />
                </ThemedButton>
            )}

            <ThemedView style={styles.buttonContainer}>
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
            </ThemedView>

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
        margin: 20,
        borderRadius: 25,
    },
    tokenTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    tokenText: {
        fontSize: 16,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    tokenExpiry: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.8,
        marginBottom: 15,
    },
    shareButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 5,
    },
    delete: {
        marginTop: 20,
        backgroundColor: Colors.warning,
        width: '45%',
        alignSelf: "flex-start",
        marginLeft: '2.5%',
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
        width: '45%',
        alignSelf: "flex-end",
        marginRight: '2.5%',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '2.5%',
    },
    generateTokenButton: {
        marginTop: 20,
        width: '90%',
        alignSelf: "center",
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    petImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 10,
        alignSelf: 'center',
    },
})