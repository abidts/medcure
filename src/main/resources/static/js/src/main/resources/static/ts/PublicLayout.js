import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from './AuthContext';
import AnnouncementBar from './AnnouncementBar';
const PublicLayout = () => {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dashboardHref, setDashboardHref] = useState('/login');
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'DOCTOR') {
                setDashboardHref('/doctor/dashboard');
            }
            else if (user.role === 'STAFF') {
                setDashboardHref('/staff/dashboard');
            }
            else if (user.role === 'ADMIN') {
                setDashboardHref('/admin-panel');
            }
            else {
                const patientId = localStorage.getItem('patientId');
                setDashboardHref(`/patient/dashboard?patientId=${patientId}`);
            }
        }
        else {
            setDashboardHref('/login');
        }
    }, [isAuthenticated, user]);
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);
    const navLinks = useMemo(() => [
        { href: '/', label: 'Home' },
        { href: '/doctors', label: 'Doctors' },
        { href: '/consultations', label: 'Consultations' },
        { href: '/tools', label: 'Tools' },
        { href: '/dictionary', label: 'Dictionary' },
        { href: '/about-us', label: 'About' },
    ], []);
    return (_jsxs("div", { className: "app-shell", children: [_jsx(AnnouncementBar, {}), _jsx("header", { className: "site-header", children: _jsxs("div", { className: "container site-header-inner", children: [_jsxs(Link, { to: "/", className: "site-brand", "aria-label": "Sehat24X7 home", children: [_jsx("span", { className: "site-brand-mark", children: "S" }), _jsxs("span", { children: [_jsx("strong", { children: "Sehat24X7" }), _jsx("small", { children: "Trusted digital care" })] })] }), _jsx("nav", { className: "site-nav desktop-nav", "aria-label": "Primary", children: navLinks.map((item) => (_jsx(Link, { to: item.href, className: location.pathname === item.href ? 'active' : '', children: item.label }, item.href))) }), _jsx("div", { className: "site-actions desktop-actions", children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsxs(Link, { to: dashboardHref, className: "site-button site-button-secondary", children: [_jsx(LayoutDashboard, { size: 16 }), "Dashboard"] }), _jsxs("button", { type: "button", className: "site-button site-button-primary", onClick: logout, children: [_jsx(LogOut, { size: 16 }), "Logout"] })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "site-button site-button-secondary", children: "Login" }), _jsx(Link, { to: "/doctor-register", className: "site-button site-button-secondary", children: "Doctor Register" }), _jsx(Link, { to: "/patients/register", className: "site-button site-button-primary", children: "Patient Register" })] })) })] }) }), _jsx("main", { className: "site-main", children: _jsx(Outlet, {}) }), _jsx("footer", { className: "site-footer", children: _jsxs("div", { className: "container site-footer-inner", children: [_jsxs("div", { children: [_jsx("p", { className: "site-footer-title", children: "Sehat24X7" }), _jsx("p", { className: "site-footer-copy", children: "Simple, secure and accessible care for every family." })] }), _jsxs("div", { className: "site-footer-links", children: [_jsx(Link, { to: "/about-us", children: "About" }), _jsx(Link, { to: "/doctors", children: "Find Doctors" }), _jsx(Link, { to: "/consultations", children: "Consult Online" })] })] }) })] }));
};
export default PublicLayout;
//# sourceMappingURL=PublicLayout.js.map