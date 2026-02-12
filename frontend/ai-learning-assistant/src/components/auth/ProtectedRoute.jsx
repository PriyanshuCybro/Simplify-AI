import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../layout/AppLayout';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return null; // Wait for auth check

    // Agar user hai toh Layout + Page dikhao, warna Login pe bhej do
    return user ? (
        <AppLayout>
            <Outlet />
        </AppLayout>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;