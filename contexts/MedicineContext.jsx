import { createContext, useState } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "69051e15000f0c86fdb1";
const MEDICINE_ID = "medicine";

export const MedicineContext = createContext();

export function MedicineProvider({ children }) {
    const [medicines, setMedicines] = useState([]);
    const { user } = useUser();

    async function addMedicine({ medicineName, manufacturer, dosage, endDate, petId }) {
        if (!user || user.role !== 'vet') return;
        try {
            const newDoc = await databases.createDocument(
                DATABASE_ID,
                MEDICINE_ID,
                ID.unique(),
                {
                    medicineName,
                    manufacturer: manufacturer || null,
                    dosage,
                    endDate,
                    petId,
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            );
            setMedicines((prev) => [newDoc, ...prev]);
            return newDoc;
        } catch (error) {
            console.error("Failed to add medicine:", error);
            throw error;
        }
    }

    async function fetchMedicinesByPet(petId) {
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                MEDICINE_ID,
                [Query.equal('petId', petId), Query.orderDesc('$createdAt')]
            );
            setMedicines(res.documents);
            return res.documents;
        } catch (error) {
            console.error('Failed to fetch medicines:', error);
            return [];
        }
    }

    return (
        <MedicineContext.Provider value={{ medicines, addMedicine, fetchMedicinesByPet }}>
            {children}
        </MedicineContext.Provider>
    );
}
