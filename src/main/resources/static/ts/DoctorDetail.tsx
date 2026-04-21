import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, MapPin, Video, Calendar, Mail, Phone, 
  Award, BookOpen, Heart, Wallet, Clock, CheckCircle2, X, UserCircle
} from 'lucide-react';

interface Education {
  degreeCourse: string;
  institute: string;
  year: string;
}

interface Service {
  serviceName: string;
  description: string;
}

interface Doctor {
  id: number;
  name: string;
  qualification: string;
  specialization: { name: string };
  yearsOfExperience: number;
  consultationFee: number;
  experience: string;
  clinicAddress: string;
  email: string;
  phone: string;
  image?: string;
  available: boolean;
  online: boolean;
}

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/doctors/${id}`);
      const data = await response.json();
      // Backend returns doctor directly or nested; handle both cases
      if (data && data.id) {
        setDoctor(data);
        setEducations(data.educations || []);
        setServices(data.services || []);
      } else if (data && data.doctor) {
        setDoctor(data.doctor);
        setEducations(data.educations || []);
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!doctor) return <div className="p-20 text-center">Doctor not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-inter">
      {/* Header Container */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-12">
        <div className="container mx-auto px-6">
          <Link to="/doctors" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-8 transition-colors">
            <ChevronLeft size={20} /> Back to Doctors
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full md:w-[320px] h-[320px] rounded-[40px] overflow-hidden border-8 border-slate-50 shadow-xl shadow-slate-200"
            >
              <img 
                src={doctor.image || '/images/doctor-placeholder.svg'} 
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <h1 className="text-4xl font-bold text-slate-900 font-outfit">{doctor.name}</h1>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${
                  doctor.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {doctor.available ? 'Accepting Patients' : 'Not Available'}
                </span>
                {doctor.online && (
                   <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse">
                     <span className="w-2 h-2 rounded-full bg-blue-500"></span> Online Now
                   </span>
                )}
              </div>

              <p className="text-xl text-blue-600 font-bold mb-2">{doctor.specialization.name}</p>
              <p className="text-slate-500 font-medium text-lg mb-8">{doctor.qualification}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Experience</p>
                  <p className="text-slate-900 font-bold">{doctor.yearsOfExperience}+ Years</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Fee</p>
                  <p className="text-slate-900 font-bold">₹{doctor.consultationFee}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Patients</p>
                  <p className="text-slate-900 font-bold">2.5k+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="flex-1 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <UserCircle className="text-blue-600" size={24} /> About Doctor
              </h2>
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-slate-600 leading-relaxed">
                {doctor.experience}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BookOpen className="text-blue-600" size={24} /> Education & Qualification
              </h2>
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                {educations.map((edu, i) => (
                  <div key={i} className="flex justify-between items-start pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{edu.degreeCourse}</h4>
                      <p className="text-slate-500 text-sm">{edu.institute}</p>
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold">{edu.year}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Heart className="text-blue-600" size={24} /> Services Offered
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-blue-600">
                    <h4 className="font-bold text-slate-900 mb-2">{service.serviceName}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{service.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column / Sidebar */}
          <div className="w-full lg:w-[400px]">
             <div className="sticky top-[100px] space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Book an Appointment</h3>
                  <p className="text-slate-400 text-sm mb-8">Schedule a physical or virtual consultation instantly.</p>
                  
                  <div className="space-y-4">
                    <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                      <Calendar size={20} /> Book In-Person
                    </button>
                    
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      disabled={!doctor.online}
                      className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                        doctor.online 
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Video size={20} /> {doctor.online ? 'Instant Video Call' : 'Video Call (Offline)'}
                    </button>
                  </div>

                  <p className="text-center mt-6 text-[11px] text-slate-400 font-medium uppercase tracking-widest">
                    <CheckCircle2 size={12} className="inline mr-1" /> Verified Professional
                  </p>
                </motion.div>

                <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 shadow-xl text-white">
                   <h4 className="text-lg font-bold mb-6">Contact & Clinic</h4>
                   <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                          <MapPin size={18} />
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{doctor.clinicAddress}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                          <Mail size={18} />
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{doctor.email}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                          <Phone size={18} />
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{doctor.phone}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Video Call Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden"
             >
                <div className="p-10">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Video size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Video Call</h3>
                    <p className="text-slate-500">Instant consultation with {doctor.name}</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl space-y-4 mb-8">
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Rate per minute</span>
                        <span className="text-green-600 font-bold text-lg">₹15/min</span>
                     </div>
                     <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Minimum charge (5 min)</span>
                        <span className="text-green-600 font-bold text-lg">₹75</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-blue-50 rounded-3xl border border-blue-100 mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                           <Wallet size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Balance</p>
                           <p className="text-xl font-bold text-slate-800">₹450.00</p>
                        </div>
                     </div>
                     <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">Add Money</button>
                  </div>

                  <div className="space-y-3 mb-10">
                    <label className="text-sm font-bold text-slate-700 ml-1">Reason for consultation</label>
                    <textarea 
                      placeholder="Briefly describe your symptoms..."
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all resize-none h-[120px]"
                    />
                  </div>

                  <button className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 transition-all shadow-xl shadow-green-100">
                    Send Request
                  </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDetail;
