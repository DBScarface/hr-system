import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { useApp } from '../context/AppContext';

export default function EmployeeProfile() {
    const { theme, dark } = useApp();
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSalary, setShowSalary] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchProfile(); }, [id]);

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/employees/${id}`);
            setData(res.data);
            setEditForm({
                first_name: res.data.employee.first_name,
                last_name: res.data.employee.last_name,
                email: res.data.employee.email,
                phone: res.data.employee.phone || '',
                department: res.data.employee.department,
                position: res.data.employee.position,
                status: res.data.employee.status,
                photo: res.data.employee.photo || '',
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be under 2MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setEditForm({ ...editForm, photo: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await api.put(`/employees/${id}`, editForm);
            setData({ ...data, employee: res.data });
            setShowEditModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleExportPdf = async () => {
        setExporting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/employees/${id}/export`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.employee.first_name}_${data.employee.last_name}_report.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Failed to generate report.');
        } finally {
            setExporting(false);
        }
    };

    const fmt = (val) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const card = {
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        padding: '20px',
    };

    const inputStyle = {
        width: '100%', height: '38px',
        border: `1px solid ${theme.border}`,
        borderRadius: '8px', padding: '0 12px', fontSize: '13px',
        background: theme.inputBg, color: theme.textPrimary,
        outline: 'none', boxSizing: 'border-box',
    };

    if (loading) {
        return <AppLayout><div style={{ textAlign: 'center', padding: '60px', color: theme.textMuted }}>Loading...</div></AppLayout>;
    }

    if (!data) {
        return <AppLayout><div style={{ textAlign: 'center', padding: '60px', color: theme.textMuted }}>Employee not found.</div></AppLayout>;
    }

    const e = data.employee;
    const initials = `${e.first_name[0]}${e.last_name[0]}`;
    const statusColor = e.status === 'active'
        ? { bg: '#eaf3de', color: '#3b6d11' }
        : { bg: '#faeeda', color: '#854f0b' };

    return (
        <AppLayout>
            {/* Breadcrumb + Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>
                    <span onClick={() => navigate('/employees')} style={{ cursor: 'pointer', color: '#534AB7' }}>Employees</span>
                    {' / '}
                    <span style={{ color: theme.textPrimary }}>{e.first_name} {e.last_name}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleExportPdf}
                        disabled={exporting}
                        style={{
                            background: 'transparent', border: `1px solid ${theme.border}`,
                            color: theme.textMuted, padding: '7px 14px', borderRadius: '8px',
                            fontSize: '12px', cursor: exporting ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {exporting ? 'Generating...' : '⬇ Generate report'}
                    </button>
                    <button
                        onClick={() => setShowEditModal(true)}
                        style={{
                            background: '#534AB7', border: 'none', color: '#fff',
                            padding: '7px 14px', borderRadius: '8px',
                            fontSize: '12px', cursor: 'pointer', fontWeight: '500',
                        }}
                    >
                        ✎ Edit profile
                    </button>
                </div>
            </div>

            {/* Profile Header */}
            <div style={{ ...card, display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
                {e.photo ? (
                    <img src={e.photo} alt={e.first_name} style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        objectFit: 'cover', flexShrink: 0, border: '2px solid #AFA9EC',
                    }} />
                ) : (
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: '#EEEDFE', color: '#534AB7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', fontWeight: '600', flexShrink: 0,
                        border: '2px solid #AFA9EC',
                    }}>
                        {initials}
                    </div>
                )}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>
                            {e.first_name} {e.last_name}
                        </h1>
                        <span style={{
                            fontSize: '10px', padding: '3px 9px', borderRadius: '5px',
                            background: statusColor.bg, color: statusColor.color, fontWeight: '600',
                            textTransform: 'uppercase', letterSpacing: '0.4px',
                        }}>
                            {e.status === 'active' ? 'Active' : 'On leave'}
                        </span>
                    </div>
                    <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>{e.position}</div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: theme.textMuted }}>
                        <span>🏢 {e.department}</span>
                        <span>🆔 EMP-{String(e.id).padStart(4, '0')}</span>
                        <span>📅 Joined {new Date(e.hire_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '12px' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>Performance overview</span>
                            <span style={{ fontSize: '10px', color: theme.textMuted, fontStyle: 'italic' }}>Coming soon</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            <div style={{ background: theme.actionBg, borderRadius: '8px', padding: '12px', opacity: 0.6 }}>
                                <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px' }}>⭐ Current rating</div>
                                <div style={{ fontSize: '20px', fontWeight: '600', color: theme.textPrimary }}>— / 5.0</div>
                            </div>
                            <div style={{ background: theme.actionBg, borderRadius: '8px', padding: '12px', opacity: 0.6 }}>
                                <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px' }}>🚩 Goals met</div>
                                <div style={{ fontSize: '20px', fontWeight: '600', color: theme.textPrimary }}>—%</div>
                            </div>
                            <div style={{ background: theme.actionBg, borderRadius: '8px', padding: '12px', opacity: 0.6 }}>
                                <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px' }}>💬 Peer sentiment</div>
                                <div style={{ fontSize: '12px', color: theme.textPrimary }}>Not yet available</div>
                            </div>
                        </div>
                    </div>

                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>Active projects</span>
                            <span style={{ fontSize: '10px', color: theme.textMuted, fontStyle: 'italic' }}>Coming soon</span>
                        </div>
                        <div style={{ textAlign: 'center', padding: '24px', color: theme.textMuted, fontSize: '12px', background: theme.actionBg, borderRadius: '8px' }}>
                            Project tracking will be available in a future update.
                        </div>
                    </div>

                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>Attendance rate</span>
                            <span onClick={() => navigate('/attendance')} style={{ fontSize: '11px', color: '#534AB7', cursor: 'pointer' }}>View attendance</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ fontSize: '32px', fontWeight: '600', color: '#1d9e75' }}>{data.attendance_rate}%</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ background: theme.border, borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                    <div style={{ width: `${data.attendance_rate}%`, height: '100%', background: '#1d9e75', borderRadius: '4px' }} />
                                </div>
                                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '6px' }}>Based on recorded attendance days</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    <div style={card}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary, marginBottom: '14px' }}>Contact information</div>
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: theme.textPrimary }}>📧 {e.email}</div>
                            <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '2px' }}>Work email</div>
                        </div>
                        {e.phone && (
                            <div>
                                <div style={{ fontSize: '12px', color: theme.textPrimary }}>📱 {e.phone}</div>
                                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '2px' }}>Mobile</div>
                            </div>
                        )}
                    </div>

                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>Document vault</span>
                            <span style={{ fontSize: '10px', color: theme.textMuted, fontStyle: 'italic' }}>Coming soon</span>
                        </div>
                        <div style={{ textAlign: 'center', padding: '20px', color: theme.textMuted, fontSize: '12px', background: theme.actionBg, borderRadius: '8px' }}>
                            Document uploads will be available soon.
                        </div>
                    </div>

                    <div style={card}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary, marginBottom: '14px' }}>🔒 Compensation</div>
                        <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px' }}>Base salary (gross)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: theme.textPrimary }}>
                                {showSalary ? fmt(data.payroll.gross) : '••••••'}
                            </div>
                            <span onClick={() => setShowSalary(!showSalary)} style={{ cursor: 'pointer', fontSize: '14px' }}>
                                {showSalary ? '🙈' : '👁'}
                            </span>
                        </div>
                        {showSalary && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: theme.textMuted, marginBottom: '4px' }}>
                                    <span>Tax (20%)</span><span style={{ color: '#e24b4a' }}>— {fmt(data.payroll.tax)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: theme.textMuted, marginBottom: '10px' }}>
                                    <span>Insurance (5%)</span><span style={{ color: '#ef9f27' }}>— {fmt(data.payroll.insurance)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1d9e75', paddingTop: '10px', borderTop: `1px solid ${theme.border}` }}>
                                    <span>Net salary</span><span>{fmt(data.payroll.net)}</span>
                                </div>
                            </>
                        )}
                        <button onClick={() => navigate('/payroll')} style={{
                            width: '100%', marginTop: '14px', background: 'transparent',
                            border: `1px solid ${theme.border}`, color: theme.textPrimary,
                            padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                        }}>
                            View full payroll
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                }}>
                    <div style={{
                        background: theme.cardBg, borderRadius: '14px',
                        padding: '28px', width: '100%', maxWidth: '480px',
                        maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${theme.border}`,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '500', color: theme.textPrimary, margin: 0 }}>Edit profile</h2>
                            <span onClick={() => setShowEditModal(false)} style={{ cursor: 'pointer', color: theme.textMuted, fontSize: '18px' }}>✕</span>
                        </div>

                        {/* Photo Upload */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                            {editForm.photo ? (
                                <img src={editForm.photo} alt="Preview" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    background: '#EEEDFE', color: '#534AB7',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', fontWeight: '600',
                                }}>
                                    {initials}
                                </div>
                            )}
                            <div>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} style={{ display: 'none' }} />
                                <button onClick={() => fileInputRef.current.click()} style={{
                                    background: 'transparent', border: `1px solid ${theme.border}`,
                                    color: theme.textPrimary, padding: '6px 12px', borderRadius: '6px',
                                    fontSize: '12px', cursor: 'pointer',
                                }}>
                                    Upload photo
                                </button>
                                <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '4px' }}>Max 2MB</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>First name</label>
                                <input type="text" value={editForm.first_name} onChange={ev => setEditForm({ ...editForm, first_name: ev.target.value })} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Last name</label>
                                <input type="text" value={editForm.last_name} onChange={ev => setEditForm({ ...editForm, last_name: ev.target.value })} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Email</label>
                            <input type="email" value={editForm.email} onChange={ev => setEditForm({ ...editForm, email: ev.target.value })} style={inputStyle} />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Phone</label>
                            <input type="text" value={editForm.phone} onChange={ev => setEditForm({ ...editForm, phone: ev.target.value })} style={inputStyle} />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Position</label>
                            <input type="text" value={editForm.position} onChange={ev => setEditForm({ ...editForm, position: ev.target.value })} style={inputStyle} />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Department</label>
                            <select value={editForm.department} onChange={ev => setEditForm({ ...editForm, department: ev.target.value })} style={inputStyle}>
                                {['Engineering', 'Design', 'Sales', 'People', 'Operations', 'Finance'].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>Status</label>
                            <select value={editForm.status} onChange={ev => setEditForm({ ...editForm, status: ev.target.value })} style={inputStyle}>
                                <option value="active">Active</option>
                                <option value="on_leave">On leave</option>
                            </select>
                        </div>

                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#dc2626', marginBottom: '12px' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setShowEditModal(false)} style={{
                                flex: 1, height: '40px', background: 'transparent',
                                border: `1px solid ${theme.border}`, borderRadius: '8px',
                                fontSize: '13px', cursor: 'pointer', color: theme.textMuted,
                            }}>Cancel</button>
                            <button onClick={handleSaveEdit} disabled={saving} style={{
                                flex: 1, height: '40px',
                                background: saving ? '#8880c8' : '#534AB7',
                                border: 'none', borderRadius: '8px',
                                fontSize: '13px', fontWeight: '500',
                                cursor: saving ? 'not-allowed' : 'pointer', color: '#fff',
                            }}>{saving ? 'Saving...' : 'Save changes'}</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}