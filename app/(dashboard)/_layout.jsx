import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/Colors"
import { Ionicons } from '@expo/vector-icons'
import UserOnly from "../../components/auth/UserOnly"

const DashboardLayout = () => {
  const colorSheme = useColorScheme()
  const theme = Colors[colorSheme] ?? Colors.light
  
  return (
    <UserOnly>
      <Tabs
        screenOptions={{
          headerShown: false, tabBarStyle: {
            backgroundColor: theme.navBackground,
            paddingTop: 10,
            height: 90
          },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor
        }}
      >

        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar", tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name="calendar"
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }}
        />

        <Tabs.Screen
          name="pets"
          options={{
            title: "Pets", tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name="paw"
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }}
        />

        <Tabs.Screen
        name="userProfile"
        options={{
            title: "Profile", tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name="person"
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }}
      />

      <Tabs.Screen
        name="addPet"
        options={{
          href: null, 
        }}
      />

      <Tabs.Screen
        name="pets/[id]"
        options={{
          href: null,
        }}
        />

        <Tabs.Screen
        name="pets/medicalRecord"
        options={{
          href: null,
        }}
        />

        <Tabs.Screen
        name="pets/passport"
        options={{
          href: null,
        }}
        />

        <Tabs.Screen
        name="pets/medicalRecordDetails"
        options={{
          href: null,
        }}
        />

        <Tabs.Screen
        name="pets/vaccination"
        options={{
          href: null,
        }}
        />

        <Tabs.Screen
        name="pets/vaccinationDetails"
        options={{
          href: null,
        }}
        />

      </Tabs>
    </UserOnly>
  )
}

export default DashboardLayout