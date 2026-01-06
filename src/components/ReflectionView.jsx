import React, { useMemo } from 'react';
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
import { getDaysInMonth } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function ReflectionView({ currentDate, habits, dailyLogs }) {
    const daysInMonth = getDaysInMonth(currentDate);

    // Calculate stats for each habit
    const chartData = useMemo(() => {
        const data = habits.map(habit => {
            // Count how many times this habit appears in dailyLogs for this month
            // Note: dailyLogs is { "1": [id1, id2], "2": [id1] }
            let count = 0;
            Object.values(dailyLogs).forEach(dayLog => {
                if (dayLog.includes(habit.id)) count++;
            });
            return count;
        });

        return {
            labels: habits.map(h => h.name),
            datasets: [
                {
                    label: 'Days Completed',
                    data: data,
                    backgroundColor: habits.map(h => h.color),
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        };
    }, [habits, dailyLogs]);

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: daysInMonth, // Maximum is number of days in month
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Monthly Reflection: Habit Consistency',
                font: {
                    family: "'Courier New', Courier, monospace",
                    size: 16
                }
            },
        },
    };

    return (
        <div style={{
            marginTop: '4rem',
            padding: '2rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-color)'
        }}>
            <h2 style={{
                fontFamily: 'var(--font-hand)',
                marginTop: 0,
                marginBottom: '1rem',
                fontSize: '1.5rem',
                borderBottom: '2px solid var(--color-accent-2)',
                display: 'inline-block'
            }}>
                Monthly Reflection
            </h2>

            {habits.length > 0 ? (
                <div style={{ height: '300px' }}>
                    <Bar options={options} data={chartData} />
                </div>
            ) : (
                <p style={{ color: 'var(--text-secondary)' }}>Track some habits to see your reflection here.</p>
            )}
        </div>
    );
}
