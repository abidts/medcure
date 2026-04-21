import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Receipt, FileEdit, LogOut, Printer, 
  User, Calendar, Info, Mail, Phone, MapPin, 
  ChevronRight, Plus, CheckCircle
} from 'lucide-react';
import { useAuth } from './AuthContext';

const StaffDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('prescription');
  const [staff, setStaff] = useState<any>(null);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    patientName: '',
    patientAge: '',
    patientGender: 'Male',
    patientAddress: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    notes: '',
    amount: '',
    paymentMethod: 'Cash',
    letterType: 'Medical Certificate',
    letterContent: ''
  });

  useEffect(() => {
    // Simulation
    setStaff({ name: 'Aamir Bashir', id: 10 });
    setDoctorInfo({
      name: 'Dr. Mushtaq Ahmad',
      qualification: 'MBBS, MD',
      specialization: { name: 'Cardiology' },
      phone: '+91 9906001122',
      clinicAddress: 'Karan Nagar, Srinagar'
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  if (!staff || !doctorInfo) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Sidebar - Hidden on print */}
      <aside className="w-[280px] bg-white border-r border-slate-200 p-8 flex flex-col h-screen sticky top-0 no-print hidden lg:flex">
         <div className="mb-12">
            <h1 className="text-2xl font-black text-blue-600 mb-10">Sehat24x7</h1>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff Member</p>
               <h3 className="font-bold text-slate-800">{staff.name}</h3>
            </div>
         </div>

         <nav className="space-y-2 flex-1">
            {[
              { id: 'prescription', icon: FileText, label: 'Prescription' },
              { id: 'receipt', icon: Receipt, label: 'Receipt' },
              { id: 'letterhead', icon: FileEdit, label: 'Letterhead' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <item.icon size={20} /> {item.label}
              </button>
            ))}
         </nav>

         <button 
            onClick={logout}
            className="flex items-center gap-4 px-6 py-4 mt-8 text-slate-400 font-bold text-sm hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Logout
         </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-x-hidden print:p-0">
         <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 no-print">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 font-outfit">Staff Dashboard</h1>
               <p className="text-slate-500">Generating documents for Dr. {doctorInfo.name.split(' ')[1]}</p>
            </div>
         </header>

         <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            {/* Form Column - Hidden on print */}
            <div className="xl:col-span-4 no-print">
               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm sticky top-12">
                  <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                     <Plus size={20} className="text-blue-600" /> Enter Details
                  </h3>
                  
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
                        <input id="patientName" value={formData.patientName} onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-blue-300" placeholder="Full Name" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                           <input id="patientAge" type="number" value={formData.patientAge} onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100" placeholder="Yrs" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                           <select id="patientGender" value={formData.patientGender} onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                        <input id="date" type="date" value={formData.date} onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100" />
                     </div>

                     {activeTab === 'prescription' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnosis</label>
                              <textarea id="diagnosis" value={formData.diagnosis} onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 h-24 resize-none" placeholder="Complaints..." />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label>
                              <textarea id="notes" value={formData.notes} onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 h-24 resize-none" placeholder="Advice..." />
                           </div>
                        </div>
                     )}

                     {activeTab === 'receipt' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                              <input id="amount" type="number" value={formData.amount} onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100" placeholder="500" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Method</label>
                              <select id="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <option value="Cash">Cash</option>
                                 <option value="UPI">UPI / GPay</option>
                                 <option value="Card">Card</option>
                              </select>
                           </div>
                        </div>
                     )}

                     <button onClick={handlePrint} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                        <Printer size={20} /> Generate & Print
                     </button>
                  </div>
               </div>
            </div>

            {/* Preview Column */}
            <div className="xl:col-span-8">
               <div className="bg-white p-12 lg:p-20 rounded-[48px] border border-slate-100 shadow-xl min-h-[1000px] print:p-0 print:border-none print:shadow-none">
                  {/* Letterhead Header */}
                  <div className="flex justify-between items-start border-b-4 border-blue-600 pb-8 mb-12">
                     <div>
                        <h2 className="text-3xl font-black text-slate-900 font-outfit mb-2 uppercase">{doctorInfo.name}</h2>
                        <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">{doctorInfo.qualification}</p>
                        <div className="space-y-1 text-slate-500 text-xs font-medium">
                           <p className="flex items-center gap-2"><MapPin size={12}/> {doctorInfo.clinicAddress}</p>
                           <p className="flex items-center gap-2"><Phone size={12}/> {doctorInfo.phone}</p>
                        </div>
                     </div>
                     <div className="w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center">
                        <h1 className="text-lg font-black text-slate-300">Sehat24x7</h1>
                     </div>
                  </div>

                  {/* Template Body */}
                  <div className="py-8">
                     <div className="flex justify-between items-center mb-12 bg-slate-50 px-8 py-4 rounded-2xl">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                           <p className="font-bold text-slate-800">{formData.patientName || '________________'}</p>
                        </div>
                        <div className="space-y-1 text-center">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age / Sex</p>
                           <p className="font-bold text-slate-800">{formData.patientAge || '__'}Y / {formData.patientGender[0]}</p>
                        </div>
                        <div className="space-y-1 text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                           <p className="font-bold text-slate-800">{new Date(formData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                     </div>

                     <div className="min-h-[500px]">
                        {activeTab === 'prescription' && (
                           <div className="space-y-12">
                              <div>
                                 <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Diagnosis / Complaints</h4>
                                 <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">{formData.diagnosis || 'No diagnosis recorded.'}</p>
                              </div>
                              <div className="pt-12 border-t border-slate-50">
                                 <img src="/images/rx-icon.png" alt="Rx" className="h-10 mb-6 opacity-20 grayscale" />
                                 <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Advice / Prescription</h4>
                                 <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">{formData.notes || 'No medication recorded.'}</p>
                              </div>
                           </div>
                        )}

                        {activeTab === 'receipt' && (
                           <div className="flex flex-col items-center justify-center pt-20">
                              <h3 className="text-2xl font-black text-slate-900 mb-12 font-outfit uppercase tracking-wider border-b-2 border-slate-900 pb-2">Payment Receipt</h3>
                              <div className="w-full max-w-md space-y-6">
                                 <div className="flex justify-between border-b border-slate-100 pb-4">
                                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Amount Paid</span>
                                    <span className="text-2xl font-black text-slate-900">₹{formData.amount || '0.00'}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-slate-100 pb-4">
                                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Payment Mode</span>
                                    <span className="font-bold text-slate-800">{formData.paymentMethod}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-slate-100 pb-4">
                                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Reference No</span>
                                    <span className="font-mono text-xs text-slate-400">#TABIB-{Math.floor(100000 + Math.random() * 900000)}</span>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Signature area */}
                  <div className="mt-20 flex justify-end">
                     <div className="text-center w-64 pt-4 border-t border-slate-200">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Authorized Signature</p>
                        <p className="text-[10px] text-slate-400 mt-1">{doctorInfo.name}</p>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-12 pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                     This is a computer generated document. Valid without physically stamped signature.
                  </div>
               </div>
            </div>
         </div>
      </main>

      {/* Global CSS for printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .min-h-[1000px] { min-height: auto !important; }
          main { padding: 0 !important; }
        }
      `}} />
    </div>
  );
};

export default StaffDashboard;
