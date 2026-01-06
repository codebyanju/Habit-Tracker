import React, { useMemo, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getDaysInMonth, subMonths, format, startOfMonth, getDay } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function ReflectionView({ currentDate, habits, dailyLogs }) {
    const [viewMode, setViewMode] = useState('single'); // 'single' | 'compare'
    const [compareMonthOffset, setCompareMonthOffset] = useState(1); // 1 = previous month
    const [compareData, setCompareData] = useState(null);

    const daysInMonth = getDaysInMonth(currentDate);

    // Derived date for comparison
    const compareDate = subMonths(currentDate, compareMonthOffset);
    const compareMonthId = format(compareDate, 'yyyy-MM');

    // Fetch comparison data when needed
    useEffect(() => {
        if (viewMode === 'compare') {
            fetch(`http://localhost:3001/api/data/${compareMonthId}`)
                .then(res => res.json())
                .then(data => setCompareData(data))
                .catch(err => console.error("Failed to load comparison data", err));
        }
    }, [viewMode, compareMonthId]);

    // CHART DATA GENERATION
    const chartData = useMemo(() => {
        const currentData = habits.map(habit => {
            let count = 0;
            Object.values(dailyLogs).forEach(dayLog => {
                if (dayLog.includes(habit.id)) count++;
            });
            return count;
        });

        const datasets = [
            {
                label: format(currentDate, 'MMM yyyy'),
                data: currentData,
                backgroundColor: habits.map(h => h.color),
                borderRadius: 4,
                barPercentage: 0.6,
            }
        ];

        if (viewMode === 'compare' && compareData) {
            const prevData = habits.map(habit => {
                const prevHabit = compareData.habits?.find(h => h.name === habit.name);
                if (!prevHabit) return 0;
                let count = 0;
                Object.values(compareData.dailyLogs || {}).forEach(dayLog => {
                    if (dayLog.includes(prevHabit.id)) count++;
                });
                return count;
            });

            datasets.push({
                label: format(compareDate, 'MMM yyyy'),
                data: prevData,
                backgroundColor: '#bdbdbd',
                borderRadius: 4,
                barPercentage: 0.6,
            });
        }

        return {
            labels: habits.map(h => h.name),
            datasets: datasets,
        };
    }, [habits, dailyLogs, compareData, currentDate, compareDate, viewMode]);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>

            {/* Header & Controls */}
            <div style={{
                marginTop: '2rem',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{ fontFamily: 'var(--font-hand)', margin: 0 }}>Analytics</h2>

                <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => setViewMode('single')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: viewMode === 'single' ? 'var(--color-accent-2)' : 'transparent',
                            fontWeight: viewMode === 'single' ? 'bold' : 'normal',
                            cursor: 'pointer'
                        }}
                    >
                        Current Month
                    </button>
                    <button
                        onClick={() => setViewMode('compare')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: viewMode === 'compare' ? 'var(--color-accent-2)' : 'transparent',
                            fontWeight: viewMode === 'compare' ? 'bold' : 'normal',
                            cursor: 'pointer'
                        }}
                    >
                        Compare Months
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                padding: '2rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid var(--border-color)'
            }}>

                {viewMode === 'compare' && (
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Comparing <strong>{format(currentDate, 'MMMM')}</strong> vs </span>
                        <select
                            value={compareMonthOffset}
                            onChange={(e) => setCompareMonthOffset(Number(e.target.value))}
                            style={{
                                marginLeft: '0.5rem',
                                padding: '0.3rem',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                fontFamily: 'var(--font-primary)'
                            }}
                        >
                            <option value={1}>Last Month</option>
                            <option value={2}>2 Months Ago</option>
                            <option value={3}>3 Months Ago</option>
                            <option value={12}>Last Year</option>
                        </select>
                    </div>
                )}

                {habits.length > 0 ? (
                    <div style={{ height: '400px' }}>
                        <Bar
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: { beginAtZero: true, max: daysInMonth, grid: { display: false } },
                                    x: { grid: { display: false } }
                                },
                                plugins: {
                                    legend: { display: true, position: 'bottom' },
                                    title: { display: true, text: viewMode === 'compare' ? 'Performance Comparison' : 'Habit Consistency' }
                                }
                            }}
                            data={chartData}
                        />
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No habits tracked for {format(currentDate, 'MMMM')}.
                    </p>
                )}
            </div>
        </div>
    );
}
