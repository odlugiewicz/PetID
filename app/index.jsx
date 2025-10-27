import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'

import Logo from '../assets/img/logo_blue.png'
import ThemedView from '../components/ThemedView'
import Spacer from '../components/Spacer'
import ThemedText from '../components/ThemedText'

const Home = () => {
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

      <Link href="/login" style={styles.link}>
        <ThemedText>
          Sign In
        </ThemedText>
      </Link>

      <Link href="/register" style={styles.link}>
        <ThemedText>
          Sign Up
        </ThemedText>
      </Link>

      <Link href="/home" style={styles.link}>
        <ThemedText>
          Home
        </ThemedText>
      </Link>

      <Link href="/pets" style={styles.link}>
        <ThemedText>
          Pets
        </ThemedText>
      </Link>

      <Link href="/calendar" style={styles.link}>
        <ThemedText>
          Calendar
        </ThemedText>
      </Link>
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
  }
})