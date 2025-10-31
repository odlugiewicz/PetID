import { createContext, useState } from "react";
import { ID, Permission, Role } from "react-native-appwrite";
import { database } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "69051e15000f0c86fdb1"
const TABLE_ID = "pets"

export const PetsContext = createContext();

export function PetsProvider({ children }) {
    const [pets, setPets] = useState([]);
    const {user} = useUser();

    async function fetchPets() {
        try {

        } catch (error) {
            console.error("Failed to fetch pets:", error);
        }
    }

    async function fetchPetById(id) {
        try {

        } catch (error) {
            console.error("Failed to fetch pet by id:", error);
        }
    }

    async function addPet(data) {
        try {
            const newPet = await database.createDocument(
                DATABASE_ID,
                TABLE_ID,
                ID.unique(),
                { ...data, userId: user.$id},
                [
                    Permission.read(Role.user( user.$id)),
                    Permission.update(Role.user( user.$id)),
                    Permission.delete(Role.user( user.$id)),

                ]
            )
        } catch (error) {
            console.error("Failed to add pet:", error);
        }
    }

    async function deletePet(id) {
        try {

        } catch (error) {
            console.error("Failed to delete pet:", error);
        }
    }

    return (
        <PetsContext.Provider
            value={{ pets, fetchPets, fetchPetById, addPet, deletePet }}
        >
            {children}
        </PetsContext.Provider>

    )
}