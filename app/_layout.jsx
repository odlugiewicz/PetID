import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from '../constants/Colors'
import { StatusBar } from 'expo-status-bar'


const RootLayout = () => {
  const colorSheme = useColorScheme()
  console.log(colorSheme)
  const theme = Colors[colorSheme] ?? Colors.light

  return (
    <>
      <StatusBar value="auto"/>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTintColor: theme.title,
      }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="about" options={{ title: 'About Us' }} />
        <Stack.Screen name="contact" options={{ title: 'Contact' }} />

      </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})