import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/Colors"
import { Ionicons } from '@expo/vector-icons'
//import UserOnly from "../../components/auth/UserOnly"

const VetLayout = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    return (
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
                name="patients"
                options={{
                    title: "Patients", tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name="paw"
                            color={focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="vetProfile"
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

        </Tabs>
    )
}

export default VetLayout