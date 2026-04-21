import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, CalendarDays, Clock3, Stethoscope, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const [specializations, setSpecializations] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const [heroBanners, setHeroBanners] = useState([]);
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    useEffect(() => {
        fetchSpecializations();
        fetchHeroBanners();
    }, []);
    useEffect(() => {
        if (heroBanners.length <= 1)
            return;
        const timer = setInterval(() => {
            setActiveBannerIndex((prev) => (prev + 1) % heroBanners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroBanners]);
    const fetchSpecializations = async () => {
        try {
            const resp = await fetch('/api/specializations');
            const data = await resp.json();
            setSpecializations(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error('Error fetching specializations:', err);
        }
    };
    const fetchHeroBanners = async () => {
        try {
            const resp = await fetch('/api/hero-banners/active');
            const data = await resp.json();
            setHeroBanners(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error('Error fetching hero banners:', err);
            setHeroBanners([]);
        }
    };
    const handleViewMore = () => {
        setVisibleCount(prev => Math.min(prev + 8, specializations.length));
    };
    const handlePhysicalAppointment = () => {
        window.location.href = '/doctors';
    };
    const handleVideoConsult = () => {
        window.location.href = '/doctors?type=video';
    };
    const handleSpecializationClick = (spec) => {
        navigate(`/doctors?specialization=${encodeURIComponent(spec.name || '')}`);
    };
    const getImagePositionClass = (position) => {
        if (position === 'LEFT')
            return 'left center';
        if (position === 'RIGHT')
            return 'right center';
        return 'center center';
    };
    const activeBanner = heroBanners[activeBannerIndex];
    return (_jsxs("div", { className: "page-section home-page", children: [_jsx("header", { className: "hero-section", children: _jsx("div", { className: "container mx-auto px-10 relative z-10", children: _jsx("div", { className: "hero-banner-shell", children: activeBanner ? (_jsxs(_Fragment, { children: [_jsx("img", { src: activeBanner.imageUrl, alt: activeBanner.title, className: "hero-banner-image", style: { objectPosition: getImagePositionClass(activeBanner.imagePosition) } }), _jsx("div", { className: "hero-banner-overlay" }), _jsxs("div", { className: "hero-banner-content", children: [activeBanner.subtitle && _jsx("p", { className: "hero-banner-subtitle", children: activeBanner.subtitle }), _jsx("h1", { className: "hero-banner-title", children: activeBanner.title }), activeBanner.description && _jsx("p", { className: "hero-banner-description", children: activeBanner.description }), _jsxs("div", { className: "hero-banner-actions", children: [activeBanner.primaryLinkText && activeBanner.primaryLinkUrl && (_jsx("a", { href: activeBanner.primaryLinkUrl, className: "site-button site-button-primary", children: activeBanner.primaryLinkText })), activeBanner.secondaryLinkText && activeBanner.secondaryLinkUrl && (_jsx("a", { href: activeBanner.secondaryLinkUrl, className: "site-button site-button-secondary", children: activeBanner.secondaryLinkText }))] })] }), heroBanners.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "hero-slider-arrow hero-slider-arrow-left", onClick: () => setActiveBannerIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length), children: _jsx(ChevronLeft, { size: 18 }) }), _jsx("button", { type: "button", className: "hero-slider-arrow hero-slider-arrow-right", onClick: () => setActiveBannerIndex((prev) => (prev + 1) % heroBanners.length), children: _jsx(ChevronRight, { size: 18 }) }), _jsx("div", { className: "hero-slider-dots", children: heroBanners.map((banner, idx) => (_jsx("button", { type: "button", className: idx === activeBannerIndex ? 'active' : '', onClick: () => setActiveBannerIndex(idx), "aria-label": `Go to banner ${idx + 1}` }, banner.id))) })] }))] })) : (_jsxs("div", { className: "hero-banner-fallback", children: [_jsx("h1", { className: "hero-banner-title", children: "Your health, one seamless platform." }), _jsx("p", { className: "hero-banner-description", children: "Add hero banners from the admin panel to customize this space." })] })) }) }) }), _jsx("section", { className: "py-12 bg-slate-50", children: _jsx("div", { className: "container mx-auto px-10", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs(motion.div, { onClick: handlePhysicalAppointment, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, whileHover: { y: -5 }, className: "page-card p-8 rounded-[24px] cursor-pointer shadow-lg hover:shadow-xl transition-all", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4", children: _jsx(CalendarDays, { size: 24 }) }), _jsx("h3", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Physical Appointment" }), _jsx("p", { className: "text-slate-600 text-sm leading-relaxed", children: "Book an in-clinic appointment with our trusted doctors" })] }), _jsxs(motion.div, { onClick: handleVideoConsult, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 }, whileHover: { y: -5 }, className: "page-card p-8 rounded-[24px] cursor-pointer shadow-lg hover:shadow-xl transition-all", children: [_jsx("div", { className: "w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4", children: _jsx(Clock3, { size: 24 }) }), _jsx("h3", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Video Consult" }), _jsx("p", { className: "text-slate-600 text-sm leading-relaxed", children: "Connect with doctors instantly via secure video consultation" })] })] }) }) }), _jsx("section", { className: "py-24", children: _jsxs("div", { className: "container mx-auto px-10", children: [_jsxs("div", { className: "section-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "section-kicker", children: "Specialities" }), _jsx("h2", { className: "text-5xl font-black font-outfit mb-2 text-slate-950", children: "Browse Specializations" }), _jsx("p", { className: "text-lg font-medium text-slate-500", children: "Find the right care across our medical network." })] }), _jsxs("a", { href: "/doctors", className: "section-link", children: ["Explore All ", _jsx(Search, { size: 16 })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center text-sm text-slate-500", children: ["Showing ", Math.min(visibleCount, specializations.length), " of ", specializations.length, " specializations"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: specializations.length > 0 ? specializations.slice(0, visibleCount).map((spec, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.1 }, whileHover: { y: -10 }, className: "group page-card p-8 rounded-[32px] transition-all cursor-pointer", onClick: () => handleSpecializationClick(spec), role: "button", tabIndex: 0, onKeyDown: (e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleSpecializationClick(spec);
                                            }
                                        }, children: [_jsx("div", { className: "w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all", children: _jsx(Stethoscope, { size: 26 }) }), _jsx("h3", { className: "text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors", children: spec.name }), _jsx("p", { className: "text-slate-400 text-sm leading-relaxed mb-4", children: spec.description || 'Consult our verified experts for specialised care.' }), _jsxs("div", { className: "flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]", children: ["View Doctors ", _jsx(ChevronRight, { size: 12 })] })] }, spec.id))) : ([1, 2, 3, 4].map(i => (_jsx("div", { className: "page-card p-8 rounded-[32px] animate-pulse", style: { height: '220px' } }, i)))) })] }), specializations.length > visibleCount && (_jsx("div", { className: "text-center mt-8", children: _jsxs(motion.button, { onClick: handleViewMore, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 mx-auto", children: ["View More Specializations", _jsx(ChevronRight, { size: 16 })] }) }))] }) })] }));
};
export default Home;
//# sourceMappingURL=Home.js.map