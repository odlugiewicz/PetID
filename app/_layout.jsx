import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from '../constants/Colors'
import { StatusBar } from 'expo-status-bar'
import { UserProvider } from '../contexts/UserContext'
import { PetsProvider } from '../contexts/PetsContext'
import { VetProvider } from '../contexts/VetContext' // <-- 1. IMPORTUJ
import { MedicalRecordProvider } from '../contexts/MedicalRecordContext'
import { PassportProvider } from '../contexts/PassportContext'


const RootLayout = () => {
  const colorSheme = useColorScheme()
  console.log(colorSheme)
  const theme = Colors[colorSheme] ?? Colors.light

  return (
    <UserProvider>
      <PetsProvider>
        <VetProvider>
          <MedicalRecordProvider>
            <PassportProvider>
              <StatusBar value="auto" />
              <Stack screenOptions={{
                headerStyle: { backgroundColor: theme.navBackground },
                headerTintColor: theme.title,
              }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
                <Stack.Screen name="(vet)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ title: 'Home' }} />

              </Stack>
            </PassportProvider>
          </MedicalRecordProvider>
        </VetProvider>
      </PetsProvider>
    </UserProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})