import { StyleSheet, Text, Image, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { useState } from 'react'
import { useUser } from '../../hooks/useUser'


import Logo from '../../assets/img/logo_blue.png'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null);

    const {user, login} = useUser()

    const handleSubmit = async () => {
        setError(null);

        try {
            await login(email, password);
            const userData = await account.get();
            
            const vets = await databases.listDocuments(DATABASE_ID, VETS_TABLE_ID, [
              Query.equal("userId", userData.$id)
            ]);

            if (vets.documents.length > 0) {
              router.replace('/(vet)/patients');
            } else {
              router.replace('/(dashboard)/pets');
            }
          } catch (error) {
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
                    Sign In to Your Account
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

                <ThemedButton onPress={handleSubmit} style={{ width: '40%', alignItems: 'center' }}>
                    <Text style={{ color: '#F5FCFA' , fontSize: 16}}> Sign In</Text>
                </ThemedButton>

                <Spacer />
                {error && <Text style={styles.error}>{error}</Text>}

                <Spacer height={40} />
                <Link href="/register" >
                    <ThemedText style={{ textAlign: "center" }}>
                        Don't have an account? Sign Up
                    </ThemedText>
                </Link>

            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default Login

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