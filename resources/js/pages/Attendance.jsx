import React, { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { useApp } from '../context/AppContext';

export default function Attendance() {
    const { theme } = useApp();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/attendance?date=${date}`);
            setRecords(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (employeeId, status) => {
        try {
            await api.post('/attendance', {
                employee_id: employeeId,
                date: date,
                status: status,
                check_in: status === 'present' || status === 'late'
                    ? new Date().toTimeString().slice(0, 5)
                    : null,
            });
            fetchAttendance();
        } catch (err) {
            console.error(err);
        }
    };

    const statusConfig = {
        present: { label: 'Present', bg: '#eaf3de', color: '#3b6d11' },
        late:    { label: 'Late',    bg: '#faeeda', color: '#854f0b' },
        absent:  { label: 'Absent',  bg: '#fce8e8', color: '#a01e1e' },
        on_leave:{ label: 'On leave',bg: '#e6f1fb', color: '#185fa5' },
    };

    const avatarColors = [
        { bg: '#EEEDFE', text: '#534AB7' },
        { bg: '#e1f5ee', text: '#0f6e56' },
        { bg: '#faeeda', text: '#854f0b' },
        { bg: '#e6f1fb', text: '#185fa5' },
        { bg: '#fce8e8', text: '#a01e1e' },
        { bg: '#e8f4e8', text: '#1e6b1e' },
    ];

    const summary = {
        present:  records.filter(r => r.status === 'present').length,
        late:     records.filter(r => r.status === 'late').length,
        absent:   records.filter(r => r.status === 'absent').length,
        on_leave: records.filter(r => r.status === 'on_leave').length,
    };

    return (
        <AppLayout>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '500', color: theme.textPrimary, margin: '0 0 4px' }}>
                        Attendance
                    </h1>
                    <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                        Daily attendance tracking for all employees
                    </p>
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{
                        height: '36px', padding: '0 12px',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px', fontSize: '13px',
                        background: theme.cardBg, color: theme.textPrimary,
                        outline: 'none', cursor: 'pointer',
                    }}
                />
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                    { key: 'present',  label: 'Present',  color: '#1d9e75' },
                    { key: 'late',     label: 'Late',     color: '#ef9f27' },
                    { key: 'absent',   label: 'Absent',   color: '#e24b4a' },
                    { key: 'on_leave', label: 'On leave', color: '#534AB7' },
                ].map(s => (
                    <div key={s.key} style={{
                        background: theme.cardBg,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '10px', padding: '16px',
                    }}>
                        <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {s.label}
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: '500', color: s.color }}>
                            {summary[s.key]}
                        </div>
                        <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>
                            out of {records.length} employees
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1.5fr',
                    padding: '10px 16px',
                    borderBottom: `1px solid ${theme.border}`,
                    background: theme.actionBg,
                }}>
                    {['Employee', 'Department', 'Check in', 'Check out', 'Status', 'Action'].map((h, i) => (
                        <div key={i} style={{ fontSize: '11px', color: theme.textMuted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            {h}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: theme.textMuted, fontSize: '13px' }}>
                        Loading...
                    </div>
                ) : records.map((r, i) => {
                    const av = avatarColors[i % avatarColors.length];
                    const sc = statusConfig[r.status] || statusConfig.absent;
                    return (
                        <div key={r.employee_id} style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1.5fr',
                            padding: '12px 16px', alignItems: 'center',
                            borderBottom: i < records.length - 1 ? `1px solid ${theme.rowBorder}` : 'none',
                            transition: 'background 0.1s',
                        }}
                            onMouseEnter={ev => ev.currentTarget.style.background = theme.hoverBg}
                            onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                        >
                            {/* Employee */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: av.bg, color: av.text,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '10px', fontWeight: '600', flexShrink: 0,
                                }}>
                                    {r.employee_name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: theme.textPrimary, fontWeight: '500' }}>{r.employee_name}</div>
                                    <div style={{ fontSize: '11px', color: theme.textMuted }}>{r.position}</div>
                                </div>
                            </div>

                            <div style={{ fontSize: '12px', color: theme.textMuted }}>{r.department}</div>

                            <div style={{ fontSize: '12px', color: theme.textPrimary, fontWeight: '500' }}>
                                {r.check_in || '—'}
                            </div>

                            <div style={{ fontSize: '12px', color: theme.textPrimary, fontWeight: '500' }}>
                                {r.check_out || '—'}
                            </div>

                            <span style={{
                                fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                                background: sc.bg, color: sc.color, fontWeight: '500',
                                display: 'inline-block',
                            }}>
                                {sc.label}
                            </span>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {['present', 'late', 'absent', 'on_leave'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => updateStatus(r.employee_id, s)}
                                        style={{
                                            padding: '3px 7px', borderRadius: '4px',
                                            fontSize: '10px', cursor: 'pointer',
                                            border: `1px solid ${statusConfig[s].color}`,
                                            background: r.status === s ? statusConfig[s].bg : 'transparent',
                                            color: statusConfig[s].color,
                                            fontWeight: r.status === s ? '600' : '400',
                                        }}
                                    >
                                        {statusConfig[s].label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}