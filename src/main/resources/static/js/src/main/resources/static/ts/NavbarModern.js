import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/design-system.css';
import '../css/navbar-modern.css';
const NavbarModern = ({ isAuthenticated = false, userRole = '' }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    return (_jsx("nav", { className: "navbar-modern", children: _jsxs("div", { className: "navbar-container", children: [_jsxs(Link, { to: "/", className: "navbar-logo", children: [_jsx("span", { className: "logo-icon", children: "\u2695\uFE0F" }), _jsx("span", { className: "logo-text", children: "Sehat24x7" })] }), _jsxs("button", { className: "mobile-menu-toggle", onClick: () => setMobileMenuOpen(!mobileMenuOpen), children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }), _jsxs("div", { className: `navbar-menu ${mobileMenuOpen ? 'open' : ''}`, children: [_jsxs("div", { className: "nav-links", children: [_jsx(Link, { to: "/", className: "nav-link", children: "Home" }), _jsx(Link, { to: "/consultations", className: "nav-link", children: "Consultations" }), _jsx(Link, { to: "/doctors", className: "nav-link", children: "Doctors" }), _jsx(Link, { to: "/about-us", className: "nav-link", children: "About" })] }), _jsx("div", { className: "navbar-actions", children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: `/${userRole.toLowerCase()}/dashboard`, className: "btn btn-sm btn-outline", children: "Dashboard" }), _jsx("button", { onClick: handleLogout, className: "btn btn-sm btn-danger", children: "Logout" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "btn btn-sm btn-outline", children: "Login" }), _jsx(Link, { to: "/patients/register", className: "btn btn-sm btn-primary", children: "Sign Up" })] })) })] })] }) }));
};
export default NavbarModern;
//# sourceMappingURL=NavbarModern.js.map