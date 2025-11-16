import { createContext, useEffect, useState, useContext } from "react";
import { ID, Permission, Role, Query } from "react-native-appwrite";
import { databases, client } from "../lib/appwrite";
import { useUser } from "../hooks/useUser"; 

const DATABASE_ID = "69051e15000f0c86fdb1"
const PATIENTS_TABLE_ID = "patients";
const VETS_TABLE_ID = "vets";

export const VetContext = createContext();

export function useVet() {
    const context = useContext(VetContext);
    if (!context) {
        throw new Error("useVet must be used within a VetProvider");
    }
    return context;
}

export function VetProvider({ children }) {
    const [patients, setPatients] = useState([]);
    const { user } = useUser();

    async function fetchPatients() {
        if (!user || user.role !== 'vet') return;
        
        try {

            console.log("Logika fetchPatients do implementacji w VetContext.jsx");

        } catch (error) {
            console.error("Failed to fetch patients:", error);
        }
    }

    useEffect(() => {
        let unsubscribe;
       
        const channel = `databases.${DATABASE_ID}.collections.${PATIENTS_TABLE_ID}.documents`;

        if (user && user.role === 'vet') {
            fetchPatients();

          
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
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    return (
        <VetContext.Provider
            value={{ patients, fetchPatients }}
        >
            {children}
        </VetContext.Provider>
    );
}