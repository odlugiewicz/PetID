import { StyleSheet, ScrollView, View, useColorScheme, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import ThemedCard from '../../../components/ThemedCard'
import ThemedButton from '../../../components/ThemedButton'
import ThemedLoader from '../../../components/ThemedLoader'
import Spacer from '../../../components/Spacer'
import { usePets } from '../../../hooks/usePets'
import { useChips } from '../../../hooks/useChips'

const ChipUser = () => {
    const router = useRouter()
    const { petId } = useLocalSearchParams()
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const { fetchPetById } = usePets()
    const { fetchChipByPet } = useChips()

    const [pet, setPet] = useState(null)
    const [chip, setChip] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            if (petId) {
                const petData = await fetchPetById(petId)
                setPet(petData)
                const chipData = await fetchChipByPet(petId)
                setChip(chipData)
            }
            setLoading(false)
        }

        load()

        return () => {
            setPet(null)
            setChip(null)
        }
    }, [petId])

    const formatDate = (value) => {
        if (!value) return 'N/A'
        return new Date(value).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <ThemedView safe={true} style={styles.centered}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    if (!pet) {
        return (
            <ThemedView safe={true} style={styles.centered}>
                <ThemedText>No pet found.</ThemedText>
                <ThemedButton onPress={() => router.replace('/pets')} style={styles.backButton}>
                    <Text style={{ color: '#fff' }}>Back</Text>
                </ThemedButton>
            </ThemedView>
        )
    }

    if (!chip) {
        return (
            <ThemedView safe={true} style={styles.centered}>
                <ThemedCard style={styles.card}>
                    <ThemedText title={true} style={styles.heading}>{pet.name}'s Chip</ThemedText>
                    <Spacer height={14} />
                    <ThemedText style={styles.muted}>No chip information available yet.</ThemedText>
                </ThemedCard>

                <ThemedButton onPress={() => router.replace({ pathname: `/pets/[id]`, params: { id: pet.$id } })} style={[styles.backButton, { backgroundColor: Colors.warning }]}>
                    <Text style={{ color: '#fff' }}>Back</Text>
                </ThemedButton>
            </ThemedView>
        )
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
            <ThemedView safe={true} style={styles.container}>
                <ThemedText title={true} style={styles.heading}>{pet.name}'s Chip</ThemedText>
                <Spacer />

                <ThemedCard style={styles.card}>
                    <View style={styles.row}>
                        <Ionicons name="hardware-chip-outline" size={22} color={Colors.primary} />
                        <ThemedText style={styles.title}>Chip Details</ThemedText>
                    </View>
                    <Spacer height={10} />

                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Chip Number:</ThemedText>
                        <ThemedText style={styles.value}>{chip.chipNumber || 'N/A'}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Implant Date:</ThemedText>
                        <ThemedText style={styles.value}>{formatDate(chip.implantDate)}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Manufacturer:</ThemedText>
                        <ThemedText style={styles.value}>{chip.manufacturer || 'N/A'}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Implant Location:</ThemedText>
                        <ThemedText style={styles.value}>{chip.implantLocation || 'N/A'}</ThemedText>
                    </View>
                    {chip.notes ? (
                        <View style={styles.infoColumn}>
                            <ThemedText style={styles.label}>Notes:</ThemedText>
                            <ThemedText style={styles.valueMultiline}>{chip.notes}</ThemedText>
                        </View>
                    ) : null}
                </ThemedCard>

                <ThemedButton onPress={() => router.replace({ pathname: `/pets/[id]`, params: { id: pet.$id } })} style={[styles.backButton, { backgroundColor: Colors.warning }]}>
                    <Text style={{ color: '#fff' }}>Back</Text>
                </ThemedButton>
                <Spacer height={20} />
            </ThemedView>
        </ScrollView>
    )
}

export default ChipUser

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10,
        color: Colors.primary,
    },
    card: {
        width: '100%',
        marginVertical: 10,
        padding: 18,
        borderRadius: 18,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        marginLeft: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
    },
    infoColumn: {
        marginTop: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    value: {
        fontSize: 15,
        flex: 1,
        textAlign: 'right',
    },
    valueMultiline: {
        fontSize: 15,
        marginTop: 4,
        lineHeight: 20,
    },
    backButton: {
        marginTop: 12,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 14,
    },
    muted: {
        textAlign: 'center',
        fontStyle: 'italic',
    },
})
