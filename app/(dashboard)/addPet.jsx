import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { usePets } from '../../hooks/usePets'
import { useRouter } from 'expo-router'
import { useState } from 'react'

import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

const AddPet = () => {
    const [name, setName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [species, setSpecies] = useState("")
    const [breed, setBreed] = useState("")
    const [loading, setLoading] = useState(false)

    const { addPet } = usePets()
    const router = useRouter()

    async function handleSubmit() {
        if (!title.trim() || !author.trim() || !description.trim()) return

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

                <Select>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select species' />
                    </SelectTrigger>
                    <SelectContent insets={contentInsets} className='w-[180px]'>
                        <SelectGroup>
                            <SelectLabel>Species</SelectLabel>
                            <SelectItem label='DOG' value='dog'>
                                Dog
                            </SelectItem>
                            <SelectItem label='Cat' value='cat'>
                                Cat
                            </SelectItem>
                            <SelectItem label='Bunny' value='bunny'>
                                Bunny
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <ThemedTextInput
                    style={styles.input}
                    placeholder="Species"
                    value={species}
                    onChangeText={setSpecies}
                />
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
                        {loading ? "Saving..." : "Create Book"}
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
})