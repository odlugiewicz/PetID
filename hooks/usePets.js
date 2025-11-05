import { useContext } from "react";
import { PetsContext } from "../contexts/PetsContext";

export function usePets() {
    const context = useContext(PetsContext);
    
    if (!context) {
        throw new Error("useUser must be used within a PetsProvider");
    }

    return context;
}