import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from '../constants/Colors'
import { StatusBar } from 'expo-status-bar'
import { UserProvider } from '../contexts/UserContext'


const RootLayout = () => {
  const colorSheme = useColorScheme()
  console.log(colorSheme)
  const theme = Colors[colorSheme] ?? Colors.light

  return (
    <UserProvider>
      <StatusBar value="auto"/>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTintColor: theme.title,
      }}>
        <Stack.Screen name="(auth)" options={{headerShown: false}} />
        <Stack.Screen name="(dashboard)" options={{headerShown: false}} />
        <Stack.Screen name="index" options={{ title: 'Home' }} />

      </Stack>
    </UserProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})