import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Announcement {
  id: number;
  text: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  displayOrder: number;
  displayDuration?: number;
}

const AnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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
    if (announcements.length <= 1 || isPaused || !isVisible) return;

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
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('announcementBarClosed', 'true');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} className="text-emerald-400" />;
      case 'warning': return <AlertTriangle size={14} className="text-amber-400" />;
      case 'danger': return <XCircle size={14} className="text-rose-400" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current?.id || 'empty'}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="announcement-bar"
      >
        <div className="flex items-center gap-3">
          {getIcon(current?.type)}
          <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">
            {current?.text}
          </span>
        </div>
        
        <button 
          onClick={handleClose}
          className="announcement-close"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBar;
