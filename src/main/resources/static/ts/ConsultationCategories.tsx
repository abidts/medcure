import React, { useState, useEffect } from 'react';

interface ConsultationCategory {
  icon: string;
  title: string;
  specializationId: number;
  description: string;
}

const ConsultationCategories: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const categories: ConsultationCategory[] = [
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
    return (
      <div className="page-section min-h-screen flex items-center justify-center">
        <div className="page-card p-8 rounded-[32px] text-center">
          <p className="text-slate-500 font-semibold">Loading consultation categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section py-24">
      <div className="container mx-auto px-6">
        <div className="hero-copy">
          <div className="hero-badge">Online Consultations</div>
          <h1 className="hero-title">Consult top doctors online for any health concern.</h1>
          <p className="hero-subtitle">Private, simple and secure video-first consultations designed with the new Sehat24X7 white and blue experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {categories.map((category, index) => (
            <div key={index} className="page-card p-8 rounded-[32px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-6">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ whiteSpace: 'pre-line' }}>
                {category.title}
              </h3>
              <p className="text-slate-500 leading-relaxed mb-8">{category.description}</p>
              <a href={`/consultation/book/${category.specializationId}`} className="site-button site-button-primary">
                Consult Now
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/doctors" className="site-button site-button-secondary">
            View All Doctors
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConsultationCategories;
