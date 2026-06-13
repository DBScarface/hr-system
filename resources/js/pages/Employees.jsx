import React, { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', phone: '',
        department: '', position: '', status: 'active',
        hire_date: '', salary: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await api.post('/employees', form);
            setEmployees([res.data, ...employees]);
            setShowModal(false);
            setForm({
                first_name: '', last_name: '', email: '', phone: '',
                department: '', position: '', status: 'active',
                hire_date: '', salary: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this employee?')) return;
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(e => e.id !== id));
    };

    const filtered = employees.filter(e =>
        `${e.first_name} ${e.last_name} ${e.email} ${e.department} ${e.position}`
            .toLowerCase().includes(search.toLowerCase())
    );

    const departments = ['Engineering', 'Design', 'Sales', 'People', 'Operations', 'Finance'];

    const statusBadge = (status) => ({
        background: status === 'active' ? '#eaf3de' : '#faeeda',
        color: status === 'active' ? '#3b6d11' : '#854f0b',
        fontSize: '10px', padding: '2px 8px',
        borderRadius: '4px', fontWeight: '500',
    });

    const initials = (e) => `${e.first_name[0]}${e.last_name[0]}`;

    const avatarColors = [
        { bg: '#EEEDFE', text: '#534AB7' },
        { bg: '#e1f5ee', text: '#0f6e56' },
        { bg: '#faeeda', text: '#854f0b' },
        { bg: '#e6f1fb', text: '#185fa5' },
        { bg: '#fce8e8', text: '#a01e1e' },
        { bg: '#e8f4e8', text: '#1e6b1e' },
    ];

    const inputStyle = {
        width: '100%', height: '38px',
        border: '1px solid #e5e5ea', borderRadius: '8px',
        padding: '0 12px', fontSize: '13px',
        background: '#fafafa', color: '#1d1d1f',
        outline: 'none', boxSizing: 'border-box',
    };

    return (
        <AppLayout>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1d1d1f', margin: '0 0 4px' }}>
                        Employees
                    </h1>
                    <p style={{ fontSize: '13px', color: '#8888a0', margin: 0 }}>
                        {employees.length} total employees
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        background: '#534AB7', color: '#fff', border: 'none',
                        padding: '9px 16px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                    }}
                >
                    + Add employee
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search by name, email, department..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    ...inputStyle,
                    marginBottom: '16px', height: '40px',
                    background: '#fff', border: '1px solid #e5e5ea',
                }}
            />

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid #e5e5ea', borderRadius: '10px', overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr 80px',
                    padding: '10px 16px',
                    borderBottom: '1px solid #f0f0f5',
                    background: '#f8f8fa',
                }}>
                    {['Employee', 'Email', 'Department', 'Position', 'Status', 'Hire date', ''].map((h, i) => (
                        <div key={i} style={{ fontSize: '11px', color: '#8888a0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            {h}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#8888a0', fontSize: '13px' }}>
                        Loading...
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#8888a0', fontSize: '13px' }}>
                        No employees found.
                    </div>
                ) : (
                    filtered.map((e, i) => {
                        const av = avatarColors[i % avatarColors.length];
                        return (
                            <div key={e.id} style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr 80px',
                                padding: '12px 16px', alignItems: 'center',
                                borderBottom: i < filtered.length - 1 ? '1px solid #f0f0f5' : 'none',
                                transition: 'background 0.1s',
                            }}
                                onMouseEnter={ev => ev.currentTarget.style.background = '#fafafa'}
                                onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                            >
                                {/* Name */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '30px', height: '30px', borderRadius: '50%',
                                        background: av.bg, color: av.text,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '10px', fontWeight: '600', flexShrink: 0,
                                    }}>
                                        {initials(e)}
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#1d1d1f', fontWeight: '500' }}>
                                        {e.first_name} {e.last_name}
                                    </span>
                                </div>

                                <div style={{ fontSize: '12px', color: '#6e6e73' }}>{e.email}</div>
                                <div style={{ fontSize: '12px', color: '#6e6e73' }}>{e.department}</div>
                                <div style={{ fontSize: '12px', color: '#6e6e73' }}>{e.position}</div>
                                <span style={statusBadge(e.status)}>
                                    {e.status === 'active' ? 'Active' : 'On leave'}
                                </span>
                                <div style={{ fontSize: '12px', color: '#6e6e73' }}>
                                    {new Date(e.hire_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                                <button
                                    onClick={() => handleDelete(e.id)}
                                    style={{
                                        background: 'transparent', border: '1px solid #fecaca',
                                        color: '#dc2626', padding: '4px 8px',
                                        borderRadius: '5px', fontSize: '11px', cursor: 'pointer',
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '14px',
                        padding: '28px', width: '100%', maxWidth: '480px',
                        maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#1d1d1f', margin: 0 }}>
                                Add employee
                            </h2>
                            <span onClick={() => setShowModal(false)} style={{ cursor: 'pointer', color: '#8888a0', fontSize: '18px' }}>✕</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            {[
                                { key: 'first_name', label: 'First name', type: 'text' },
                                { key: 'last_name', label: 'Last name', type: 'text' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ fontSize: '12px', color: '#8888a0', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                                    <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
                                </div>
                            ))}
                        </div>

                        {[
                            { key: 'email', label: 'Email', type: 'email' },
                            { key: 'phone', label: 'Phone', type: 'text' },
                            { key: 'position', label: 'Position', type: 'text' },
                            { key: 'hire_date', label: 'Hire date', type: 'date' },
                            { key: 'salary', label: 'Salary', type: 'number' },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '12px', color: '#8888a0', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                                <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
                            </div>
                        ))}

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: '#8888a0', display: 'block', marginBottom: '4px' }}>Department</label>
                            <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ ...inputStyle }}>
                                <option value="">Select department</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', color: '#8888a0', display: 'block', marginBottom: '4px' }}>Status</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...inputStyle }}>
                                <option value="active">Active</option>
                                <option value="on_leave">On leave</option>
                            </select>
                        </div>

                        {error && (
                            <div style={{
                                background: '#fef2f2', border: '1px solid #fecaca',
                                borderRadius: '8px', padding: '10px 12px',
                                fontSize: '12px', color: '#dc2626', marginBottom: '12px',
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setShowModal(false)} style={{
                                flex: 1, height: '40px', background: 'transparent',
                                border: '1px solid #e5e5ea', borderRadius: '8px',
                                fontSize: '13px', cursor: 'pointer', color: '#6e6e73',
                            }}>
                                Cancel
                            </button>
                            <button onClick={handleAdd} disabled={saving} style={{
                                flex: 1, height: '40px', background: saving ? '#8880c8' : '#534AB7',
                                border: 'none', borderRadius: '8px',
                                fontSize: '13px', fontWeight: '500',
                                cursor: saving ? 'not-allowed' : 'pointer', color: '#fff',
                            }}>
                                {saving ? 'Saving...' : 'Add employee'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}