import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/Colors"

const DashboardLayout = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light
  return (
    <Tabs
        screenOptions={{headerShown: false, tabBarStyle: {
            backgroundColor: theme.navBackground,
            paddingTop: 10,
            height: 90
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor
    }}
    >
        <Tabs.Screen 
        name="home" 
        options={{title: "Home"}} 
        />

        <Tabs.Screen 
        name="pets" 
        options={{title: "Pets"}} 
        />

        <Tabs.Screen 
        name="calendar" 
        options={{title: "Calendar"}} 
        />

    </Tabs>
  )
}

export default DashboardLayout