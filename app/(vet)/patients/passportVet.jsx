import { StyleSheet, TouchableWithoutFeedback, ScrollView, View, useColorScheme, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { usePets } from '../../../hooks/usePets'
import { usePassport } from '../../../contexts/PassportContext'
import { useEffect, useState } from 'react'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

import Spacer from "../../../components/Spacer"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import ThemedButton from '../../../components/ThemedButton'
import ThemedCard from '../../../components/ThemedCard'
import ThemedLoader from '../../../components/ThemedLoader'

const PassportVet = () => {
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const [pet, setPet] = useState(null)
    const [passport, setPassport] = useState(null)
    const [loading, setLoading] = useState(true)
    const { petId: idParam } = useLocalSearchParams()
    const { fetchPetById } = usePets()
    const { fetchPassportByPetId } = usePassport()

    useEffect(() => {
        async function loadData() {

            setLoading(true)
            if (idParam) {
                const petData = await fetchPetById(idParam)
                setPet(petData)
                
                if (petData) {
                    const passportData = await fetchPassportByPetId(idParam)
                    setPassport(passportData)
                }
            }
            setLoading(false)
        }

        loadData()

        return () => {
            setPet(null)
            setPassport(null)
        }
    }, [idParam])

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    if (loading || !pet) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    if (!passport) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedCard style={styles.card}>
                    <ThemedText title={true} style={styles.heading}>
                        {pet.name}'s Passport
                    </ThemedText>
                    <Spacer height={20} />
                    <ThemedText style={styles.noPassport}>
                        No passport found for this pet
                    </ThemedText>
                </ThemedCard>

                <ThemedButton 
                    onPress={() => router.push({ pathname: `/patients/[patient]`, params: { patient: pet.$id } })} 
                    style={styles.cancel}
                >
                    <Text style={{ color: theme.button }}>Back</Text>
                </ThemedButton>
            </ThemedView>
        )
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
            <ThemedView style={styles.scrollContainer} safe={true}>
                <ThemedText title={true} style={styles.heading}>
                    {pet.name}'s Passport
                </ThemedText>
                <Spacer />

                <ThemedCard style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Passport Information</ThemedText>
                    <Spacer height={10} />
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Passport Number:</ThemedText>
                        <ThemedText style={styles.value}>{passport.passportNumber || 'N/A'}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Issue Date:</ThemedText>
                        <ThemedText style={styles.value}>{formatDate(passport.issueDate)}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Expiry Date:</ThemedText>
                        <ThemedText style={styles.value}>{formatDate(passport.expiryDate)}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Issuing Country:</ThemedText>
                        <ThemedText style={styles.value}>{passport.issuingCountry || 'N/A'}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Issuing Authority:</ThemedText>
                        <ThemedText style={styles.value}>{passport.issuingAuthority || 'N/A'}</ThemedText>
                    </View>
                </ThemedCard>

                <ThemedCard style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Pet Details</ThemedText>
                    <Spacer height={10} />
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Pet's Name:</ThemedText>
                        <ThemedText style={styles.value}>{passport.petsName || 'N/A'}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Nationality:</ThemedText>
                        <ThemedText style={styles.value}>{passport.petsNationality || 'N/A'}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Birth Date:</ThemedText>
                        <ThemedText style={styles.value}>{formatDate(passport.petsBirthDate)}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Color:</ThemedText>
                        <ThemedText style={styles.value}>{passport.petColor || 'N/A'}</ThemedText>
                    </View>
                    
                    {passport.distinguishingMarks && (
                        <View style={styles.infoColumn}>
                            <ThemedText style={styles.label}>Distinguishing Marks:</ThemedText>
                            <ThemedText style={styles.valueMultiline}>{passport.distinguishingMarks}</ThemedText>
                        </View>
                    )}
                </ThemedCard>

                <ThemedCard style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Owner Information</ThemedText>
                    <Spacer height={10} />
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Owner Name:</ThemedText>
                        <ThemedText style={styles.value}>{passport.ownerName || 'N/A'}</ThemedText>
                    </View>
                    
                    {passport.ownerAddress && (
                        <View style={styles.infoRow}>
                            <ThemedText style={styles.label}>Address:</ThemedText>
                            <ThemedText style={styles.valueMultiline}>{passport.ownerAddress}</ThemedText>
                        </View>
                    )}
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Phone:</ThemedText>
                        <ThemedText style={styles.value}>{passport.ownerPhone || 'N/A'}</ThemedText>
                    </View>
                </ThemedCard>

                <ThemedCard style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Rabies Vaccination</ThemedText>
                    <Spacer height={10} />
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Vaccination Date:</ThemedText>
                        <ThemedText style={styles.value}>{formatDate(passport.rabiesVaccinationDate)}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Vaccine Name:</ThemedText>
                        <ThemedText style={styles.value}>{passport.rabiesVaccineName || 'N/A'}</ThemedText>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.label}>Batch Number:</ThemedText>
                        <ThemedText style={styles.value}>{passport.rabiesBatchNumber || 'N/A'}</ThemedText>
                    </View>
                </ThemedCard>

                {passport.otherPreventiveMeasures && (
                    <ThemedCard style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Other Preventive Health Measures</ThemedText>
                        <Spacer height={10} />
                        <ThemedText style={styles.valueMultiline}>{passport.otherPreventiveMeasures}</ThemedText>
                    </ThemedCard>
                )}

                <ThemedButton 
                    onPress={() => router.push({ pathname: `/patients/[patient]`, params: { patient: pet.$id } })} 
                    style={styles.backButton}
                >
                    <Text style={{ color: '#fff' }}>Back</Text>
                </ThemedButton>

                <Spacer height={20} />
            </ThemedView>
        </ScrollView>
    )
}

export default PassportVet

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
        marginTop: 20,
        color: Colors.primary,
    },
    noPassport: {
        fontSize: 16,
        textAlign: "center",
        fontStyle: 'italic',
    },
    section: {
        width: "100%",
        marginVertical: 10,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.primary,
        marginBottom: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        paddingVertical: 5,
    },
    infoColumn: {
        marginVertical: 5,
        paddingVertical: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    value: {
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
    },
    valueMultiline: {
        fontSize: 14,
        marginTop: 5,
        lineHeight: 20,
    },
    backButton: {
        marginTop: 20,
        backgroundColor: Colors.primary,
        width: '100%',
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