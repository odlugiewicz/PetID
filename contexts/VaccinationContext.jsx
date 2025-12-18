import { createContext, useEffect, useState } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases, client, storage } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "69051e15000f0c86fdb1";
const VACCINATION_ID = "vaccination";

export const VaccinationContext = createContext();

export function VaccinationProvider({ children }) {
    const [vaccinations, setVaccinations] = useState([]);
    const [pet, setPet] = useState(null);
    const { user } = useUser();

    async function addVaccination({ vaccineName, dosage, applicationDate, expiryDate, manufacturer, batchNumber, petId, vetId, notes }) {
        if (!user || user.role !== 'vet') return;
        try {
            const newVaccination = await databases.createDocument(
                DATABASE_ID,
                VACCINATION_ID,
                ID.unique(),
                {
                    vaccineName,
                    dosage,
                    applicationDate,
                    expiryDate,
                    manufacturer,
                    batchNumber,
                    petId,
                    vetId,
                    notes: notes || null
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            );
            setVaccinations((prev) => [...prev, newVaccination]);
            return newVaccination;
        } catch (error) {
            console.error("Failed to add vaccination:", error);
            throw error;
        }
    }

    async function fetchVaccinationsByPet(petId) {
        if (!user) return [];
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                VACCINATION_ID,
                [Query.equal('petId', petId), Query.orderDesc('applicationDate')]
            );
            setVaccinations(res.documents);
            return res.documents;
        } catch (error) {
            console.error('Failed to fetch vaccinations:', error);
            return [];
        }
    }

    return (
        <VaccinationContext.Provider value={{ vaccinations, addVaccination, fetchVaccinationsByPet }}>
            {children}
        </VaccinationContext.Provider>
    );
}
