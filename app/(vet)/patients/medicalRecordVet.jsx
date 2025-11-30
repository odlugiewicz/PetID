import { StyleSheet, TouchableWithoutFeedback, FlatList, Pressable, Image, View, useColorScheme, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { usePets } from '../../../hooks/usePets'
import { useEffect, useState } from 'react'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons';

import Spacer from "../../../components/Spacer"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import ThemedButton from '../../../components/ThemedButton'
import ThemedCard from '../../../components/ThemedCard'
import ThemedLoader from '../../../components/ThemedLoader'


const MedicalRecordVet = () => {
    const router = useRouter()
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    const [pet, setPet] = useState(null)
    const { petId: id } = useLocalSearchParams()
    const { fetchPetById } = usePets()

    useEffect(() => {
        async function loadPet() {
            if (id) {
                const petData = await fetchPetById(id)
                setPet(petData)
            }
        }

        loadPet()

        return () => setPet(null)
    }, [id, fetchPetById])

    if (!pet) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    return (
        <TouchableWithoutFeedback>
            <ThemedView style={styles.container} safe={true}>

                <ThemedText title={true} style={styles.heading}>
                    {pet.name} Medical Records
                </ThemedText>

                <Spacer />

                <FlatList />

                <ThemedButton onPress={() => router.push({ pathname: `/patients/addMedicalRecord`, params: { patient: pet.$id } })} style={styles.button}>
                    <Text style={{ color: theme.text }}>
                        Add New Record
                    </Text>
                </ThemedButton>

                <ThemedButton onPress={() => router.push({ pathname: `/patients/[patient]`, params: { patient: pet.$id } })} style={styles.cancel}>
                    <Text style={{ color: theme.text }}>
                        Back
                    </Text>
                </ThemedButton>

            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default MedicalRecordVet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "center",
        marginTop: 40,
        color: Colors.primary,
    },
    button: {
        width: '40%',
        alignItems: 'center'
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
        borderLeftColor: Colors.primary,
        borderLeftWidth: 4
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
    },
    petImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: Colors.primary,
        width: '50%',
        alignSelf: "center",
        alignItems: 'center',
    },
    cancel: {
        marginTop: 20,
        backgroundColor: Colors.warning,
        width: '50%',
        alignSelf: "center",
        alignItems: 'center',
    },
})