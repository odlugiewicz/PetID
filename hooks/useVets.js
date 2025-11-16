import { VetContext } from "../contexts/VetContext";
import { useContext } from "react";

export function useVet() {
    const context = useContext(VetContext);
    
    if (!context) {
        throw new Error("useVet must be used within a VetProvider");
    }

    return context;
}