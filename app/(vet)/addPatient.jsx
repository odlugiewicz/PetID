import { useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, TextInput, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useVet } from '../../hooks/useVets'
import { Colors } from '../../constants/Colors'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'
import ThemedScroll from '../../components/ThemedScroll'

const AddPatient = () => {
    const router = useRouter()
    const { addPatientByToken } = useVet()
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAddPatient = async () => {
        if (!token.trim()) {
            Alert.alert('Error', 'Please enter a token')
            return
        }

        setLoading(true)
        try {
            await addPatientByToken(token.trim())
            Alert.alert('Success', 'Patient added successfully!')
            setToken('')
            router.back()
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to add patient')
        } finally {
            setLoading(false)
        }
    }

    return (
        <TouchableWithoutFeedback>
            <ThemedScroll safe={true} style={styles.container}>
                <ThemedCard style={styles.card}>
                    <ThemedText style={styles.heading}>Add Patient</ThemedText>

                    <Spacer height={20} />

                    <ThemedText style={styles.label}>Enter Patient Code:</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="00000000"
                        value={token}
                        onChangeText={setToken}
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        maxLength={8}
                    />

                    <Spacer height={20} />

                    <ThemedButton
                        onPress={handleAddPatient}
                        disabled={loading}
                        style={styles.button}
                    >
                        <ThemedText style={styles.buttonText}>
                            {loading ? 'Adding...' : 'Add Patient'}
                        </ThemedText>
                    </ThemedButton>

                    <ThemedButton
                        onPress={() => router.push('/addPatient/qrScanner')}
                        style={[styles.button, { backgroundColor: Colors.secondary }]}
                    >
                        <ThemedText style={styles.buttonText}>
                            Scan QR Code
                        </ThemedText>
                    </ThemedButton>
                </ThemedCard>
            </ThemedScroll>
        </TouchableWithoutFeedback>
    )
}

export default AddPatient

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        margin: 20,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
        fontSize: 16,
    },
    button: {
        marginTop: 15,
        backgroundColor: Colors.primary,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
})