import { PassportContext } from "../contexts/PassportContext"; 
import { useContext } from "react";

export function usePassport() {
    const context = useContext(PassportContext);
    
    if (!context) {
        throw new Error("usePassport must be used within a PassportProvider");
    }

    return context;
}