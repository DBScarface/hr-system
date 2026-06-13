import React from 'react';
import AppLayout from '../layouts/AppLayout';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
    const { dark } = useApp();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const metrics = [
        { label: 'Headcount', value: '248', delta: '↑ 4 this month', color: '#1d9e75' },
        { label: 'Present today', value: '211', delta: '85.1% rate', color: '#1d9e75' },
        { label: 'On leave', value: '18', delta: '3 pending', color: '#ef9f27' },
        { label: 'Payroll due', value: 'Jun 1', delta: 'In 10 days', color: '#534AB7' },
    ];

    const employees = [
        { initials: 'SR', name: 'Sara Rami', role: 'UX Designer', status: 'Active', color: '#EEEDFE', textColor: '#534AB7' },
        { initials: 'KA', name: 'Karim Alaoui', role: 'Backend Engineer', status: 'Active', color: '#e1f5ee', textColor: '#0f6e56' },
        { initials: 'NB', name: 'Nadia Bennani', role: 'HR Manager', status: 'On leave', color: '#faeeda', textColor: '#854f0b' },
        { initials: 'YM', name: 'Youssef Mansouri', role: 'Data Analyst', status: 'Active', color: '#e6f1fb', textColor: '#185fa5' },
    ];

    const attendance = [
        { day: 'Mon', pct: 55 },
        { day: 'Tue', pct: 70 },
        { day: 'Wed', pct: 62 },
        { day: 'Thu', pct: 80 },
        { day: 'Fri', pct: 72 },
        { day: 'Sat', pct: 96, today: true },
        { day: 'Sun', pct: 40 },
    ];

    const actions = [
        { icon: '📄', title: 'Leave request', sub: 'Alex Rivera · 2 days (Oct 16-18)' },
        { icon: '🧾', title: 'Expense approval', sub: 'Marketing Team · $4,250' },
    ];

    const card = {
        background: dark ? '#1a2540' : '#ffffff',
        border: `1px solid ${dark ? '#1e2d45' : '#e5e5ea'}`,
        borderRadius: '10px',
        padding: '18px',
    };

    const textPrimary = dark ? '#e8edf5' : '#1d1d1f';
    const textMuted = dark ? '#6b8cae' : '#8888a0';
    const rowBorder = dark ? '#1e2d45' : '#f0f0f5';

    return (
        <AppLayout>
            {/* Page Header */}
            <h1 style={{ fontSize: '20px', fontWeight: '500', color: textPrimary, margin: '0 0 4px' }}>
                Good morning, {user.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 24px' }}>
                Real-time operational intelligence across all departments.
            </p>

            {/* Metric Cards */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px', marginBottom: '20px',
            }}>
                {metrics.map((m, i) => (
                    <div key={i} style={card}>
                        <div style={{ fontSize: '11px', color: textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {m.label}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '500', color: textPrimary }}>
                            {m.value}
                        </div>
                        <div style={{ fontSize: '11px', color: m.color, marginTop: '4px' }}>
                            {m.delta}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '12px' }}>

                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    {/* Attendance Chart */}
                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: textPrimary }}>Attendance insights</span>
                            <span style={{ fontSize: '11px', color: '#534AB7', cursor: 'pointer' }}>View all</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px', marginBottom: '8px' }}>
                            {attendance.map((a, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{
                                        width: '100%',
                                        height: `${a.pct}%`,
                                        background: a.today ? '#534AB7' : dark ? '#1e2d45' : '#EEEDFE',
                                        borderRadius: '4px 4px 0 0',
                                    }} />
                                    <span style={{ fontSize: '10px', color: a.today ? '#534AB7' : textMuted, fontWeight: a.today ? '500' : '400' }}>
                                        {a.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Employee List */}
                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: textPrimary }}>Recent employees</span>
                            <span style={{ fontSize: '11px', color: '#534AB7', cursor: 'pointer' }}>View all</span>
                        </div>
                        {employees.map((e, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '8px 0',
                                borderBottom: i < employees.length - 1 ? `1px solid ${rowBorder}` : 'none',
                            }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: e.color, color: e.textColor,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '10px', fontWeight: '600', flexShrink: 0,
                                }}>
                                    {e.initials}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', color: textPrimary }}>{e.name}</div>
                                    <div style={{ fontSize: '11px', color: textMuted }}>{e.role}</div>
                                </div>
                                <span style={{
                                    fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                                    background: e.status === 'Active' ? '#eaf3de' : '#faeeda',
                                    color: e.status === 'Active' ? '#3b6d11' : '#854f0b',
                                }}>
                                    {e.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    {/* Action Items */}
                    <div style={card}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: textPrimary, marginBottom: '14px' }}>
                            Action items
                        </div>
                        {actions.map((a, i) => (
                            <div key={i} style={{
                                background: dark ? '#0f1a2e' : '#f8f8fa',
                                border: `1px solid ${dark ? '#1e2d45' : '#e5e5ea'}`,
                                borderRadius: '8px', padding: '10px 12px',
                                marginBottom: i < actions.length - 1 ? '8px' : '0',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '13px' }}>{a.icon}</span>
                                    <span style={{ fontSize: '12px', fontWeight: '500', color: textPrimary }}>{a.title}</span>
                                </div>
                                <div style={{ fontSize: '11px', color: textMuted, marginBottom: '8px' }}>{a.sub}</div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button style={{
                                        background: '#534AB7', color: '#fff', border: 'none',
                                        padding: '4px 10px', borderRadius: '5px',
                                        fontSize: '11px', cursor: 'pointer',
                                    }}>Approve</button>
                                    <button style={{
                                        background: 'transparent', color: '#534AB7',
                                        border: '1px solid #534AB7', padding: '4px 10px',
                                        borderRadius: '5px', fontSize: '11px', cursor: 'pointer',
                                    }}>Review</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payroll Alert */}
                    <div style={{
                        background: dark ? '#1a1a3a' : '#EEEDFE',
                        border: `1px solid ${dark ? '#3C3489' : '#AFA9EC'}`,
                        borderRadius: '10px', padding: '16px',
                    }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: dark ? '#AFA9EC' : '#3C3489', marginBottom: '4px' }}>
                            Payroll deadline
                        </div>
                        <div style={{ fontSize: '12px', color: dark ? '#8880c8' : '#534AB7', marginBottom: '12px', lineHeight: '1.5' }}>
                            Finalize Q3 bonuses by tomorrow at 5:00 PM to ensure timely payout.
                        </div>
                        <button style={{
                            width: '100%', background: '#534AB7', color: '#fff',
                            border: 'none', padding: '8px', borderRadius: '6px',
                            fontSize: '12px', cursor: 'pointer', fontWeight: '500',
                        }}>
                            Go to payroll
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}