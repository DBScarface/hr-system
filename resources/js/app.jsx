import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import './index.css';
import Attendance from './pages/Attendance';
import LeaveRequests from './pages/LeaveRequests';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import Settings from './pages/Settings';


function RoleRoute({ allowed, children }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'admin';
    if (!allowed.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

function App() {
    const token = localStorage.getItem('token');

    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
                    <Route path="/employees" element={token ? <RoleRoute allowed={['admin', 'manager']}><Employees /></RoleRoute> : <Navigate to="/login" replace />} />
                    <Route path="/employees/:id" element={token ? <RoleRoute allowed={['admin', 'manager']}><EmployeeProfile /></RoleRoute> : <Navigate to="/login" replace />} />
                    <Route path="/attendance" element={token ? <Attendance /> : <Navigate to="/login" replace />} />
                    <Route path="/leave" element={token ? <LeaveRequests /> : <Navigate to="/login" replace />} />
                    <Route path="/reports" element={token ? <RoleRoute allowed={['admin', 'manager']}><Reports /></RoleRoute> : <Navigate to="/login" replace />} />
                    <Route path="/reports" element={token ? <Reports /> : <Navigate to="/login" replace />} />
                    <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" replace />} />

                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);