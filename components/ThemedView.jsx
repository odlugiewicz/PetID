import { View, useColorScheme} from 'react-native'
import {Colors} from '../constants/Colors'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { use } from 'react'


const ThemedView = ({ style, safe=false, ...props }) => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    if (!safe) return (
        <View
            style={[{backgroundColor: theme.background}, style]}
            {...props}
        />
    )

    const inserts = useSafeAreaInsets()

    return (
        <View
            style={[{
            backgroundColor: theme.background,
            paddingTop: inserts.top,
            paddingBottom: inserts.bottom,
            },
             style
            ]}
            {...props}
        />
    )
}

export default ThemedView