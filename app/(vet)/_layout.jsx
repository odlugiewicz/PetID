import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/Colors"
import { Ionicons } from '@expo/vector-icons'
import VetOnly from "../../components/auth/VetOnly"

const VetLayout = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    return (
        <VetOnly>
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
                    name="vetCalendar"
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

                <Tabs.Screen
                    name="addPatient"
                    options={{
                        href: null,
                    }}
                />

                <Tabs.Screen
                    name="patients/[patient]"
                    options={{
                        href: null,
                    }}
                />

                <Tabs.Screen
                    name="patients/medicalRecordVet"
                    options={{
                        href: null,
                    }}
                />

                <Tabs.Screen
                    name="patients/addMedicalRecord"
                    options={{
                        href: null,
                    }}
                />

            </Tabs>
        </VetOnly>
    )
}

export default VetLayout