import { StyleSheet, Text, useColorScheme, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useVet } from '../../../hooks/useVets'
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
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const [patient, setPatient] = useState(null)

    const { patientId: patientId } = useLocalSearchParams()
    const { patients } = useVet()
    const router = useRouter()

    useEffect(() => {
        if (patients && patientId) {
            const foundPatient = patients.find(p => p.$id === patientId)
            setPatient(foundPatient)
        }
    }, [patientId, patients])

    if (!patient) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    return (
        <ThemedScroll safe={true} style={styles.container}>
            <ThemedCard style={styles.card}>
                <ThemedText style={styles.header}>{patient.name}</ThemedText>

                <ThemedText style={styles.title}>Species:</ThemedText>
                <ThemedText style={styles.text}>{patient.species}</ThemedText>

                <Spacer height={20} />

                <ThemedText style={styles.title}>Breed:</ThemedText>
                <ThemedText style={styles.text}>{patient.breed}</ThemedText>

                <Spacer height={20} />

                <ThemedText style={styles.title}>Date of Birth:</ThemedText>
                <ThemedText style={styles.text}>{formatDateToDDMMYYYY(patient.birthDate)}</ThemedText>

                <Spacer height={20} />

                <ThemedText style={styles.title}>Owner:</ThemedText>
                <ThemedText style={styles.text}>{patient.ownerName}</ThemedText>

                <Spacer height={20} />

                {patient.passportId && (
                    <ThemedView style={{ backgroundColor: null }}>
                        <Spacer height={20} />
                        <ThemedText style={styles.title}>
                            Passport Number:
                        </ThemedText>
                        <ThemedText style={styles.text}>
                            {patient.passportId}
                        </ThemedText>
                    </ThemedView>
                )}

                {patient.chipId && (
                    <ThemedView style={{ backgroundColor: null }}>
                        <Spacer height={20} />
                        <ThemedText style={styles.title}>
                            Chip Number:
                        </ThemedText>
                        <ThemedText style={styles.text}>
                            {patient.chipId}
                        </ThemedText>
                    </ThemedView>
                )}

                {patient.medicalRecordId && (
                    <ThemedView style={{ backgroundColor: null }}>
                        <Spacer height={20} />
                        <ThemedText style={styles.title}>
                            Medical Record ID:
                        </ThemedText>
                        <ThemedText style={styles.text}>
                            {patient.medicalRecordId}
                        </ThemedText>
                    </ThemedView>
                )}

            </ThemedCard>

            <ThemedButton onPress={() => router.push({
                pathname: '/patients/medicalRecords',
                params: { patientId: patient.$id }
            })} style={[styles.options, { backgroundColor: theme.uiBackground }]} >
                <ThemedText style={{ fontSize: 20 }}>
                    Medical Records
                </ThemedText>
                <Ionicons name="chevron-forward-outline" size={20} color={theme.text} />
            </ThemedButton>

            <ThemedButton onPress={() => router.push('/patients')} style={styles.button}>
                <Text style={{ color: theme.buttonText }}>
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
    button: {
        marginTop: 20,
        backgroundColor: Colors.primary,
        width: '50%',
        alignSelf: "center",
        alignItems: 'center',
        marginBottom: 20,
    }
})