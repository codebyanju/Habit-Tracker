import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { format, addMonths, subMonths, setMonth, setYear } from 'date-fns';
import { HabitGrid } from './HabitGrid';

export function TrackerView({ currentDate, setCurrentDate, habits, dailyLogs, onToggleHabit, onAddHabit }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newHabitName, setNewHabitName] = useState("");

    const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

    const handleDateChange = (e) => {
        if (!e.target.value) return;
        const [year, month] = e.target.value.split('-');
        const newDate = new Date(currentDate);
        newDate.setFullYear(parseInt(year));
        newDate.setMonth(parseInt(month) - 1); // Month is 0-indexed
        setCurrentDate(newDate);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            // Random pastel color
            const colors = ['#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            onAddHabit(newHabitName, randomColor);
            setNewHabitName("");
            setIsAdding(false);
        }
    };

    return (
        <div>
            {/* 1. Month Navigation Toolbar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '0.5rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={handlePrevMonth} style={{ padding: '0.5rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} color="var(--text-primary)" />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h2 style={{
                            margin: 0,
                            fontFamily: 'var(--font-hand)',
                            fontSize: '1.5rem',
                            minWidth: '180px',
                            textAlign: 'center'
                        }}>
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>

                        {/* Native Date Picker (Hidden but triggered by icon) */}
                        <div
                            style={{ position: 'relative', width: '24px', height: '24px', cursor: 'pointer' }}
                            onClick={() => document.getElementById('month-picker').showPicker()}
                            title="Select Month"
                        >
                            <Calendar
                                size={20}
                                color="var(--text-secondary)"
                                style={{ position: 'absolute', top: '2px', left: '2px' }}
                            />
                            <input
                                id="month-picker"
                                type="month"
                                value={format(currentDate, 'yyyy-MM')}
                                onChange={handleDateChange}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                                aria-label="Choose Month"
                            />
                        </div>
                    </div>

                    <button onClick={handleNextMonth} style={{ padding: '0.5rem', cursor: 'pointer' }}>
                        <ChevronRight size={20} color="var(--text-primary)" />
                    </button>
                </div>

                {/* 2. Add Habit Button */}
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        backgroundColor: isAdding ? '#f0f0f0' : 'var(--text-primary)',
                        color: isAdding ? 'var(--text-primary)' : '#fff',
                        borderRadius: '2rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                >
                    <Plus size={16} />
                    {isAdding ? 'Cancel' : 'Add Habit'}
                </button>
            </div>

            {/* 3. Add Habit Inline Form */}
            {isAdding && (
                <form onSubmit={handleAddSubmit} style={{ marginBottom: '1.5rem', animation: 'slideDown 0.2s ease-out' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Enter habit name..."
                            value={newHabitName}
                            onChange={e => setNewHabitName(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                borderRadius: '4px',
                                border: '1px solid var(--color-accent-6)',
                                outline: 'none',
                                fontFamily: 'var(--font-hand)',
                                fontSize: '1rem'
                            }}
                        />
                        <button type="submit" style={{
                            padding: '0 1.5rem',
                            backgroundColor: 'var(--color-accent-4)',
                            border: '1px solid #b2dfdb',
                            borderRadius: '4px',
                            color: '#00695c',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}>Save</button>
                    </div>
                </form>
            )}

            {/* 4. The Grid */}
            <HabitGrid
                currentDate={currentDate}
                habits={habits}
                dailyLogs={dailyLogs}
                onToggleHabit={onToggleHabit}
            />

            <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
