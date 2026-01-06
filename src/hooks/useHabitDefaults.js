import { useState, useEffect } from 'react';

const API_DEFAULT = 'http://localhost:3001/api/defaults';
const API_RECOMMENDATIONS = 'http://localhost:3001/api/recommendations';

export function useHabitDefaults() {
    const [defaultHabits, setDefaultHabits] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load defaults and recommendations on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [defaultsRes, recsRes] = await Promise.all([
                    fetch(API_DEFAULT),
                    fetch(API_RECOMMENDATIONS)
                ]);

                if (!defaultsRes.ok) throw new Error("Failed to load defaults");

                const defaultsData = await defaultsRes.json();
                setDefaultHabits(defaultsData || []);

                // Only process recommendations if endpoint exists/succeeds
                if (recsRes.ok) {
                    const recsData = await recsRes.json();
                    setRecommendations(recsData || []);
                }

                setError(null);
            } catch (err) {
                console.error("Error loading data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const saveDefaults = async (newDefaults) => {
        try {
            await fetch(API_DEFAULT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDefaults)
            });
            setDefaultHabits(newDefaults);

            // Optimistically remove added habits from recommendations
            const newNames = newDefaults.map(d => d.name.toLowerCase());
            setRecommendations(prev => prev.filter(r => !newNames.includes(r.name.toLowerCase())));

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
        recommendations,
        isLoading,
        error,
        addDefaultHabit,
        deleteDefaultHabit
    };
}
