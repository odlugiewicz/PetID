import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Pressable, View, useColorScheme } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ID, Permission, Role } from 'react-native-appwrite'
import { useMedicalRecord } from '../../../hooks/useMedicalRecord'
import { useVet } from '../../../hooks/useVets'
import { usePets } from '../../../hooks/usePets'
import { useUser } from '../../../hooks/useUser'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { databases } from '../../../lib/appwrite'

import ThemedView from "../../../components/ThemedView"
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedButton from '../../../components/ThemedButton'
import Spacer from '../../../components/Spacer'
import ThemedScroll from '../../../components/ThemedScroll'


const AddMedicalRecord = () => {
    const colorScheme = useColorScheme()
    const router = useRouter()

    const theme = Colors[colorScheme] ?? Colors.light
    const { addMedicalRecord } = useMedicalRecord()
    const { vetData, fetchVetData } = useVet()
    const { fetchPetById } = usePets()
    const { user } = useUser()
    const { patient: petId } = useLocalSearchParams()


    const [title, setTitle] = useState("")

    const [visitDate, setVisitDate] = useState(() => new Date())
    const [visitDateString, setVisitDateString] = useState(() => {
        const d = new Date()
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    })
    const [diagnosis, setDiagnosis] = useState("")
    const [treatment, setTreatment] = useState("")
    const [notes, setNotes] = useState("")
    const [nextAppointmentTitle, setNextAppointmentTitle] = useState("")
    const [hasNextAppointment, setHasNextAppointment] = useState(false)
    const [nextAppointmentDate, setNextAppointmentDate] = useState(null)
    const [nextAppointmentDateString, setNextAppointmentDateString] = useState("")
    const [nextAppointmentTime, setNextAppointmentTime] = useState(null)
    const [nextAppointmentTimeString, setNextAppointmentTimeString] = useState("")
    const [petOwnerId, setPetOwnerId] = useState(null)
    const [petName, setPetName] = useState("")

    const [isVisitDatePickerVisible, setVisitDatePickerVisibility] = useState(false)
    const [isNextAppointmentPickerVisible, setNextAppointmentPickerVisibility] = useState(false)
    const [isNextAppointmentTimePickerVisible, setNextAppointmentTimePickerVisibility] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadPet = async () => {
            if (!petId) return
            try {
                const pet = await fetchPetById(petId)
                if (pet) {
                    setPetOwnerId(pet.userId)
                    setPetName(pet.name)
                }
            } catch (error) {
                console.log("Failed to load pet for calendar event:", error)
            }
        }

        loadPet()
    }, [petId, fetchPetById])

    const createCalendarEvent = async ({ targetUserId, title, description, whenISO, timeLabel }) => {
        if (!targetUserId || !whenISO) return null

        try {
            return await databases.createDocument(
                "69051e15000f0c86fdb1",
                "events",
                ID.unique(),
                {
                    userId: targetUserId,
                    title,
                    description: description || null,
                    eventDate: whenISO,
                    eventTime: timeLabel || null,
                },
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any()),
                ]
            )
        } catch (error) {
            console.log("Failed to add calendar event:", error)
            return null
        }
    }

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
        setNextAppointmentDateString(formattedDate)
        setNextAppointmentDate(date)
        hideNextAppointmentPicker()
    }

    const showNextAppointmentTimePicker = () => {
        setNextAppointmentTimePickerVisibility(true)
    }

    const hideNextAppointmentTimePicker = () => {
        setNextAppointmentTimePickerVisibility(false)
    }

    const handleNextAppointmentTimeConfirm = (date) => {
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        })
        setNextAppointmentTimeString(formattedTime)
        setNextAppointmentTime(date)
        hideNextAppointmentTimePicker()
    }

    const handleSubmit = async () => {
        if (!petId || !vetData?.$id) {
            console.log("Missing petId or vetId")
            return
        }
        if (!title.trim() || !visitDate || !visitDateString.trim() || !diagnosis.trim() || !treatment.trim()) {
            alert("Please fill in all required fields")
            return
        }

        if (hasNextAppointment && (!nextAppointmentDate || !nextAppointmentTime || !nextAppointmentTitle.trim())) {
            alert("Please add a title, date, and time for the next appointment")
            return
        }

        setLoading(true)

        try {
            let nextAppointmentISO = null
            if (hasNextAppointment && nextAppointmentDate) {
                const combined = new Date(nextAppointmentDate)
                if (nextAppointmentTime) {
                    combined.setHours(nextAppointmentTime.getHours(), nextAppointmentTime.getMinutes(), 0, 0)
                }
                nextAppointmentISO = combined.toISOString()
            }

            await addMedicalRecord({
                title: title.trim() || "General Checkup",
                visitDate: (visitDate ?? new Date()).toISOString(),
                diagnosis: diagnosis.trim(),
                treatment: treatment.trim(),
                notes: notes.trim() || null,
                nextAppointment: nextAppointmentISO,
                nextAppointmentTitle: hasNextAppointment ? nextAppointmentTitle.trim() : null,
                vetId: vetData.$id,
                petId: petId
            })

            if (hasNextAppointment && nextAppointmentISO) {
                const eventTitle = nextAppointmentTitle.trim() || "Next appointment"
                const description = petName ? `Pet: ${petName}` : null
                const timeLabel = nextAppointmentTimeString || null

                const calendarEvents = []
                
                if (user?.$id) {
                    calendarEvents.push(
                        createCalendarEvent({
                            targetUserId: user.$id,
                            title: eventTitle,
                            description,
                            whenISO: nextAppointmentISO,
                            timeLabel,
                        })
                    )
                }
                console.log("petOwnerId before creating event:", petOwnerId)
                if (petOwnerId) {
                    calendarEvents.push(
                        createCalendarEvent({
                            targetUserId: petOwnerId,
                            title: eventTitle,
                            description,
                            whenISO: nextAppointmentISO,
                            timeLabel,
                        })
                    )
                }

                if (calendarEvents.length > 0) {
                    await Promise.allSettled(calendarEvents)
                }
            }

            setTitle("")
            const now = new Date()
            setVisitDate(now)
            setVisitDateString(now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }))
            setDiagnosis("")
            setTreatment("")
            setNotes("")
            setNextAppointmentTitle("")
            setHasNextAppointment(false)
            setNextAppointmentDate(null)
            setNextAppointmentDateString("")
            setNextAppointmentTime(null)
            setNextAppointmentTimeString("")

            router.push({ pathname: `/patients/medicalRecordVet`, params: { petId: petId } })
        } catch (error) {
            console.log("Submitting add medical record form:", error)
            alert("Failed to add medical record")
        }

        setLoading(false)
    }

    const handleCancel = () => {
        setLoading(true)
        try {
            setTitle("")
            setVisitDate(null)
            setVisitDateString("")
            setDiagnosis("")
            setTreatment("")
            setNotes("")
            setNextAppointmentTitle("")
            setHasNextAppointment(false)
            setNextAppointmentDate(null)
            setNextAppointmentDateString("")
            setNextAppointmentTime(null)
            setNextAppointmentTimeString("")
            router.push({ pathname: `/patients/medicalRecordVet`, params: { petId: petId } })
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

                <ThemedText style={styles.label}>Title</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <Spacer />

                <ThemedText style={styles.label}>Visit Date</ThemedText>
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
                    style={styles.multiline}
                    placeholder="Diagnosis"
                    value={diagnosis}
                    onChangeText={setDiagnosis}
                    maxLength={255}
                    multiline
                    numberOfLines={4}
                    blurOnSubmit={false}
                    textAlignVertical="top"
                />
                <Spacer />

                <ThemedText style={styles.label}>Treatment</ThemedText>
                <ThemedTextInput
                    style={styles.multiline}
                    placeholder="Treatment"
                    value={treatment}
                    onChangeText={setTreatment}
                    maxLength={255}
                    multiline
                    numberOfLines={4}
                    blurOnSubmit={false}
                    textAlignVertical="top"
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
                    numberOfLines={6}
                    blurOnSubmit={false}
                    textAlignVertical="top"
                />
                <Spacer />

                <View style={styles.nextHeader}>
                    <Pressable
                        style={styles.checkboxRow}
                        onPress={() => {
                            const nextValue = !hasNextAppointment
                            setHasNextAppointment(nextValue)
                            if (!nextValue) {
                                setNextAppointmentTitle("")
                                setNextAppointmentDate(null)
                                setNextAppointmentDateString("")
                                setNextAppointmentTime(null)
                                setNextAppointmentTimeString("")
                            }
                        }}
                    >
                        <Ionicons
                            name={hasNextAppointment ? "checkbox" : "square-outline"}
                            size={22}
                            color={hasNextAppointment ? Colors.primary : theme.text}
                        />
                        <ThemedText style={[styles.label, { marginLeft: 10, color: Colors.primary }]}>Next Appointment</ThemedText>
                    </Pressable>
                </View>

                {hasNextAppointment && (
                    <>
                        <Spacer height={20} />
                        <ThemedText style={styles.label}>Title</ThemedText>
                        <ThemedTextInput
                            style={styles.input}
                            placeholder="Follow-up"
                            value={nextAppointmentTitle}
                            onChangeText={setNextAppointmentTitle}
                        />
                        <Spacer height={20} />

                        <ThemedText style={styles.label}>Date</ThemedText>
                        <ThemedButton
                            style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                            onPress={showNextAppointmentPicker}
                        >
                            <View style={styles.row}>
                                <ThemedText style={{ color: theme.text }}>
                                    {nextAppointmentDateString || "Select Date"}
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
                        />

                        <Spacer height={20} />

                        <ThemedText style={styles.label}>Time</ThemedText>

                        <ThemedButton
                            style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                            onPress={showNextAppointmentTimePicker}
                        >
                            <View style={styles.row}>
                                <ThemedText style={{ color: theme.text }}>
                                    {nextAppointmentTimeString || "Select Time"}
                                </ThemedText>
                                <Ionicons name="chevron-down" size={20} color={theme.text} />
                            </View>
                        </ThemedButton>

                        <DateTimePickerModal
                            isVisible={isNextAppointmentTimePickerVisible}
                            mode="time"
                            onConfirm={handleNextAppointmentTimeConfirm}
                            onCancel={hideNextAppointmentTimePicker}
                            pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                            pickerStyleIOS={{ backgroundColor: theme.navBackground }}
                            textColor={theme.text}
                        />

                        {(nextAppointmentDateString || nextAppointmentTimeString) && (
                            <ThemedButton
                                onPress={() => {
                                    setNextAppointmentTitle("")
                                    setNextAppointmentDate(null)
                                    setNextAppointmentDateString("")
                                    setNextAppointmentTime(null)
                                    setNextAppointmentTimeString("")
                                }}
                                style={[styles.clearButton, { backgroundColor: Colors.warning }]}
                            >
                                <Text style={{ color: '#fff' }}>Clear Next Appointment</Text>
                            </ThemedButton>
                        )}
                    </>
                )}

                <Spacer height={10}/>

                <View style={styles.buttonsRow}>
                    <ThemedButton onPress={handleCancel} disabled={loading} style={[styles.buttonHalf, styles.cancel]}>
                        <Text style={{ color: '#fff' }}>
                            {loading ? "Cancelling..." : "Cancel"}
                        </Text>
                    </ThemedButton>

                    <ThemedButton onPress={handleSubmit} disabled={loading} style={[styles.buttonHalf, styles.add]}>
                        <Text style={{ color: '#fff' }}>
                            {loading ? "Saving..." : "Add Record"}
                        </Text>
                    </ThemedButton>
                </View>

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
    nextHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 40,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        width: '80%',
        marginTop: 20,
    },
    buttonHalf: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    add: {
        backgroundColor: Colors.primary,
    },
    cancel: {
        backgroundColor: Colors.warning,
    },
})