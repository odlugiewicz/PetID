import { StyleSheet, Text, Image, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { useState } from 'react'
import { useUser } from '../../hooks/useUser'

import Logo from '../../assets/img/logo_blue.png'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedCard from '../../components/ThemedCard'
import ThemedScroll from '../../components/ThemedScroll'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [licenseNumber, setLicenseNumber] = useState('')
    const [error, setError] = useState(null)
    const [isVet, setIsVet] = useState(false)

    const { register } = useUser()
    const router = useRouter()

    const handleSubmit = async () => {
        setError(null)

        try {
            console.log(`Rejestracja jako ${isVet ? 'weterynarz' : 'właściciel zwierzęcia'}`);
            await register(email, password, name, phone, isVet, licenseNumber)
            
            if (isVet) {
                router.replace('/(vet)/patients')
            } else {
                router.replace('/(dashboard)/pets')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedScroll style={styles.container} contentContainerStyle={styles.contentContainer}>

                <Image source={Logo} style={styles.logo}/>
                <Spacer height={10} />

                    <ThemedView style={styles.switchContainer}>
                        <Pressable
                            style={[styles.switchButton, !isVet && styles.switchButtonActive]}
                            onPress={() => setIsVet(false)}
                        >
                            <ThemedText style={[styles.switchText, !isVet && styles.switchTextActive]}>
                                Pet Owner
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            style={[styles.switchButton, isVet && styles.switchButtonActive]}
                            onPress={() => setIsVet(true)}
                        >
                            <ThemedText style={[styles.switchText, isVet && styles.switchTextActive]}>
                                Vet
                            </ThemedText>
                        </Pressable>
                    </ThemedView>

                <ThemedCard style={styles.card}>
                    <ThemedText title={true} style={styles.title}>
                        Sign Up for PetID
                    </ThemedText>

                    <Spacer height={20} />

                    <ThemedTextInput
                        style={{ width: '100%', marginBottom: 10 }}
                        placeholder="Email"
                        keyboardType="email-address"
                        onChangeText={setEmail}
                        value={email}
                    />

                    <ThemedTextInput
                        style={{ width: '100%', marginBottom: 10 }}
                        placeholder="Password"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                    />

                    <ThemedTextInput
                        style={{ width: '100%', marginBottom: 10 }}
                        placeholder="Name"
                        onChangeText={setName}
                        value={name}
                    />

                    <ThemedTextInput
                        style={{ width: '100%', marginBottom: 10 }}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                        onChangeText={setPhone}
                        value={phone}
                    />

                    {isVet && (
                        <ThemedTextInput
                            style={{ width: '100%', marginBottom: 10 }}
                            placeholder="License Number"
                            onChangeText={setLicenseNumber}
                            value={licenseNumber}
                        />
                    )}

                    {error && <Text style={styles.error}>{error}</Text>}

                    <Spacer height={10} />

                    <ThemedButton onPress={handleSubmit}>
                        <Text style={{ color: '#F5FCFA' }}>Sign Up</Text>
                    </ThemedButton>
                </ThemedCard>

                <Spacer height={20} />
                <Link href="/login">
                    <ThemedText style={{ textAlign: "center" }}>
                        Already have an account? Sign In
                    </ThemedText>
                </Link>

            </ThemedScroll>
        </TouchableWithoutFeedback>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        padding: 20,
        alignItems: 'center',

    },
    title: {
        textAlign: "center",
        fontSize: 22,
    },
    switchContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 4,
        gap: 10
    },
    switchButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    switchButtonActive: {
        backgroundColor: Colors.primary,
    },
    switchText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666'
    },
    switchTextActive: {
        color: '#fff'
    },
    error: {
        color: Colors.warning,
        padding: 10,
        backgroundColor: '#F9DCE3',
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        textAlign: 'center'
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    }
})