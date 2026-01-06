import React from 'react';
import { getDaysInMonth, format, isWeekend, isSunday } from 'date-fns';

/**
 * Renders the main grid of habits with enhanced visuals.
 * - Shows Weekday initials (M, T, W...)
 * - Highlights Weekends
 * - Groups by 7 days (visual separator ALIGNED TO SUNDAY)
 * - Compact layout to fit 31 days without scroll
 */
export function HabitGrid({ currentDate, habits, dailyLogs, onToggleHabit }) {
    const daysInMonth = getDaysInMonth(currentDate);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
        return {
            day: i + 1,
            date: date,
            isWeekend: isWeekend(date),
            isSunday: isSunday(date),
            weekdayInitial: format(date, 'EEEEE') // 'M', 'T', 'W'...
        };
    });

    return (
        <div className="habit-grid-container" style={{
            overflowX: 'visible', // Removed scroll requirement
            paddingBottom: '1rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                tableLayout: 'fixed',
                // Removed minWidth to force fit
            }}>
                {/* Table Header: Days */}
                <thead>
                    <tr>
                        <th style={{
                            width: '150px', // Slightly smaller habit name column
                            textAlign: 'left',
                            padding: '1rem 0.5rem',
                            borderBottom: '2px solid var(--border-color)',
                            position: 'sticky',
                            left: 0,
                            backgroundColor: '#fff',
                            zIndex: 10
                        }}>
                            <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem' }}>Habits</span>
                        </th>
                        {daysArray.map((d, index) => (
                            <th key={d.day} style={{
                                // No fixed width, let table layout handle it evenly
                                textAlign: 'center',
                                borderBottom: '2px solid var(--border-color)',
                                backgroundColor: d.isWeekend ? '#fafafa' : '#fff',
                                // Separator ONLY on Sunday to mark end of week
                                borderRight: (d.isSunday && d.day !== daysInMonth) ? '2px solid var(--border-color)' : '1px dashed #eee',
                                padding: '5px 0'
                            }}>
                                <div style={{
                                    fontSize: '0.6rem',
                                    color: d.isWeekend ? 'var(--color-accent-1)' : 'var(--text-secondary)',
                                    marginBottom: '2px'
                                }}>
                                    {d.weekdayInitial}
                                </div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    color: 'var(--text-primary)'
                                }}>
                                    {d.day}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Table Body: Habits */}
                <tbody>
                    {habits.map(habit => (
                        <tr key={habit.id} style={{ height: '45px' }}> {/* More compact rows */}
                            <td style={{
                                padding: '0 0.5rem',
                                fontWeight: '500',
                                borderRight: '1px solid var(--border-color)',
                                borderBottom: '1px solid var(--border-color)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                position: 'sticky',
                                left: 0,
                                backgroundColor: '#fff',
                                zIndex: 5,
                                fontSize: '0.9rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: habit.color,
                                        marginRight: '8px',
                                        flexShrink: 0
                                    }}></span>
                                    <span style={{ fontFamily: 'var(--font-hand)' }}>{habit.name}</span>
                                </div>
                            </td>

                            {daysArray.map(d => {
                                const isCompleted = dailyLogs[d.day]?.includes(habit.id);
                                return (
                                    <td key={d.day}
                                        onClick={() => onToggleHabit(d.day, habit.id)}
                                        style={{
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            borderRight: (d.isSunday && d.day !== daysInMonth) ? '2px solid var(--border-color)' : '1px dashed #eee',
                                            borderBottom: '1px solid var(--border-color)',
                                            backgroundColor: d.isWeekend ? '#fafafa' : '#fff',
                                            transition: 'background-color 0.2s',
                                            padding: 0
                                        }}
                                        onMouseEnter={e => !d.isWeekend && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                                        onMouseLeave={e => !d.isWeekend && (e.currentTarget.style.backgroundColor = '#fff')}
                                    >
                                        {isCompleted && (
                                            <div style={{
                                                width: '18px', // Smaller checkmark
                                                height: '18px',
                                                backgroundColor: habit.color,
                                                borderRadius: '4px',
                                                margin: '0 auto',
                                                animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                            }} />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
        @keyframes popIn {
          from { transform: scale(0) rotate(-45deg); opacity: 0; }
          to { transform: scale(1) rotate(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
