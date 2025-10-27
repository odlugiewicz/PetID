import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Link} from 'expo-router'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'

const Contact = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>About Page</ThemedText>
      <Link href="/" style={styles.link}>
        <ThemedText>
        Back Home
        </ThemedText>
      </Link>
    </ThemedView>
  )
}

export default Contact

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