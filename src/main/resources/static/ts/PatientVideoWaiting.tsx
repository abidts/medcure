import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Video, XCircle, UserCheck, Loader2, ChevronLeft, PhoneCall, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const PatientVideoWaiting: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const doctorName = searchParams.get('doctorName') || 'Your Doctor';

  const [status, setStatus] = useState('Initiating...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
       checkStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    setStatus('Waiting for acceptance...');
    // In a real app, this would poll the backend for call status
    // If accepted, navigate to /appointments/id/call
  };

  const cancelRequest = () => {
    const patientId = localStorage.getItem('patientId');
    navigate(`/patient/dashboard?patientId=${patientId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.4),transparent)] animate-pulse"></div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full bg-white rounded-[48px] shadow-2xl p-12 relative z-10 text-center"
      >
         <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-10 relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full"
            />
            <PhoneCall size={32} />
         </div>

         <h2 className="text-3xl font-black text-slate-900 mb-4 font-outfit tracking-tight">Calling {doctorName}...</h2>
         <p className="text-slate-500 mb-8 leading-relaxed">Your instant video call request is currently being processed. Please don't close this window.</p>

         <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-10 shadow-sm border border-blue-100">
            <Loader2 size={14} className="animate-spin" /> {status}
         </div>

         <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 mb-12">
            <div className="flex items-center gap-6 text-left">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300 font-bold text-lg border border-slate-50">D</div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Professional</p>
                  <p className="font-bold text-slate-800">{doctorName}</p>
               </div>
            </div>
         </div>

         <div className="flex flex-col gap-4">
            <button 
              onClick={cancelRequest}
              className="w-full py-5 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-xl shadow-red-100/20"
            >
               <XCircle size={18} /> Cancel Call Request
            </button>
            <Link to="/patient/dashboard" className="text-slate-400 font-bold text-sm hover:text-slate-900 transition-all flex items-center justify-center gap-2 mt-4">
               <ChevronLeft size={16} /> Back to Dashboard
            </Link>
         </div>

         <footer className="mt-16 pt-8 border-t border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
               <AlertCircle size={10} /> Stable Connection Required
            </p>
         </footer>
      </motion.div>
    </div>
  );
};

export default PatientVideoWaiting;
