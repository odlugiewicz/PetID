import { createContext, useContext, useState } from 'react'
import { ID, Permission, Role, Query } from 'react-native-appwrite'
import { databases, storage } from '../lib/appwrite'
import { useUser } from '../hooks/useUser'

const DATABASE_ID = "69051e15000f0c86fdb1"
const PASSPORTS_COLLECTION_ID = "passports"
const BUCKET_ID = "69111f64001a3b3c4563"

const PassportContext = createContext()

export const PassportProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { user } = useUser();

    const fetchPassportById = async (passportId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                PASSPORTS_COLLECTION_ID,
                passportId
            )
            return response
        } catch (err) {
            console.error('Error fetching passport:', err)
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }

    const fetchPassportByPetId = async (petId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PASSPORTS_COLLECTION_ID,
                [Query.equal('pet', petId)]
            )
            return response.documents[0] || null
        } catch (err) {
            console.error('Error fetching passport by pet ID:', err)
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }

    async function uploadPassportImage(imageAsset, userId) {
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

    const getPassportImageUrl = (imageId) => {
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


    const createPassport = async (passportData, image) => {
        setLoading(true)
        setError(null)
        try {
            let imageId = null;

            if (image && user?.$id) {
                imageId = await uploadPassportImage(image, user.$id);
            }

            const response = await databases.createDocument(
                DATABASE_ID,
                PASSPORTS_COLLECTION_ID,
                'unique()',
                { ...passportData, imageId: imageId }
            )
            return response
        } catch (err) {
            console.error('Error creating passport:', err)
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }

    const updatePassport = async (passportId, passportData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                PASSPORTS_COLLECTION_ID,
                passportId,
                passportData
            )
            return response
        } catch (err) {
            console.error('Error updating passport:', err)
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }

    const deletePassport = async (passportId) => {
        setLoading(true)
        setError(null)
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                PASSPORTS_COLLECTION_ID,
                passportId
            )
            return true
        } catch (err) {
            console.error('Error deleting passport:', err)
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    return (
        <PassportContext.Provider
            value={{
                loading,
                error,
                fetchPassportById,
                fetchPassportByPetId,
                createPassport,
                updatePassport,
                deletePassport,
                getPassportImageUrl
            }}
        >
            {children}
        </PassportContext.Provider>
    )
}

export const usePassport = () => {
    const context = useContext(PassportContext)
    if (!context) {
        throw new Error('usePassport must be used within a PassportProvider')
    }
    return context
}