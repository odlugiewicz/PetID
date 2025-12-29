import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Pressable, View, useColorScheme } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { useVaccinations } from '../../../hooks/useVaccinations'
import { useVet } from '../../../hooks/useVets'
import { usePets } from '../../../hooks/usePets'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { databases } from "../../../lib/appwrite"
import { ID, Permission, Role } from "react-native-appwrite"

import ThemedView from "../../../components/ThemedView"
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedButton from '../../../components/ThemedButton'
import Spacer from '../../../components/Spacer'
import ThemedScroll from '../../../components/ThemedScroll'


const AddVaccination = () => {
    const colorScheme = useColorScheme()
    const router = useRouter()

    const theme = Colors[colorScheme] ?? Colors.light
    const { addVaccination } = useVaccinations()
    const { vetData, fetchVetData } = useVet()
    const { fetchPetById } = usePets()
    const { patient: petId } = useLocalSearchParams()


    const [vaccineName, setVaccineName] = useState("")
    const [dosage, setDosage] = useState("")
    const [manufacturer, setManufacturer] = useState("")
    const [batchNumber, setBatchNumber] = useState("")
    const [notes, setNotes] = useState("")
    
    const [applicationDate, setApplicationDate] = useState(() => new Date())
    const [applicationDateString, setApplicationDateString] = useState(() => {
        const d = new Date()
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    })

    const [expiryDate, setExpiryDate] = useState(null)
    const [expiryDateString, setExpiryDateString] = useState("")

    const [isApplicationDatePickerVisible, setApplicationDatePickerVisibility] = useState(false)
    const [isExpiryDatePickerVisible, setExpiryDatePickerVisibility] = useState(false)
    const [loading, setLoading] = useState(false)
    const [petOwnerId, setPetOwnerId] = useState(null)
    const [petName, setPetName] = useState("")

    useEffect(() => {
        const loadPet = async () => {
            if (!petId) return
            try {
                const pet = await fetchPetById(petId)
                if (pet) {
                    setPetOwnerId(pet.userId ?? null)
                    setPetName(pet.name ?? "")
                }
            } catch (error) {
                console.log("Failed to load pet for vaccination event:", error)
            }
        }
        loadPet()
    }, [petId, fetchPetById])

    const ensurePetOwner = async () => {
        if (petOwnerId) return petOwnerId
        if (!petId) return null
        try {
            const pet = await fetchPetById(petId)
            if (pet) {
                setPetOwnerId(pet.userId ?? null)
                setPetName(pet.name ?? "")
                return pet.userId ?? null
            }
        } catch (error) {
            console.log("Failed to ensure pet owner:", error)
        }
        return null
    }

    const createExpiryEventForOwner = async ({ whenISO, timeLabel }) => {
        if (!petOwnerId || !whenISO) return
        try {
            await databases.createDocument(
                "69051e15000f0c86fdb1",
                "events",
                ID.unique(),
                {
                    userId: petOwnerId,
                    title: `Vaccine expires: ${vaccineName.trim() || 'Vaccine'}`,
                    description: petName ? `Pet: ${petName}` : null,
                    eventDate: whenISO,
                    eventTime: timeLabel || null,
                },
            )
        } catch (error) {
            console.log("Failed to add expiry event:", error)
        }
    }

    const showApplicationDatePicker = () => {
        setApplicationDatePickerVisibility(true)
    }

    const hideApplicationDatePicker = () => {
        setApplicationDatePickerVisibility(false)
    }

    const handleApplicationDateConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        setApplicationDateString(formattedDate)
        setApplicationDate(date)
        hideApplicationDatePicker()
    }

    const showExpiryDatePicker = () => {
        setExpiryDatePickerVisibility(true)
    }

    const hideExpiryDatePicker = () => {
        setExpiryDatePickerVisibility(false)
    }

    const handleExpiryDateConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        setExpiryDateString(formattedDate)
        setExpiryDate(date)
        hideExpiryDatePicker()
    }

    const handleSubmit = async () => {
        if (!petId || !vetData?.$id) {
            console.log("Missing petId or vetId")
            return
        }
        if (!vaccineName.trim() || !dosage.trim() || !applicationDate || !applicationDateString.trim() || !expiryDate || !expiryDateString.trim() || !manufacturer.trim() || !batchNumber.trim()) {
            alert("Please fill in all required fields")
            return
        }

        setLoading(true)

        try {
            await addVaccination({
                vaccineName: vaccineName.trim(),
                dosage: dosage.trim(),
                applicationDate: (applicationDate ?? new Date()).toISOString(),
                expiryDate: (expiryDate ?? new Date()).toISOString(),
                manufacturer: manufacturer.trim(),
                batchNumber: batchNumber.trim(),
                petId: petId,
                vetId: vetData.$id,
                notes: notes.trim() || null
            })

            const ownerId = await ensurePetOwner()
            if (ownerId) {
                await createExpiryEventForOwner({
                    whenISO: (expiryDate ?? new Date()).toISOString(),
                    timeLabel: null,
                })
            } else {
                console.log("Skipped expiry event: missing pet owner id")
            }

            setVaccineName("")
            setDosage("")
            setManufacturer("")
            setBatchNumber("")
            setNotes("")
            const now = new Date()
            setApplicationDate(now)
            setApplicationDateString(now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }))
            setExpiryDate(null)
            setExpiryDateString("")

            router.push({ pathname: `/patients/vaccinationVet`, params: { petId: petId } })
        } catch (error) {
            console.log("Submitting add vaccination form:", error)
            alert("Failed to add vaccination")
        }

        setLoading(false)
    }

    const handleCancel = () => {
        setLoading(true)
        try {
            setVaccineName("")
            setDosage("")
            setManufacturer("")
            setBatchNumber("")
            setNotes("")
            setApplicationDate(null)
            setApplicationDateString("")
            setExpiryDate(null)
            setExpiryDateString("")
            router.push({ pathname: `/patients/vaccinationVet`, params: { petId: petId } })
        } catch (error) {
            console.log("Canceling add vaccination form:", error)
        }
        setLoading(false)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedScroll>
                <ThemedText title={true} style={styles.heading} safe={true}>
                    Add Vaccination
                </ThemedText>
                <Spacer height={10}/>

                <ThemedText style={styles.label}>Vaccine Name</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Vaccine Name"
                    value={vaccineName}
                    onChangeText={setVaccineName}
                />
                <Spacer height={10}/>

                <ThemedText style={styles.label}>Dosage</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Dosage (e.g., 0.5 mL)"
                    value={dosage}
                    onChangeText={setDosage}
                />
                <Spacer height={10}/>

                <ThemedText style={styles.label}>Application Date</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showApplicationDatePicker}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {applicationDateString || "Select Application Date"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={isApplicationDatePickerVisible}
                    mode="date"
                    onConfirm={handleApplicationDateConfirm}
                    onCancel={hideApplicationDatePicker}
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

                <Spacer height={10}/>

                <ThemedText style={styles.label}>Expiry Date</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showExpiryDatePicker}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {expiryDateString || "Select Expiry Date"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={isExpiryDatePickerVisible}
                    mode="date"
                    onConfirm={handleExpiryDateConfirm}
                    onCancel={hideExpiryDatePicker}
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

                <Spacer height={10}/>

                <ThemedText style={styles.label}>Manufacturer</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Manufacturer"
                    value={manufacturer}
                    onChangeText={setManufacturer}
                />
                <Spacer height={10}/>

                <ThemedText style={styles.label}>Batch Number</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Batch Number"
                    value={batchNumber}
                    onChangeText={setBatchNumber}
                />
                <Spacer height={10}/>

                <ThemedText style={styles.label}>Notes (Optional)</ThemedText>
                <ThemedTextInput
                    style={styles.multiline}
                    placeholder="Additional notes..."
                    value={notes}
                    onChangeText={setNotes}
                    multiline={true}
                    numberOfLines={4}
                />

                <Spacer height={20}/>

                <View style={styles.buttonContainer}>
                    <ThemedButton
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        disabled={loading}
                    >
                        <Text style={{ color: theme.button, fontWeight: 'bold', }}>Add</Text>
                    </ThemedButton>

                    <ThemedButton
                        onPress={handleCancel}
                        style={styles.cancelButton}
                        disabled={loading}
                    >
                        <Text style={{ color: theme.button, fontWeight: 'bold' }}>Cancel</Text>
                    </ThemedButton>
                </View>

                <Spacer />
            </ThemedScroll>
        </TouchableWithoutFeedback>
    )
}

export default AddVaccination

const styles = StyleSheet.create({
    heading: {
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
        marginTop: 40,
        color: Colors.primary,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginHorizontal: "5%",
        color: Colors.primary,
        marginTop: 10,
    },
    input: {
        marginHorizontal: "5%",
        width: "90%",
    },
    multiline: {
        marginHorizontal: "5%",
        width: "90%",
        textAlignVertical: 'top',
    },
    picker: {
        marginHorizontal: "5%",
        width: "90%",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: '5%',
        gap: 10,
    },
    submitButton: {
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.warning,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
})
