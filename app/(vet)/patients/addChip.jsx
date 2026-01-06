import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, useColorScheme, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Query } from 'react-native-appwrite'
import { databases } from '../../../lib/appwrite'

import ThemedText from '../../../components/ThemedText'
import ThemedTextInput from '../../../components/ThemedTextInput'
import ThemedButton from '../../../components/ThemedButton'
import ThemedScroll from '../../../components/ThemedScroll'
import Spacer from '../../../components/Spacer'
import { useChips } from '../../../hooks/useChips'

const AddChip = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const router = useRouter()
    const { petId } = useLocalSearchParams()
    const { addChip, loading } = useChips()

    const [chipNumber, setChipNumber] = useState('')
    const [implantDate, setImplantDate] = useState(new Date())
    const [implantDateString, setImplantDateString] = useState(() => new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }))
    const [manufacturer, setManufacturer] = useState('')
    const [implantLocation, setImplantLocation] = useState('')
    const [notes, setNotes] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false)

    const [ownerName, setOwnerName] = useState('')
    const [ownerPhone, setOwnerPhone] = useState('')
    const [ownerAddress, setOwnerAddress] = useState('')

    const [petName, setPetName] = useState('')
    const [petSpecies, setPetSpecies] = useState('')
    const [petBreed, setPetBreed] = useState('')
    const [petBirthDate, setPetBirthDate] = useState(null)

    useEffect(() => {
        const generateChipNumber = () => {
            const random = Math.floor(1e14 + Math.random() * 9e14)
            return random.toString()
        }

        setChipNumber(generateChipNumber())
    }, [])

    useEffect(() => {
        const fetchPetAndOwnerData = async () => {
            if (!petId) return

            try {
                const petDoc = await databases.getDocument(
                    '69051e15000f0c86fdb1',
                    'pets',
                    petId
                )

                if (petDoc.name) setPetName(petDoc.name)
                if (petDoc.species) setPetSpecies(petDoc.species)
                if (petDoc.breed) setPetBreed(petDoc.breed)
                if (petDoc.birthDate) setPetBirthDate(petDoc.birthDate)

                if (petDoc.ownerId) {
                    const ownerId = typeof petDoc.ownerId === 'string' ? petDoc.ownerId : petDoc.ownerId.$id

                    try {
                        const ownerDocs = await databases.listDocuments(
                            '69051e15000f0c86fdb1',
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
                        console.error('Failed to fetch owner data:', ownerError)
                    }
                }

            } catch (error) {
                console.error('Failed to fetch pet data:', error)
            }
        }

        fetchPetAndOwnerData()
    }, [petId])

    const handleConfirmDate = (date) => {
        setImplantDate(date)
        setImplantDateString(date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }))
        setShowDatePicker(false)
    }

    const handleSubmit = async () => {
        if (!petId) {
            Alert.alert('Error', 'Missing pet reference')
            return
        }

        if (!chipNumber.trim() || !implantLocation.trim() || !ownerName.trim() || !ownerPhone.trim() || !ownerAddress.trim() || !petName.trim() || !petSpecies.trim() || !petBreed.trim() || !petBirthDate) {
            Alert.alert('Error', 'Please fill in all required fields')
            return
        }

        try {
            await addChip({
                chipNumber: chipNumber.trim(),
                implantDate: implantDate.toISOString(),
                manufacturer,
                implantLocation: implantLocation.trim(),
                notes,
                petId,
                ownerName: ownerName.trim(),
                ownerPhone: ownerPhone.trim(),
                ownerAddress: ownerAddress.trim(),
                petName: petName.trim(),
                petSpecies: petSpecies.trim(),
                petBreed: petBreed.trim(),
                petBirthDate: petBirthDate,
            })
            Alert.alert('Success', 'Chip information saved')
            router.replace({ pathname: `/patients/[patient]`, params: { patient: petId } })
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to save chip information')
        }
    }

    const handleCancel = () => {
        router.replace({ pathname: `/patients/[patient]`, params: { patient: petId } })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedScroll>
                <ThemedText title={true} style={styles.heading} safe={true}>
                    Add Chip Information
                </ThemedText>
                <Spacer />

                <ThemedText style={[styles.sectionHeader, { color: Colors.primary }]}>
                    Chip Details
                </ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.label}>Chip Number</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="15-digit chip number"
                    value={chipNumber}
                    onChangeText={setChipNumber}
                    keyboardType="numeric"
                    maxLength={15}
                />
                <Spacer />

                <ThemedText style={styles.label}>Implant Date</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {implantDateString}
                        </ThemedText>
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={() => setShowDatePicker(false)}
                    pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                    pickerStyleIOS={{ backgroundColor: theme.navBackground }}
                    textColor={theme.text}
                />
                <Spacer />

                <ThemedText style={styles.label}>Manufacturer</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Manufacturer"
                    value={manufacturer}
                    onChangeText={setManufacturer}
                />
                <Spacer />

                <ThemedText style={styles.label}>Implant Location</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="e.g. Between shoulder blades"
                    value={implantLocation}
                    onChangeText={setImplantLocation}
                />
                <Spacer />

                <ThemedText style={styles.label}>Notes</ThemedText>
                <ThemedTextInput
                    style={styles.multiline}
                    placeholder="Additional notes"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                    blurOnSubmit={false}
                    textAlignVertical="top"
                />
                <Spacer height={20} />

                <ThemedText style={[styles.sectionHeader, { color: Colors.primary }]}>
                    Pet Information
                </ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.label}>Pet Name</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Pet Name"
                    value={petName}
                    onChangeText={setPetName}
                    editable={false}
                />
                <Spacer />

                <ThemedText style={styles.label}>Species</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Species"
                    value={petSpecies}
                    onChangeText={setPetSpecies}
                    editable={false}
                />
                <Spacer />

                <ThemedText style={styles.label}>Breed</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Breed"
                    value={petBreed}
                    onChangeText={setPetBreed}
                    editable={false}
                />
                <Spacer />

                <ThemedText style={styles.label}>Date of Birth</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Date of Birth"
                    value={petBirthDate ? new Date(petBirthDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }) : ''}
                    editable={false}
                />
                <Spacer height={20} />

                <ThemedText style={[styles.sectionHeader, { color: Colors.primary }]}>
                    Owner Information
                </ThemedText>
                <Spacer height={10} />

                <ThemedText style={styles.label}>Owner Name</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Owner Name"
                    value={ownerName}
                    onChangeText={setOwnerName}
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

                <View style={styles.buttonRow}>
                    <ThemedButton
                        onPress={handleSubmit}
                        disabled={loading}
                        style={[styles.actionButton, { backgroundColor: Colors.primary }]}
                    >
                        <Text style={{ color: '#fff' }}>
                            {loading ? 'Saving...' : 'Save'}
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

export default AddChip

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
