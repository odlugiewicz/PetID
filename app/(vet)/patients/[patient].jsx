import { StyleSheet, Text, useColorScheme, Alert, Image } from 'react-native'
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import { useVet } from '../../../hooks/useVets'
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

const PatientDetails = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light
    const router = useRouter()

    const [pet, setPet] = useState(null)

    const { patient: id } = useLocalSearchParams()
    const { fetchPetById, getPetImageUrl } = usePets()
     const imageUrl = pet && pet.imageId ? getPetImageUrl(pet.imageId) : null;

    const loadPet = useCallback(async () => {
        const petData = await fetchPetById(id)
        setPet(petData)
    }, [id, fetchPetById])

    useEffect(() => {
        loadPet()
        return () => setPet(null)
    }, [loadPet])

    useFocusEffect(
        useCallback(() => {
            loadPet()
        }, [loadPet])
    )

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

                <Spacer height={20} />

                <ThemedText style={styles.title}>Owner:</ThemedText>
                <ThemedText style={styles.text}>{pet.ownerName}</ThemedText>

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
                pathname: '/patients/medicalRecordVet',
                params: { petId: pet.$id }
            })} style={[styles.options, { backgroundColor: theme.uiBackground }]} >
                <ThemedText style={{ fontSize: 20 }}>
                    Medical Records
                </ThemedText>
                <Ionicons name="chevron-forward-outline" size={20} color={theme.text} />
            </ThemedButton>

            {pet.passport ? (
                <ThemedButton onPress={() => router.push({
                    pathname: '/patients/passportVet',
                    params: { petId: pet.$id }
                })} style={[styles.options, { backgroundColor: theme.uiBackground }]} >
                    <ThemedText style={{ fontSize: 20 }}>
                        Passport
                    </ThemedText>
                    <Ionicons name="chevron-forward-outline" size={20} color={theme.text} />
                </ThemedButton>
            ) : (
                <ThemedButton onPress={() => router.push({
                    pathname: '/patients/addPassport',
                    params: { petId: pet.$id }
                })} style={[styles.createPassportButton, { backgroundColor: Colors.primary }]} >
                    <Ionicons name="add-circle-outline" size={24} color="#fff" />
                    <ThemedText style={{ fontSize: 20, color: '#fff', marginLeft: 10 }}>
                        Create Passport
                    </ThemedText>
                </ThemedButton>
            )}

            <ThemedButton onPress={() => router.push('/patients')} style={[styles.button, { backgroundColor: Colors.warning }]} >
                <Text style={{ color: '#fff' }}>
                    Back
                </Text>
            </ThemedButton>

        </ThemedScroll >
    )
}

export default PatientDetails

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
    options: {
        marginTop: 20,
        width: '90%',
        alignSelf: "center",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    createPassportButton: {
        marginTop: 20,
        width: '90%',
        alignSelf: "center",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    button: {
        marginTop: 20,
        backgroundColor: Colors.primary,
        width: '50%',
        alignSelf: "center",
        alignItems: 'center',
        marginBottom: 20,
    },
    petImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 10,
        alignSelf: 'center',
    },
})