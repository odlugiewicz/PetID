import { createContext, useEffect, useState } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases, client } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "69051e15000f0c86fdb1"
const PATIENTS_TABLE_ID = "patients";
const VETS_TABLE_ID = "vets";
const PET_TOKENS_TABLE_ID = "pet_tokens";

export const VetContext = createContext();

export function VetProvider({ children }) {
    const [patients, setPatients] = useState([]);
    const [vetData, setVetData] = useState(null);
    const { user } = useUser();

    async function fetchVetData() {
        if (!user || user.role !== 'vet') return;
        
        try {
            const response = await databases.listDocuments(DATABASE_ID, VETS_TABLE_ID, [
                Query.equal("userId", user.$id)
            ]);

            if (response.documents.length > 0) {
                setVetData(response.documents[0]);
            }
        } catch (error) {
            console.error("Failed to fetch vet data:", error);
        }
    }

    async function fetchPatients() {
        if (!user || user.role !== 'vet' || !vetData) return;
        
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PATIENTS_TABLE_ID
            );
            const filteredPatients = response.documents.filter(p => 
                p.vetId === vetData.$id || p.vetId?.$id === vetData.$id
            );

            const patientsWithPetData = await Promise.all(
                filteredPatients.map(async (patient) => {
                    try {
                        const petData = await databases.getDocument(
                            DATABASE_ID,
                            "pets",
                            patient.petId
                        );
                        return { ...patient, name: petData.name, species: petData.species, breed: petData.breed, ownerName: petData.ownerName };
                    } catch (error) {
                        console.error("Failed to fetch pet data:", error);
                        return patient;
                    }
                })
            );

            setPatients(patientsWithPetData);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        }
    }

    async function addPatientByToken(token) {
        if (!user || user.role !== 'vet' || !vetData) return;
        
        try {
            const tokenResponse = await databases.listDocuments(
                DATABASE_ID,
                PET_TOKENS_TABLE_ID,
                [
                    Query.equal("token", token),
                    Query.equal("used", false)
                ]
            );

            if (tokenResponse.documents.length === 0) {
                throw new Error("Invalid or expired token");
            }

            const tokenDoc = tokenResponse.documents[0];
            
            // Check if token expired
            if (new Date(tokenDoc.expiresAt) < new Date()) {
                throw new Error("Token has expired");
            }

            // Fetch pet data
            const pet = await databases.getDocument(
                DATABASE_ID,
                "pets",
                tokenDoc.petId
            );

            const patientRecord = await databases.createDocument(
                DATABASE_ID,
                PATIENTS_TABLE_ID,
                ID.unique(),
                {
                    petId: tokenDoc.petId,  
                    vetId: vetData.$id,
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id)),
                ]
            );

            // Mark token as used
            await databases.updateDocument(
                DATABASE_ID,
                PET_TOKENS_TABLE_ID,
                tokenDoc.$id,
                { used: true }
            );

            // Fetch pet data and add to state
            const petData = await databases.getDocument(
                DATABASE_ID,
                "pets",
                tokenDoc.petId
            );

            const patientWithPetData = { ...patientRecord, name: petData.name, species: petData.species, breed: petData.breed, ownerName: petData.ownerName };

            setPatients((prev) => [...prev, patientWithPetData]);
            return patientWithPetData;
        } catch (error) {
            console.error("Failed to add patient by token:", error);
            throw error;
        }
    }

    useEffect(() => {
        let unsubscribe;
       
        const channel = `databases.${DATABASE_ID}.collections.${PATIENTS_TABLE_ID}.documents`;

        if (user && user.role === 'vet') {
            fetchVetData();

            unsubscribe = client.subscribe(channel, (response) => {
                const { payload, events } = response;
                console.log(events);

                if (events[0].includes("create")) {
                    setPatients((prev) => [...prev, payload]);
                }
                if (events[0].includes("delete")) {
                    setPatients((prev) => prev.filter((p) => p.$id !== payload.$id));
                }
                if (events[0].includes("update")) {
                    setPatients((prev) => prev.map(p => p.$id === payload.$id ? payload : p));
                }
            });

        } else {
            setPatients([]);
            setVetData(null);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    useEffect(() => {
        if (vetData) {
            fetchPatients();
        }
    }, [vetData]);

    return (
        <VetContext.Provider
            value={{ patients, vetData, fetchPatients, fetchVetData, addPatientByToken }}
        >
            {children}
        </VetContext.Provider>
    );
}