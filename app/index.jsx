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

      <Link href="/about" style={styles.link}>
        <ThemedText>
          About Page
        </ThemedText>
      </Link>

      <Link href="/contact" style={styles.link}>
        <ThemedText>
          Contact Page
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