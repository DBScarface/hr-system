import React, { useState } from 'react';
import api from '../services/api';

export default function Login() {
    const [lang, setLang] = useState('EN');
    const [dark, setDark] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const t = {
        EN: {
            title: 'Sign in',
            sub: 'Enterprise HR Management Platform',
            email: 'Corporate email',
            placeholder: 'name@company.com',
            password: 'Password',
            forgot: 'Forgot password?',
            remember: 'Remember this device for 30 days',
            btn: 'Sign in to portal',
            secure: 'Secure access only',
            note: 'By signing in, you agree to our Terms of Service and Privacy Policy.',
            footer: '© 2026 Veltahr Enterprise. All rights reserved.',
        },
        FR: {
            title: 'Se connecter',
            sub: 'Plateforme RH Enterprise',
            email: 'Email professionnel',
            placeholder: 'nom@entreprise.com',
            password: 'Mot de passe',
            forgot: 'Mot de passe oublié ?',
            remember: 'Se souvenir de cet appareil 30 jours',
            btn: 'Accéder au portail',
            secure: 'Accès sécurisé uniquement',
            note: "En vous connectant, vous acceptez nos Conditions d'utilisation.",
            footer: '© 2026 Veltahr Enterprise. Tous droits réservés.',
        },
    };

    const text = t[lang];

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/login', {
                email: form.email,
                password: form.password,
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: dark ? '#0e0e14' : '#f4f4f6',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, system-ui, sans-serif',
            transition: 'background 0.2s',
        }}>

            {/* Top Bar */}
            <div style={{
                background: dark ? '#13131c' : '#ffffff',
                borderBottom: `1px solid ${dark ? '#22222e' : '#e5e5ea'}`,
                padding: '0 32px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '28px', height: '28px',
                        background: '#534AB7', borderRadius: '7px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>V</span>
                    </div>
                    <span style={{ color: dark ? '#f0f0f5' : '#1d1d1f', fontWeight: '500', fontSize: '15px' }}>
                        Veltahr
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')} style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                        border: `1px solid ${dark ? '#2a2a38' : '#dddde0'}`,
                        background: 'transparent', cursor: 'pointer',
                        color: dark ? '#8888a0' : '#6e6e73',
                    }}>
                        {lang === 'EN' ? 'FR' : 'EN'}
                    </button>
                    <button onClick={() => setDark(!dark)} style={{
                        width: '30px', height: '30px', borderRadius: '6px',
                        border: `1px solid ${dark ? '#2a2a38' : '#dddde0'}`,
                        background: 'transparent', cursor: 'pointer',
                        color: dark ? '#8888a0' : '#6e6e73', fontSize: '15px',
                    }}>
                        {dark ? '☀' : '☾'}
                    </button>
                </div>
            </div>

            {/* Login Body */}
            <div style={{
                flex: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                padding: '40px 20px',
            }}>
                <div style={{
                    background: dark ? '#13131c' : '#ffffff',
                    border: `1px solid ${dark ? '#22222e' : '#e5e5ea'}`,
                    borderRadius: '14px', padding: '36px 32px',
                    width: '100%', maxWidth: '400px',
                }}>
                    <h1 style={{
                        fontSize: '22px', fontWeight: '500', textAlign: 'center',
                        color: dark ? '#f0f0f5' : '#1d1d1f', margin: '0 0 4px',
                    }}>
                        {text.title}
                    </h1>
                    <p style={{
                        fontSize: '13px', color: '#8888a0',
                        textAlign: 'center', margin: '0 0 28px',
                    }}>
                        {text.sub}
                    </p>

                    {/* Email */}
                    <label style={{ fontSize: '12px', color: '#8888a0', display: 'block', marginBottom: '5px' }}>
                        {text.email}
                    </label>
                    <input
                        type="email"
                        placeholder={text.placeholder}
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        style={{
                            width: '100%', height: '40px', marginBottom: '16px',
                            border: `1px solid ${dark ? '#2a2a38' : '#dddde0'}`,
                            borderRadius: '8px', padding: '0 12px', fontSize: '13px',
                            background: dark ? '#1a1a28' : '#fafafa',
                            color: dark ? '#f0f0f5' : '#1d1d1f', outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />

                    {/* Password */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '12px', color: '#8888a0' }}>{text.password}</label>
                        <span style={{ fontSize: '12px', color: '#534AB7', cursor: 'pointer' }}>{text.forgot}</span>
                    </div>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            style={{
                                width: '100%', height: '40px',
                                border: `1px solid ${dark ? '#2a2a38' : '#dddde0'}`,
                                borderRadius: '8px', padding: '0 36px 0 12px', fontSize: '13px',
                                background: dark ? '#1a1a28' : '#fafafa',
                                color: dark ? '#f0f0f5' : '#1d1d1f', outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                        <span
                            onClick={() => setShowPass(!showPass)}
                            style={{
                                position: 'absolute', right: '10px', top: '50%',
                                transform: 'translateY(-50%)', cursor: 'pointer',
                                color: '#8888a0', fontSize: '14px',
                            }}
                        >
                            {showPass ? '🙈' : '👁'}
                        </span>
                    </div>

                    {/* Remember */}
                    <label style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        fontSize: '12px', color: '#8888a0', marginBottom: '22px', cursor: 'pointer',
                    }}>
                        <input
                            type="checkbox"
                            checked={form.remember}
                            onChange={e => setForm({ ...form, remember: e.target.checked })}
                            style={{ accentColor: '#534AB7' }}
                        />
                        {text.remember}
                    </label>

                    {/* Error message */}
                    {error && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: '8px', padding: '10px 12px',
                            fontSize: '12px', color: '#dc2626', marginBottom: '12px',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: '100%', height: '42px',
                            background: loading ? '#8880c8' : '#534AB7',
                            color: '#fff', border: 'none', borderRadius: '8px',
                            fontSize: '14px', fontWeight: '500',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Signing in...' : text.btn}
                    </button>

                    <p style={{
                        textAlign: 'center', fontSize: '11px',
                        color: '#aaaabc', marginTop: '20px', lineHeight: '1.6',
                    }}>
                        🔒 {text.secure}<br />
                        <span style={{ fontSize: '10px' }}>{text.note}</span>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center', padding: '14px',
                fontSize: '11px', color: '#aaaabc',
                borderTop: `1px solid ${dark ? '#22222e' : '#e5e5ea'}`,
                background: dark ? '#13131c' : '#ffffff',
            }}>
                {text.footer}
            </div>
        </div>
    );
}