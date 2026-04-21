import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, CalendarDays, Clock3, Stethoscope, ChevronLeft } from 'lucide-react';

type HeroBanner = {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  imagePosition: 'LEFT' | 'CENTER' | 'RIGHT';
  primaryLinkText?: string;
  primaryLinkUrl?: string;
  secondaryLinkText?: string;
  secondaryLinkUrl?: string;
};

const Home: React.FC = () => {
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    fetchSpecializations();
    fetchHeroBanners();
  }, []);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
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
    } catch (err) {
      console.error('Error fetching specializations:', err);
    }
  };

  const fetchHeroBanners = async () => {
    try {
      const resp = await fetch('/api/hero-banners/active');
      const data = await resp.json();
      setHeroBanners(Array.isArray(data) ? data : []);
    } catch (err) {
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

  const getImagePositionClass = (position?: string) => {
    if (position === 'LEFT') return 'left center';
    if (position === 'RIGHT') return 'right center';
    return 'center center';
  };

  const activeBanner = heroBanners[activeBannerIndex];

  return (
    <div className="page-section home-page">
      <header className="hero-section">
        <div className="container mx-auto px-10 relative z-10">
          <div className="hero-banner-shell">
            {activeBanner ? (
              <>
                <img
                  src={activeBanner.imageUrl}
                  alt={activeBanner.title}
                  className="hero-banner-image"
                  style={{ objectPosition: getImagePositionClass(activeBanner.imagePosition) }}
                />
                <div className="hero-banner-overlay" />
                <div className="hero-banner-content">
                  {activeBanner.subtitle && <p className="hero-banner-subtitle">{activeBanner.subtitle}</p>}
                  <h1 className="hero-banner-title">{activeBanner.title}</h1>
                  {activeBanner.description && <p className="hero-banner-description">{activeBanner.description}</p>}
                  <div className="hero-banner-actions">
                    {activeBanner.primaryLinkText && activeBanner.primaryLinkUrl && (
                      <a href={activeBanner.primaryLinkUrl} className="site-button site-button-primary">
                        {activeBanner.primaryLinkText}
                      </a>
                    )}
                    {activeBanner.secondaryLinkText && activeBanner.secondaryLinkUrl && (
                      <a href={activeBanner.secondaryLinkUrl} className="site-button site-button-secondary">
                        {activeBanner.secondaryLinkText}
                      </a>
                    )}
                  </div>
                </div>
                {heroBanners.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="hero-slider-arrow hero-slider-arrow-left"
                      onClick={() => setActiveBannerIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="hero-slider-arrow hero-slider-arrow-right"
                      onClick={() => setActiveBannerIndex((prev) => (prev + 1) % heroBanners.length)}
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="hero-slider-dots">
                      {heroBanners.map((banner, idx) => (
                        <button
                          key={banner.id}
                          type="button"
                          className={idx === activeBannerIndex ? 'active' : ''}
                          onClick={() => setActiveBannerIndex(idx)}
                          aria-label={`Go to banner ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="hero-banner-fallback">
                <h1 className="hero-banner-title">Your health, one seamless platform.</h1>
                <p className="hero-banner-description">Add hero banners from the admin panel to customize this space.</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Appointment Type Cards */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Physical Appointment Card */}
            <motion.div
              onClick={handlePhysicalAppointment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="page-card p-8 rounded-[24px] cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <CalendarDays size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Physical Appointment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Book an in-clinic appointment with our trusted doctors</p>
            </motion.div>

            {/* Video Consult Card */}
            <motion.div
              onClick={handleVideoConsult}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="page-card p-8 rounded-[24px] cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Clock3 size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Video Consult</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Connect with doctors instantly via secure video consultation</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-10">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Specialities</p>
              <h2 className="text-5xl font-black font-outfit mb-2 text-slate-950">Browse Specializations</h2>
              <p className="text-lg font-medium text-slate-500">Find the right care across our medical network.</p>
            </div>
            <a href="/doctors" className="section-link">
              Explore All <Search size={16} />
            </a>
          </div>

          <div className="space-y-4">
              <div className="text-center text-sm text-slate-500">
                Showing {Math.min(visibleCount, specializations.length)} of {specializations.length} specializations
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {specializations.length > 0 ? specializations.slice(0, visibleCount).map((spec, i) => (
              <motion.div 
                key={spec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group page-card p-8 rounded-[32px] transition-all"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <Stethoscope size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{spec.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{spec.description || 'Consult our verified experts for specialised care.'}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                   View Doctors <ChevronRight size={12} />
                </div>
              </motion.div>
            )) : (
               [1,2,3,4].map(i => (
                 <div key={i} className="page-card p-8 rounded-[32px] animate-pulse" style={{height:'220px'}}></div>
               ))
            )}
          </div>
          </div>
          
          {/* View More Button */}
          {specializations.length > visibleCount && (
            <div className="text-center mt-8">
              <motion.button
                onClick={handleViewMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 mx-auto"
              >
                View More Specializations
                <ChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
