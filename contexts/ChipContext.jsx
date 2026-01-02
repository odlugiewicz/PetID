import { createContext, useState } from 'react'
import { ID, Query } from 'react-native-appwrite'
import { databases } from '../lib/appwrite'
import { useUser } from '../hooks/useUser'

const DATABASE_ID = '69051e15000f0c86fdb1'
const CHIPS_COLLECTION_ID = 'chips'
const PETS_COLLECTION_ID = 'pets'

export const ChipContext = createContext()

export const ChipProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { user } = useUser()

    const addChip = async ({ chipNumber, implantDate, manufacturer, implantLocation, notes, petId, ownerName, ownerPhone, ownerAddress, petName, petSpecies, petBreed, petBirthDate }) => {
        if (!user || user.role !== 'vet') {
            throw new Error('Only vets can add chip information')
        }

        setLoading(true)
        setError(null)

        try {
            const newChip = await databases.createDocument(
                DATABASE_ID,
                CHIPS_COLLECTION_ID,
                ID.unique(),
                {
                    chipNumber: chipNumber?.trim() || null,
                    implantDate: implantDate || null,
                    manufacturer: manufacturer?.trim() || null,
                    implantLocation: implantLocation?.trim() || null,
                    notes: notes?.trim() || null,
                    petId,
                    vetId: user.$id,
                    ownerName: ownerName?.trim() || null,
                    ownerPhone: ownerPhone?.trim() || null,
                    ownerAddress: ownerAddress?.trim() || null,
                    petName: petName?.trim() || null,
                    petSpecies: petSpecies?.trim() || null,
                    petBreed: petBreed?.trim() || null,
                    petBirthDate: petBirthDate || null,
                }
            )

            await databases.updateDocument(
                DATABASE_ID,
                PETS_COLLECTION_ID,
                petId,
                {
                    chipId: chipNumber?.trim() || null,
                }
            )

            return newChip
        } catch (err) {
            console.error('Failed to add chip info:', err)
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const fetchChipByPet = async (petId) => {
        setLoading(true)
        setError(null)
        try {
            console.log('ChipContext - fetchChipByPet called with petId:', petId)
            const response = await databases.listDocuments(
                DATABASE_ID,
                CHIPS_COLLECTION_ID,
                [Query.equal('petId', petId), Query.limit(1)]
            )

            console.log('ChipContext - response:', response)
            console.log('ChipContext - documents count:', response.documents.length)

            if (response.documents.length === 0) {
                console.log('ChipContext - No chip found for petId:', petId)
                return null
            }

            console.log('ChipContext - Chip found:', response.documents[0])
            return response.documents[0]
        } catch (err) {
            console.error('Failed to fetch chip info:', err)
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }

    const updateChip = async (chipId, data) => {
        if (!user || user.role !== 'vet') {
            throw new Error('Only vets can update chip information')
        }

        setLoading(true)
        setError(null)

        try {
            const updated = await databases.updateDocument(
                DATABASE_ID,
                CHIPS_COLLECTION_ID,
                chipId,
                data
            )
            return updated
        } catch (err) {
            console.error('Failed to update chip info:', err)
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return (
        <ChipContext.Provider value={{ loading, error, addChip, fetchChipByPet, updateChip }}>
            {children}
        </ChipContext.Provider>
    )
}
