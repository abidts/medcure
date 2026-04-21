import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Mail, Phone, MapPin, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-inter page-section">
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-transparent"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-slate-900 mb-6 font-outfit"
          >
            Empowering <span className="text-blue-600">Health</span> for Life
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto"
          >
            Sehat24x7 is Jammu & Kashmir's leading healthcare platform, bridging the gap between experts and those in need.
          </motion.p>
          <div className="mt-10 inline-flex items-center gap-2 px-6 py-2 bg-green-100 text-green-600 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm">
             <Clock size={14} /> Established 2020
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-xl"
           >
              <h2 className="text-3xl font-bold text-slate-900 mb-6 font-outfit">Our Story</h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                 Born in the heart of Srinagar, Sehat24x7 started with a simple vision: quality healthcare should not be a luxury. We observed the challenges patients faced in reaching the right specialists and envisioned a digital bridge.
              </p>
              <p className="text-slate-500 leading-relaxed">
                 Today, we are a comprehensive platform connecting thousands of patients with top-tier medical professionals across the valley, ensuring help is always just a click away.
              </p>
           </motion.div>

           <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-blue-600 p-12 rounded-[40px] text-white shadow-xl shadow-blue-200"
              >
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <Target size={32} className="text-white" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 font-outfit">Our Mission</h3>
                 <p className="text-blue-100 leading-relaxed">
                    To provide accessible, affordable, and high-quality healthcare services to all, leveraging cutting-edge technology to create a seamless patient experience.
                 </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900 p-12 rounded-[40px] text-white shadow-xl shadow-slate-200"
              >
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <Eye size={32} className="text-white" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 font-outfit">Our Vision</h3>
                 <p className="text-slate-400 leading-relaxed">
                    To become the most trusted and comprehensive healthcare ecosystem in North India, setting new standards for digital medical integration.
                 </p>
              </motion.div>
           </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: 'Specializations', value: '48+' },
             { label: 'Availability', value: '24/7' },
             { label: 'Patient Support', value: '100%' },
             { label: 'Satisfaction', value: '99%' }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center group hover:bg-blue-600 transition-all duration-500"
             >
                <h4 className="text-4xl font-black text-slate-900 mb-2 group-hover:text-white transition-colors">{stat.value}</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-blue-100 transition-colors">{stat.label}</p>
             </motion.div>
           ))}
        </div>

        {/* Contact info card */}
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="mt-20 bg-white p-12 rounded-[40px] border border-slate-100 shadow-xl overflow-hidden relative"
        >
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                 <h3 className="text-3xl font-bold text-slate-900 mb-8 font-outfit">Get in Touch</h3>
                 <div className="space-y-6">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                          <Mail size={20} />
                       </div>
                       <span className="font-semibold text-slate-600">info@sehat24x7.com</span>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                          <Phone size={20} />
                       </div>
                       <span className="font-semibold text-slate-600">+91 9906000000</span>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                          <MapPin size={20} />
                       </div>
                       <span className="font-semibold text-slate-600">Srinagar, Jammu & Kashmir</span>
                    </div>
                 </div>
              </div>
              <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100 space-y-4">
                 <div className="flex items-center gap-2 text-green-600 font-bold mb-4">
                    <ShieldCheck size={24} /> <span>Verified Platform</span>
                 </div>
                 <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    All our healthcare providers are thoroughly verified and licensed medical professionals. Your safety and health data privacy are our top priorities.
                 </p>
                 <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <CheckCircle2 size={18} /> <span>Encryption Enabled</span>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
