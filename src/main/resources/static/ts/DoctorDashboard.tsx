import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, Video, Clock, Users, User, LogOut, 
  CheckCircle2, AlertCircle, Search, Trash2, Plus, ArrowRight,
  Stethoscope, IndianRupee, MapPin, Mail, Phone, GraduationCap, Briefcase,
  RefreshCw, Edit, Save, X, Video as VideoIcon, CalendarCheck, Clock3,
  UserPlus, Building, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from './AuthContext';

const DoctorDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctor, setDoctor] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState('today');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [videoRequests, setVideoRequests] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [addingStaff, setAddingStaff] = useState(false);
  const [staffForm, setStaffForm] = useState<any>({});
  const [addingAvailability, setAddingAvailability] = useState(false);
  const [availabilityForm, setAvailabilityForm] = useState<any>({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '17:00',
    consultationType: 'CLINIC',
    slotDurationMinutes: 30
  });

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      // Get doctor ID from localStorage
      const doctorId = localStorage.getItem('doctorId');
      const userId = localStorage.getItem('userId');

      if (!doctorId || !userId) {
        console.error('Doctor ID or User ID not found in localStorage');
        // Set default values for demo purposes when no IDs are found
        setStats({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
        setAppointments([]);
        setDoctor({
          name: 'Demo Doctor',
          email: 'demo@sehat24x7.com',
          phone: '+91 98765 43210',
          qualification: 'MBBS',
          specialization: { name: 'General Medicine' },
          yearsOfExperience: 5,
          consultationFee: 500,
          clinicAddress: 'Demo Clinic, City'
        });
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        return;
      }

      
      // Fetch doctor online status
      try {
        const statusRes = await fetch(`/api/doctor/dashboard/online-status/${doctorId}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setIsOnline(statusData.onlineStatus);
        }
      } catch (error) {
        console.error('Error fetching doctor online status:', error);
      }

      // Fetch doctor profile
      try {
        const doctorRes = await fetch(`/api/doctor/dashboard/profile/${userId}`);
        if (doctorRes.ok) {
          const doctorData = await doctorRes.json();
          setDoctor(doctorData);
        } else {
          console.warn('Failed to fetch doctor profile:', doctorRes.status);
          // Set fallback doctor data on API failure
          setDoctor({
            name: 'Doctor',
            email: 'doctor@sehat24x7.com',
            phone: '+91 98765 43210',
            qualification: 'MBBS',
            specialization: { name: 'General Medicine' },
            yearsOfExperience: 0,
            consultationFee: 0,
            clinicAddress: 'Clinic Address'
          });
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        // Set fallback doctor data on network error
        setDoctor({
          name: 'Doctor',
          email: 'doctor@sehat24x7.com',
          phone: '+91 98765 43210',
          qualification: 'MBBS',
          specialization: { name: 'General Medicine' },
          yearsOfExperience: 0,
          consultationFee: 0,
          clinicAddress: 'Clinic Address'
        });
      }

      // Fetch doctor appointments
      try {
        const appointmentsRes = await fetch(`/api/doctor/dashboard/appointments/${doctorId}?filter=today`);
        if (appointmentsRes.ok) {
          const appointmentsResponse = await appointmentsRes.json();
          // Backend returns {appointments: [...], count: X, filter: "today"}
          const appointmentsData = appointmentsResponse.appointments || [];
          // Transform appointment data to match frontend expectations
          const transformedAppointments = appointmentsData.map((apt: any) => ({
            id: apt.id,
            patient: `${apt.patient?.firstName || ''} ${apt.patient?.lastName || ''}`.trim() || 'Unknown Patient',
            reason: apt.reason || 'General consultation',
            time: apt.appointmentTime || apt.appointmentDate || 'N/A',
            type: apt.consultationType || 'CLINIC',
            status: apt.status || 'PENDING'
          }));
          setAppointments(transformedAppointments);
        } else {
          console.warn('Failed to fetch appointments:', appointmentsRes.status);
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      }

      // Fetch doctor stats
      try {
        const statsRes = await fetch(`/api/doctor/dashboard/stats/${doctorId}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          // Map backend field names to frontend expectations
          setStats({
            total: statsData.totalAppointments || 0,
            today: statsData.todayAppointments || 0,
            pending: statsData.pendingAppointments || 0,
            completed: statsData.completedAppointments || 0,
            earnings: 0 // Backend doesn't provide earnings, calculate from completed appointments
          });
        } else {
          console.warn('Failed to fetch stats:', statsRes.status);
          setStats({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
      }

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchDoctorData:', error);
      setStats({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
      setAppointments([]);
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchDoctorData(true);
  };

  const handleToggleOnline = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) {
      alert('Doctor ID not found. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`/api/doctor/dashboard/toggle-online/${doctorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsOnline(data.onlineStatus);
        // Show success message
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await res.json();
        alert('Failed to toggle status: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error toggling online status:', error);
      alert('Error toggling status: ' + error);
    }
  };

  
  const handleEditProfile = () => {
    setProfileForm({
      name: doctor?.name || '',
      email: doctor?.email || '',
      phone: doctor?.phone || '',
      qualification: doctor?.qualification || '',
      experience: doctor?.experience || '',
      clinicAddress: doctor?.clinicAddress || '',
      consultationFee: doctor?.consultationFee || 0,
      specializations: doctor?.specializations || '',
      image: doctor?.image || '',
      educations: doctor?.educations || [],
      services: doctor?.services || []
    });
    setEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/doctor/dashboard/profile/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        const userId = localStorage.getItem('userId');
        const doctorRes = await fetch(`/api/doctor/dashboard/profile/${userId}`);
        if (doctorRes.ok) {
          const updatedDoctor = await doctorRes.json();
          setDoctor(updatedDoctor);
        }
        setEditingProfile(false);
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddEducation = () => {
    setProfileForm({
      ...profileForm,
      educations: [...(profileForm.educations || []), { institute: '', degreeCourse: '', year: new Date().getFullYear() }]
    });
  };

  const handleRemoveEducation = (index: number) => {
    const newEducations = profileForm.educations.filter((_: any, i: number) => i !== index);
    setProfileForm({ ...profileForm, educations: newEducations });
  };

  const handleAddService = () => {
    setProfileForm({
      ...profileForm,
      services: [...(profileForm.services || []), { serviceName: '', description: '' }]
    });
  };

  const handleRemoveService = (index: number) => {
    const newServices = profileForm.services.filter((_: any, i: number) => i !== index);
    setProfileForm({ ...profileForm, services: newServices });
  };

  const createCenterSquareCroppedFile = async (file: File): Promise<File> => {
    const imageUrl = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = imageUrl;
      });

      const cropSize = Math.min(img.width, img.height);
      const sx = (img.width - cropSize) / 2;
      const sy = (img.height - cropSize) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = cropSize;
      canvas.height = cropSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;

      ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, cropSize, cropSize);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.92)
      );

      if (!blob) return file;
      return new File([blob], `profile-${Date.now()}.jpg`, { type: 'image/jpeg' });
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleProfileImageUpload = async (file: File | null) => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId || !file) return;
    setUploadingImage(true);
    try {
      const croppedFile = await createCenterSquareCroppedFile(file);
      const formData = new FormData();
      formData.append('file', croppedFile);
      const res = await fetch(`/api/doctor/dashboard/profile/${doctorId}/image`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setProfileForm((prev: any) => ({ ...prev, image: data.image }));
        setDoctor((prev: any) => ({ ...prev, image: data.image }));
        setSuccessMessage('Profile picture updated');
        setTimeout(() => setSuccessMessage(null), 2500);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    } finally {
      setUploadingImage(false);
      setPendingImageFile(null);
      if (pendingImagePreview) {
        URL.revokeObjectURL(pendingImagePreview);
      }
      setPendingImagePreview(null);
    }
  };

  const handleRemoveProfileImage = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) return;
    try {
      const res = await fetch(`/api/doctor/dashboard/profile/${doctorId}/image`, { method: 'DELETE' });
      if (res.ok) {
        setProfileForm((prev: any) => ({ ...prev, image: '' }));
        setDoctor((prev: any) => ({ ...prev, image: '' }));
        setSuccessMessage('Profile picture removed');
        setTimeout(() => setSuccessMessage(null), 2500);
      }
    } catch (error) {
      console.error('Error removing profile image:', error);
    }
  };

  const handleSelectPendingImage = (file: File | null) => {
    if (!file) return;
    if (pendingImagePreview) URL.revokeObjectURL(pendingImagePreview);
    const preview = URL.createObjectURL(file);
    setPendingImageFile(file);
    setPendingImagePreview(preview);
  };

  const handleCancelPendingImage = () => {
    setPendingImageFile(null);
    if (pendingImagePreview) URL.revokeObjectURL(pendingImagePreview);
    setPendingImagePreview(null);
  };

  const fetchAvailabilities = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) return;

    try {
      const res = await fetch(`/api/doctor/dashboard/availability/${doctorId}`);
      if (res.ok) {
        const data = await res.json();
        setAvailabilities(data);
      }
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const handleAddAvailability = () => {
    setAvailabilityForm({
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '17:00',
      consultationType: 'CLINIC',
      slotDurationMinutes: 30
    });
    setAddingAvailability(true);
  };

  const handleSaveAvailability = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) {
      alert('Doctor ID not found. Please log in again.');
      return;
    }

    const newAvailability = {
      doctorId: parseInt(doctorId),
      ...availabilityForm,
      isActive: true
    };

    console.log('Saving availability:', newAvailability);

    try {
      const res = await fetch('/api/doctor/dashboard/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAvailability)
      });
      
      if (res.ok) {
        setAddingAvailability(false);
        fetchAvailabilities();
        setSuccessMessage('Availability added successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          alert('Failed to add availability: ' + (data.error || data.message || 'Unknown error'));
        } catch {
          alert('Failed to add availability: ' + text);
        }
      }
    } catch (error) {
      console.error('Error adding availability:', error);
      alert('Error adding availability: ' + error);
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    try {
      const res = await fetch(`/api/doctor/dashboard/availability/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAvailabilities();
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      const res = await fetch(`/api/doctor/dashboard/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDoctorData();
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const fetchVideoRequests = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) return;

    try {
      const res = await fetch(`/api/video-call/doctor/${doctorId}/requests`);
      if (res.ok) {
        const data = await res.json();
        setVideoRequests(data);
      }
    } catch (error) {
      console.error('Error fetching video requests:', error);
    }
  };

  const handleAcceptVideoCall = async (requestId: number) => {
    try {
      const res = await fetch(`/api/video-call/request/${requestId}/accept`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          window.open(`https://meet.jit.si/${data.callRoomId}`, '_blank');
          fetchVideoRequests();
        }
      }
    } catch (error) {
      console.error('Error accepting video call:', error);
    }
  };

  const handleRejectVideoCall = async (requestId: number) => {
    try {
      const res = await fetch(`/api/video-call/request/${requestId}/reject`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchVideoRequests();
      }
    } catch (error) {
      console.error('Error rejecting video call:', error);
    }
  };

  const fetchStaff = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) return;

    try {
      const res = await fetch(`/api/staff/doctor/${doctorId}`);
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleAddStaff = () => {
    setStaffForm({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      canPrintReceipts: true,
      canPrintPrescriptions: true,
      canCreateLetterheads: true
    });
    setAddingStaff(true);
  };

  const handleSaveStaff = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) return;

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...staffForm,
          doctorId: parseInt(doctorId)
        })
      });
      if (res.ok) {
        setAddingStaff(false);
        fetchStaff();
        setSuccessMessage('Staff added successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const handleDeleteStaff = async (staffId: number) => {
    try {
      const res = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchStaff();
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'availability') {
      fetchAvailabilities();
    } else if (activeTab === 'video') {
      fetchVideoRequests();
    } else if (activeTab === 'staff') {
      fetchStaff();
    }
  }, [activeTab]);

  if (loading) return (
     <div className="flex items-center justify-center min-h-screen bg-slate-50">
       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Sidebar */}
      <aside className="w-[300px] bg-white border-r border-slate-200 p-8 flex flex-col h-screen sticky top-0 hidden lg:flex">
         <div className="mb-10">
            <h1 className="text-2xl font-black text-blue-600 mb-10">Sehat24x7</h1>
            
                     </div>

         <nav className="space-y-2 flex-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'appointments', icon: Calendar, label: 'Appointments' },
              { id: 'video', icon: Video, label: 'Video Calls' },
              { id: 'availability', icon: Clock, label: 'Scheduling' },
              { id: 'staff', icon: Users, label: 'My Staff' },
              { id: 'profile', icon: User, label: 'Profile' },
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
      <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
         <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 font-outfit">
                 {doctor?.name || 'Doctor'}
               </h1>
               <p className="text-slate-500 font-medium">{doctor?.specialization?.name || 'Specialization'} • {doctor?.qualification || 'Qualification'}</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div 
                  onClick={handleToggleOnline}
                  className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={`text-sm font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
               </div>
               <button 
                 onClick={handleRefresh}
                 disabled={refreshing}
                 className="p-2 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-50"
                 title="Refresh data"
               >
                 <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                 <span className="text-xs font-bold text-slate-600">Refresh</span>
               </button>
               <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
                  <span className="text-xs font-bold text-slate-600">{stats.today} Active Appointments</span>
               </div>
            </div>
         </header>

         <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                 {/* Stats */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Patients', val: stats.total, icon: Users, color: 'blue' },
                      { label: 'Today', val: stats.today, icon: Calendar, color: 'orange' },
                      { label: 'Pending', val: stats.pending, icon: Clock, color: 'purple' },
                      { label: 'Earnings', val: stats.earnings > 0 ? `₹${stats.earnings}k` : '₹0', icon: IndianRupee, color: 'green' }
                    ].map((s, i) => (
                      <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
                         <div className={`w-14 h-14 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center shrink-0`}>
                            <s.icon size={24} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <h4 className="text-2xl font-black text-slate-800">{s.val}</h4>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Recent Queue */}
                 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-bold font-outfit">Today's Queue</h3>
                       <button onClick={() => setActiveTab('availability')} className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-all">View Schedule</button>
                    </div>

                    <div className="space-y-4">
                       {appointments.length > 0 ? (
                         appointments.map(apt => (
                           <div key={apt.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-100 transition-all">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-blue-600 shadow-sm">
                                    {apt.time ? apt.time.split(' ')[0] : 'N/A'}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">{apt.patient || 'Unknown Patient'}</h4>
                                    <p className="text-xs text-slate-500">{apt.reason || 'No reason provided'}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${apt.type === 'VIDEO' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-600'}`}>
                                    {apt.type || 'CLINIC'}
                                 </span>
                                 <span className={`px-4 py-2 rounded-xl text-xs font-bold ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {apt.status || 'PENDING'}
                                 </span>
                                 <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                                    <ArrowRight size={18} />
                                 </button>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-12">
                           <p className="text-slate-500 font-medium">No appointments scheduled for today</p>
                           <p className="text-slate-400 text-sm mt-2">Your appointments will appear here once they are booked</p>
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div key="prof" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto space-y-8">
                 {successMessage && (
                   <div className="bg-green-50 text-green-600 p-4 rounded-2xl font-bold text-center">
                     {successMessage}
                   </div>
                 )}
                 <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-12 pb-12 border-b border-slate-50">
                       <div className="w-32 h-32 bg-blue-600 rounded-[32px] overflow-hidden flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-100">
                          {doctor?.image ? (
                            <img src={doctor.image} alt="Doctor profile" className="w-full h-full object-cover" />
                          ) : (
                            <>{doctor?.name?.[0] || 'D'}</>
                          )}
                       </div>
                       <div className="flex-1 text-center md:text-left">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-3xl font-bold text-slate-900 font-outfit mb-2">{doctor?.name || 'Doctor Name'}</h2>
                              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                 <span className="flex items-center gap-2 text-slate-500 font-medium"><Stethoscope size={16}/> {doctor?.specializations || 'Specialization'}</span>
                                 <span className="flex items-center gap-2 text-slate-500 font-medium"><GraduationCap size={16}/> {doctor?.qualification || 'Qualification'}</span>
                              </div>
                            </div>
                            {!editingProfile && (
                              <div className="flex items-center gap-3">
                                <label className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl cursor-pointer text-xs font-bold hover:bg-slate-200 transition-all">
                                  {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleSelectPendingImage(e.target.files?.[0] || null)}
                                  />
                                </label>
                                {doctor?.image && (
                                  <button onClick={handleRemoveProfileImage} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-bold hover:bg-red-200 transition-all">
                                    Remove
                                  </button>
                                )}
                                <button onClick={handleEditProfile} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                                  <Edit size={20} />
                                </button>
                              </div>
                            )}
                          </div>
                       </div>
                    </div>

                    {editingProfile ? (
                      <div className="space-y-6 max-h-[68vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                            <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                            <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qualification</label>
                            <input type="text" value={profileForm.qualification} onChange={(e) => setProfileForm({...profileForm, qualification: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience</label>
                            <input type="text" value={profileForm.experience} onChange={(e) => setProfileForm({...profileForm, experience: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Fee</label>
                            <input type="number" value={profileForm.consultationFee} onChange={(e) => setProfileForm({...profileForm, consultationFee: parseFloat(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Address</label>
                            <input type="text" value={profileForm.clinicAddress} onChange={(e) => setProfileForm({...profileForm, clinicAddress: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specializations</label>
                            <input type="text" value={profileForm.specializations} onChange={(e) => setProfileForm({...profileForm, specializations: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Education</h3>
                            <button onClick={handleAddEducation} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                              <Plus size={18} />
                            </button>
                          </div>
                          {profileForm.educations?.map((edu: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl">
                              <input type="text" placeholder="Institute" value={edu.institute} onChange={(e) => {
                                const newEducations = [...profileForm.educations];
                                newEducations[index].institute = e.target.value;
                                setProfileForm({...profileForm, educations: newEducations});
                              }} className="p-3 bg-white border border-slate-100 rounded-xl" />
                              <input type="text" placeholder="Degree" value={edu.degreeCourse} onChange={(e) => {
                                const newEducations = [...profileForm.educations];
                                newEducations[index].degreeCourse = e.target.value;
                                setProfileForm({...profileForm, educations: newEducations});
                              }} className="p-3 bg-white border border-slate-100 rounded-xl" />
                              <div className="flex gap-2">
                                <input type="number" placeholder="Year" value={edu.year} onChange={(e) => {
                                  const newEducations = [...profileForm.educations];
                                  newEducations[index].year = parseInt(e.target.value);
                                  setProfileForm({...profileForm, educations: newEducations});
                                }} className="p-3 bg-white border border-slate-100 rounded-xl flex-1" />
                                <button onClick={() => handleRemoveEducation(index)} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Services</h3>
                            <button onClick={handleAddService} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                              <Plus size={18} />
                            </button>
                          </div>
                          {profileForm.services?.map((svc: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl">
                              <input type="text" placeholder="Service Name" value={svc.serviceName} onChange={(e) => {
                                const newServices = [...profileForm.services];
                                newServices[index].serviceName = e.target.value;
                                setProfileForm({...profileForm, services: newServices});
                              }} className="p-3 bg-white border border-slate-100 rounded-xl" />
                              <div className="flex gap-2">
                                <input type="text" placeholder="Description" value={svc.description} onChange={(e) => {
                                  const newServices = [...profileForm.services];
                                  newServices[index].description = e.target.value;
                                  setProfileForm({...profileForm, services: newServices});
                                }} className="p-3 bg-white border border-slate-100 rounded-xl flex-1" />
                                <button onClick={() => handleRemoveService(index)} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button onClick={handleSaveProfile} disabled={saving} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button onClick={() => setEditingProfile(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[68vh] overflow-y-auto pr-2">
                         {[
                           { label: 'Email', val: doctor?.email || 'N/A', icon: Mail },
                           { label: 'Phone', val: doctor?.phone || 'N/A', icon: Phone },
                           { label: 'Experience', val: doctor?.experience || 'N/A', icon: Briefcase },
                           { label: 'Consultation Fee', val: `₹${doctor?.consultationFee || 0}`, icon: IndianRupee },
                           { label: 'Clinic', val: doctor?.clinicAddress || 'N/A', icon: MapPin },
                         ].map((info, i) => (
                           <div key={i} className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{info.label}</label>
                              <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                                 <div className="text-blue-600"><info.icon size={18}/></div>
                                 <span className="font-bold text-slate-800">{info.val}</span>
                              </div>
                           </div>
                         ))}
                         <div className="md:col-span-2 space-y-4">
                           <h3 className="text-lg font-bold text-slate-900">Education</h3>
                           <div className="space-y-2">
                             {doctor?.educations?.map((edu: any, i: number) => (
                               <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                                 <GraduationCap size={18} className="text-blue-600" />
                                 <span className="font-bold text-slate-800">{edu.degreeCourse} - {edu.institute} ({edu.year})</span>
                               </div>
                             )) || <p className="text-slate-500">No education added</p>}
                           </div>
                         </div>
                         <div className="md:col-span-2 space-y-4">
                           <h3 className="text-lg font-bold text-slate-900">Services</h3>
                           <div className="space-y-2">
                             {doctor?.services?.map((svc: any, i: number) => (
                               <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                                 <Briefcase size={18} className="text-blue-600" />
                                 <span className="font-bold text-slate-800">{svc.serviceName} - {svc.description}</span>
                               </div>
                             )) || <p className="text-slate-500">No services added</p>}
                           </div>
                         </div>
                      </div>
                    )}
                 </div>

                {pendingImagePreview && (
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
                      Preview (center square crop will be applied)
                    </p>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-40 h-40 rounded-2xl overflow-hidden border border-slate-200 bg-white">
                        <img src={pendingImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleProfileImageUpload(pendingImageFile)}
                          disabled={uploadingImage}
                          className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-60"
                        >
                          {uploadingImage ? 'Uploading...' : 'Confirm Upload'}
                        </button>
                        <button
                          onClick={handleCancelPendingImage}
                          className="px-5 py-3 bg-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === 'appointments' && (
              <motion.div key="appt" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                       <h3 className="text-xl font-bold font-outfit">Appointments</h3>
                       <div className="flex gap-2">
                          {['today', 'upcoming', 'all'].map(filter => (
                            <button key={filter} onClick={() => { setAppointmentFilter(filter); fetchDoctorData(); }} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${appointmentFilter === filter ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                              {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       {appointments.length > 0 ? (
                         appointments.map(apt => (
                           <div key={apt.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-blue-600 shadow-sm">
                                    {apt.time ? apt.time.split(' ')[0] : 'N/A'}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">{apt.patient || 'Unknown Patient'}</h4>
                                    <p className="text-xs text-slate-500">{apt.reason || 'No reason provided'}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${apt.type === 'VIDEO' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-600'}`}>
                                    {apt.type || 'CLINIC'}
                                 </span>
                                 <select value={apt.status} onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value)} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white">
                                   <option value="PENDING">Pending</option>
                                   <option value="CONFIRMED">Confirmed</option>
                                   <option value="COMPLETED">Completed</option>
                                   <option value="CANCELLED">Cancelled</option>
                                 </select>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-12">
                           <p className="text-slate-500 font-medium">No appointments found</p>
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'availability' && (
              <motion.div key="avail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 {successMessage && (
                   <div className="bg-green-50 text-green-600 p-4 rounded-2xl font-bold text-center">
                     {successMessage}
                   </div>
                 )}
                 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-bold font-outfit">Availability Schedule</h3>
                       <button onClick={handleAddAvailability} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                         <Plus size={18} /> Add Availability
                       </button>
                    </div>

                    {addingAvailability && (
                      <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4">Add New Availability Slot</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Day of Week</label>
                            <select value={availabilityForm.dayOfWeek} onChange={(e) => setAvailabilityForm({...availabilityForm, dayOfWeek: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl">
                              <option value="MONDAY">Monday</option>
                              <option value="TUESDAY">Tuesday</option>
                              <option value="WEDNESDAY">Wednesday</option>
                              <option value="THURSDAY">Thursday</option>
                              <option value="FRIDAY">Friday</option>
                              <option value="SATURDAY">Saturday</option>
                              <option value="SUNDAY">Sunday</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Type</label>
                            <select value={availabilityForm.consultationType} onChange={(e) => setAvailabilityForm({...availabilityForm, consultationType: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl">
                              <option value="CLINIC">Clinic Visit</option>
                              <option value="VIDEO">Video Call</option>
                              <option value="BOTH">Both</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                            <input type="time" value={availabilityForm.startTime} onChange={(e) => setAvailabilityForm({...availabilityForm, startTime: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                            <input type="time" value={availabilityForm.endTime} onChange={(e) => setAvailabilityForm({...availabilityForm, endTime: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slot Duration (minutes)</label>
                            <input type="number" value={availabilityForm.slotDurationMinutes} onChange={(e) => setAvailabilityForm({...availabilityForm, slotDurationMinutes: parseInt(e.target.value)})} className="w-full p-3 bg-white border border-slate-200 rounded-xl" min="15" step="15" />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button onClick={handleSaveAvailability} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                            Save
                          </button>
                          <button onClick={() => setAddingAvailability(false)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                       {availabilities.length > 0 ? (
                         availabilities.map((avail: any) => (
                           <div key={avail.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-blue-600 shadow-sm">
                                    <Clock3 size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">{avail.dayOfWeek}</h4>
                                    <p className="text-xs text-slate-500">{avail.startTime} - {avail.endTime} • {avail.consultationType} • {avail.slotDurationMinutes} min slots</p>
                                 </div>
                              </div>
                              <button onClick={() => handleDeleteAvailability(avail.id)} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all">
                                 <Trash2 size={18} />
                              </button>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-12">
                           <p className="text-slate-500 font-medium">No availability set</p>
                           <p className="text-slate-400 text-sm mt-2">Add your availability to allow patients to book appointments</p>
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'video' && (
              <motion.div key="vid" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-bold font-outfit">Video Consultations</h3>
                       <button onClick={fetchVideoRequests} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
                         <RefreshCw size={16} /> Refresh
                       </button>
                    </div>

                    <div className="space-y-4">
                       {videoRequests.length > 0 ? (
                         videoRequests.map((req: any) => (
                           <div key={req.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                                    <VideoIcon size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">{req.patientName || 'Patient'}</h4>
                                    <p className="text-xs text-slate-500">{req.reason || 'Video consultation'}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(req.requestTime).toLocaleString()}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button onClick={() => handleAcceptVideoCall(req.id)} className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
                                    Accept
                                 </button>
                                 <button onClick={() => handleRejectVideoCall(req.id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all">
                                    Reject
                                 </button>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-12">
                           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <VideoIcon size={32} className="text-slate-400" />
                           </div>
                           <p className="text-slate-500 font-medium">No pending video calls</p>
                           <p className="text-slate-400 text-sm mt-2">Video call requests from patients will appear here</p>
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'staff' && (
              <motion.div key="stf" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 {successMessage && (
                   <div className="bg-green-50 text-green-600 p-4 rounded-2xl font-bold text-center">
                     {successMessage}
                   </div>
                 )}
                 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-bold font-outfit">My Staff</h3>
                       <button onClick={handleAddStaff} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                         <UserPlus size={18} /> Add Staff
                       </button>
                    </div>

                    {addingStaff && (
                      <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4">Add New Staff Member</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="Username" value={staffForm.username} onChange={(e) => setStaffForm({...staffForm, username: e.target.value})} className="p-3 bg-white border border-slate-200 rounded-xl" />
                          <input type="password" placeholder="Password" value={staffForm.password} onChange={(e) => setStaffForm({...staffForm, password: e.target.value})} className="p-3 bg-white border border-slate-200 rounded-xl" />
                          <input type="text" placeholder="Full Name" value={staffForm.name} onChange={(e) => setStaffForm({...staffForm, name: e.target.value})} className="p-3 bg-white border border-slate-200 rounded-xl" />
                          <input type="email" placeholder="Email" value={staffForm.email} onChange={(e) => setStaffForm({...staffForm, email: e.target.value})} className="p-3 bg-white border border-slate-200 rounded-xl" />
                          <input type="text" placeholder="Phone" value={staffForm.phone} onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})} className="p-3 bg-white border border-slate-200 rounded-xl md:col-span-2" />
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button onClick={handleSaveStaff} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                            Save
                          </button>
                          <button onClick={() => setAddingStaff(false)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                       {staff.length > 0 ? (
                         staff.map((member: any) => (
                           <div key={member.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm font-bold">
                                    {member.name?.[0] || 'S'}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-slate-900">{member.name || 'Staff Member'}</h4>
                                    <p className="text-xs text-slate-500">{member.email || member.username}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{member.phone || 'No phone'}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className={`px-3 py-1 rounded-lg text-xs font-bold ${member.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'}`}>
                                    {member.isActive ? 'Active' : 'Inactive'}
                                 </span>
                                 <button onClick={() => handleDeleteStaff(member.id)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-12">
                           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Users size={32} className="text-slate-400" />
                           </div>
                           <p className="text-slate-500 font-medium">No staff members</p>
                           <p className="text-slate-400 text-sm mt-2">Add staff members to help manage your clinic</p>
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* Mobile Nav - Now available on both mobile and desktop */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 px-6 py-4 flex justify-around z-[100] shadow-2xl">
         {[
           { id: 'dashboard', icon: LayoutDashboard },
           { id: 'appointments', icon: Calendar },
           { id: 'video', icon: Video },
           { id: 'profile', icon: User },
         ].map(item => (
           <button 
             key={item.id}
             onClick={() => setActiveTab(item.id)}
             className={`p-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400'}`}
           >
             <item.icon size={24} />
           </button>
         ))}
      </nav>
    </div>
  );
};

export default DoctorDashboard;
