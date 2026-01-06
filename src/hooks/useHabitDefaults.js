import { useState, useEffect } from 'react';

const API_DEFAULT = 'http://localhost:3001/api/defaults';

export function useHabitDefaults() {
    const [defaultHabits, setDefaultHabits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load defaults on mount
    useEffect(() => {
        setIsLoading(true);
        fetch(API_DEFAULT)
            .then(res => res.json())
            .then(data => {
                setDefaultHabits(data || []);
                setError(null);
            })
            .catch(err => {
                console.error("Error loading defaults:", err);
                setError(err.message);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const saveDefaults = async (newDefaults) => {
        try {
            await fetch(API_DEFAULT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDefaults)
            });
            setDefaultHabits(newDefaults);
        } catch (err) {
            console.error("Error saving defaults:", err);
            setError("Failed to save changes");
        }
    };

    const addDefaultHabit = (name, color) => {
        const newHabit = { name, color };
        saveDefaults([...defaultHabits, newHabit]);
    };

    const deleteDefaultHabit = (index) => {
        const updated = defaultHabits.filter((_, i) => i !== index);
        saveDefaults(updated);
    };

    return {
        defaultHabits,
        isLoading,
        error,
        addDefaultHabit,
        deleteDefaultHabit
    };
}
