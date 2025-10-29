import { StyleSheet, Text, Image, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { useState } from 'react'


import Logo from '../../assets/img/logo_blue.png'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = () => {
        console.log("Sign Up from submitted", email, password)
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container}>

                <Image source={Logo} />
                <Spacer height={20} />

                <Spacer />
                <ThemedText title={true} style={styles.title}>
                    Sign Up for PetID
                </ThemedText>

                <ThemedTextInput
                    style={{ width: '80%', marginBottom: 20 }}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                />

                <ThemedTextInput
                    style={{ width: '80%', marginBottom: 20 }}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />


                <ThemedButton onPress={handleSubmit}>
                    <Text style={{ color: '#F5FCFA' }}> Sign Up</Text>
                </ThemedButton>

                <Spacer height={40} />
                <Link href="/login" >
                    <ThemedText style={{ textAlign: "center" }}>
                        Already have an account? Sign In
                    </ThemedText>
                </Link>

            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        marginBottom: 30
    },
})