import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Check authentication status on app load
        const checkAuthStatus = () => {
            try {
                const userId = localStorage.getItem('userId');
                const userRole = localStorage.getItem('userRole');
                const userName = localStorage.getItem('userName');
                const userEmail = localStorage.getItem('userEmail');
                if (userId && userRole) {
                    setUser({
                        id: userId,
                        name: userName || 'User',
                        email: userEmail || '',
                        role: userRole
                    });
                }
            }
            catch (error) {
                console.error('Error checking auth status:', error);
                // Clear potentially corrupted data
                clearAuthData();
            }
            finally {
                setIsLoading(false);
            }
        };
        checkAuthStatus();
    }, []);
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
        // Set role-specific IDs
        if (userData.role === 'PATIENT') {
            localStorage.setItem('patientId', userData.id);
            localStorage.setItem('patientName', userData.name);
        }
        else if (userData.role === 'DOCTOR') {
            localStorage.setItem('doctorId', userData.id);
        }
    };
    const logout = () => {
        setUser(null);
        clearAuthData();
        window.location.href = '/login';
    };
    const clearAuthData = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('patientId');
        localStorage.removeItem('patientName');
        localStorage.removeItem('doctorId');
    };
    const isAuthenticated = !!user;
    return (_jsx(AuthContext.Provider, { value: { user, login, logout, isAuthenticated, isLoading }, children: children }));
};
//# sourceMappingURL=AuthContext.js.map