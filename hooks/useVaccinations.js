import { VaccinationContext } from "../contexts/VaccinationContext";
import { useContext } from "react";

export function useVaccinations() {
    const context = useContext(VaccinationContext);
    
    if (!context) {
        throw new Error("useVaccinations must be used within a VaccinationProvider");
    }

    return context;
}
