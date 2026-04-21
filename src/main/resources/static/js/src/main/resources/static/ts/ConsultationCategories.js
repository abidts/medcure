import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const ConsultationCategories = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = window.setTimeout(() => setLoading(false), 350);
        return () => window.clearTimeout(timer);
    }, []);
    const categories = [
        {
            icon: '🏥',
            title: 'Period doubts or\nPregnancy',
            specializationId: 1,
            description: 'Speak to experienced gynaecology experts with privacy and fast support.'
        },
        {
            icon: '🧴',
            title: 'Acne, pimple or\nskin issues',
            specializationId: 3,
            description: 'Get guidance for skin allergies, acne, rashes and long-term care plans.'
        },
        {
            icon: '💪',
            title: 'Performance\nissues in bed',
            specializationId: 2,
            description: 'Private consultations for sensitive health concerns with specialist support.'
        },
        {
            icon: '🤒',
            title: 'Cold, cough or\nfever',
            specializationId: 4,
            description: 'Quick advice for common infections, fever, cough and early symptoms.'
        },
        {
            icon: '👶',
            title: 'Child not feeling\nwell',
            specializationId: 5,
            description: 'Talk to paediatric doctors for child health, fever and routine concerns.'
        },
        {
            icon: '🧠',
            title: 'Depression or\nanxiety',
            specializationId: 6,
            description: 'Access mental wellness support with calm, secure and confidential sessions.'
        }
    ];
    if (loading) {
        return (_jsx("div", { className: "page-section min-h-screen flex items-center justify-center", children: _jsx("div", { className: "page-card p-8 rounded-[32px] text-center", children: _jsx("p", { className: "text-slate-500 font-semibold", children: "Loading consultation categories..." }) }) }));
    }
    return (_jsx("div", { className: "page-section py-24", children: _jsxs("div", { className: "container mx-auto px-6", children: [_jsxs("div", { className: "hero-copy", children: [_jsx("div", { className: "hero-badge", children: "Online Consultations" }), _jsx("h1", { className: "hero-title", children: "Consult top doctors online for any health concern." }), _jsx("p", { className: "hero-subtitle", children: "Private, simple and secure video-first consultations designed with the new Sehat24X7 white and blue experience." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12", children: categories.map((category, index) => (_jsxs("div", { className: "page-card p-8 rounded-[32px]", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-6", children: category.icon }), _jsx("h3", { className: "text-2xl font-bold text-slate-900 mb-4", style: { whiteSpace: 'pre-line' }, children: category.title }), _jsx("p", { className: "text-slate-500 leading-relaxed mb-8", children: category.description }), _jsx("a", { href: `/consultation/book/${category.specializationId}`, className: "site-button site-button-primary", children: "Consult Now" })] }, index))) }), _jsx("div", { className: "text-center mt-12", children: _jsx("a", { href: "/doctors", className: "site-button site-button-secondary", children: "View All Doctors" }) })] }) }));
};
export default ConsultationCategories;
//# sourceMappingURL=ConsultationCategories.js.map