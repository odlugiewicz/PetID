import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
        <Stack screenOptions={{
            headerStyle: {backgroundColor: '#D3EBEE'},
            headerTintColor: '#282828',
        }}>    
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="about" options={{ title: 'About Us' }} />
            <Stack.Screen name="contact" options={{ title: 'Contact' }} />

        </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})