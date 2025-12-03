import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, useColorScheme, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { ID, Permission, Role } from 'react-native-appwrite'
import { databases } from '../../../lib/appwrite'
import { useUser } from '../../../hooks/useUser'

import ThemedView from "../../../components/ThemedView"
import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedButton from '../../../components/ThemedButton'
import Spacer from '../../../components/Spacer'
import ThemedScroll from '../../../components/ThemedScroll'

const DATABASE_ID = "69051e15000f0c86fdb1"
const PASSPORTS_TABLE_ID = "passports"
const PETS_TABLE_ID = "pets"

const AddPassport = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const router = useRouter()
    const { petId } = useLocalSearchParams()
    const { user } = useUser()

    const [passportNumber, setPassportNumber] = useState("")
    const [issueDate, setIssueDate] = useState(new Date())
    const [issueDateString, setIssueDateString] = useState(() => {
        const d = new Date()
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    })
    const [issuingCountry, setIssuingCountry] = useState("")
    const [issuingAuthority, setIssuingAuthority] = useState("")
    const [ownerName, setOwnerName] = useState("")
    const [ownerAddress, setOwnerAddress] = useState("")
    const [ownerPhone, setOwnerPhone] = useState("")

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
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

    const handleSubmit = async () => {
        if (!passportNumber.trim() || !issuingCountry.trim() || !ownerName.trim()) {
            Alert.alert("Error", "Please fill in all required fields")
            return
        }

        if (!petId || !user) {
            Alert.alert("Error", "Missing pet or user information")
            return
        }

        setLoading(true)

        try {
            const passportDoc = await databases.createDocument(
                DATABASE_ID,
                PASSPORTS_TABLE_ID,
                ID.unique(),
                {
                    passportNumber: passportNumber.trim(),
                    issueDate: issueDate.toISOString(),
                    issuingCountry: issuingCountry.trim(),
                    issuingAuthority: issuingAuthority.trim() || null,
                    ownerName: ownerName.trim(),
                    ownerAddress: ownerAddress.trim() || null,
                    ownerPhone: ownerPhone.trim() || null,
                    petId: petId
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            )

            // Update pet document with passportId
            await databases.updateDocument(
                DATABASE_ID,
                PETS_TABLE_ID,
                petId,
                {
                    passportId: passportDoc.$id
                }
            )

            Alert.alert("Success", "Passport created successfully")
            router.back()
        } catch (error) {
            console.error("Failed to create passport:", error)
            Alert.alert("Error", "Failed to create passport. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setPassportNumber("")
        setIssueDate(new Date())
        setIssueDateString(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }))
        setIssuingCountry("")
        setIssuingAuthority("")
        setOwnerName("")
        setOwnerAddress("")
        setOwnerPhone("")
        router.back()
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedScroll>
                <ThemedText title={true} style={styles.heading} safe={true}>
                    Create Pet Passport
                </ThemedText>
                <Spacer />

                <ThemedText style={styles.label}>Passport Number *</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Passport Number"
                    value={passportNumber}
                    onChangeText={setPassportNumber}
                />
                <Spacer />

                <ThemedText style={styles.label}>Issue Date *</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showDatePicker}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {issueDateString}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
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

                <ThemedText style={styles.label}>Issuing Country *</ThemedText>
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
                    placeholder="Issuing Authority"
                    value={issuingAuthority}
                    onChangeText={setIssuingAuthority}
                />
                <Spacer />

                <ThemedText style={[styles.label, { color: Colors.primary, fontSize: 20 }]}>
                    Owner Information
                </ThemedText>
                <Spacer />

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