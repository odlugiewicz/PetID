import { StyleSheet, Pressable, Text } from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '../../constants/Colors'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'

const Login = () => {
    const handleSubmit = () => {
        console.log("Sign In pressed")
    }
    return (
        <ThemedView style={styles.container}>

            <Spacer />
            <ThemedText title={true} style={styles.title}>
                Sign In
            </ThemedText>

            <ThemedButton onPress={handleSubmit}>
                <Text style={{ color: '#F5FCFA'}}> Sign In</Text>
            </ThemedButton>

            <Spacer height={100} />
            <Link href="/register" >
                <ThemedText style={{ textAlign: "center" }}>
                    Don't have an account? Sign Up
                </ThemedText>
            </Link>

        </ThemedView>
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
    }
})