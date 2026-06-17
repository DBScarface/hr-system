import React, { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function Settings() {
    const { theme, dark, setDark, lang, setLang } = useApp();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [profile, setProfile] = useState({
        name: user.name || '',
        email: user.email || '',
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const [profileMsg, setProfileMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [saving, setSaving] = useState(false);

    const card = {
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        padding: '24px',
        marginBottom: '16px',
    };

    const inputStyle = {
        width: '100%', height: '40px',
        border: `1px solid ${theme.border}`,
        borderRadius: '8px', padding: '0 12px',
        fontSize: '13px', background: theme.inputBg,
        color: theme.textPrimary, outline: 'none',
        boxSizing: 'border-box',
    };

    const labelStyle = {
        fontSize: '12px', color: theme.textMuted,
        display: 'block', marginBottom: '5px',
    };

    const handleProfileSave = () => {
        setProfileMsg('Profile updated successfully.');
        setTimeout(() => setProfileMsg(''), 3000);
    };

    const handlePasswordSave = () => {
        if (password.new !== password.confirm) {
            setPasswordMsg('New passwords do not match.');
            return;
        }
        if (password.new.length < 8) {
            setPasswordMsg('Password must be at least 8 characters.');
            return;
        }
        setPasswordMsg('Password updated successfully.');
        setPassword({ current: '', new: '', confirm: '' });
        setTimeout(() => setPasswordMsg(''), 3000);
    };

    return (
        <AppLayout>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '500', color: theme.textPrimary, margin: '0 0 4px' }}>
                    Settings
                </h1>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                    Manage your account and preferences
                </p>
            </div>

            <div style={{ maxWidth: '600px' }}>

                {/* Profile */}
                <div style={card}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary, marginBottom: '18px' }}>
                        Profile information
                    </div>

                    {/* Avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#EEEDFE', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px', fontWeight: '600', color: '#534AB7',
                            border: '2px solid #AFA9EC',
                        }}>
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: theme.textMuted }}>{user.email}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>Full name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Email address</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    {profileMsg && (
                        <div style={{
                            background: '#eaf3de', border: '1px solid #b7dfb7',
                            borderRadius: '8px', padding: '10px 12px',
                            fontSize: '12px', color: '#3b6d11', marginBottom: '12px',
                        }}>
                            {profileMsg}
                        </div>
                    )}

                    <button onClick={handleProfileSave} style={{
                        background: '#534AB7', color: '#fff', border: 'none',
                        padding: '9px 20px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                    }}>
                        Save changes
                    </button>
                </div>

                {/* Preferences */}
                <div style={card}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary, marginBottom: '18px' }}>
                        Preferences
                    </div>

                    {/* Dark mode */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '16px',
                        paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`,
                    }}>
                        <div>
                            <div style={{ fontSize: '13px', color: theme.textPrimary, marginBottom: '2px' }}>Dark mode</div>
                            <div style={{ fontSize: '11px', color: theme.textMuted }}>Switch between light and dark theme</div>
                        </div>
                        <div
                            onClick={() => setDark(!dark)}
                            style={{
                                width: '44px', height: '24px', borderRadius: '12px',
                                background: dark ? '#534AB7' : '#dddde0',
                                position: 'relative', cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            <div style={{
                                width: '18px', height: '18px', borderRadius: '50%',
                                background: '#fff', position: 'absolute',
                                top: '3px', left: dark ? '23px' : '3px',
                                transition: 'left 0.2s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }} />
                        </div>
                    </div>

                    {/* Language */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '13px', color: theme.textPrimary, marginBottom: '2px' }}>Language</div>
                            <div style={{ fontSize: '11px', color: theme.textMuted }}>Choose your preferred language</div>
                        </div>
                        <select
                            value={lang}
                            onChange={e => setLang(e.target.value)}
                            style={{
                                height: '34px', padding: '0 12px',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '8px', fontSize: '13px',
                                background: theme.inputBg, color: theme.textPrimary,
                                outline: 'none', cursor: 'pointer',
                            }}
                        >
                            <option value="EN">English</option>
                            <option value="FR">Français</option>
                        </select>
                    </div>
                </div>

                {/* Password */}
                <div style={card}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary, marginBottom: '18px' }}>
                        Change password
                    </div>

                    {['current', 'new', 'confirm'].map((key, i) => (
                        <div key={key} style={{ marginBottom: i < 2 ? '14px' : '20px' }}>
                            <label style={labelStyle}>
                                {key === 'current' ? 'Current password' : key === 'new' ? 'New password' : 'Confirm new password'}
                            </label>
                            <input
                                type="password"
                                value={password[key]}
                                onChange={e => setPassword({ ...password, [key]: e.target.value })}
                                style={inputStyle}
                                placeholder="••••••••"
                            />
                        </div>
                    ))}

                    {passwordMsg && (
                        <div style={{
                            background: passwordMsg.includes('success') ? '#eaf3de' : '#fef2f2',
                            border: `1px solid ${passwordMsg.includes('success') ? '#b7dfb7' : '#fecaca'}`,
                            borderRadius: '8px', padding: '10px 12px',
                            fontSize: '12px',
                            color: passwordMsg.includes('success') ? '#3b6d11' : '#dc2626',
                            marginBottom: '12px',
                        }}>
                            {passwordMsg}
                        </div>
                    )}

                    <button onClick={handlePasswordSave} style={{
                        background: '#534AB7', color: '#fff', border: 'none',
                        padding: '9px 20px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                    }}>
                        Update password
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}