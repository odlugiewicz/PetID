import { View, useColorScheme, StyleSheet } from 'react-native'
import {Colors} from '../constants/Colors'

const ThemedCard = ({ style, ...props }) => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    return (
        <View
            style={[{backgroundColor: theme.uiBackground}, styles.card, style]}
            {...props}
        />
    )
}

export default ThemedCard

const styles = StyleSheet.create({
    card: {
        borderRadius: 5,
        padding: 20
    }
})