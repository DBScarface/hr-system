import React, { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { useApp } from '../context/AppContext';

export default function Reports() {
    const { theme } = useApp();
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [empRes, attRes, payRes] = await Promise.all([
                api.get('/employees'),
                api.get(`/attendance?date=${new Date().toISOString().split('T')[0]}`),
                api.get('/payroll'),
            ]);
            setEmployees(empRes.data);
            setAttendance(attRes.data);
            setPayroll(payRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (val) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const deptMap = employees.reduce((acc, e) => {
        acc[e.department] = (acc[e.department] || 0) + 1;
        return acc;
    }, {});

    const deptColors = {
        Engineering: '#534AB7',
        Design:      '#1d9e75',
        Sales:       '#ef9f27',
        People:      '#185fa5',
        Operations:  '#854f0b',
        Finance:     '#e24b4a',
    };

    const maxDept = Math.max(...Object.values(deptMap));

    const presentToday = attendance.filter(r => r.status === 'present' || r.status === 'late').length;
    const attendanceRate = attendance.length > 0 ? Math.round((presentToday / attendance.length) * 100) : 0;

    const card = {
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        padding: '20px',
    };

    return (
        <AppLayout>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '500', color: theme.textPrimary, margin: '0 0 4px' }}>
                    Reports
                </h1>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                    Organization overview and key metrics
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: theme.textMuted }}>Loading...</div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        {[
                            { label: 'Total employees', value: employees.length, delta: 'Across all departments', color: '#534AB7' },
                            { label: 'Present today', value: `${attendanceRate}%`, delta: `${presentToday} of ${attendance.length} employees`, color: '#1d9e75' },
                            { label: 'Monthly payroll', value: fmt(payroll?.total_gross || 0), delta: `Net: ${fmt(payroll?.total_net || 0)}`, color: theme.textPrimary },
                            { label: 'Departments', value: Object.keys(deptMap).length, delta: 'Active departments', color: '#ef9f27' },
                        ].map((k, i) => (
                            <div key={i} style={card}>
                                <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {k.label}
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: '500', color: k.color, marginBottom: '4px' }}>
                                    {k.value}
                                </div>
                                <div style={{ fontSize: '11px', color: theme.textMuted }}>{k.delta}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>

                        {/* Department Breakdown */}
                        <div style={card}>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary, marginBottom: '18px' }}>
                                Headcount by department
                            </div>
                            {Object.entries(deptMap).map(([dept, count]) => (
                                <div key={dept} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '12px', color: theme.textPrimary }}>{dept}</span>
                                        <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '500' }}>{count}</span>
                                    </div>
                                    <div style={{ background: theme.border, borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${(count / maxDept) * 100}%`,
                                            height: '100%',
                                            background: deptColors[dept] || '#534AB7',
                                            borderRadius: '4px',
                                            transition: 'width 0.6s ease',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Attendance Today */}
                        <div style={card}>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary, marginBottom: '18px' }}>
                                Today's attendance breakdown
                            </div>
                            {[
                                { key: 'present',  label: 'Present',  color: '#1d9e75' },
                                { key: 'late',     label: 'Late',     color: '#ef9f27' },
                                { key: 'absent',   label: 'Absent',   color: '#e24b4a' },
                                { key: 'on_leave', label: 'On leave', color: '#534AB7' },
                            ].map(s => {
                                const count = attendance.filter(r => r.status === s.key).length;
                                const pct = attendance.length > 0 ? (count / attendance.length) * 100 : 0;
                                return (
                                    <div key={s.key} style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '12px', color: theme.textPrimary }}>{s.label}</span>
                                            <span style={{ fontSize: '12px', color: theme.textMuted }}>{count} ({Math.round(pct)}%)</span>
                                        </div>
                                        <div style={{ background: theme.border, borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${pct}%`,
                                                height: '100%',
                                                background: s.color,
                                                borderRadius: '4px',
                                                transition: 'width 0.6s ease',
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Donut-style summary */}
                            <div style={{
                                marginTop: '20px',
                                padding: '14px',
                                background: theme.actionBg,
                                borderRadius: '8px',
                                border: `1px solid ${theme.border}`,
                                display: 'flex',
                                justifyContent: 'space-around',
                            }}>
                                {[
                                    { label: 'Present', count: attendance.filter(r => r.status === 'present').length, color: '#1d9e75' },
                                    { label: 'Late',    count: attendance.filter(r => r.status === 'late').length,    color: '#ef9f27' },
                                    { label: 'Absent',  count: attendance.filter(r => r.status === 'absent').length,  color: '#e24b4a' },
                                    { label: 'Leave',   count: attendance.filter(r => r.status === 'on_leave').length, color: '#534AB7' },
                                ].map(s => (
                                    <div key={s.label} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '20px', fontWeight: '600', color: s.color }}>{s.count}</div>
                                        <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Payroll by Department */}
                    <div style={card}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary, marginBottom: '16px' }}>
                            Payroll by department
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '10px',
                        }}>
                            {Object.entries(
                                employees.reduce((acc, e) => {
                                    if (!acc[e.department]) acc[e.department] = { count: 0, total: 0 };
                                    acc[e.department].count++;
                                    acc[e.department].total += Number(e.salary || 0);
                                    return acc;
                                }, {})
                            ).map(([dept, info]) => (
                                <div key={dept} style={{
                                    background: theme.actionBg,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '8px', padding: '12px',
                                    borderLeft: `3px solid ${deptColors[dept] || '#534AB7'}`,
                                }}>
                                    <div style={{ fontSize: '12px', fontWeight: '500', color: theme.textPrimary, marginBottom: '4px' }}>{dept}</div>
                                    <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px' }}>{info.count} employee{info.count > 1 ? 's' : ''}</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: deptColors[dept] || '#534AB7' }}>{fmt(info.total)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    );
}