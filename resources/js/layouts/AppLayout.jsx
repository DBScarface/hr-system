import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function AppLayout({ children }) {
    const [dark, setDark] = useState(false);
    const [lang, setLang] = useState('EN');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await api.post('/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const navItems = [
        { key: 'dashboard', label: { EN: 'Dashboard', FR: 'Tableau de bord' }, icon: '⊞', path: '/dashboard' },
        { key: 'employees', label: { EN: 'Employees', FR: 'Employés' }, icon: '👥', path: '/employees' },
        { key: 'attendance', label: { EN: 'Attendance', FR: 'Présences' }, icon: '📅', path: '/attendance' },
        { key: 'payroll', label: { EN: 'Payroll', FR: 'Paie' }, icon: '💰', path: '/payroll' },
        { key: 'reports', label: { EN: 'Reports', FR: 'Rapports' }, icon: '📊', path: '/reports' },
        { key: 'settings', label: { EN: 'Settings', FR: 'Paramètres' }, icon: '⚙️', path: '/settings' },
    ];

    const bg = dark ? '#0e0e16' : '#f4f4f6';
    const sidebarBg = dark ? '#12121c' : '#ffffff';
    const topbarBg = dark ? '#12121c' : '#ffffff';
    const border = dark ? '#1e1e2e' : '#e5e5ea';
    const textPrimary = dark ? '#f0f0f5' : '#1d1d1f';
    const textMuted = dark ? '#6666808' : '#6e6e73';

    return (
        <div style={{
            minHeight: '100vh', background: bg,
            fontFamily: 'Inter, system-ui, sans-serif',
            display: 'flex', flexDirection: 'column',
        }}>
            {/* Top Bar */}
            <div style={{
                background: topbarBg, borderBottom: `1px solid ${border}`,
                height: '52px', padding: '0 24px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexShrink: 0,
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '28px', height: '28px', background: '#534AB7',
                        borderRadius: '7px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>V</span>
                    </div>
                    <span style={{ color: textPrimary, fontWeight: '500', fontSize: '15px' }}>Veltahr</span>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder={lang === 'EN' ? 'Search employees, documents...' : 'Rechercher...'}
                    style={{
                        width: '280px', height: '32px',
                        border: `1px solid ${border}`, borderRadius: '8px',
                        padding: '0 12px', fontSize: '12px',
                        background: dark ? '#1a1a28' : '#f8f8fa',
                        color: textPrimary, outline: 'none',
                    }}
                />

                {/* Right Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')} style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                        border: `1px solid ${border}`, background: 'transparent',
                        cursor: 'pointer', color: textMuted,
                    }}>
                        {lang === 'EN' ? 'FR' : 'EN'}
                    </button>
                    <button onClick={() => setDark(!dark)} style={{
                        width: '30px', height: '30px', borderRadius: '6px',
                        border: `1px solid ${border}`, background: 'transparent',
                        cursor: 'pointer', color: textMuted, fontSize: '14px',
                    }}>
                        {dark ? '☀' : '☾'}
                    </button>
                    <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: '#EEEDFE', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: '600', color: '#534AB7',
                        border: '1px solid #AFA9EC',
                    }}>
                        {user.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <div style={{
                    width: '200px', background: sidebarBg,
                    borderRight: `1px solid ${border}`,
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', flexShrink: 0,
                    padding: '12px 0',
                }}>
                    <div>
                        {navItems.map(item => {
                            const active = location.pathname === item.path;
                            return (
                                <div
                                    key={item.key}
                                    onClick={() => navigate(item.path)}
                                    style={{
                                        display: 'flex', alignItems: 'center',
                                        gap: '10px', padding: '9px 16px',
                                        cursor: 'pointer', fontSize: '13px',
                                        color: active ? '#534AB7' : textMuted,
                                        background: active ? '#EEEDFE' : 'transparent',
                                        borderRight: active ? '2px solid #534AB7' : '2px solid transparent',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <span style={{ fontSize: '15px' }}>{item.icon}</span>
                                    {item.label[lang]}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom */}
                    <div>
                        <div
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center',
                                gap: '10px', padding: '9px 16px',
                                cursor: 'pointer', fontSize: '13px', color: '#e24b4a',
                            }}
                        >
                            <span>🚪</span>
                            {lang === 'EN' ? 'Logout' : 'Déconnexion'}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}