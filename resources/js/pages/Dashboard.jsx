import React from 'react';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div style={{ padding: '40px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <h1>Welcome, {user.name} 👋</h1>
            <p>You are logged in to Veltahr.</p>
        </div>
    );
}