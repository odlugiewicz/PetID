import { StyleSheet, Text, Button, TouchableWithoutFeedback, Keyboard, Modal, Pressable, View, Platform, useColorScheme } from 'react-native'
import { usePets } from '../../hooks/usePets'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';


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
    const [showBreedPicker, setShowBreedPicker] = useState(false)

    const { addPet } = usePets()
    const router = useRouter()

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };


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

                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    style={styles.datePicker}
                    
                />

                <Spacer />

                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={() => setShowSpeciesPicker(true)}
                >
                    <View style={styles.row}>
                        <ThemedText>
                            {species ? species.charAt(0).toUpperCase() + species.slice(1) : "Select Species"}
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
                    <ThemedView style={[styles.modalContent, { backgroundColor: theme.uiBackground }]}>
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
                    </ThemedView>
                </Modal>


                <Spacer />


                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={() => setShowBreedPicker(true)}
                >
                    <View style={styles.row}>
                        <ThemedText>
                            {breed ? breed.charAt(0).toUpperCase() + breed.slice(1) : "Select Breed"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <Modal
                    visible={showBreedPicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowBreedPicker(false)}
                >
                    <Pressable style={styles.modalOverlay} onPress={() => setShowBreedPicker(false)} />
                    <ThemedView style={[styles.modalContent, { backgroundColor: theme.uiBackground }]}>
                        <Picker
                            selectedValue={breed}
                            onValueChange={(value) => {
                                setBreed(value)
                                if (Platform.OS === 'android') {
                                    setShowBreedPicker(false)
                                }
                            }}
                            mode="dropdown"
                            style={{ color: theme.text }}
                            itemStyle={{ color: theme.text }}
                            dropdownIconColor={theme.text}
                        >
                            <Picker.Item label="Dalmatian" value="dalmatian" />
                            <Picker.Item label="Maine Coon" value="maine coon" />
                        </Picker>

                        {Platform.OS === 'ios' && (
                            <ThemedButton onPress={() => setShowBreedPicker(false)}>
                                <ThemedText>Done</ThemedText>
                            </ThemedButton>
                        )}
                    </ThemedView>
                </Modal>

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
    datePicker:{
        width: '80%',
        textAlign: 100,
        
    },
    row: {
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