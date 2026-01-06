import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Header({ activePath }) {
    const navigate = useNavigate();

    const tabs = [
        { id: '/tracker', label: 'Tracker' },
        { id: '/charts', label: 'Analysis' },
        { id: '/manage', label: 'Manage' },
    ];

    return (
        <header style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginBottom: '2rem'
        }}>
            {/* Navigation Tabs (Routes) */}
            <nav style={{
                display: 'flex',
                gap: '1rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.id)}
                        style={{
                            padding: '0.8rem 1.5rem',
                            fontSize: '1rem',
                            fontFamily: 'var(--font-ui)',
                            fontWeight: activePath.includes(tab.id) ? '600' : '400',
                            color: activePath.includes(tab.id) ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderBottom: activePath.includes(tab.id) ? '3px solid var(--color-accent-1)' : '3px solid transparent',
                            transition: 'all 0.2s',
                            background: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </header>
    );
}
