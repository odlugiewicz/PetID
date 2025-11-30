import { MedicalRecordContext } from "../contexts/MedicalRecordContext"; 
import { useContext } from "react";

export function useMedicalRecord() {
    const context = useContext(MedicalRecordContext);
    
    if (!context) {
        throw new Error("useMedicalRecord must be used within a MedicalRecordProvider");
    }

    return context;
}