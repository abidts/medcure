import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-slate-50", children: _jsx("div", { className: "w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        switch (user?.role) {
            case 'PATIENT':
                return _jsx(Navigate, { to: `/patient/dashboard?patientId=${user.id}`, replace: true });
            case 'DOCTOR':
                return _jsx(Navigate, { to: "/doctor/dashboard", replace: true });
            case 'STAFF':
                return _jsx(Navigate, { to: "/staff/dashboard", replace: true });
            case 'ADMIN':
                return _jsx(Navigate, { to: "/admin-panel", replace: true });
            default:
                return _jsx(Navigate, { to: "/login", replace: true });
        }
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
//# sourceMappingURL=ProtectedRoute.js.map