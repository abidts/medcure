import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Pill, Calendar, User, ChevronDown, 
  ChevronUp, Apple, Heart, Activity, Clock, 
  Search, Filter, ChevronRight, BookOpen, UserCheck
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const PatientPrescriptions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setPrescriptions([
        { 
          id: 1, 
          doctor: { name: 'Dr. Mushtaq Ahmad', specialization: { name: 'Cardiology' } },
          date: '2024-03-10',
          diagnosis: 'High Blood Pressure',
          symptoms: 'Mild dizziness, fatigue',
          followUpRequired: true,
          medicines: [
             { name: 'Amlodipine', dosage: '5mg', frequency: '1-0-0', duration: 30, beforeFood: true, instructions: 'Take in the morning' },
             { name: 'Atorvastatin', dosage: '10mg', frequency: '0-0-1', duration: 30, beforeFood: false, instructions: 'Take before bed' }
          ],
          generalAdvice: 'Reduce salt intake and exercise regularly.',
          dietaryAdvice: 'Avoid fatty foods and excess caffeine.',
          lifestyleChanges: 'Stop smoking and manage stress.',
          followUpDate: '2024-04-10'
        },
        { 
          id: 2, 
          doctor: { name: 'Dr. Sarah Jan', specialization: { name: 'Dermatology' } },
          date: '2024-01-15',
          diagnosis: 'Contact Dermatitis',
          medicines: [
             { name: 'Desonide Cream', dosage: '0.05%', frequency: 'Twice daily', duration: 14, beforeFood: false, instructions: 'Apply thinly' }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-inter">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 font-outfit">My Prescriptions</h1>
               <p className="text-slate-500">Track your medication plans and doctor's advice.</p>
            </div>
            <div className="flex gap-4">
               <div className="relative">
                  <input type="text" placeholder="Search by doctor or drug..." className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-full md:w-64" />
               </div>
            </div>
        </header>

        {loading ? (
          <div className="space-y-6">
             {[1,2].map(i => <div key={i} className="h-48 bg-white rounded-[40px] animate-pulse"></div>)}
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="space-y-6">
             {prescriptions.map((px) => (
                <motion.div 
                  key={px.id} 
                  layout
                  className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-xl"
                >
                   <div 
                     className="p-8 cursor-pointer group"
                     onClick={() => setExpandedId(expandedId === px.id ? null : px.id)}
                   >
                      <div className="flex flex-wrap justify-between items-start gap-6">
                         <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0">
                               <UserCheck size={28} />
                            </div>
                            <div>
                               <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{px.doctor.name}</h3>
                               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{px.doctor.specialization.name}</p>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-8">
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prescribed on</p>
                               <p className="font-bold text-slate-700">{new Date(px.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div className={`p-3 rounded-2xl transition-all ${expandedId === px.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                               {expandedId === px.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                         </div>
                      </div>

                      {px.diagnosis && (
                        <div className="mt-8 flex gap-3 flex-wrap">
                           <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2">
                              <Activity size={12} className="text-blue-500" /> {px.diagnosis}
                           </span>
                           {px.followUpRequired && (
                              <span className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold flex items-center gap-2">
                                 <Calendar size={12} /> Follow-up Required
                              </span>
                           )}
                        </div>
                      )}
                   </div>

                   <AnimatePresence>
                      {expandedId === px.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-50"
                        >
                           <div className="p-10 space-y-12">
                              {/* Medication List */}
                              <div>
                                 <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Pill size={14}/> Medication Plan
                                 </h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {px.medicines.map((m: any, idx: number) => (
                                       <div key={idx} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                                          <div className="flex justify-between items-start mb-4">
                                             <p className="font-bold text-slate-900">{m.name}</p>
                                             <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black">{m.dosage}</span>
                                          </div>
                                          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                                             <div className="flex items-center gap-1"><Clock size={12}/> {m.frequency}</div>
                                             <div className="flex items-center gap-1"><Calendar size={12}/> {m.duration} Days</div>
                                             <div className={`flex items-center gap-1 ${m.beforeFood ? 'text-green-600' : 'text-orange-600'}`}>
                                                <BookOpen size={12}/> {m.beforeFood ? 'Before Food' : 'After Food'}
                                             </div>
                                          </div>
                                          {m.instructions && (
                                            <p className="mt-4 text-[11px] text-slate-400 font-medium italic">"{m.instructions}"</p>
                                          )}
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              {/* Advice Sections */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 {px.generalAdvice && (
                                    <div className="p-8 bg-blue-50/20 rounded-[32px] border border-blue-50">
                                       <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <Activity size={12}/> General Advice
                                       </h5>
                                       <p className="text-sm font-medium text-slate-700 leading-relaxed">{px.generalAdvice}</p>
                                    </div>
                                 )}
                                 {px.dietaryAdvice && (
                                    <div className="p-8 bg-purple-50/20 rounded-[32px] border border-purple-50">
                                       <h5 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <Apple size={12}/> Dietary Plan
                                       </h5>
                                       <p className="text-sm font-medium text-slate-700 leading-relaxed">{px.dietaryAdvice}</p>
                                    </div>
                                 )}
                              </div>

                              {px.followUpRequired && (
                                 <div className="p-8 bg-slate-900 rounded-[32px] flex flex-wrap justify-between items-center gap-6">
                                    <div className="flex items-center gap-6">
                                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white"><Calendar size={24}/></div>
                                       <div>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommended Follow-up</p>
                                          <p className="text-white font-bold">{new Date(px.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                       </div>
                                    </div>
                                    <Link to={`/appointments/book/${px.id}?doctorId=1`} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                                       Book Now <ChevronRight size={18} />
                                    </Link>
                                 </div>
                              )}
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </motion.div>
             ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-3xl mx-auto mb-6 text-slate-300">
                <FileText size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No prescriptions found</h3>
             <p className="text-slate-400 max-w-xs mx-auto">Once a doctor issues a prescription, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
