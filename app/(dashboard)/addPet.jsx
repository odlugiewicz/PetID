import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Modal, Pressable, View, Platform, useColorScheme, Image } from 'react-native'
import { usePets } from '../../hooks/usePets'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Checkbox } from 'expo-checkbox'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import * as ImagePicker from 'expo-image-picker'

import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import ThemedScroll from '../../components/ThemedScroll'
import { set } from 'date-fns'

const AddPet = () => {
    const colorSheme = useColorScheme()
    const theme = Colors[colorSheme] ?? Colors.light
    const { addPet, fetchSpecies, fetchBreedsBySpecies } = usePets()
    const router = useRouter()

    const [name, setName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [species, setSpecies] = useState("")
    const [speciesName, setSpeciesName] = useState("")
    const [breed, setBreed] = useState("")
    const [breedName, setBreedName] = useState("")
    const [chipId, setChipId] = useState("");
    const [passportId, setPassportId] = useState("");
    const [birthDateString, setBirthDateString] = useState("")
    const [image, setImage] = useState(null);

    const [showSpeciesPicker, setShowSpeciesPicker] = useState(false)
    const [showBreedPicker, setShowBreedPicker] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isCheckedChip, setCheckedChip] = useState(false);
    const [isCheckedPassport, setCheckedPassport] = useState(false);
    const [loading, setLoading] = useState(false)

    const [speciesList, setSpeciesList] = useState([])
    const [breedList, setBreedList] = useState([])
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        const loadSpecies = async () => {
            try {
                const data = await fetchSpecies()
                setSpeciesList(data)
            } catch (error) {
                console.log("Error fetching species:", error)
                alert("Failed to load species")
            } finally {
                setLoadingData(false)
            }
        }
        loadSpecies()
    }, [])

    useEffect(() => {
        const loadBreeds = async () => {
            if (species) {
                try {
                    const data = await fetchBreedsBySpecies(species)
                    setBreedList(data)
                    setBreed("")
                } catch (error) {
                    console.log("Error fetching breeds:", error)
                    alert("Failed to load breeds")
                }
            } else {
                setBreedList([])
            }
        }
        loadBreeds()
    }, [species])

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

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
        setLoading(false)
    };

    const handleSubmit = async () => {
        if (!name.trim() || !speciesName.trim() || !breedName.trim()) return

        setLoading(true)

        try {
            await addPet({ name, birthDate, species: speciesName, breed: breedName, chipId, passportId }, image)

            setName("")
            setBirthDate(null)
            setSpecies("")
            setSpeciesName("")
            setBreed("")
            setBreedName("")
            setChipId("")
            setPassportId("")
            setImage(null)

            router.replace("/pets")
        } catch (error) {
            console.log("Submitting add pet form:", error)
        }

        setLoading(false)
    }

    const handleCancel = async () => {
        setLoading(true)
        try {
            setName("")
            setBirthDate(null)
            setSpecies("")
            setSpeciesName("")
            setBreed("")
            setBreedName("")
            setChipId("")
            setPassportId("")
            setImage(null)
            router.replace("/pets")
        } catch (error) {
            console.log("Canceling add pet form:", error)
        }
        setLoading(false)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedScroll>
                <ThemedText title={true} style={styles.heading} safe={true}>
                    Add Pet
                </ThemedText>
                <Spacer />

                <View style={styles.imageInputContainer}>
                    {image ? (
                        <Image
                            source={{ uri: image.uri }}
                            style={styles.imagePreview}
                        />
                    ) : (
                        <View style={[styles.imagePlaceholder, { backgroundColor: theme.uiBackground, borderColor: theme.text }]}>
                            <Ionicons name="camera-outline" size={30} color={theme.text} />
                            <ThemedText style={{ marginTop: 10 }}>Select Photo</ThemedText>
                        </View>
                    )}

                    <ThemedButton
                        onPress={pickImage}
                        style={{ marginTop: 10, width: '80%', alignSelf: 'center', alignItems: 'center' }}
                    >
                        <Text style={{ color: '#F5FCFA' }}>
                            {image ? "Change Photo" : "Select Photo"}
                        </Text>
                    </ThemedButton>

                    {image && (
                        <ThemedButton onPress={() => setImage(null)} style={[styles.removeImageButton, { backgroundColor: Colors.warning, width: '80%', alignSelf: 'center' }]} >
                            <Text style={{ color: '#fff', textAlign: 'center' }}>
                                Remove Photo
                            </Text>
                        </ThemedButton>
                    )}
                </View>

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
                    disabled={loadingData}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {species ? speciesList.find(s => s.$id === species)?.speciesName || "Select Species" : loadingData ? "Loading..." : "Select Species"}
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
                                const selectedSpecies = speciesList.find(s => s.$id === value)
                                setSpeciesName(selectedSpecies?.speciesName || "")
                                if (Platform.OS === 'android') {
                                    setShowSpeciesPicker(false)
                                }
                            }}
                            mode="dropdown"
                            style={{ color: theme.text }}
                            itemStyle={{ color: theme.text }}
                            dropdownIconColor={theme.text}
                        >
                            <Picker.Item label="Select Species" value="" color={theme.text} />
                            {speciesList.map((spec) => (
                                <Picker.Item 
                                    key={spec.$id} 
                                    label={spec.speciesName} 
                                    value={spec.$id} 
                                    color={theme.text} 
                                />
                            ))}
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
                    onPress={() => species ? setShowBreedPicker(true) : alert("Please select a species first")}
                    disabled={!species}
                >
                    <View style={styles.row}>
                        <ThemedText style={{ color: theme.text }}>
                            {breed ? breedList.find(b => b.$id === breed)?.breedName || "Select Breed" : "Select Breed"}
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
                                 const selectedBreed = breedList.find(b => b.$id === value)
                                setBreedName(selectedBreed?.breedName || "")
                                if (Platform.OS === 'android') {
                                    setShowBreedPicker(false)
                                }
                            }}
                            mode="dropdown"
                            style={{ color: theme.text }}
                            itemStyle={{ color: theme.text }}
                            dropdownIconColor={theme.text}
                        >
                            <Picker.Item label="Select Breed" value="" color={theme.text} />
                            {breedList.map((b) => (
                                <Picker.Item 
                                    key={b.$id} 
                                    label={b.breedName} 
                                    value={b.$id} 
                                    color={theme.text} 
                                />
                            ))}
                        </Picker>

                        {Platform.OS === 'ios' && (
                            <ThemedButton onPress={() => setShowBreedPicker(false)} style={{ alignItems: "center", width: '60%', alignSelf: 'center' }}>
                                <ThemedText>Done</ThemedText>
                            </ThemedButton>
                        )}
                    </ThemedView>
                </Modal>

                <Spacer />

                <ThemedText style={[styles.label, { color: Colors.primary }]}>Additional</ThemedText>

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

                <ThemedButton onPress={handleSubmit} disabled={loading} style={{ alignSelf: 'center', width: '40%', alignItems: 'center'}} >
                    <Text style={{ color: '#fff' }}>
                        {loading ? "Saving..." : "Add Pet"}
                    </Text>
                </ThemedButton>

                <ThemedButton onPress={handleCancel} disabled={loading} style={styles.cancel} >
                    <Text style={{ color: '#fff' }}>
                        {loading ? "Cancelling..." : "Cancel"}
                    </Text>
                </ThemedButton>

                <Spacer/>

            </ThemedScroll>
        </TouchableWithoutFeedback>
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
    imageInputContainer: {
        alignItems: 'center',
        marginHorizontal: 40,
        padding: 20,
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    imagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        marginBottom: 10,
    },
    removeImageButton: {
        marginTop: 10,
    },
    cancel: {
        marginTop: 40,
        backgroundColor: Colors.warning,
        width: '40%',
        alignSelf: "center",
        alignItems: "center",
    },
})