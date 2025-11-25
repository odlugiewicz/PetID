import { StyleSheet, TouchableWithoutFeedback, FlatList, Pressable, Image, View, useColorScheme, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useVet } from '../../../hooks/useVets'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons';

import Spacer from "../../../components/Spacer"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import ThemedButton from '../../../components/ThemedButton'
import ThemedCard from '../../../components/ThemedCard'
import ThemedLoader from '../../../components/ThemedLoader'


const MedicalRecords = () => {
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
        <TouchableWithoutFeedback>
            <ThemedView style={styles.container} safe={true}>

                <ThemedText title={true} style={styles.heading}>
                    {patient.name} Medical Records
                </ThemedText>

                <Spacer />

                <FlatList />

                <ThemedButton onPress={() => router.push('/patients/addRecord', { patientId: patient.$id })} style={styles.button}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="add" size={20} color={theme.buttonText} style={{ marginRight: 6 }} />
                        <Text style={{ color: theme.buttonText }}>Add Medical Record</Text>
                    </View>
                </ThemedButton>

                <ThemedButton onPress={() => router.push('/patients/[patient]', { patientId: patient.$id })} style={styles.cancel}>
                    <Text style={{ color: theme.buttonText }}>
                        Cancel
                    </Text>
                </ThemedButton>

            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default MedicalRecords

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