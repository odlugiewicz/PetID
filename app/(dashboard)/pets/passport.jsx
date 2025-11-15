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


const Passport = () => {
    const router = useRouter()
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    const [pet, setPet] = useState(null)
    const { id, petId: idParam } = useLocalSearchParams()
    const { fetchPetById } = usePets()

    useEffect(() => {
        async function loadPet() {
            if (idParam) {
                const petData = await fetchPetById(idParam)
                setPet(petData)
            }
        }

        loadPet()

        return () => setPet(null)
    }, [idParam, fetchPetById])

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
                <ThemedCard style={styles.card}>

                    <ThemedText title={true} style={styles.heading}>
                        {pet.name} Passport
                    </ThemedText>

                    <Spacer />

                    

                </ThemedCard>


                <ThemedButton onPress={() => router.push(`/pets/${pet.$id}`)} style={styles.cancel}>
                    <Text style={{ color: '#fff' }}>
                        Cancel
                    </Text>
                </ThemedButton>

            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default Passport

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