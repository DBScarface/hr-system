import React, { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { useApp } from '../context/AppContext';

export default function Payroll() {
    const { theme } = useApp();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayroll();
    }, []);

    const fetchPayroll = async () => {
        try {
            const res = await api.get('/payroll');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (val) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const avatarColors = [
        { bg: '#EEEDFE', text: '#534AB7' },
        { bg: '#e1f5ee', text: '#0f6e56' },
        { bg: '#faeeda', text: '#854f0b' },
        { bg: '#e6f1fb', text: '#185fa5' },
        { bg: '#fce8e8', text: '#a01e1e' },
        { bg: '#e8f4e8', text: '#1e6b1e' },
    ];

    return (
        <AppLayout>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '500', color: theme.textPrimary, margin: '0 0 4px' }}>
                    Payroll
                </h1>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                    Monthly salary overview — June 2026
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: theme.textMuted }}>Loading...</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        {[
                            { label: 'Total gross', value: fmt(data.total_gross), color: theme.textPrimary },
                            { label: 'Total net',   value: fmt(data.total_net),   color: '#1d9e75' },
                            { label: 'Total tax',   value: fmt(data.total_tax),   color: '#e24b4a' },
                            { label: 'Employees',   value: data.employee_count,   color: '#534AB7' },
                        ].map((s, i) => (
                            <div key={i} style={{
                                background: theme.cardBg,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '10px', padding: '16px',
                            }}>
                                <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {s.label}
                                </div>
                                <div style={{ fontSize: '22px', fontWeight: '500', color: s.color }}>
                                    {s.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payroll Table */}
                    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr',
                            padding: '10px 16px',
                            borderBottom: `1px solid ${theme.border}`,
                            background: theme.actionBg,
                        }}>
                            {['Employee', 'Gross salary', 'Tax (20%)', 'Insurance (5%)', 'Net salary', 'Status'].map((h, i) => (
                                <div key={i} style={{ fontSize: '11px', color: theme.textMuted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                    {h}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        {data.payroll.map((p, i) => {
                            const av = avatarColors[i % avatarColors.length];
                            return (
                                <div key={p.employee_id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr',
                                    padding: '12px 16px', alignItems: 'center',
                                    borderBottom: i < data.payroll.length - 1 ? `1px solid ${theme.rowBorder}` : 'none',
                                    transition: 'background 0.1s',
                                }}
                                    onMouseEnter={ev => ev.currentTarget.style.background = theme.hoverBg}
                                    onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '30px', height: '30px', borderRadius: '50%',
                                            background: av.bg, color: av.text,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '10px', fontWeight: '600', flexShrink: 0,
                                        }}>
                                            {p.employee_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13px', color: theme.textPrimary, fontWeight: '500' }}>{p.employee_name}</div>
                                            <div style={{ fontSize: '11px', color: theme.textMuted }}>{p.position}</div>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '13px', color: theme.textPrimary }}>{fmt(p.gross_salary)}</div>
                                    <div style={{ fontSize: '13px', color: '#e24b4a' }}>— {fmt(p.tax)}</div>
                                    <div style={{ fontSize: '13px', color: '#ef9f27' }}>— {fmt(p.insurance)}</div>
                                    <div style={{ fontSize: '13px', color: '#1d9e75', fontWeight: '500' }}>{fmt(p.net_salary)}</div>

                                    <span style={{
                                        fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                                        background: '#faeeda', color: '#854f0b', fontWeight: '500',
                                    }}>
                                        Pending
                                    </span>
                                </div>
                            );
                        })}

                        {/* Footer Total */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr',
                            padding: '12px 16px',
                            borderTop: `2px solid ${theme.border}`,
                            background: theme.actionBg,
                        }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>Total</div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{fmt(data.total_gross)}</div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#e24b4a' }}>— {fmt(data.total_tax)}</div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#ef9f27' }}>— {fmt(data.payroll.reduce((a, p) => a + Number(p.insurance), 0))}</div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1d9e75' }}>{fmt(data.total_net)}</div>
                            <div />
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    );
}