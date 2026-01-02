import { useContext } from 'react'
import { ChipContext } from '../contexts/ChipContext'

export function useChips() {
    const context = useContext(ChipContext)

    if (!context) {
        throw new Error('useChips must be used within a ChipProvider')
    }

    return context
}
