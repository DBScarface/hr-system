import React from 'react';
import AppLayout from '../layouts/AppLayout';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const metrics = [
        { label: 'Headcount', value: '248', delta: '↑ 4 this month', color: '#1d9e75' },
        { label: 'Present today', value: '211', delta: '85.1% rate', color: '#1d9e75' },
        { label: 'On leave', value: '18', delta: '3 pending', color: '#ef9f27' },
        { label: 'Payroll due', value: 'Jun 1', delta: 'In 10 days', color: '#534AB7' },
    ];

    return (
        <AppLayout>
            <div>
                <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1d1d1f', margin: '0 0 4px' }}>
                    Good morning, {user.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ fontSize: '13px', color: '#8888a0', margin: '0 0 24px' }}>
                    Here's what's happening across your organization today.
                </p>

                {/* Metric Cards */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px', marginBottom: '24px',
                }}>
                    {metrics.map((m, i) => (
                        <div key={i} style={{
                            background: '#ffffff', border: '1px solid #e5e5ea',
                            borderRadius: '10px', padding: '16px',
                        }}>
                            <div style={{ fontSize: '11px', color: '#8888a0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {m.label}
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: '500', color: '#1d1d1f' }}>
                                {m.value}
                            </div>
                            <div style={{ fontSize: '11px', color: m.color, marginTop: '4px' }}>
                                {m.delta}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Placeholder for more sections */}
                <div style={{
                    background: '#ffffff', border: '1px solid #e5e5ea',
                    borderRadius: '10px', padding: '24px',
                    color: '#8888a0', fontSize: '13px', textAlign: 'center',
                }}>
                    More dashboard sections coming soon — employees, attendance chart, action items.
                </div>
            </div>
        </AppLayout>
    );
}