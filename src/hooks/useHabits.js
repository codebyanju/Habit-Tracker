import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const API_URL = 'http://localhost:3001/api/data';

/**
 * Custom hook to manage habits and daily logs.
 * Syncs with the local Node.js backend.
 * 
 * @param {Date} currentDate - The currently selected month (as a Date object)
 */
export function useHabits(currentDate) {
    const [habits, setHabits] = useState([]);
    const [dailyLogs, setDailyLogs] = useState({}); // { dayNumber: [habitId1, habitId2] }
    const [reflection, setReflection] = useState({ summary: "", mood: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const monthId = format(currentDate, 'yyyy-MM');

    // Load data when month changes
    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/${monthId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch data');
                return res.json();
            })
            .then(data => {
                setHabits(data.habits || []);
                setDailyLogs(data.dailyLogs || {});
                setReflection(data.reflection || { summary: "", mood: "" });
                setError(null);
            })
            .catch(err => {
                console.error("Error loading habits:", err);
                setError(err.message);
            })
            .finally(() => setIsLoading(false));
    }, [monthId]);

    // Save data whenever state changes (debounced could be better, but direct for now)
    const saveData = async (newHabits, newLogs, newReflection) => {
        const payload = {
            monthId,
            habits: newHabits,
            dailyLogs: newLogs,
            reflection: newReflection
        };

        try {
            await fetch(`${API_URL}/${monthId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.error("Error saving data:", err);
            // Optional: set error state slightly un-intrusively
        }
    };

    const addHabit = (name, color) => {
        const newHabit = {
            id: crypto.randomUUID(),
            name,
            color,
            createdAt: new Date().toISOString()
        };
        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        saveData(updatedHabits, dailyLogs, reflection);
    };

    const deleteHabit = (habitId) => {
        const updatedHabits = habits.filter(h => h.id !== habitId);
        // Optional: cleanup logs for this habit? For now, keep them is fine.
        setHabits(updatedHabits);
        saveData(updatedHabits, dailyLogs, reflection);
    };

    const toggleHabit = (day, habitId) => {
        const dayLogs = dailyLogs[day] || [];
        let newDayLogs;

        if (dayLogs.includes(habitId)) {
            newDayLogs = dayLogs.filter(id => id !== habitId);
        } else {
            newDayLogs = [...dayLogs, habitId];
        }

        const updatedLogs = {
            ...dailyLogs,
            [day]: newDayLogs
        };

        setDailyLogs(updatedLogs);
        saveData(habits, updatedLogs, reflection);
    };

    const updateReflection = (field, value) => {
        const updatedReflection = { ...reflection, [field]: value };
        setReflection(updatedReflection);
        saveData(habits, dailyLogs, updatedReflection);
    };

    return {
        habits,
        dailyLogs,
        reflection,
        isLoading,
        error,
        addHabit,
        deleteHabit,
        toggleHabit,
        updateReflection
    };
}
