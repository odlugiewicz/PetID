import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Modal, Pressable, View, Platform, useColorScheme } from 'react-native'
import { usePets } from '../../hooks/usePets'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons' // added import

import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

const AddPet = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light

    const [name, setName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [species, setSpecies] = useState("")
    const [breed, setBreed] = useState("")
    const [loading, setLoading] = useState(false)
    const [showSpeciesPicker, setShowSpeciesPicker] = useState(false)

    const { addPet } = usePets()
    const router = useRouter()

    async function handleSubmit() {
        if (!name.trim()) return

        setLoading(true)

        await addPet({ name, birthDate, species, breed })

        setName("")
        setBirthDate("")
        setSpecies("")
        setBreed("")

        router.replace("/pets")

        setLoading(false)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container}>

                <ThemedText title={true} style={styles.heading}>
                    Add Pet
                </ThemedText>
                <Spacer />

                <ThemedTextInput
                    style={styles.input}
                    placeholder="Pets Name"
                    value={name}
                    onChangeText={setName}
                />
                <Spacer />

                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={() => setShowSpeciesPicker(true)}
                >
                    <View style={styles.speciesRow}>
                        <ThemedText>
                            {species ? species.charAt(0).toUpperCase() + species.slice(1) : "Select species"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <Modal
                    visible={showSpeciesPicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowSpeciesPicker(false)}
                >
                    <Pressable style={styles.modalOverlay} onPress={() => setShowSpeciesPicker(false)} />
                    <View style={[styles.modalContent, { backgroundColor: theme.uiBackground }]}>
                        <Picker
                            selectedValue={species}
                            onValueChange={(value) => {
                                setSpecies(value)
                                if (Platform.OS === 'android') {
                                    setShowSpeciesPicker(false)
                                }
                            }}
                            mode="dropdown"
                            style={{ color: theme.text }}
                            itemStyle={{ color: theme.text }}
                            dropdownIconColor={theme.text}
                        >
                            <Picker.Item label="Dog" value="dog" />
                            <Picker.Item label="Cat" value="cat" />
                            <Picker.Item label="Bunny" value="bunny" />
                            <Picker.Item label="Bird" value="bird" />
                            <Picker.Item label="Guinea Pig" value="guinea pig" />
                        </Picker>

                        {Platform.OS === 'ios' && (
                            <ThemedButton onPress={() => setShowSpeciesPicker(false)}>
                                <ThemedText>Done</ThemedText>
                            </ThemedButton>
                        )}
                    </View>
                </Modal>

                <Spacer />

                <ThemedTextInput
                    style={styles.input}
                    placeholder="Breed"
                    value={breed}
                    onChangeText={setBreed}
                />
                <Spacer />

                <ThemedButton onPress={handleSubmit} disabled={loading}>
                    <Text style={{ color: '#fff' }}>
                        {loading ? "Saving..." : "Add Pet"}
                    </Text>
                </ThemedButton>

            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default AddPet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
    input: {
        padding: 20,
        borderRadius: 6,
        alignSelf: 'stretch',
        marginHorizontal: 40,
    },
    multiline: {
        padding: 20,
        borderRadius: 6,
        minHeight: 100,
        alignSelf: 'stretch',
        marginHorizontal: 40,
    },
    picker: {
        padding: 20,
        borderRadius: 6,
        alignSelf: 'stretch',
        marginHorizontal: 40,
    },
    speciesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    modalContent: {
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
})