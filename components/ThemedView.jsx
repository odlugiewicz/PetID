import { View, useColorScheme } from 'react-native'
import {Colors} from '../constants/Colors'

const ThemedView = ({ style, ...props }) => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    return (
        <View
            style={[{backgroundColor: theme.background}, style]}
            {...props}
        />
    )
}

export default ThemedView