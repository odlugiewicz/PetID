import { useContext } from "react";
import { PetsContext } from "../contexts/PetsContext";
import { Query } from "react-native-appwrite";
import { databases } from "../lib/appwrite";


export function usePets() {
    const context = useContext(PetsContext);
    
    if (!context) {
        throw new Error("usePets must be used within a PetsProvider");
    }

    const fetchSpecies = async () => {
        try {
            const response = await databases.listDocuments(
                '69051e15000f0c86fdb1', 
                'speecies'
            )
            return response.documents
        } catch (error) {
            console.error('Error fetching species:', error)
            throw error
        }
    }

    const fetchBreedsBySpecies = async (speciesId) => {
        try {
            const response = await databases.listDocuments(
                '69051e15000f0c86fdb1',
                'breeds',
                [Query.equal('specie', speciesId)]
            )
            return response.documents
        } catch (error) {
            console.error('Error fetching breeds:', error)
            throw error
        }
    }

    return {
        ...context,
        fetchSpecies,
        fetchBreedsBySpecies,
    }
}