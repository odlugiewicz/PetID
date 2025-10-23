import { StyleSheet, Text, View, Image } from 'react-native'
import {Link} from 'expo-router'

import Logo from '../assets/img/logo_blue.png'

const Home = () => {
  return (
    <View style={styles.container}>

      <Image source={Logo} style={styles.img}/>

      <Text style={styles.title}>Keep Your Pets Info with You!</Text>

      <Text style={{marginTop: 10, marginBottom: 30}}>
        Join Now!
      </Text>

      <Link href="/about" style={styles.link}>About Page</Link>
      <Link href="/contact" style={styles.link}>Contact Page</Link>
    </View>
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
  img: {
    marginVertical: 20
  },
  link: {
    marginVertical: 20,
    borderBottomWidth: 1
  }
})