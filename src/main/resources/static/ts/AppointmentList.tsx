import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, User, UserCheck, Video, 
  MapPin, ChevronRight, Search, Filter,
  MoreVertical, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    // Simulation
    setTimeout(() => {
      setAppointments([
        { id: 1, patient: { name: 'Aamir Bashir' }, doctor: { name: 'Dr. Mushtaq Ahmad' }, date: '2024-03-24', time: '10:30', type: 'VIDEO', status: 'CONFIRMED', reason: 'Fever & Fatigue' },
        { id: 2, patient: { name: 'Sarah Jan' }, doctor: { name: 'Dr. Sarah Jan' }, date: '2024-03-25', time: '11:00', type: 'CLINIC', status: 'PENDING', reason: 'Skin Rash' },
        { id: 3, patient: { name: 'Imtiyaz Bhat' }, doctor: { name: 'Dr. Mushtaq Ahmad' }, date: '2024-03-26', time: '12:15', type: 'VIDEO', status: 'COMPLETED', reason: 'Follow-up' },
      ]);
      setLoading(false);
    }, 800);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'COMPLETED': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 font-inter">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
               <h1 className="text-4xl font-black text-slate-900 font-outfit tracking-tight">Executive Registry</h1>
               <p className="text-slate-500 font-medium">Managing all patient doctor interactions across the network.</p>
            </div>
            <div className="flex gap-4">
               <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input type="text" placeholder="Search appointments..." className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-blue-100/50 w-64 shadow-sm" />
               </div>
               <button className="p-4 bg-white text-slate-400 rounded-[20px] border border-slate-100 hover:text-blue-600 transition-all shadow-sm">
                  <Filter size={20} />
               </button>
            </div>
        </header>

        {loading ? (
          <div className="space-y-4">
             {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-[32px] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
             {appointments.map((app, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={app.id} 
                  className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-wrap items-center gap-8 group"
                >
                   <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <p className="text-[10px] font-black uppercase leading-none mb-1">MAR</p>
                      <p className="text-xl font-black leading-none">{app.date.split('-')[2]}</p>
                   </div>

                   <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`w-2 h-2 rounded-full ${app.status === 'CONFIRMED' ? 'bg-blue-500' : app.status === 'PENDING' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.status}</p>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                         {app.patient.name} <ChevronRight size={14} className="text-slate-300" /> {app.doctor.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Clock size={14} className="text-blue-500" /> {app.time}
                         </div>
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Video size={14} className={app.type === 'VIDEO' ? 'text-purple-500' : 'text-slate-300'} /> {app.type}
                         </div>
                      </div>
                   </div>

                   <div className="hidden lg:block w-48">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Clinical Reason</p>
                      <p className="text-xs font-bold text-slate-600 truncate">{app.reason}</p>
                   </div>

                   <div className="flex items-center gap-4">
                      {app.type === 'VIDEO' && app.status === 'CONFIRMED' && (
                        <Link to={`/appointments/${app.id}/call`} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                           <Video size={20} />
                        </Link>
                      )}
                      <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                         <MoreVertical size={20} />
                      </button>
                   </div>
                </motion.div>
             ))}
          </div>
        )}

        {appointments.length === 0 && !loading && (
           <div className="py-32 text-center bg-white rounded-[48px] border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                 <Calendar size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Registry is empty</h3>
              <p className="text-slate-500">No appointments have been scheduled yet.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
