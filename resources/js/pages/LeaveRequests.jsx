import React, { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { useApp } from '../context/AppContext';

export default function LeaveRequests() {
    const { theme } = useApp();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isApprover = user.role === 'admin' || user.role === 'manager';

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ start_date: '', end_date: '', type: 'vacation', reason: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/leave-requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await api.post('/leave-requests', form);
            setRequests([res.data, ...requests]);
            setShowModal(false);
            setForm({ start_date: '', end_date: '', type: 'vacation', reason: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleReview = async (id, status) => {
        try {
            const res = await api.put(`/leave-requests/${id}`, { status });
            setRequests(requests.map(r => r.id === id ? res.data : r));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Cancel this leave request?')) return;
        await api.delete(`/leave-requests/${id}`);
        setRequests(requests.filter(r => r.id !== id));
    };

    const statusConfig = {
        pending:  { label: 'Pending',  bg: '#faeeda', color: '#854f0b' },
        approved: { label: 'Approved', bg: '#eaf3de', color: '#3b6d11' },
        rejected: { label: 'Rejected', bg: '#fce8e8', color: '#a01e1e' },
    };

    const typeLabels = { vacation: 'Vacation', sick: 'Sick leave', personal: 'Personal', other: 'Other' };

    const card = { background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '18px' };
    const inputStyle = {
        width: '100%', height: '38px', border: `1px solid ${theme.border}`,
        borderRadius: '8px', padding: '0 12px', fontSize: '13px',
        background: theme.inputBg, color: theme.textPrimary, outline: 'none', boxSizing: 'border-box',
    };

    const days = (start, end) => {
        const d1 = new Date(start), d2 = new Date(end);
        return Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
    };

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '500', color: theme.textPrimary, margin: '0 0 4px' }}>
                        Leave requests
                    </h1>
                    <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
                        {isApprover ? 'Review and manage employee leave requests' : 'Submit and track your leave requests'}
                    </p>
                </div>
                {!isApprover && (
                    <button onClick={() => setShowModal(true)} style={{
                        background: '#534AB7', color: '#fff', border: 'none',
                        padding: '9px 16px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                    }}>
                        + Request leave
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: theme.textMuted }}>Loading...</div>
            ) : requests.length === 0 ? (
                <div style={{ ...card, textAlign: 'center', padding: '40px', color: theme.textMuted, fontSize: '13px' }}>
                    No leave requests yet.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {requests.map(r => {
                        const sc = statusConfig[r.status];
                        return (
                            <div key={r.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        {isApprover && (
                                            <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>
                                                {r.employee?.first_name} {r.employee?.last_name}
                                            </span>
                                        )}
                                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#EEEDFE', color: '#534AB7' }}>
                                            {typeLabels[r.type]}
                                        </span>
                                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: sc.bg, color: sc.color, fontWeight: '500' }}>
                                            {sc.label}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: theme.textMuted }}>
                                        {new Date(r.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 
                                        {' → '}
                                        {new Date(r.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        {' · '}{days(r.start_date, r.end_date)} day{days(r.start_date, r.end_date) > 1 ? 's' : ''}
                                    </div>
                                    {r.reason && (
                                        <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px', fontStyle: 'italic' }}>
                                            "{r.reason}"
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {isApprover && r.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleReview(r.id, 'approved')} style={{
                                                background: '#534AB7', color: '#fff', border: 'none',
                                                padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                                            }}>Approve</button>
                                            <button onClick={() => handleReview(r.id, 'rejected')} style={{
                                                background: 'transparent', color: '#e24b4a', border: '1px solid #e24b4a',
                                                padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                                            }}>Reject</button>
                                        </>
                                    )}
                                    {!isApprover && r.status === 'pending' && (
                                        <button onClick={() => handleDelete(r.id)} style={{
                                            background: 'transparent', color: '#e24b4a', border: '1px solid #fecaca',
                                            padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                                        }}>Cancel</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Request Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: theme.cardBg, borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '440px', border: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '500', color: theme.textPrimary, margin: 0 }}>Request leave</h2>
                            <span onClick={() => setShowModal(false)} style={{ cursor: 'pointer', color: theme.textMuted, fontSize: '18px' }}>✕</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Start date</label>
                                <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>End date</label>
                                <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                                <option value="vacation">Vacation</option>
                                <option value="sick">Sick leave</option>
                                <option value="personal">Personal</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Reason (optional)</label>
                            <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3} style={{ ...inputStyle, height: 'auto', padding: '8px 12px', resize: 'none' }} />
                        </div>

                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#dc2626', marginBottom: '12px' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setShowModal(false)} style={{
                                flex: 1, height: '40px', background: 'transparent', border: `1px solid ${theme.border}`,
                                borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: theme.textMuted,
                            }}>Cancel</button>
                            <button onClick={handleSubmit} disabled={saving} style={{
                                flex: 1, height: '40px', background: saving ? '#8880c8' : '#534AB7',
                                border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                cursor: saving ? 'not-allowed' : 'pointer', color: '#fff',
                            }}>{saving ? 'Submitting...' : 'Submit request'}</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}