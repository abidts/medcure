import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/design-system.css';
import '../css/home-modern.css';
const HomeModern = () => {
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchSpecializations();
    }, []);
    const fetchSpecializations = async () => {
        try {
            const response = await fetch('/api/specializations');
            if (response.ok) {
                const data = await response.json();
                setSpecializations(data.slice(0, 6));
            }
        }
        catch (error) {
            console.error('Error fetching specializations:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "home-modern", children: [_jsxs("section", { className: "hero-section", children: [_jsxs("div", { className: "hero-content animate-fade-in", children: [_jsx("h1", { children: "Your Health, Our Priority" }), _jsx("p", { className: "hero-subtitle", children: "Connect with qualified doctors, book consultations, and get expert medical advice" }), _jsx(Link, { to: "/consultations", className: "btn btn-primary btn-lg", children: "Start Consultation" })] }), _jsxs("div", { className: "hero-background", children: [_jsx("div", { className: "gradient-orb orb-1" }), _jsx("div", { className: "gradient-orb orb-2" }), _jsx("div", { className: "gradient-orb orb-3" })] })] }), _jsx("section", { className: "features-section", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "section-header animate-slide-in", children: [_jsx("h2", { children: "Why Choose Sehat24x7?" }), _jsx("p", { children: "Professional healthcare at your fingertips" })] }), _jsxs("div", { className: "features-grid", children: [_jsxs("div", { className: "feature-card animate-fade-in", children: [_jsx("div", { className: "feature-icon", children: "\uD83E\uDE7A" }), _jsx("h3", { children: "Expert Doctors" }), _jsx("p", { children: "Qualified and experienced medical professionals ready to help" })] }), _jsxs("div", { className: "feature-card animate-fade-in", children: [_jsx("div", { className: "feature-icon", children: "\u23F1\uFE0F" }), _jsx("h3", { children: "Quick Consultations" }), _jsx("p", { children: "Book and connect within minutes from the comfort of your home" })] }), _jsxs("div", { className: "feature-card animate-fade-in", children: [_jsx("div", { className: "feature-icon", children: "\uD83D\uDD12" }), _jsx("h3", { children: "Secure & Private" }), _jsx("p", { children: "Your medical information is completely secure and confidential" })] }), _jsxs("div", { className: "feature-card animate-fade-in", children: [_jsx("div", { className: "feature-icon", children: "\uD83D\uDCB3" }), _jsx("h3", { children: "Affordable Rates" }), _jsx("p", { children: "Transparent pricing with no hidden charges" })] }), _jsxs("div", { className: "feature-card animate-fade-in", children: [_jsx("div", { className: "feature-icon", children: "\uD83D\uDCCB" }), _jsx("h3", { children: "Prescriptions" }), _jsx("p", { children: "Get digital prescriptions directly from your doctor" })] }), _jsxs("div", { className: "feature-card animate-fade-in", children: [_jsx("div", { className: "feature-icon", children: "\uD83C\uDFAF" }), _jsx("h3", { children: "24/7 Available" }), _jsx("p", { children: "Book consultations anytime, day or night" })] })] })] }) }), _jsx("section", { className: "specializations-section", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "section-header animate-slide-in", children: [_jsx("h2", { children: "Popular Specializations" }), _jsx("p", { children: "Book consultations with specialists" })] }), loading ? (_jsx("div", { className: "flex-center", style: { height: '300px' }, children: _jsx("div", { className: "animate-pulse", children: "Loading specializations..." }) })) : (_jsx("div", { className: "specializations-grid", children: specializations.map((spec) => (_jsx(Link, { to: `/consultation/book/${spec.id}`, className: "specialization-card-link", children: _jsxs("div", { className: "specialization-card animate-fade-in", children: [_jsx("div", { className: "spec-icon-large", children: "\uD83C\uDFE5" }), _jsx("h3", { children: spec.name }), _jsx("p", { children: spec.description }), _jsxs("div", { className: "spec-info", children: [_jsxs("div", { className: "spec-fee", children: ["\u20B9", spec.fee || 499] }), _jsx("button", { className: "btn btn-sm btn-primary", children: "Book Now" })] })] }) }, spec.id))) }))] }) }), _jsx("section", { className: "cta-section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "cta-content animate-fade-in", children: [_jsx("h2", { children: "Ready to Book Your First Consultation?" }), _jsx("p", { children: "Join thousands of patients getting expert medical advice online" }), _jsxs("div", { className: "cta-buttons", children: [_jsx(Link, { to: "/consultations", className: "btn btn-primary btn-lg", children: "Explore Specializations" }), _jsx(Link, { to: "/about-us", className: "btn btn-outline btn-lg", children: "Learn More" })] })] }) }) })] }));
};
export default HomeModern;
//# sourceMappingURL=HomeModern.js.map