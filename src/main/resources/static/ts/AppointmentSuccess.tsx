import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Video, Home, Search, Heart, ShieldCheck, CalendarCheck, Share2, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const AppointmentSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-inter">
      <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-tr from-blue-50/20 via-white to-purple-50/20">
         <div className="max-w-4xl w-full">
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden relative">
               {/* Pattern Background */}
               <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none -rotate-12"><CalendarCheck size={320} /></div>
               
               <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left: Branding & Graphic */}
                  <div className="p-12 md:p-20 bg-slate-900 text-white flex flex-col justify-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent)]"></div>
                     <motion.div 
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ duration: 0.8, ease: "easeOut" }}
                       className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-10 border border-white/10"
                     >
                        <CheckCircle size={48} className="text-green-400" />
                     </motion.div>
                     <h1 className="text-5xl font-black font-outfit mb-6 leading-tight">Session Confirmed.</h1>
                     <p className="text-slate-400 text-lg leading-relaxed mb-12">Your appointment has been successfully recorded. You're one step closer to better health.</p>
                     
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                              <ShieldCheck size={20} />
                           </div>
                           <p className="text-sm font-bold tracking-wide">Secure Encryption</p>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
                              <Heart size={20} />
                           </div>
                           <p className="text-sm font-bold tracking-wide">Caring Professionals</p>
                        </div>
                     </div>
                  </div>

                  {/* Right: Actions & Details */}
                  <div className="p-12 md:p-20">
                     <header className="mb-12">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Reference ID: #{id || 'T24-2910'}</p>
                        <h2 className="text-2xl font-bold text-slate-900 font-outfit">Next Steps</h2>
                     </header>

                     <div className="space-y-4 mb-12">
                        <Link 
                          to={`/appointments/${id}/call`}
                          className="w-full p-6 bg-blue-600 text-white rounded-3xl flex items-center justify-between group hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                        >
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                 <Video size={24} />
                              </div>
                              <div className="text-left">
                                 <p className="font-bold">Join Video Room</p>
                                 <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">For Video Consultations</p>
                              </div>
                           </div>
                        </Link>

                        <button className="w-full p-6 bg-slate-50 text-slate-900 rounded-3xl flex items-center justify-between group hover:bg-slate-100 transition-all border border-slate-100">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                 <Printer size={20} className="text-slate-400" />
                              </div>
                              <div className="text-left">
                                 <p className="font-bold text-slate-700">Print Receipt</p>
                                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Download PDF Summary</p>
                              </div>
                           </div>
                        </button>
                     </div>

                     <div className="flex gap-4">
                        <Link to="/" className="flex-1 px-8 py-5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm text-center hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                           <Home size={18} /> Home
                        </Link>
                        <Link to="/doctors" className="flex-1 px-8 py-5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm text-center hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                           <Search size={18} /> Find More
                        </Link>
                     </div>

                     <footer className="mt-16 pt-12 border-t border-slate-50">
                        <div className="flex justify-center gap-6 text-slate-300">
                           <Share2 size={20} className="hover:text-blue-500 cursor-pointer transition-colors" />
                           <span className="w-px h-5 bg-slate-100"></span>
                           <p className="text-[10px] font-black uppercase tracking-widest">Sehat 24x7 © 2026</p>
                        </div>
                     </footer>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

export default AppointmentSuccess;
