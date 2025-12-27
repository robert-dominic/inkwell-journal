import { useState, useEffect } from "react"

export function useLocalStorage(key, initialValue) {
    //Get initial value from localStorage or use initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error('Error reading from localStorage', error)
            return initialValue
        }
    })

    //Update localStorage whenever storedValue changes
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch (error) {
            console.error('Error writing to localStorage', error)
        }
    }, [key, storedValue])

    return [storedValue, setStoredValue]
}