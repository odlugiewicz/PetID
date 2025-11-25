import React, { createContext, useState, useCallback, useEffect } from 'react'
import { ID, Permission, Role, Query } from 'react-native-appwrite'
import { databases, client } from '../lib/appwrite'
import { useUser } from '../hooks/useUser'

const DATABASE_ID = "69051e15000f0c86fdb1"
const MEDICALREC_TABLE_ID = "medical_records"

export const MedicalRecordContext = createContext()

export function MedicalRecordsProvider({ children }) {
    const { user } = useUser()
    const [patient, setPatient] = useState(null)
    const { patientId: patientId } = useLocalSearchParams()

    const addMedicalRecord = useCallback(async (patientId, data) => {
        if (!user) return
        
        setLoading(true)
        try {
            const newRecord = await databases.createDocument(
                DATABASE_ID,
                MEDICALREC_TABLE_ID,
                ID.unique(),
                { 
                    ...data, 
                    recordId: patientId,
                    visitDate: new Date().toISOString()
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.read(Role.any('vet')),
                    Permission.update(Role.any('vet')),
                    Permission.delete(Role.any('vet')),
                ]
            )
            setRecords(prev => [...prev, newRecord])
            return newRecord
        } catch (err) {
            setError(err.message)
            console.error("Failed to add medical record:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user])

    const getMedicalRecords = useCallback(async (patientId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                MEDICALREC_TABLE_ID,
                [Query.equal("recordId", patientId)]
            )
            setRecords(response.documents)
            return response.documents
        } catch (err) {
            setError(err.message)
            console.error("Failed to fetch medical records:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        let unsubscribe

        if (user) {
            const channel = `databases.${DATABASE_ID}.collections.${MEDICALREC_TABLE_ID}.documents`

            unsubscribe = client.subscribe(channel, (response) => {
                const { payload, events } = response

                if (events[0].includes("create")) {
                    setRecords((prev) => [...prev, payload])
                }
                if (events[0].includes("delete")) {
                    setRecords((prev) => prev.filter((r) => r.$id !== payload.$id))
                }
                if (events[0].includes("update")) {
                    setRecords((prev) => prev.map(r => r.$id === payload.$id ? payload : r))
                }
            })
        }

        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [user])

    const value = {
        records,
        loading,
        error,
        addMedicalRecord,
        getMedicalRecords,
    }

    

    return (
        <MedicalRecordContext.Provider value={value}>
            {children}
        </MedicalRecordContext.Provider>
    )
}


