import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, useColorScheme, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { ID, Permission, Role, Query } from 'react-native-appwrite'
import { databases } from '../../../lib/appwrite'
import { useUser } from '../../../hooks/useUser'
import { usePassport } from '../../../contexts/PassportContext'

import ThemedView from "../../../components/ThemedView"
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedButton from '../../../components/ThemedButton'
import Spacer from '../../../components/Spacer'
import ThemedScroll from '../../../components/ThemedScroll'

const DATABASE_ID = "69051e15000f0c86fdb1"
const PASSPORTS_TABLE_ID = "passports"
const PETS_TABLE_ID = "pets"
const VETS_TABLE_ID = "vets"

const AddPassport = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const router = useRouter()
    const { petId } = useLocalSearchParams()
    const { user } = useUser()
    const { createPassport } = usePassport()

    const [passportNumber, setPassportNumber] = useState("")
    const [issueDate, setIssueDate] = useState(new Date())
    const [issueDateString, setIssueDateString] = useState(() => {
        const d = new Date()
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    })
    const [expiryDate, setExpiryDate] = useState(() => {
        const d = new Date()
        d.setFullYear(d.getFullYear() + 3)
        return d
    })
    const [expiryDateString, setExpiryDateString] = useState(() => {
        const d = new Date()
        d.setFullYear(d.getFullYear() + 3)
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    })
    const [issuingCountry, setIssuingCountry] = useState("")
    const [issuingAuthority, setIssuingAuthority] = useState("")

    const [petsName, setPetsName] = useState("")
    const [petsNationality, setPetsNationality] = useState("")
    const [petsBirthDate, setPetsBirthDate] = useState(null)
    const [petsBirthDateString, setPetsBirthDateString] = useState("")
    const [petColor, setPetColor] = useState("")
    const [distinguishingMarks, setDistinguishingMarks] = useState("")

    const [ownerName, setOwnerName] = useState("")
    const [ownerAddress, setOwnerAddress] = useState("")
    const [ownerPhone, setOwnerPhone] = useState("")

    const [rabiesVaccinationDate, setRabiesVaccinationDate] = useState(null)
    const [rabiesVaccinationDateString, setRabiesVaccinationDateString] = useState("")
    const [rabiesVaccineName, setRabiesVaccineName] = useState("")
    const [rabiesBatchNumber, setRabiesBatchNumber] = useState("")

    const [otherPreventiveMeasures, setOtherPreventiveMeasures] = useState("")

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [isPetsBirthDatePickerVisible, setPetsBirthDatePickerVisibility] = useState(false)
    const [isRabiesVacDatePickerVisible, setRabiesVacDatePickerVisibility] = useState(false)
    const [loading, setLoading] = useState(false)

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false)
    }

    const handleDateConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        setIssueDateString(formattedDate)
        setIssueDate(date)
        hideDatePicker()
    }

    const showPetsBirthDatePicker = () => {
        setPetsBirthDatePickerVisibility(true)
    }

    const hidePetsBirthDatePicker = () => {
        setPetsBirthDatePickerVisibility(false)
    }

    const handlePetsBirthDateConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        setPetsBirthDateString(formattedDate)
        setPetsBirthDate(date)
        hidePetsBirthDatePicker()
    }

    const showRabiesVacDatePicker = () => {
        setRabiesVacDatePickerVisibility(true)
    }

    const hideRabiesVacDatePicker = () => {
        setRabiesVacDatePickerVisibility(false)
    }

    const handleRabiesVacDateConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        setRabiesVaccinationDateString(formattedDate)
        setRabiesVaccinationDate(date)
        hideRabiesVacDatePicker()
    }


    const handleSubmit = async () => {
        if (!passportNumber.trim() || !issuingCountry.trim() || !ownerName.trim()) {
            Alert.alert("Error", "Please fill in all required fields")
            return
        }

        const passportData = {
            passportNumber: passportNumber.trim(),
            issueDate: issueDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            issuingCountry: issuingCountry.trim(),
            issuingAuthority: issuingAuthority.trim() || null,
            petsName: petsName.trim() || null,
            petsNationality: petsNationality.trim() || null,
            petsBirthDate: petsBirthDate ? petsBirthDate.toISOString() : null,
            petColor: petColor.trim() || null,
            distinguishingMarks: distinguishingMarks.trim() || null,
            ownerName: ownerName.trim(),
            ownerAddress: ownerAddress.trim() || null,
            ownerPhone: ownerPhone.trim() || null,
            rabiesVaccinationDate: rabiesVaccinationDate ? rabiesVaccinationDate.toISOString() : null,
            rabiesVaccineName: rabiesVaccineName.trim() || null,
            rabiesBatchNumber: rabiesBatchNumber.trim() || null,
            otherPreventiveMeasures: otherPreventiveMeasures.trim() || null,
            pet: petId
        }

        const result = await createPassport(passportData)
        
        if (result) {
            Alert.alert("Success", "Passport created successfully")
            router.replace({ pathname: `/patients/[patient]`, params: { patient: petId } })
        }
    }

    const handleCancel = () => {
        router.replace({ pathname: `/patients/[patient]`, params: { patient: petId } })
    }

    useEffect(() => {
        const generatePassportNumber = () => {
            const randomNumber = Math.floor(1000000 + Math.random() * 9000000)
            return randomNumber.toString()
        }

        setPassportNumber(generatePassportNumber())

        const expiry = new Date(issueDate)
        expiry.setFullYear(expiry.getFullYear() + 3)
        setExpiryDate(expiry)
        setExpiryDateString(expiry.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }))
    }, [])

    useEffect(() => {
        const fetchPetData = async () => {
            if (!petId) return

            try {
                const petDoc = await databases.getDocument(
                    DATABASE_ID,
                    PETS_TABLE_ID,
                    petId
                )

                if (petDoc.name) {
                    setPetsName(petDoc.name)
                }

                if (petDoc.birthDate) {
                    const birthDate = new Date(petDoc.birthDate)
                    setPetsBirthDate(birthDate)
                    setPetsBirthDateString(birthDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }))
                }

                if (petDoc.color) {
                    setPetColor(petDoc.color)
                }

                if (petDoc.ownerId) {
                    const ownerId = typeof petDoc.ownerId === 'string' ? petDoc.ownerId : petDoc.ownerId.$id

                    try {
                        const ownerDocs = await databases.listDocuments(
                            DATABASE_ID,
                            'pet_owners',
                            [
                                Query.equal('$id', ownerId)
                            ]
                        )

                        if (ownerDocs.documents.length > 0) {
                            const ownerDoc = ownerDocs.documents[0]
                            
                            if (ownerDoc.firstName && ownerDoc.lastName) {
                                setOwnerName(`${ownerDoc.firstName} ${ownerDoc.lastName}`)
                            }

                            if (ownerDoc.phoneNumber) {
                                setOwnerPhone(ownerDoc.phoneNumber)
                            }

                            if (ownerDoc.address) {
                                setOwnerAddress(ownerDoc.address)
                            }
                        }
                    } catch (ownerError) {
                        console.error("Failed to fetch owner data:", ownerError)
                    }
                }

            } catch (error) {
                console.error("Failed to fetch pet data:", error)
            }
        }

        fetchPetData()
    }, [petId])

    useEffect(() => {
        const fetchVetData = async () => {
            if (!user) return

            try {
                const vetDocs = await databases.listDocuments(
                    DATABASE_ID,
                    VETS_TABLE_ID,
                    [
                        Query.equal('userId', user.$id)
                    ]
                )

                if (vetDocs.documents.length > 0) {
                    const vetDoc = vetDocs.documents[0]
                    if (vetDoc.firstName && vetDoc.lastName) {
                        setIssuingAuthority(`${vetDoc.firstName} ${vetDoc.lastName}`)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch vet data:", error)
            }
        }

        fetchVetData()
    }, [user])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedScroll>
                <ThemedText title={true} style={styles.heading} safe={true}>
                    Create Pet Passport
                </ThemedText>
                <Spacer />

                <ThemedText style={[styles.sectionHeader, { color: Colors.primary }]}>
                    Passport Information
                </ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.label}>Passport Number </ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Passport Number"
                    value={passportNumber}
                    onChangeText={setPassportNumber}
                    editable={false}
                />
                <Spacer />

                <ThemedText style={styles.label}>Issue Date </ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showDatePicker}
                    disabled={true}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {issueDateString}
                        </ThemedText>
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                    pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                    pickerStyleIOS={{ backgroundColor: theme.navBackground }}
                    textColor={theme.text}
                />

                <Spacer />

                <ThemedText style={styles.label}>Expiry Date</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    disabled={true}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {expiryDateString}
                        </ThemedText>
                    </View>
                </ThemedButton>

                <Spacer />

                <ThemedText style={styles.label}>Issuing Country </ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Issuing Country"
                    value={issuingCountry}
                    onChangeText={setIssuingCountry}
                />
                <Spacer />

                <ThemedText style={styles.label}>Issuing Authority</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Your Name and Surname"
                    value={issuingAuthority}
                    onChangeText={setIssuingAuthority}
                    editable={false}
                />
                <Spacer height={20} />

                <ThemedText style={[styles.sectionHeader, { color: Colors.primary }]}>
                    Pet Details
                </ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.label}>Pet's Name</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Pet's name on passport"
                    value={petsName}
                    onChangeText={setPetsName}
                />
                <Spacer />

                <ThemedText style={styles.label}>Pet's Nationality</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Pet's nationality"
                    value={petsNationality}
                    onChangeText={setPetsNationality}
                />
                <Spacer />

                <ThemedText style={styles.label}>Pet's Birth Date</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showPetsBirthDatePicker}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {petsBirthDateString || "Select Date"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={isPetsBirthDatePickerVisible}
                    mode="date"
                    onConfirm={handlePetsBirthDateConfirm}
                    onCancel={hidePetsBirthDatePicker}
                    pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                    pickerStyleIOS={{ backgroundColor: theme.navBackground }}
                    textColor={theme.text}
                />

                <Spacer />

                <ThemedText style={styles.label}>Color</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Pet's color"
                    value={petColor}
                    onChangeText={setPetColor}
                />
                <Spacer />

                <ThemedText style={styles.label}>Distinguishing Marks</ThemedText>
                <ThemedTextInput
                    style={styles.multiline}
                    placeholder="Any prominent features or distinguishing marks"
                    value={distinguishingMarks}
                    onChangeText={setDistinguishingMarks}
                    multiline
                    numberOfLines={4}
                    blurOnSubmit={false}
                    textAlignVertical="top"
                />
                <Spacer height={20} />

                <ThemedText style={[styles.sectionHeader, { color: Colors.primary }]}>
                    Owner Information
                </ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.label}>Owner Name *</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Owner Name"
                    value={ownerName}
                    onChangeText={setOwnerName}
                />
                <Spacer />

                <ThemedText style={styles.label}>Owner Address</ThemedText>
                <ThemedTextInput
                    style={styles.multiline}
                    placeholder="Owner Address"
                    value={ownerAddress}
                    onChangeText={setOwnerAddress}
                    multiline
                    numberOfLines={3}
                    blurOnSubmit={false}
                    textAlignVertical="top"
                />
                <Spacer />

                <ThemedText style={styles.label}>Owner Phone</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Owner Phone"
                    value={ownerPhone}
                    onChangeText={setOwnerPhone}
                    keyboardType="phone-pad"
                />
                <Spacer />

                <ThemedText style={[styles.sectionHeader, { color: Colors.primary }]}>
                    Rabies Vaccination
                </ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.label}>Vaccination Date</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showRabiesVacDatePicker}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {rabiesVaccinationDateString || "Select Date"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={isRabiesVacDatePickerVisible}
                    mode="date"
                    onConfirm={handleRabiesVacDateConfirm}
                    onCancel={hideRabiesVacDatePicker}
                    pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                    pickerStyleIOS={{ backgroundColor: theme.navBackground }}
                    textColor={theme.text}
                />

                <Spacer />

                <ThemedText style={styles.label}>Vaccine Name</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Rabies vaccine name"
                    value={rabiesVaccineName}
                    onChangeText={setRabiesVaccineName}
                />
                <Spacer />

                <ThemedText style={styles.label}>Batch Number</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Vaccine batch number"
                    value={rabiesBatchNumber}
                    onChangeText={setRabiesBatchNumber}
                />
                <Spacer height={20} />

                {/* Other Preventive Measures */}
                <ThemedText style={[styles.sectionHeader, { color: Colors.primary }]}>
                    Other Preventive Health Measures
                </ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.label}>Preventive Measures</ThemedText>
                <ThemedTextInput
                    style={styles.multiline}
                    placeholder="Details regarding preventive measures for diseases or infections other than rabies"
                    value={otherPreventiveMeasures}
                    onChangeText={setOtherPreventiveMeasures}
                    multiline
                    numberOfLines={6}
                    blurOnSubmit={false}
                    textAlignVertical="top"
                />
                <Spacer />

                <View style={styles.buttonRow}>
                    <ThemedButton
                        onPress={handleSubmit}
                        disabled={loading}
                        style={[styles.actionButton, { backgroundColor: Colors.primary }]}
                    >
                        <Text style={{ color: '#fff' }}>
                            {loading ? "Creating..." : "Create Passport"}
                        </Text>
                    </ThemedButton>

                    <ThemedButton
                        onPress={handleCancel}
                        disabled={loading}
                        style={[styles.actionButton, { backgroundColor: Colors.warning }]}
                    >
                        <Text style={{ color: '#fff' }}>
                            Cancel
                        </Text>
                    </ThemedButton>
                </View>

                <Spacer />
            </ThemedScroll>
        </TouchableWithoutFeedback>
    )
}

export default AddPassport

const styles = StyleSheet.create({
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 40,
    },
    label: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 40,
        fontSize: 16,
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
        minHeight: 80,
        alignSelf: 'stretch',
        marginHorizontal: 40,
        marginTop: 10,
    },
    picker: {
        padding: 20,
        borderRadius: 6,
        alignSelf: 'stretch',
        marginHorizontal: 40,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20,
    },
    actionButton: {
        width: '40%',
        alignItems: 'center',
    },
})