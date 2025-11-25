import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import ThemedButton from '../../../components/ThemedButton'
import ThemedCard from '../../../components/ThemedCard'
import Spacer from '../../../components/Spacer'
import { Colors } from '../../../constants/Colors'
import { TextInput } from 'react-native'
import { useMedicalRecords } from '../../../hooks/useMedicalRecords'

const AddRecord = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  const router = useRouter()
  const { patientId } = useLocalSearchParams()
  const { addMedicalRecord } = useMedicalRecords()

  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    notes: '',
    nextAppointment: '',
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.visitDate || !formData.diagnosis || !formData.treatment) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await addMedicalRecord(patientId, formData)
      alert('Medical record added successfully')
      router.back()
    } catch (error) {
      alert('Error adding medical record')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView safe={true} style={styles.container}>
        <ThemedText title={true} style={styles.heading}>
          Add Medical Record
        </ThemedText>

        <Spacer />

        {/* Visit Date */}
        <ThemedCard style={styles.card}>
          <ThemedText style={styles.label}>Visit Date *</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.tabIconDefault}
            value={formData.visitDate}
            onChangeText={(value) => handleInputChange('visitDate', value)}
          />
        </ThemedCard>

        {/* Diagnosis */}
        <ThemedCard style={styles.card}>
          <ThemedText style={styles.label}>Diagnosis *</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Enter diagnosis"
            placeholderTextColor={theme.tabIconDefault}
            multiline
            numberOfLines={3}
            value={formData.diagnosis}
            onChangeText={(value) => handleInputChange('diagnosis', value)}
          />
        </ThemedCard>

        {/* Treatment */}
        <ThemedCard style={styles.card}>
          <ThemedText style={styles.label}>Treatment *</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Enter treatment details"
            placeholderTextColor={theme.tabIconDefault}
            multiline
            numberOfLines={3}
            value={formData.treatment}
            onChangeText={(value) => handleInputChange('treatment', value)}
          />
        </ThemedCard>

        {/* Notes */}
        <ThemedCard style={styles.card}>
          <ThemedText style={styles.label}>Notes</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Additional notes (optional)"
            placeholderTextColor={theme.tabIconDefault}
            multiline
            numberOfLines={4}
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
          />
        </ThemedCard>

        {/* Next Appointment */}
        <ThemedCard style={styles.card}>
          <ThemedText style={styles.label}>Next Appointment</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="YYYY-MM-DD (optional)"
            placeholderTextColor={theme.tabIconDefault}
            value={formData.nextAppointment}
            onChangeText={(value) => handleInputChange('nextAppointment', value)}
          />
        </ThemedCard>

        <Spacer />

        {/* Submit Button */}
        <ThemedButton
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
        >
          <Text style={{ color: theme.buttonText, fontWeight: 'bold' }}>
            {loading ? 'Saving...' : 'Save Medical Record'}
          </Text>
        </ThemedButton>

        {/* Cancel Button */}
        <ThemedButton
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={{ color: theme.buttonText }}>Cancel</Text>
        </ThemedButton>

        <Spacer />
      </ThemedView>
    </ScrollView>
  )
}

export default AddRecord

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
    color: Colors.primary,
  },
  card: {
    marginVertical: 10,
    padding: 15,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    marginVertical: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.warning,
    marginVertical: 10,
    alignItems: 'center',
  },
})