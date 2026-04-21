import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const AnnouncementBar = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    useEffect(() => {
        const closed = sessionStorage.getItem('announcementBarClosed');
        if (closed === 'true') {
            setIsVisible(false);
            return;
        }
        fetchAnnouncements();
    }, []);
    useEffect(() => {
        if (announcements.length <= 1 || isPaused || !isVisible)
            return;
        const current = announcements[currentIndex];
        const duration = (current?.displayDuration || 5) * 1000;
        const timer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, duration);
        return () => clearTimeout(timer);
    }, [currentIndex, announcements, isPaused, isVisible]);
    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('/api/announcements/active');
            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data || []);
            }
        }
        catch (error) {
            console.error('Failed to fetch announcements:', error);
        }
    };
    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('announcementBarClosed', 'true');
    };
    const getIcon = (type) => {
        switch (type) {
            case 'success': return _jsx(CheckCircle, { size: 14, className: "text-emerald-400" });
            case 'warning': return _jsx(AlertTriangle, { size: 14, className: "text-amber-400" });
            case 'danger': return _jsx(XCircle, { size: 14, className: "text-rose-400" });
            default: return _jsx(Info, { size: 14, className: "text-blue-400" });
        }
    };
    if (!isVisible || announcements.length === 0)
        return null;
    const current = announcements[currentIndex];
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -50, opacity: 0 }, onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false), className: "announcement-bar", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getIcon(current?.type), _jsx("span", { className: "text-[11px] font-black uppercase tracking-[0.2em] leading-none", children: current?.text })] }), _jsx("button", { onClick: handleClose, className: "announcement-close", children: _jsx(X, { size: 14 }) })] }, current?.id || 'empty') }));
};
export default AnnouncementBar;
//# sourceMappingURL=AnnouncementBar.js.map