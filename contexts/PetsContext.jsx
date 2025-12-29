import { createContext, useEffect, useState } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases, client, storage } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "69051e15000f0c86fdb1"
const TABLE_ID = "pets"
const PET_OWNERS_TABLE_ID = "pet_owners"
const BUCKET_ID = "69111f64001a3b3c4563"

export const PetsContext = createContext()


async function uploadPetImage(imageAsset, userId) {
    if (!imageAsset) {
        return null;
    }

    const file = {
        uri: imageAsset.uri,
        name: imageAsset.fileName || imageAsset.uri.split('/').pop(),
        type: imageAsset.mimeType || 'image/jpeg',
        size: imageAsset.fileSize

    };
    try {
        const response = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            file,
            [
                Permission.read(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );
        console.log(`response ${response}`)
        return response.$id;

    } catch (error) {
        console.error("Failed to upload pet image:", error);
        console.log("File object sent:", file);
        throw new Error(`Failed to upload pet image 2 ${error}`);
    }
}

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

    const getPetImageUrl = (imageId) => {
        if (!imageId) return null;

        try {
            const url =  storage.getFileViewURL(
                BUCKET_ID,
                imageId
            );

            return url.toString();
        } catch (error) {
            console.error("Failed to get pet image URL:", error);
            return null;
        }
    }

    async function addPet(data, imageAsset) {
        try {
            let imageId = null;

            if (imageAsset && user?.$id) {
                imageId = await uploadPetImage(imageAsset, user.$id);
            }

            const ownerResponse = await databases.listDocuments(
                DATABASE_ID,
                PET_OWNERS_TABLE_ID,
                [
                    Query.equal("userId", user.$id)
                ]
            );

            const ownerId = ownerResponse.documents.length > 0 ? ownerResponse.documents[0].$id : null;

            await databases.createDocument(
                DATABASE_ID,
                TABLE_ID,
                ID.unique(),
                { ...data, userId: user.$id, ownerId: ownerId, imageId: imageId, },
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

    async function generatePetToken(petId) {
        try {
            const randomCode = Math.floor(10000000 + Math.random() * 90000000).toString();
            const token = randomCode;
            
            await databases.createDocument(
                DATABASE_ID,
                "pet_tokens",
                ID.unique(),
                {
                    petId: petId,
                    token: token,
                    userId: user.$id,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                    used: false
                }
            );
            
            return token;
        } catch (error) {
            console.error("Failed to generate pet token:", error);
            throw error;
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
            value={{ pets, fetchPets, fetchPetById, addPet, deletePet, getPetImageUrl, generatePetToken }}
        >
            {children}
        </PetsContext.Provider>

    )
}