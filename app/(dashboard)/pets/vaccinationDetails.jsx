import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useVaccinations } from '../../../hooks/useVaccinations'
import { databases } from '../../../lib/appwrite'
import { Colors } from '../../../constants/Colors'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import ThemedCard from '../../../components/ThemedCard'
import ThemedButton from '../../../components/ThemedButton'
import ThemedLoader from '../../../components/ThemedLoader'
import Spacer from '../../../components/Spacer'

const DATABASE_ID = "69051e15000f0c86fdb1"
const VETS_TABLE_ID = "vets"

const VaccinationDetails = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const router = useRouter()
    const { vaccinationId: vaccinationId } = useLocalSearchParams()
    const { petId: petId } = useLocalSearchParams()
    const { vaccinations } = useVaccinations()
    const [vaccination, setVaccination] = useState(null)
    const [vetInfo, setVetInfo] = useState(null)

    useEffect(() => {
        if (vaccinationId && vaccinations.length > 0) {
            const found = vaccinations.find(r => r.$id === vaccinationId)
            setVaccination(found)
        }
    }, [vaccinationId, vaccinations])

    useEffect(() => {
        async function fetchVetInfo() {
            if (vaccination?.vetId) {
                try {
                    const vetData = await databases.getDocument(
                        DATABASE_ID,
                        VETS_TABLE_ID,
                        vaccination.vetId
                    )
                    setVetInfo(vetData)
                } catch (error) {
                    console.error("Failed to fetch vet info:", error)
                }
            }
        }
        fetchVetInfo()
    }, [vaccination])

    if (!vaccination) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    const isExpired = new Date(vaccination.expiryDate) < new Date()

    return (
        <ThemedView safe={true} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedText title={true} style={styles.heading}>
                    {vaccination.vaccineName}
                </ThemedText>

                <Spacer height={12} />

                <ThemedCard style={[styles.card, isExpired && { borderLeftColor: Colors.warning }]}>

                    <Spacer height={12} />

                    {isExpired && (
                        <>
                            <View style={styles.sectionColumn}>
                                <ThemedText style={[styles.label, { color: Colors.warning }]}>⚠ Expired</ThemedText>
                            </View>
                            <Spacer height={20} />
                        </>
                    )}

                    <View style={styles.sectionColumn}>
                        <ThemedText style={styles.label}>Application Date:</ThemedText>
                        <ThemedText style={styles.value}>
                            {new Date(vaccination.applicationDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </ThemedText>
                    </View>

                    <Spacer height={20} />

                    <View style={styles.sectionColumn}>
                        <ThemedText style={styles.label}>Expiry Date:</ThemedText>
                        <ThemedText style={[styles.value, isExpired && { color: Colors.warning }]}>
                            {new Date(vaccination.expiryDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </ThemedText>
                    </View>

                    <Spacer height={20} />

                    <View style={styles.sectionColumn}>
                        <ThemedText style={styles.label}>Dosage:</ThemedText>
                        <ThemedText style={styles.value}>{vaccination.dosage}</ThemedText>
                    </View>
                    <Spacer height={20} />

                    <View style={styles.sectionColumn}>
                        <ThemedText style={styles.label}>Manufacturer:</ThemedText>
                        <ThemedText style={styles.value}>{vaccination.manufacturer}</ThemedText>
                    </View>
                    <Spacer height={20} />

                    <View style={styles.sectionColumn}>
                        <ThemedText style={styles.label}>Batch Number:</ThemedText>
                        <ThemedText style={styles.value}>{vaccination.batchNumber}</ThemedText>
                    </View>
                    <Spacer height={20} />

                    {vetInfo && (
                        <>
                            <View style={styles.sectionColumn}>
                                <ThemedText style={styles.label}>Veterinarian:</ThemedText>
                                <ThemedText style={styles.value}>
                                    {vetInfo.firstName} {vetInfo.lastName}
                                </ThemedText>
                                
                                <ThemedText style={[styles.value, { fontSize: 14, opacity: 0.7 }]}>
                                   Licence Nr. {vetInfo.licenseNumber}
                                </ThemedText>
                                
                                {vetInfo.phoneNumber && (
                                    <ThemedText style={[styles.value, { fontSize: 14, opacity: 0.7 }]}>
                                        Phone Nr. {vetInfo.phoneNumber}
                                    </ThemedText>
                                )}
                            </View>
                            <Spacer height={20} />
                        </>
                    )}

                    {vaccination.notes && (
                        <>
                            <View style={styles.sectionColumn}>
                                <ThemedText style={styles.label}>Notes:</ThemedText>
                                <ThemedText style={styles.valueMultiline}>{vaccination.notes}</ThemedText>
                            </View>
                            <Spacer height={12} />
                        </>
                    )}

                </ThemedCard>

                <Spacer height={12}/>

                <ThemedButton
                    onPress={() => router.push({ pathname: `/pets/vaccination`, params: { petId: petId } })}
                    style={styles.backButton}
                >
                    <Text style={{ color: theme.button }}>Back</Text>
                </ThemedButton>

                <Spacer />
            </ScrollView>
        </ThemedView>
    )
}

export default VaccinationDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 20,
        color: Colors.primary,
    },
    card: {
        width: '90%',
        marginHorizontal: '5%',
        padding: 20,
        borderRadius: 12,
        borderLeftColor: Colors.primary,
        borderLeftWidth: 4,
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionColumn: {
        flexDirection: 'column',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.8,
        color: Colors.primary,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 6,
    },
    valueMultiline: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 6,
        flexWrap: 'wrap',
    },
    backButton: {
        marginTop: 20,
        backgroundColor: Colors.warning,
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
    }
})
