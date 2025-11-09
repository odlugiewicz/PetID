import { createContext, useEffect, useState } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases, client } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "69051e15000f0c86fdb1"
const TABLE_ID = "pets"

export const PetsContext = createContext();

export function PetsProvider({ children }) {
    const [pets, setPets] = useState([]);
    const { user } = useUser();

    async function fetchPets() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                TABLE_ID,
                [
                    Query.equal('userId', user.$id)
                ]
            )

            setPets(response.documents)
            console.log(response.documents)
        } catch (error) {
            console.error("Failed to fetch pets:", error);
        }
    }

    async function fetchPetById(id) {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                TABLE_ID,
                id
            )
            return response
        } catch (error) {
            console.error("Failed to fetch pet by id:", error);
        }
    }

    async function addPet(data) {
        try {
            await databases.createDocument(
                DATABASE_ID,
                TABLE_ID,
                ID.unique(),
                { ...data, userId: user.$id },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),

                ]
            )
        } catch (error) {
            console.error("Failed to add pet:", error);
        }
    }

    async function deletePet(id) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                TABLE_ID,
                id,
            )
        } catch (error) {
            console.error("Failed to delete pet:", error);
        }
    }

    useEffect(() => {
        let unsubscribe
        const channel = `databases.${DATABASE_ID}.collections.${TABLE_ID}.documents`

        if (user) {
            fetchPets()

            unsubscribe = client.subscribe(channel, (response) => {
                const { payload, events } = response
                console.log(events)

                if (events[0].includes("create")) {
                    setPets((prevPets) => [...prevPets, payload])
                }

                if (events[0].includes("delete")) {
                    setPets((prevPets) => prevPets.filter((pet) => pet.$id !== payload.$id))
                }
            })

        } else {
            setPets([])
        }

        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [user])

    return (
        <PetsContext.Provider
            value={{ pets, fetchPets, fetchPetById, addPet, deletePet }}
        >
            {children}
        </PetsContext.Provider>

    )
}