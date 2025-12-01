import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMedicalRecord } from '../../../hooks/useMedicalRecord'
import { Colors } from '../../../constants/Colors'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import ThemedCard from '../../../components/ThemedCard'
import ThemedButton from '../../../components/ThemedButton'
import ThemedLoader from '../../../components/ThemedLoader'
import Spacer from '../../../components/Spacer'

const MedicalRecordDetails = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const router = useRouter()
    const { recordId: recordId} = useLocalSearchParams()
    const {petId: petId} = useLocalSearchParams()
    const { medicalRecords } = useMedicalRecord()
    const [record, setRecord] = useState(null)

    useEffect(() => {
        if (recordId && medicalRecords.length > 0) {
            const found = medicalRecords.find(r => r.$id === recordId)
            setRecord(found)
        }
    }, [recordId, medicalRecords])

    if (!record) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <ThemedLoader />
            </ThemedView>
        )
    }

    return (
        <ThemedView safe={true} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedText title={true} style={styles.heading}>
                    {record.title}
                </ThemedText>

                <Spacer height={12} />

                <ThemedCard style={styles.card}>

                    <Spacer height={12} />

                    <View style={styles.sectionColumn}>
                        <ThemedText style={styles.label}>Visit Date:</ThemedText>
                        <ThemedText style={styles.value}>
                            {new Date(record.visitDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </ThemedText>
                    </View>

                    <Spacer height={20} />

                    <View style={styles.sectionColumn}>
                        <ThemedText style={styles.label}>Diagnosis:</ThemedText>
                        <ThemedText style={styles.valueMultiline}>{record.diagnosis}</ThemedText>
                    </View>
                    <Spacer height={20} />


                    <View style={styles.sectionColumn}>
                        <ThemedText style={styles.label}>Treatment:</ThemedText>
                        <ThemedText style={styles.valueMultiline}>{record.treatment}</ThemedText>
                    </View>
                    <Spacer height={20} />

                    {record.notes && (
                        <>
                            <View style={styles.sectionColumn}>
                                <ThemedText style={styles.label}>Notes:</ThemedText>
                                <ThemedText style={styles.valueMultiline}>{record.notes}</ThemedText>
                            </View>
                            <Spacer height={20} />
                        </>
                    )}

                    {record.nextAppointment && (
                        <>
                            <View style={styles.sectionColumn}>
                                <ThemedText style={styles.label}>Next Appointment:</ThemedText>
                                <ThemedText style={[styles.value, { color: Colors.primary }]}>
                                    {new Date(record.nextAppointment).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </ThemedText>
                            </View>
                            <Spacer height={12} />
                        </>
                    )}

                </ThemedCard>

                <Spacer height={12}/>

                <ThemedButton
                    onPress={() => router.push({ pathname: `/pets/medicalRecord`, params: { petId: petId } })}
                    style={styles.backButton}
                >
                    <Text style={{ color: theme.button }}>Back</Text>
                </ThemedButton>

                <Spacer />
            </ScrollView>
        </ThemedView>
    )
}

export default MedicalRecordDetails

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
        fontWeight: '400',
        marginTop: 8,
    },
    valueMultiline: {
        fontSize: 16,
        fontWeight: '400',
        marginTop: 8,
        lineHeight: 22,
    },
    backButton: {
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: Colors.warning,
    },
})