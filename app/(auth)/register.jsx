import { StyleSheet, Text} from 'react-native'
import { Link } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'

const Register = () => {
    const handleSubmit = () => {
        console.log("Sign Up pressed")
    }
    return (
        <ThemedView style={styles.container}>

            <Spacer />
            <ThemedText title={true} style={styles.title}>
                Sign Up for PetID
            </ThemedText>

            <ThemedButton onPress={handleSubmit}>
                <Text style={{ color: '#F5FCFA' }}> Sign Up</Text>
            </ThemedButton>

            <Spacer height={100} />
            <Link href="/login" >
                <ThemedText style={{ textAlign: "center" }}>
                    Already have an account? Sign In
                </ThemedText>
            </Link>

        </ThemedView>
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