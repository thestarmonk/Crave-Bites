import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
