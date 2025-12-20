import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, View, useColorScheme } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker"

import ThemedText from "../../../components/ThemedText"
import ThemedTextInput from "../../../components/ThemedTextInput"
import ThemedButton from '../../../components/ThemedButton'
import Spacer from '../../../components/Spacer'
import ThemedScroll from '../../../components/ThemedScroll'
import { useMedicines } from '../../../hooks/useMedicines'
import { useVet } from '../../../hooks/useVets'

const AddMedicine = () => {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const theme = Colors[colorScheme] ?? Colors.light

  const { addMedicine } = useMedicines()
  const { vetData } = useVet()
  const { patient: petId } = useLocalSearchParams()

  const [medicineName, setMedicineName] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [dosage, setDosage] = useState("")

  const [endDate, setEndDate] = useState(null)
  const [endDateString, setEndDateString] = useState("")
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false)
  const [loading, setLoading] = useState(false)

  const showEndDatePicker = () => setEndDatePickerVisibility(true)
  const hideEndDatePicker = () => setEndDatePickerVisibility(false)

  const handleEndDateConfirm = (date) => {
    const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    setEndDateString(formattedDate)
    setEndDate(date)
    hideEndDatePicker()
  }

  const handleSubmit = async () => {
    if (!petId) return
    if (!medicineName.trim() || !dosage.trim() || !endDate || !endDateString.trim()) {
      alert('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      await addMedicine({
        medicineName: medicineName.trim(),
        manufacturer: manufacturer.trim() || null,
        dosage: dosage.trim(),
        endDate: endDate.toISOString(),
        petId,
      })

      setMedicineName("")
      setManufacturer("")
      setDosage("")
      setEndDate(null)
      setEndDateString("")

      router.push({ pathname: `/patients/[patient]`, params: { patient: petId } })
    } catch (error) {
      console.log('Submitting add medicine form:', error)
      alert('Failed to add medicine')
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setMedicineName("")
    setManufacturer("")
    setDosage("")
    setEndDate(null)
    setEndDateString("")
    router.push({ pathname: `/patients/[patient]`, params: { patient: petId } })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedScroll>
        <ThemedText title={true} style={styles.heading} safe={true}>
          Add Medicine
        </ThemedText>
        <Spacer />

        <ThemedText style={styles.label}>Medicine Name</ThemedText>
        <ThemedTextInput style={styles.input} placeholder="Medicine Name" value={medicineName} onChangeText={setMedicineName} />
        <Spacer />

        <ThemedText style={styles.label}>Dosage</ThemedText>
        <ThemedTextInput style={styles.input} placeholder="Dosage (e.g., 1 tablet)" value={dosage} onChangeText={setDosage} />
        <Spacer />

        <ThemedText style={styles.label}>Manufacturer</ThemedText>
        <ThemedTextInput style={styles.input} placeholder="Manufacturer (optional)" value={manufacturer} onChangeText={setManufacturer} />
        <Spacer />

        <ThemedText style={styles.label}>End Date</ThemedText>
        <ThemedButton style={[styles.picker, { backgroundColor: theme.uiBackground }]} onPress={showEndDatePicker}>
          <View style={styles.row}>
            <ThemedText style={{ color: theme.text }}>
              {endDateString || 'Select End Date'}
            </ThemedText>
            <Ionicons name="chevron-down" size={20} color={theme.text} />
          </View>
        </ThemedButton>

        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={hideEndDatePicker}
          pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
          pickerStyleIOS={{ backgroundColor: theme.navBackground }}
          textColor={theme.text}
        />

        <Spacer />

        <ThemedButton onPress={handleSubmit} disabled={loading} style={{ alignSelf: 'center', width: '40%', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>
            {loading ? 'Saving...' : 'Add'}
          </Text>
        </ThemedButton>

        <ThemedButton onPress={handleCancel} disabled={loading} style={styles.cancel}>
          <Text style={{ color: '#fff' }}>
            {loading ? 'Cancelling...' : 'Cancel'}
          </Text>
        </ThemedButton>

        <Spacer />
      </ThemedScroll>
    </TouchableWithoutFeedback>
  )
}

export default AddMedicine

const styles = StyleSheet.create({
  heading: { fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  label: { flex: 1, justifyContent: 'center', marginLeft: 40, fontSize: 18 },
  input: { padding: 20, borderRadius: 6, alignSelf: 'stretch', marginHorizontal: 40, marginTop: 10 },
  picker: { padding: 20, borderRadius: 6, alignSelf: 'stretch', marginHorizontal: 40 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cancel: { marginTop: 40, backgroundColor: Colors.warning, width: '40%', alignSelf: 'center', alignItems: 'center' }
})
