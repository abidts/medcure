import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Plus, Trash2, Eye, 
  Calendar, CheckCircle, AlertCircle, X, 
  Search, Filter, ChevronRight, File, Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setReports([
        { id: 1, reportName: 'Lab Result - Jan 2024', fileType: 'pdf', uploadDate: '2024-01-15' },
        { id: 2, reportName: 'Chest X-Ray', fileType: 'image', uploadDate: '2024-02-02' },
        { id: 3, reportName: 'Prescription - Dr. Mushtaq', fileType: 'pdf', uploadDate: '2024-03-10' },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    // Simulation
    setTimeout(() => {
       setUploadLoading(false);
       setShowUpload(false);
       setSuccess('Report uploaded successfully!');
       fetchReports();
       setTimeout(() => setSuccess(null), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Small Left Sidebar (Simplified) */}
      <aside className="w-[100px] bg-slate-900 h-screen sticky top-0 flex flex-col items-center py-10 gap-8 hidden md:flex">
         <Link to="/"><img src="/images/sehat24x7-logo.png" alt="T" className="h-6 brightness-0 invert" /></Link>
         <Link to={`/patient/dashboard?patientId=${localStorage.getItem('patientId')}`} className="p-4 text-slate-500 hover:text-white transition-colors"><FileText size={28} /></Link>
         <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-900"><File size={28} /></div>
      </aside>

      <main className="flex-1 p-8 lg:p-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 font-outfit">Medical Reports</h1>
               <p className="text-slate-500">Securely store and share your health documents.</p>
            </div>
            <button 
              onClick={() => setShowUpload(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-3xl font-bold flex items-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
            >
               <Upload size={20} /> Upload Report
            </button>
         </header>

         {success && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 font-bold border border-green-100">
               <CheckCircle size={20} /> {success}
            </motion.div>
         )}

         {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-[200px] bg-white rounded-[32px] animate-pulse"></div>)}
           </div>
         ) : reports.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {reports.map((report) => (
                <motion.div 
                  key={report.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
                >
                   <div className="mb-6 flex justify-between items-start">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${report.fileType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                         {report.fileType === 'pdf' ? <FileText size={24} /> : <ImageIcon size={24} />}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                   </div>
                   
                   <h3 className="font-bold text-slate-900 mb-2 truncate">{report.reportName}</h3>
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
                      <Calendar size={12} /> {new Date(report.uploadDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                   </div>

                   <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                      <Eye size={18} /> View Document
                   </button>
                </motion.div>
              ))}
           </div>
         ) : (
           <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-3xl mx-auto mb-6 text-slate-300">
                 <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No reports yet</h3>
              <p className="text-slate-400 max-w-xs mx-auto mb-8">Upload your digital health records to have them accessible anywhere, anytime.</p>
              <button onClick={() => setShowUpload(true)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">Upload Your First Report</button>
           </div>
         )}
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
         {showUpload && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-white w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl"
               >
                  <div className="p-10">
                     <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 font-outfit">Upload Document</h2>
                        <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button>
                     </div>

                     <form onSubmit={handleUpload} className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Report Description</label>
                           <input type="text" placeholder="e.g. Health Checkup - 2024" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-300" required />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select File</label>
                           <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-10 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
                              <Upload size={32} className="mx-auto mb-4 text-slate-300 group-hover:text-blue-600 group-hover:-translate-y-1 transition-all" />
                              <p className="text-sm font-bold text-slate-500">Click to upload or drag & drop</p>
                              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">PDF, PNG or JPG (Max 5MB)</p>
                              <input type="file" className="hidden" />
                           </div>
                        </div>

                        <button type="submit" disabled={uploadLoading} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
                           {uploadLoading ? 'Uploading...' : 'Start Uploading'}
                        </button>
                     </form>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default PatientReports;
