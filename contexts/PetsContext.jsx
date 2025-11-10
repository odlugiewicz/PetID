import { createContext, useEffect, useState } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases, client, storage, PET_BUCKET_ID } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "69051e15000f0c86fdb1"
const TABLE_ID = "pets"

export const PetsContext = createContext();

async function uriToFile(uri) {

    if (!uri || typeof uri !== 'string') {
        throw new Error("Invalid URI provided for file upload.");
    }

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const type = 'image/jpeg';

    const finalUri = uri.startsWith('file://') || uri.startsWith('content://') ? uri : `file://${uri}`;

    return {
        uri: finalUri,
        name: filename,
        type: type,
    };
}

async function uploadPetImage(imageUri, userId) {
    if (!imageUri || PET_BUCKET_ID === "YOUR_APPWRITE_BUCKET_ID") {
        console.error("Image URI or BUCKET ID missing for upload.");
        return null;
    }

    try {
        const file = await uriToFile(imageUri);

        const response = await storage.createFile(
            PET_BUCKET_ID,
            ID.unique(),
            file,
            [
                Permission.read(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );
        return response.$id;
    } catch (error) {
        console.error("Failed to upload pet image:", error);
        throw new Error(`Upload failed: ${error.message}`);
    }
}

export function PetsProvider({ children }) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    async function fetchPets() {
        if (!user) {
            setPets([]);
            setLoading(false);
            return;
        }
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                TABLE_ID,
                [
                    Query.equal('userId', user.$id)
                ]
            )

            setPets(response.documents)
        } catch (error) {
            console.error("Failed to fetch pets:", error);
        }finally{
            setLoading(false);
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

    async function addPet(data, imageUri) {
        if (!user) {
            throw new Error("User not authenticated.");
        }

        try {
            let imageId = null;

            if (imageUri) {
                imageId = await uploadPetImage(imageUri, user.$id);
            }

            await databases.createDocument(
                DATABASE_ID,
                TABLE_ID,
                ID.unique(),
                { ...data, userId: user.$id, imageId: imageId},
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
            setLoading(true);
            fetchPets()

            unsubscribe = client.subscribe(channel, (response) => {
                const { payload, events } = response

                if (events[0].includes("create")) {
                    setPets((prevPets) => [...prevPets, payload])
                }

                if (events[0].includes("delete")) {
                    setPets((prevPets) => prevPets.filter((pet) => pet.$id !== payload.$id))
                }
            })

        } else {
            setPets([])
            setLoading(false);
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