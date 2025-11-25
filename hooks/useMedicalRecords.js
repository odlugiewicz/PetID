import { useContext } from "react";
import { MedicalRecordContext } from "../contexts/MedicalRecordContext";

export const useMedicalRecords = () => {
    const context = useContext(MedicalRecordContext)
    if (!context) {
        throw new Error('useMedicalRecords must be used within MedicalRecordsProvider')
    }
    return context
}