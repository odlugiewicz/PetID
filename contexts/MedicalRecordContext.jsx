import { createContext, useEffect, useState } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases, client, storage } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "69051e15000f0c86fdb1";
const MEDRECORD_ID = "medical_records";

export const MedicalRecordContext = createContext();

export function MedicalRecordProvider({ children }) {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [pet, setPet] = useState(null);
    const { user } = useUser();

    async function addMedicalRecord({ title, visitDate, diagnosis, treatment, notes, nextAppointment, vetId, petId }) {
        if (!user || user.role !== 'vet' ) return;

        try {
            const newRecord = await databases.createDocument(
                DATABASE_ID,
                MEDRECORD_ID,
                ID.unique(),
                {
                    title,
                    visitDate,
                    diagnosis: diagnosis || null,
                    treatment: treatment || null,
                    notes: notes || null,
                    nextAppointment: nextAppointment || null,
                    vetId,
                    pet: petId
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            );

            setMedicalRecords((prev) => [...prev, newRecord]);
            return newRecord;
        } catch (error) {
            console.error("Failed to add medical record:", error);
            throw error;
        }
    }

    return (
        <MedicalRecordContext.Provider value={{ medicalRecords, addMedicalRecord }}>
            {children}
        </MedicalRecordContext.Provider>
    );
}