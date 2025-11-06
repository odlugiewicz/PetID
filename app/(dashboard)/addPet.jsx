import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Modal, Pressable, View, Platform, useColorScheme } from 'react-native'
import { usePets } from '../../hooks/usePets'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Checkbox } from 'expo-checkbox';
import DateTimePickerModal from "react-native-modal-datetime-picker";


import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import ThemedScroll from '../../components/ThemedScroll'

const AddPet = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light
    const { addPet } = usePets()
    const router = useRouter()

    const [name, setName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [species, setSpecies] = useState("")
    const [breed, setBreed] = useState("")
    const [chipId, setChipId] = useState(null);
    const [passportId, setPassportId] = useState("");
    const [birthDateString, setBirthDateString] = useState("")

    const [showSpeciesPicker, setShowSpeciesPicker] = useState(false)
    const [showBreedPicker, setShowBreedPicker] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isCheckedChip, setCheckedChip] = useState(false);
    const [isCheckedPassport, setCheckedPassport] = useState(false);
    const [loading, setLoading] = useState(false)


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };


    const handleConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        setBirthDateString(formattedDate);
        setBirthDate(date);
        hideDatePicker();
    };


    const handleSubmit = async () => {
        if (!name.trim() || !species.trim() || !breed.trim()) return

        setLoading(true)

        await addPet({ name, birthDate, species, breed, chipId, passportId })

        setName("")
        setBirthDate(null)
        setSpecies("")
        setBreed("")
        setChipId(null)
        setPassportId("")

        router.replace("/pets")

        setLoading(false)
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedScroll>
                <ThemedText title={true} style={styles.heading} safe={true}>
                    Add Pet
                </ThemedText>
                <Spacer />

                <ThemedText style={styles.label}>Name</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="Pets Name"
                    value={name}
                    onChangeText={setName}
                />
                <Spacer />

                <ThemedText style={styles.label}>Date of birth</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={showDatePicker}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {birthDateString || "Select Birth Date"}
                        </ThemedText>
                        <Ionicons name="chevron-down" size={20} color={theme.text} />
                    </View>
                </ThemedButton>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    pickerContainerStyleIOS={{ backgroundColor: theme.navBackground }}
                    pickerStyleIOS={{ backgroundColor: theme.navBackground }}
                    pickerComponentStyleIOS={{ backgroundColor: theme.navBackground }}
                    textColor={theme.text}
                    customConfirmButtonIOS={({ onPress }) => (
                        <ThemedButton onPress={onPress} style={{ alignItems: "center", width: '80%', alignSelf: 'center' }}>
                            <ThemedText>Confirm</ThemedText>
                        </ThemedButton>
                    )}
                    customCancelButtonIOS={({ onPress }) => (
                        <ThemedButton onPress={onPress} style={{ alignItems: "center", width: '80%', alignSelf: 'center' }}>
                            <ThemedText>Cancel</ThemedText>
                        </ThemedButton>
                    )}
                />

                <Spacer />

                <ThemedText style={styles.label}>Species</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={() => setShowSpeciesPicker(true)}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
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
                            <Picker.Item label="Dog" value="dog" color={theme.text} />
                            <Picker.Item label="Cat" value="cat" color={theme.text} />
                            <Picker.Item label="Bunny" value="bunny" color={theme.text} />
                            <Picker.Item label="Bird" value="bird" color={theme.text} />
                            <Picker.Item label="Guinea Pig" value="guinea pig" color={theme.text} />
                        </Picker>

                        {Platform.OS === 'ios' && (
                            <ThemedButton onPress={() => setShowSpeciesPicker(false)} style={{ alignItems: "center", width: '60%', alignSelf: 'center' }}>
                                <ThemedText>Done</ThemedText>
                            </ThemedButton>
                        )}
                    </ThemedView>
                </Modal>


                <Spacer />


                <ThemedText style={styles.label}>Breed</ThemedText>
                <ThemedButton
                    style={[styles.picker, { backgroundColor: theme.uiBackground }]}
                    onPress={() => setShowBreedPicker(true)}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
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
                            <Picker.Item label="Dalmatian" value="dalmatian" color={theme.text} />
                            <Picker.Item label="Maine Coon" value="maine coon" color={theme.text} />
                        </Picker>

                        {Platform.OS === 'ios' && (
                            <ThemedButton onPress={() => setShowBreedPicker(false)} style={{ alignItems: "center", width: '60%', alignSelf: 'center' }}>
                                <ThemedText>Done</ThemedText>
                            </ThemedButton>
                        )}
                    </ThemedView>
                </Modal>

                <Spacer />

                <ThemedText style={[styles.label, {color: Colors.primary}]}>Additional</ThemedText>

                <Spacer />

                <ThemedView style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isCheckedChip}
                        onValueChange={setCheckedChip}
                        color={theme.primary}
                    />
                    <ThemedText style={styles.paragraph}>Chip</ThemedText>
                    {isCheckedChip && (
                        <ThemedTextInput
                            style={styles.input}
                            placeholder="Chip ID (15 characters)"
                            value={chipId}
                            onChangeText={setChipId}
                            maxLength={15}
                            keyboardType="numeric"
                            width="54%"
                        />
                    )}
                </ThemedView>
                
                <Spacer />

                <ThemedView style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isCheckedPassport}
                        onValueChange={setCheckedPassport}
                        color={theme.primary}
                    />
                    <ThemedText style={styles.paragraph}>Passport</ThemedText>
                    {isCheckedPassport && (
                        <ThemedTextInput
                            style={styles.input}
                            placeholder="Passport ID (12 characters)"
                            value={passportId}
                            onChangeText={setPassportId}
                            maxLength={12}
                            width="46%"
                        />
                    )}
                </ThemedView>

                <Spacer />

                <ThemedButton onPress={handleSubmit} disabled={loading} style={{ alignSelf: 'center'}}>
                    <Text style={{ color: '#fff'}}>
                        {loading ? "Saving..." : "Add Pet"}
                    </Text>
                </ThemedButton>

                <Spacer />

            </ThemedScroll>
        </TouchableWithoutFeedback >
    )
}

export default AddPet

const styles = StyleSheet.create({
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
    label: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 40,
        fontSize: 18,

    },
    input: {
        padding: 20,
        borderRadius: 6,
        alignSelf: 'stretch',
        marginHorizontal: 40,
        marginTop: 10,
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
    datePicker: {
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
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        margin: 8,
        marginLeft: 40,
    },
    paragraph: {
        fontSize: 15,
    },
})