import { createContext, useEffect, useState } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases, client, storage } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";
import { Alert, Platform } from "react-native"

const DATABASE_ID = "69051e15000f0c86fdb1"
const TABLE_ID = "pets"
const BUCKET_ID = "69111f64001a3b3c4563"

export const PetsContext = createContext();

async function uriToFile(uri) {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    const parts = filename.split('.');
    // Użyjemy małych liter dla rozszerzenia, aby uniknąć problemów z wielkością liter (np. .JPG vs .jpg)
    const extension = parts.length > 1 ? parts.pop().toLowerCase() : '';

    let type = 'application/octet-stream'; // Bezpieczny domyślny typ

    // Poprawne mapowanie rozszerzeń na typy MIME
    if (extension === 'png') {
        type = 'image/png';
    } else if (extension === 'jpg' || extension === 'jpeg') {
        type = 'image/jpeg';
    } else if (extension === 'heic') {
        type = 'image/heic';
    } else if (extension === 'heif') {
        type = 'image/heif';
    } else {
        // Używamy domyślnego typu image/jpeg jako fallback, zgodnie z pierwotną intencją
        type = 'image/jpeg';
    }
    return {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        //uri,
        name: filename,
        type,
    };
}

async function uploadPetImage(imageAsset, userId) {
    if (!imageAsset) {
        return null;
    }

    try {
        const file = {
        uri: imageAsset.uri,
        name: imageAsset.fileName || imageAsset.uri.split('/').pop(), // Użyj fileName lub wyciągnij z uri
        type: imageAsset.mimeType || 'image/jpeg', // Użyj mimeType
    };
        const response = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            file, // Przekaż ten obiekt
            [
                Permission.read(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );

        console.log(`response ${response}`)
        //Alert.alert(response)
        return response.$id;
    } catch (error) {
        console.error("Failed to upload pet image:", error);
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

    function getPetImageUrl(imageId) {
        if (!imageId) return null;

        try {
            // Użyj getFilePreview, aby uzyskać URL
            const url = storage.getFilePreview(
                BUCKET_ID,
                imageId
            );
            return url.href; // Zwróć sam URL jako string
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

            await databases.createDocument(
                DATABASE_ID,
                TABLE_ID,
                ID.unique(),
                { ...data, userId: user.$id, imageId: imageId },
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


    async function addPetImg(path, id) {
        const promise = storage.createFile(
            BUCKET_ID,
            id,
            {
                name: 'image.jpg',
                type: 'image/jpeg',
                size: 1234567,
                uri: 'file:///path/to/file.jpg',
            }
        )
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
            value={{ pets, fetchPets, fetchPetById, addPet, deletePet, getPetImageUrl }}
        >
            {children}
        </PetsContext.Provider>

    )
}