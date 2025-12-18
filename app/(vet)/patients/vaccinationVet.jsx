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
import { useVaccinations } from '../../../hooks/useVaccinations'


const VaccinationVet = () => {
    const router = useRouter()
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    const [pet, setPet] = useState(null)
    const [records, setRecords] = useState([])
    const { petId: id } = useLocalSearchParams()
    const { fetchPetById } = usePets()
    const { vaccinations, fetchVaccinationsByPet } = useVaccinations()

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

    useEffect(() => {
        async function loadRecords() {
            if (id) {
                const docs = await fetchVaccinationsByPet(id)
                setRecords(docs)
            }
        }
        loadRecords()
    }, [id, fetchVaccinationsByPet])

    if (!pet) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    const renderItem = ({ item }) => {
        const isExpired = new Date(item.expiryDate) < new Date()
        return (
            <Pressable onPress={() => router.push({ pathname: `/patients/vaccinationDetailsVet`, params: { vaccinationId: item.$id, petId: pet.$id } })} style={{ flex: 1, margin: 1, minWidth: '50%' }}>
                <ThemedCard style={[styles.card, isExpired && { borderLeftColor: Colors.warning }]}>
                    <ThemedText style={styles.title}>{item.vaccineName}</ThemedText>
                    <Spacer height={8} />
                    <ThemedText>
                        {new Date(item.applicationDate).toLocaleDateString('en-GB')}
                    </ThemedText>
                    {isExpired && (
                        <>
                            <Spacer height={8} />
                            <ThemedText style={{ color: Colors.warning, fontSize: 12, fontWeight: '600' }}>
                                ⚠ Expired
                            </ThemedText>
                        </>
                    )}
                </ThemedCard>
            </Pressable>
        )
    }

    return (
        <TouchableWithoutFeedback>
            <ThemedView style={styles.container} safe={true}>
                <ThemedText title={true} style={styles.heading}>
                    {pet.name} Vaccinations
                </ThemedText>

                <Spacer />

                <FlatList
                    style={styles.list}
                    data={records}
                    keyExtractor={(item) => item.$id}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <ThemedText style={{ textAlign: 'center', opacity: 0.6 }}>
                            No vaccinations yet.
                        </ThemedText>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />

                <ThemedButton onPress={() => router.push({ pathname: `/patients/addVaccination`, params: { patient: pet.$id } })} style={styles.button}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="add" size={18} color={theme.button} />
                        <ThemedText style={{ color: theme.button }}>
                            Add New Vaccination
                        </ThemedText>
                    </View>
                </ThemedButton>

                <ThemedButton onPress={() => router.push({ pathname: `/patients/[patient]`, params: { patient: pet.$id } })} style={styles.cancel}>
                    <Text style={{ color: theme.button }}>
                        Back
                    </Text>
                </ThemedButton>
            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default VaccinationVet

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderLeftWidth: 4,
        borderRadius: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
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
