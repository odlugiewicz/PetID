import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'
import { useRouter } from 'expo-router'

import Logo from '../assets/img/logo_blue.png'
import ThemedView from '../components/ThemedView'
import Spacer from '../components/Spacer'
import ThemedText from '../components/ThemedText'
import ThemedButton from '../components/ThemedButton'

const Home = () => {
  const router = useRouter()

  return (
    <ThemedView style={styles.container}>
      <Image source={Logo} />
      <Spacer height={20} />

      <ThemedText style={styles.title} title={true}>
        Keep Your Pets Info with You!
      </ThemedText>

      <Spacer height={10} />
      <ThemedText>
        Join Now!
      </ThemedText>
      <Spacer />

      <ThemedButton 
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <ThemedText style={styles.buttonText}>Sign In</ThemedText>
      </ThemedButton>

      <ThemedButton 
        style={styles.button}
        onPress={() => router.push('/register')}
      >
        <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
      </ThemedButton>

    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  link: {
    marginVertical: 20,
    borderBottomWidth: 1
  },
  button: {
    width: '60%',
    alignItems: 'center'
  }
})