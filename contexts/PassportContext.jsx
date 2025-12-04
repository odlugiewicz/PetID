import React, { createContext, useContext, useState } from 'react'
import { databases } from '../lib/appwrite'
import { Query } from 'react-native-appwrite'

const DATABASE_ID = "69051e15000f0c86fdb1"
const PASSPORTS_COLLECTION_ID = "passports"

const PassportContext = createContext()

export const PassportProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

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

    const createPassport = async (passportData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                PASSPORTS_COLLECTION_ID,
                'unique()',
                passportData
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
                deletePassport
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