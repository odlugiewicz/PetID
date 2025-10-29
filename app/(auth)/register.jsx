import { StyleSheet, Text, Image, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { use, useState } from 'react'
import { useUser } from '../../hooks/useUser'


import Logo from '../../assets/img/logo_blue.png'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null);

    const { register} = useUser()

    const handleSubmit = async() => {
        setError(null);

        try{
            await register(email, password);
        }catch(error){
            setError(error.message);
        }
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

                <Spacer />
                {error && <Text style={styles.error}>{error}</Text>}

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
    error: {
        color: Colors.warning,
        padding: 10,
        backgroundColor: '#F9DCE3',
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 10
    }
})