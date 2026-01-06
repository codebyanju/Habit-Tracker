import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useHabitDefaults } from '../hooks/useHabitDefaults';

export function ManageDashboard() {
    const { defaultHabits, recommendations, isLoading, addDefaultHabit, deleteDefaultHabit } = useHabitDefaults();
    const [customName, setCustomName] = useState("");

    const handleCreate = (e) => {
        e.preventDefault();
        if (customName.trim()) {
            // Random color
            const colors = ['#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            addDefaultHabit(customName, randomColor);
            setCustomName("");
        }
    };

    if (isLoading) return <p>Loading templates...</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Introduction Banner */}
            <div style={{
                backgroundColor: '#e3f2fd',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                border: '1px solid #bbdefb',
                color: '#0d47a1'
            }}>
                <h3 style={{ marginTop: 0, fontFamily: 'var(--font-hand)' }}>Global Templates</h3>
                <p style={{ margin: 0 }}>
                    These are your <strong>Default Habits</strong>. They will be automatically copied to any <strong>new month</strong> you open.
                    Use this to set up your ideal routine once!
                </p>
            </div>

            {/* 1. Smart Recommendations (NEW) */}
            {recommendations.length > 0 && (
                <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Sparkles size={18} color="#9c27b0" />
                        <h3 style={{
                            color: '#9c27b0',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            margin: 0
                        }}>Found in History</h3>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {recommendations.map((rec, idx) => (
                            <button
                                key={idx}
                                onClick={() => addDefaultHabit(rec.name, rec.color)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    backgroundColor: '#f3e5f5',
                                    border: '1px solid #e1bee7',
                                    color: '#4a148c',
                                    borderRadius: '2rem',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s',
                                    fontFamily: 'var(--font-hand)'
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: rec.color }}></div>
                                {rec.name}
                                <Plus size={14} />
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* 2. Add New Default */}
            <section style={{ marginBottom: '3rem', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontFamily: 'var(--font-hand)', marginTop: 0 }}>Add New Template</h2>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        placeholder="e.g. Read 30 mins..."
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            fontSize: '1rem',
                            fontFamily: 'var(--font-hand)'
                        }}
                    />
                    <button type="submit" style={{
                        backgroundColor: 'var(--text-primary)',
                        color: '#fff',
                        padding: '0 1.5rem',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        Add
                    </button>
                </form>
            </section>

            {/* 3. List of Default Habits */}
            <section>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Template List</h3>
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                    {defaultHabits.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No default habits set. Add some above!</p>}

                    {defaultHabits.map((habit, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            backgroundColor: '#fff',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: habit.color }}></div>
                                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{habit.name}</span>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm(`Remove "${habit.name}" from your global template?`)) deleteDefaultHabit(index);
                                }}
                                style={{ color: '#ff6b6b', padding: '0.5rem', cursor: 'pointer' }}
                                aria-label="Delete template"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
