import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Pressable, View, useColorScheme } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useMedicalRecord } from '../../../hooks/useMedicalRecord'
import { useVet } from '../../../hooks/useVets'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker"

import ThemedView from "../../../components/ThemedView"
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedButton from '../../../components/ThemedButton'
import Spacer from '../../../components/Spacer'
import ThemedScroll from '../../../components/ThemedScroll'


const AddMedicalRecord = () => {
    const colorScheme = useColorScheme()
    const router = useRouter()
    const params = useLocalSearchParams()
    
    const petId = params.petId
    const theme = Colors[colorScheme] ?? Colors.light
    const { addMedicalRecord } = useMedicalRecord()
    const { vetData } = useVet()

    const [recordId, setRecordId] = useState("")
    const [visitDate, setVisitDate] = useState(null)
    const [visitDateString, setVisitDateString] = useState("")
    const [diagnosis, setDiagnosis] = useState("")
    const [treatment, setTreatment] = useState("")
    const [notes, setNotes] = useState("")
    const [nextAppointment, setNextAppointment] = useState(null)
    const [nextAppointmentString, setNextAppointmentString] = useState("")

    const [isVisitDatePickerVisible, setVisitDatePickerVisibility] = useState(false)
    const [isNextAppointmentPickerVisible, setNextAppointmentPickerVisibility] = useState(false)
    const [loading, setLoading] = useState(false)

    const showVisitDatePicker = () => {
        setVisitDatePickerVisibility(true)
    }

    const hideVisitDatePicker = () => {
        setVisitDatePickerVisibility(false)
    }

    const handleVisitDateConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        setVisitDateString(formattedDate)
        setVisitDate(date)
        hideVisitDatePicker()
    }

    const showNextAppointmentPicker = () => {
        setNextAppointmentPickerVisibility(true)
    }

    const hideNextAppointmentPicker = () => {
        setNextAppointmentPickerVisibility(false)
    }

    const handleNextAppointmentConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        setNextAppointmentString(formattedDate)
        setNextAppointment(date)
        hideNextAppointmentPicker()
    }

    const handleSubmit = async () => {
        if (!recordId.trim() || !visitDate || !petId || !vetData?.$id) {
            alert("Please fill in all required fields")
            return
        }

        setLoading(true)

        try {
            await addMedicalRecord({
                recordId: parseInt(recordId),
                visitDate: visitDate.toISOString(),
                diagnosis: diagnosis.trim() || null,
                treatment: treatment.trim() || null,
                notes: notes.trim() || null,
                nextAppointment: nextAppointment ? nextAppointment.toISOString() : null,
                vetId: vetData.$id,
                petId: petId
            })

            setRecordId("")
            setVisitDate(null)
            setVisitDateString("")
            setDiagnosis("")
            setTreatment("")
            setNotes("")
            setNextAppointment(null)
            setNextAppointmentString("")

            router.back()
        } catch (error) {
            console.log("Submitting add medical record form:", error)
            alert("Failed to add medical record")
        }

        setLoading(false)
    }

    const handleCancel = () => {
        setLoading(true)
        try {
            setRecordId("")
            setVisitDate(null)
            setVisitDateString("")
            setDiagnosis("")
            setTreatment("")
            setNotes("")
            setNextAppointment(null)
            setNextAppointmentString("")
            router.back()
        } catch (error) {
            console.log("Canceling add medical record form:", error)
        }
        setLoading(false)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedScroll>
                <ThemedText title={true} style={styles.heading} safe={true}>
                    Add Medical Record
                </ThemedText>
                <Spacer />

                <ThemedText style={styles.label}>Record ID *</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Record ID"
                    value={recordId}
                    onChangeText={setRecordId}
                    keyboardType="numeric"
                />
                <Spacer />

                <ThemedText style={styles.label}>Visit Date *</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showVisitDatePicker}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {visitDateString || "Select Visit Date"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={isVisitDatePickerVisible}
                    mode="date"
                    onConfirm={handleVisitDateConfirm}
                    onCancel={hideVisitDatePicker}
                    pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                    pickerStyleIOS={{ backgroundColor: theme.navBackground }}
                    textColor={theme.text}
                    customConfirmButtonIOS={({ onPress }) => (
                        <ThemedButton onPress={onPress} style={{ alignItems: "center", width: '80%', alignSelf: 'center' }}>
                            <ThemedText>Confirm</ThemedText>
                        </ThemedButton>
                    )}
                    customCancelButtonIOS={({ onPress }) => (
                        <ThemedButton onPress={onPress} style={{ alignItems: "center", width: '80%', alignSelf: 'center' }}>
                            <ThemedText>Cancel</ThemedText>
                        </ThemedButton>
                    )}
                />

                <Spacer />

                <ThemedText style={styles.label}>Diagnosis</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Diagnosis"
                    value={diagnosis}
                    onChangeText={setDiagnosis}
                    maxLength={255}
                />
                <Spacer />

                <ThemedText style={styles.label}>Treatment</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Treatment"
                    value={treatment}
                    onChangeText={setTreatment}
                    maxLength={255}
                />
                <Spacer />

                <ThemedText style={styles.label}>Notes</ThemedText>
                <ThemedTextInput
                    style={styles.multiline}
                    placeholder="Additional notes"
                    value={notes}
                    onChangeText={setNotes}
                    maxLength={500}
                    multiline
                    numberOfLines={4}
                />
                <Spacer />

                <ThemedText style={[styles.label, { color: Colors.primary }]}>Next Appointment</ThemedText>
                <Spacer />

                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showNextAppointmentPicker}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {nextAppointmentString || "Select Next Appointment"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={isNextAppointmentPickerVisible}
                    mode="date"
                    onConfirm={handleNextAppointmentConfirm}
                    onCancel={hideNextAppointmentPicker}
                    pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                    pickerStyleIOS={{ backgroundColor: theme.navBackground }}
                    textColor={theme.text}
                    customConfirmButtonIOS={({ onPress }) => (
                        <ThemedButton onPress={onPress} style={{ alignItems: "center", width: '80%', alignSelf: 'center' }}>
                            <ThemedText>Confirm</ThemedText>
                        </ThemedButton>
                    )}
                    customCancelButtonIOS={({ onPress }) => (
                        <ThemedButton onPress={onPress} style={{ alignItems: "center", width: '80%', alignSelf: 'center' }}>
                            <ThemedText>Cancel</ThemedText>
                        </ThemedButton>
                    )}
                />

                {nextAppointmentString && (
                    <ThemedButton
                        onPress={() => {
                            setNextAppointment(null)
                            setNextAppointmentString("")
                        }}
                        style={[styles.clearButton, { backgroundColor: Colors.warning }]}
                    >
                        <Text style={{ color: '#fff' }}>Clear Next Appointment</Text>
                    </ThemedButton>
                )}

                <Spacer />

                <ThemedButton onPress={handleSubmit} disabled={loading} style={{ alignSelf: 'center', width: '40%', alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>
                        {loading ? "Saving..." : "Add Record"}
                    </Text>
                </ThemedButton>

                <ThemedButton onPress={handleCancel} disabled={loading} style={styles.cancel}>
                    <Text style={{ color: '#fff' }}>
                        {loading ? "Cancelling..." : "Cancel"}
                    </Text>
                </ThemedButton>

                <Spacer />
            </ThemedScroll>
        </TouchableWithoutFeedback>
    )
}

export default AddMedicalRecord

const styles = StyleSheet.create({
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
    label: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 40,
        fontSize: 18,
    },
    input: {
        padding: 20,
        borderRadius: 6,
        alignSelf: 'stretch',
        marginHorizontal: 40,
        marginTop: 10,
    },
    multiline: {
        padding: 20,
        borderRadius: 6,
        minHeight: 100,
        alignSelf: 'stretch',
        marginHorizontal: 40,
        marginTop: 10,
    },
    picker: {
        padding: 20,
        borderRadius: 6,
        alignSelf: 'stretch',
        marginHorizontal: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clearButton: {
        marginTop: 10,
        width: '60%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    cancel: {
        marginTop: 40,
        backgroundColor: Colors.warning,
        width: '40%',
        alignSelf: "center",
        alignItems: "center",
    },
})