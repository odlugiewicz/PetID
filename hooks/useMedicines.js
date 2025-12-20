import { useContext } from "react";
import { MedicineContext } from "../contexts/MedicineContext";

export function useMedicines() {
    const context = useContext(MedicineContext);
    if (!context) {
        throw new Error("useMedicines must be used within a MedicineProvider");
    }
    return context;
}
