import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Video, Clock, Users, User, LogOut, Trash2, Plus, ArrowRight, Stethoscope, IndianRupee, MapPin, Mail, Phone, GraduationCap, Briefcase, RefreshCw, Edit, Video as VideoIcon, Clock3, UserPlus } from 'lucide-react';
import { useAuth } from './AuthContext';
const DoctorDashboard = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [doctor, setDoctor] = useState(null);
    const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
    const [appointments, setAppointments] = useState([]);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({});
    const [availabilities, setAvailabilities] = useState([]);
    const [appointmentFilter, setAppointmentFilter] = useState('today');
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [videoRequests, setVideoRequests] = useState([]);
    const [staff, setStaff] = useState([]);
    const [addingStaff, setAddingStaff] = useState(false);
    const [staffForm, setStaffForm] = useState({});
    const [addingAvailability, setAddingAvailability] = useState(false);
    const [availabilityForm, setAvailabilityForm] = useState({
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
        }
        else {
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
                }
                else {
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
            }
            catch (error) {
                console.error('Error fetching doctor online status:', error);
            }
            // Fetch doctor profile
            try {
                const doctorRes = await fetch(`/api/doctor/dashboard/profile/${userId}`);
                if (doctorRes.ok) {
                    const doctorData = await doctorRes.json();
                    setDoctor(doctorData);
                }
                else {
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
            }
            catch (error) {
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
                    const transformedAppointments = appointmentsData.map((apt) => ({
                        id: apt.id,
                        patient: `${apt.patient?.firstName || ''} ${apt.patient?.lastName || ''}`.trim() || 'Unknown Patient',
                        reason: apt.reason || 'General consultation',
                        time: apt.appointmentTime || apt.appointmentDate || 'N/A',
                        type: apt.consultationType || 'CLINIC',
                        status: apt.status || 'PENDING'
                    }));
                    setAppointments(transformedAppointments);
                }
                else {
                    console.warn('Failed to fetch appointments:', appointmentsRes.status);
                    setAppointments([]);
                }
            }
            catch (error) {
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
                }
                else {
                    console.warn('Failed to fetch stats:', statsRes.status);
                    setStats({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
                }
            }
            catch (error) {
                console.error('Error fetching stats:', error);
                setStats({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
            }
            if (isRefresh) {
                setRefreshing(false);
            }
            else {
                setLoading(false);
            }
        }
        catch (error) {
            console.error('Error in fetchDoctorData:', error);
            setStats({ total: 0, today: 0, pending: 0, completed: 0, earnings: 0 });
            setAppointments([]);
            if (isRefresh) {
                setRefreshing(false);
            }
            else {
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
            }
            else {
                const errorData = await res.json();
                alert('Failed to toggle status: ' + (errorData.message || 'Unknown error'));
            }
        }
        catch (error) {
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
            educations: doctor?.educations || [],
            services: doctor?.services || []
        });
        setEditingProfile(true);
    };
    const handleSaveProfile = async () => {
        const doctorId = localStorage.getItem('doctorId');
        if (!doctorId)
            return;
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
        }
        catch (error) {
            console.error('Error saving profile:', error);
        }
        finally {
            setSaving(false);
        }
    };
    const handleAddEducation = () => {
        setProfileForm({
            ...profileForm,
            educations: [...(profileForm.educations || []), { institute: '', degreeCourse: '', year: new Date().getFullYear() }]
        });
    };
    const handleRemoveEducation = (index) => {
        const newEducations = profileForm.educations.filter((_, i) => i !== index);
        setProfileForm({ ...profileForm, educations: newEducations });
    };
    const handleAddService = () => {
        setProfileForm({
            ...profileForm,
            services: [...(profileForm.services || []), { serviceName: '', description: '' }]
        });
    };
    const handleRemoveService = (index) => {
        const newServices = profileForm.services.filter((_, i) => i !== index);
        setProfileForm({ ...profileForm, services: newServices });
    };
    const fetchAvailabilities = async () => {
        const doctorId = localStorage.getItem('doctorId');
        if (!doctorId)
            return;
        try {
            const res = await fetch(`/api/doctor/dashboard/availability/${doctorId}`);
            if (res.ok) {
                const data = await res.json();
                setAvailabilities(data);
            }
        }
        catch (error) {
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
            }
            else {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    alert('Failed to add availability: ' + (data.error || data.message || 'Unknown error'));
                }
                catch {
                    alert('Failed to add availability: ' + text);
                }
            }
        }
        catch (error) {
            console.error('Error adding availability:', error);
            alert('Error adding availability: ' + error);
        }
    };
    const handleDeleteAvailability = async (id) => {
        try {
            const res = await fetch(`/api/doctor/dashboard/availability/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchAvailabilities();
            }
        }
        catch (error) {
            console.error('Error deleting availability:', error);
        }
    };
    const handleUpdateAppointmentStatus = async (appointmentId, status) => {
        try {
            const res = await fetch(`/api/doctor/dashboard/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchDoctorData();
            }
        }
        catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };
    const fetchVideoRequests = async () => {
        const doctorId = localStorage.getItem('doctorId');
        if (!doctorId)
            return;
        try {
            const res = await fetch(`/api/video-call/doctor/${doctorId}/requests`);
            if (res.ok) {
                const data = await res.json();
                setVideoRequests(data);
            }
        }
        catch (error) {
            console.error('Error fetching video requests:', error);
        }
    };
    const handleAcceptVideoCall = async (requestId) => {
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
        }
        catch (error) {
            console.error('Error accepting video call:', error);
        }
    };
    const handleRejectVideoCall = async (requestId) => {
        try {
            const res = await fetch(`/api/video-call/request/${requestId}/reject`, {
                method: 'POST'
            });
            if (res.ok) {
                fetchVideoRequests();
            }
        }
        catch (error) {
            console.error('Error rejecting video call:', error);
        }
    };
    const fetchStaff = async () => {
        const doctorId = localStorage.getItem('doctorId');
        if (!doctorId)
            return;
        try {
            const res = await fetch(`/api/staff/doctor/${doctorId}`);
            if (res.ok) {
                const data = await res.json();
                setStaff(data);
            }
        }
        catch (error) {
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
        if (!doctorId)
            return;
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
        }
        catch (error) {
            console.error('Error adding staff:', error);
        }
    };
    const handleDeleteStaff = async (staffId) => {
        try {
            const res = await fetch(`/api/staff/${staffId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchStaff();
            }
        }
        catch (error) {
            console.error('Error deleting staff:', error);
        }
    };
    useEffect(() => {
        if (activeTab === 'availability') {
            fetchAvailabilities();
        }
        else if (activeTab === 'video') {
            fetchVideoRequests();
        }
        else if (activeTab === 'staff') {
            fetchStaff();
        }
    }, [activeTab]);
    if (loading)
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-slate-50", children: _jsx("div", { className: "w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }) }));
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex font-inter", children: [_jsxs("aside", { className: "w-[300px] bg-white border-r border-slate-200 p-8 flex flex-col h-screen sticky top-0 hidden lg:flex", children: [_jsx("div", { className: "mb-10", children: _jsx("h1", { className: "text-2xl font-black text-blue-600 mb-10", children: "Sehat24x7" }) }), _jsx("nav", { className: "space-y-2 flex-1", children: [
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { id: 'appointments', icon: Calendar, label: 'Appointments' },
                            { id: 'video', icon: Video, label: 'Video Calls' },
                            { id: 'availability', icon: Clock, label: 'Scheduling' },
                            { id: 'staff', icon: Users, label: 'My Staff' },
                            { id: 'profile', icon: User, label: 'Profile' },
                        ].map(item => (_jsxs("button", { onClick: () => setActiveTab(item.id), className: `w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`, children: [_jsx(item.icon, { size: 20 }), " ", item.label] }, item.id))) }), _jsxs("button", { onClick: logout, className: "flex items-center gap-4 px-6 py-4 mt-8 text-slate-400 font-bold text-sm hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all", children: [_jsx(LogOut, { size: 20 }), " Logout"] })] }), _jsxs("main", { className: "flex-1 p-8 lg:p-12 overflow-x-hidden", children: [_jsxs("header", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 font-outfit", children: doctor?.name || 'Doctor' }), _jsxs("p", { className: "text-slate-500 font-medium", children: [doctor?.specialization?.name || 'Specialization', " \u2022 ", doctor?.qualification || 'Qualification'] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { onClick: handleToggleOnline, className: "bg-white rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all", children: [_jsx("span", { className: "text-sm font-medium text-slate-700", children: isOnline ? 'Online' : 'Offline' }), _jsx("div", { className: `w-11 h-6 rounded-full relative transition-all ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`, children: _jsx("div", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${isOnline ? 'right-0.5' : 'left-0.5'}` }) })] }), _jsxs("button", { onClick: handleRefresh, disabled: refreshing, className: "p-2 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-50", title: "Refresh data", children: [_jsx(RefreshCw, { size: 16, className: refreshing ? 'animate-spin' : '' }), _jsx("span", { className: "text-xs font-bold text-slate-600", children: "Refresh" })] }), _jsxs("div", { className: "px-4 py-2 bg-white border border-slate-200 rounded-2xl flex items-center gap-3", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-blue-600 animate-ping" }), _jsxs("span", { className: "text-xs font-bold text-slate-600", children: [stats.today, " Active Appointments"] })] })] })] }), _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'dashboard' && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "space-y-10", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
                                            { label: 'Total Patients', val: stats.total, icon: Users, color: 'blue' },
                                            { label: 'Today', val: stats.today, icon: Calendar, color: 'orange' },
                                            { label: 'Pending', val: stats.pending, icon: Clock, color: 'purple' },
                                            { label: 'Earnings', val: stats.earnings > 0 ? `₹${stats.earnings}k` : '₹0', icon: IndianRupee, color: 'green' }
                                        ].map((s, i) => (_jsxs("div", { className: "bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6", children: [_jsx("div", { className: `w-14 h-14 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center shrink-0`, children: _jsx(s.icon, { size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1", children: s.label }), _jsx("h4", { className: "text-2xl font-black text-slate-800", children: s.val })] })] }, i))) }), _jsxs("div", { className: "bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h3", { className: "text-xl font-bold font-outfit", children: "Today's Queue" }), _jsx("button", { onClick: () => setActiveTab('availability'), className: "text-blue-600 font-bold text-sm hover:text-blue-700 transition-all", children: "View Schedule" })] }), _jsx("div", { className: "space-y-4", children: appointments.length > 0 ? (appointments.map(apt => (_jsxs("div", { className: "p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-100 transition-all", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-blue-600 shadow-sm", children: apt.time ? apt.time.split(' ')[0] : 'N/A' }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-900", children: apt.patient || 'Unknown Patient' }), _jsx("p", { className: "text-xs text-slate-500", children: apt.reason || 'No reason provided' })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: `px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${apt.type === 'VIDEO' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-600'}`, children: apt.type || 'CLINIC' }), _jsx("span", { className: `px-4 py-2 rounded-xl text-xs font-bold ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`, children: apt.status || 'PENDING' }), _jsx("button", { className: "p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all", children: _jsx(ArrowRight, { size: 18 }) })] })] }, apt.id)))) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-slate-500 font-medium", children: "No appointments scheduled for today" }), _jsx("p", { className: "text-slate-400 text-sm mt-2", children: "Your appointments will appear here once they are booked" })] })) })] })] }, "dash")), activeTab === 'profile' && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "max-w-4xl mx-auto space-y-8", children: [successMessage && (_jsx("div", { className: "bg-green-50 text-green-600 p-4 rounded-2xl font-bold text-center", children: successMessage })), _jsxs("div", { className: "bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-12 items-center mb-12 pb-12 border-b border-slate-50", children: [_jsx("div", { className: "w-32 h-32 bg-blue-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-100", children: doctor?.name?.[0] || 'D' }), _jsx("div", { className: "flex-1 text-center md:text-left", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-slate-900 font-outfit mb-2", children: doctor?.name || 'Doctor Name' }), _jsxs("div", { className: "flex flex-wrap justify-center md:justify-start gap-4", children: [_jsxs("span", { className: "flex items-center gap-2 text-slate-500 font-medium", children: [_jsx(Stethoscope, { size: 16 }), " ", doctor?.specializations || 'Specialization'] }), _jsxs("span", { className: "flex items-center gap-2 text-slate-500 font-medium", children: [_jsx(GraduationCap, { size: 16 }), " ", doctor?.qualification || 'Qualification'] })] })] }), !editingProfile && (_jsx("button", { onClick: handleEditProfile, className: "p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all", children: _jsx(Edit, { size: 20 }) }))] }) })] }), editingProfile ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Name" }), _jsx("input", { type: "text", value: profileForm.name, onChange: (e) => setProfileForm({ ...profileForm, name: e.target.value }), className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Email" }), _jsx("input", { type: "email", value: profileForm.email, onChange: (e) => setProfileForm({ ...profileForm, email: e.target.value }), className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Phone" }), _jsx("input", { type: "text", value: profileForm.phone, onChange: (e) => setProfileForm({ ...profileForm, phone: e.target.value }), className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Qualification" }), _jsx("input", { type: "text", value: profileForm.qualification, onChange: (e) => setProfileForm({ ...profileForm, qualification: e.target.value }), className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Experience" }), _jsx("input", { type: "text", value: profileForm.experience, onChange: (e) => setProfileForm({ ...profileForm, experience: e.target.value }), className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Consultation Fee" }), _jsx("input", { type: "number", value: profileForm.consultationFee, onChange: (e) => setProfileForm({ ...profileForm, consultationFee: parseFloat(e.target.value) }), className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" })] }), _jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Clinic Address" }), _jsx("input", { type: "text", value: profileForm.clinicAddress, onChange: (e) => setProfileForm({ ...profileForm, clinicAddress: e.target.value }), className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" })] }), _jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Specializations" }), _jsx("input", { type: "text", value: profileForm.specializations, onChange: (e) => setProfileForm({ ...profileForm, specializations: e.target.value }), className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Education" }), _jsx("button", { onClick: handleAddEducation, className: "p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all", children: _jsx(Plus, { size: 18 }) })] }), profileForm.educations?.map((edu, index) => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl", children: [_jsx("input", { type: "text", placeholder: "Institute", value: edu.institute, onChange: (e) => {
                                                                            const newEducations = [...profileForm.educations];
                                                                            newEducations[index].institute = e.target.value;
                                                                            setProfileForm({ ...profileForm, educations: newEducations });
                                                                        }, className: "p-3 bg-white border border-slate-100 rounded-xl" }), _jsx("input", { type: "text", placeholder: "Degree", value: edu.degreeCourse, onChange: (e) => {
                                                                            const newEducations = [...profileForm.educations];
                                                                            newEducations[index].degreeCourse = e.target.value;
                                                                            setProfileForm({ ...profileForm, educations: newEducations });
                                                                        }, className: "p-3 bg-white border border-slate-100 rounded-xl" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", placeholder: "Year", value: edu.year, onChange: (e) => {
                                                                                    const newEducations = [...profileForm.educations];
                                                                                    newEducations[index].year = parseInt(e.target.value);
                                                                                    setProfileForm({ ...profileForm, educations: newEducations });
                                                                                }, className: "p-3 bg-white border border-slate-100 rounded-xl flex-1" }), _jsx("button", { onClick: () => handleRemoveEducation(index), className: "p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all", children: _jsx(Trash2, { size: 18 }) })] })] }, index)))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Services" }), _jsx("button", { onClick: handleAddService, className: "p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all", children: _jsx(Plus, { size: 18 }) })] }), profileForm.services?.map((svc, index) => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl", children: [_jsx("input", { type: "text", placeholder: "Service Name", value: svc.serviceName, onChange: (e) => {
                                                                            const newServices = [...profileForm.services];
                                                                            newServices[index].serviceName = e.target.value;
                                                                            setProfileForm({ ...profileForm, services: newServices });
                                                                        }, className: "p-3 bg-white border border-slate-100 rounded-xl" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Description", value: svc.description, onChange: (e) => {
                                                                                    const newServices = [...profileForm.services];
                                                                                    newServices[index].description = e.target.value;
                                                                                    setProfileForm({ ...profileForm, services: newServices });
                                                                                }, className: "p-3 bg-white border border-slate-100 rounded-xl flex-1" }), _jsx("button", { onClick: () => handleRemoveService(index), className: "p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all", children: _jsx(Trash2, { size: 18 }) })] })] }, index)))] }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx("button", { onClick: handleSaveProfile, disabled: saving, className: "flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50", children: saving ? 'Saving...' : 'Save Changes' }), _jsx("button", { onClick: () => setEditingProfile(false), className: "px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all", children: "Cancel" })] })] })) : (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [[
                                                        { label: 'Email', val: doctor?.email || 'N/A', icon: Mail },
                                                        { label: 'Phone', val: doctor?.phone || 'N/A', icon: Phone },
                                                        { label: 'Experience', val: doctor?.experience || 'N/A', icon: Briefcase },
                                                        { label: 'Consultation Fee', val: `₹${doctor?.consultationFee || 0}`, icon: IndianRupee },
                                                        { label: 'Clinic', val: doctor?.clinicAddress || 'N/A', icon: MapPin },
                                                    ].map((info, i) => (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: info.label }), _jsxs("div", { className: "flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-3xl", children: [_jsx("div", { className: "text-blue-600", children: _jsx(info.icon, { size: 18 }) }), _jsx("span", { className: "font-bold text-slate-800", children: info.val })] })] }, i))), _jsxs("div", { className: "md:col-span-2 space-y-4", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Education" }), _jsx("div", { className: "space-y-2", children: doctor?.educations?.map((edu, i) => (_jsxs("div", { className: "p-4 bg-slate-50 rounded-2xl flex items-center gap-4", children: [_jsx(GraduationCap, { size: 18, className: "text-blue-600" }), _jsxs("span", { className: "font-bold text-slate-800", children: [edu.degreeCourse, " - ", edu.institute, " (", edu.year, ")"] })] }, i))) || _jsx("p", { className: "text-slate-500", children: "No education added" }) })] }), _jsxs("div", { className: "md:col-span-2 space-y-4", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Services" }), _jsx("div", { className: "space-y-2", children: doctor?.services?.map((svc, i) => (_jsxs("div", { className: "p-4 bg-slate-50 rounded-2xl flex items-center gap-4", children: [_jsx(Briefcase, { size: 18, className: "text-blue-600" }), _jsxs("span", { className: "font-bold text-slate-800", children: [svc.serviceName, " - ", svc.description] })] }, i))) || _jsx("p", { className: "text-slate-500", children: "No services added" }) })] })] }))] })] }, "prof")), activeTab === 'appointments' && (_jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: _jsxs("div", { className: "bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm", children: [_jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-6 mb-8", children: [_jsx("h3", { className: "text-xl font-bold font-outfit", children: "Appointments" }), _jsx("div", { className: "flex gap-2", children: ['today', 'upcoming', 'all'].map(filter => (_jsx("button", { onClick: () => { setAppointmentFilter(filter); fetchDoctorData(); }, className: `px-4 py-2 rounded-xl font-bold text-sm transition-all ${appointmentFilter === filter ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`, children: filter.charAt(0).toUpperCase() + filter.slice(1) }, filter))) })] }), _jsx("div", { className: "space-y-4", children: appointments.length > 0 ? (appointments.map(apt => (_jsxs("div", { className: "p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-blue-600 shadow-sm", children: apt.time ? apt.time.split(' ')[0] : 'N/A' }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-900", children: apt.patient || 'Unknown Patient' }), _jsx("p", { className: "text-xs text-slate-500", children: apt.reason || 'No reason provided' })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: `px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${apt.type === 'VIDEO' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-600'}`, children: apt.type || 'CLINIC' }), _jsxs("select", { value: apt.status, onChange: (e) => handleUpdateAppointmentStatus(apt.id, e.target.value), className: "px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white", children: [_jsx("option", { value: "PENDING", children: "Pending" }), _jsx("option", { value: "CONFIRMED", children: "Confirmed" }), _jsx("option", { value: "COMPLETED", children: "Completed" }), _jsx("option", { value: "CANCELLED", children: "Cancelled" })] })] })] }, apt.id)))) : (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-slate-500 font-medium", children: "No appointments found" }) })) })] }) }, "appt")), activeTab === 'availability' && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: [successMessage && (_jsx("div", { className: "bg-green-50 text-green-600 p-4 rounded-2xl font-bold text-center", children: successMessage })), _jsxs("div", { className: "bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h3", { className: "text-xl font-bold font-outfit", children: "Availability Schedule" }), _jsxs("button", { onClick: handleAddAvailability, className: "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all", children: [_jsx(Plus, { size: 18 }), " Add Availability"] })] }), addingAvailability && (_jsxs("div", { className: "mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100", children: [_jsx("h4", { className: "font-bold text-slate-900 mb-4", children: "Add New Availability Slot" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Day of Week" }), _jsxs("select", { value: availabilityForm.dayOfWeek, onChange: (e) => setAvailabilityForm({ ...availabilityForm, dayOfWeek: e.target.value }), className: "w-full p-3 bg-white border border-slate-200 rounded-xl", children: [_jsx("option", { value: "MONDAY", children: "Monday" }), _jsx("option", { value: "TUESDAY", children: "Tuesday" }), _jsx("option", { value: "WEDNESDAY", children: "Wednesday" }), _jsx("option", { value: "THURSDAY", children: "Thursday" }), _jsx("option", { value: "FRIDAY", children: "Friday" }), _jsx("option", { value: "SATURDAY", children: "Saturday" }), _jsx("option", { value: "SUNDAY", children: "Sunday" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Consultation Type" }), _jsxs("select", { value: availabilityForm.consultationType, onChange: (e) => setAvailabilityForm({ ...availabilityForm, consultationType: e.target.value }), className: "w-full p-3 bg-white border border-slate-200 rounded-xl", children: [_jsx("option", { value: "CLINIC", children: "Clinic Visit" }), _jsx("option", { value: "VIDEO", children: "Video Call" }), _jsx("option", { value: "BOTH", children: "Both" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Start Time" }), _jsx("input", { type: "time", value: availabilityForm.startTime, onChange: (e) => setAvailabilityForm({ ...availabilityForm, startTime: e.target.value }), className: "w-full p-3 bg-white border border-slate-200 rounded-xl" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "End Time" }), _jsx("input", { type: "time", value: availabilityForm.endTime, onChange: (e) => setAvailabilityForm({ ...availabilityForm, endTime: e.target.value }), className: "w-full p-3 bg-white border border-slate-200 rounded-xl" })] }), _jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsx("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1", children: "Slot Duration (minutes)" }), _jsx("input", { type: "number", value: availabilityForm.slotDurationMinutes, onChange: (e) => setAvailabilityForm({ ...availabilityForm, slotDurationMinutes: parseInt(e.target.value) }), className: "w-full p-3 bg-white border border-slate-200 rounded-xl", min: "15", step: "15" })] })] }), _jsxs("div", { className: "flex gap-3 mt-4", children: [_jsx("button", { onClick: handleSaveAvailability, className: "px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all", children: "Save" }), _jsx("button", { onClick: () => setAddingAvailability(false), className: "px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all", children: "Cancel" })] })] })), _jsx("div", { className: "space-y-4", children: availabilities.length > 0 ? (availabilities.map((avail) => (_jsxs("div", { className: "p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-blue-600 shadow-sm", children: _jsx(Clock3, { size: 24 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-900", children: avail.dayOfWeek }), _jsxs("p", { className: "text-xs text-slate-500", children: [avail.startTime, " - ", avail.endTime, " \u2022 ", avail.consultationType, " \u2022 ", avail.slotDurationMinutes, " min slots"] })] })] }), _jsx("button", { onClick: () => handleDeleteAvailability(avail.id), className: "p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all", children: _jsx(Trash2, { size: 18 }) })] }, avail.id)))) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-slate-500 font-medium", children: "No availability set" }), _jsx("p", { className: "text-slate-400 text-sm mt-2", children: "Add your availability to allow patients to book appointments" })] })) })] })] }, "avail")), activeTab === 'video' && (_jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: _jsxs("div", { className: "bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h3", { className: "text-xl font-bold font-outfit", children: "Video Consultations" }), _jsxs("button", { onClick: fetchVideoRequests, className: "flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all", children: [_jsx(RefreshCw, { size: 16 }), " Refresh"] })] }), _jsx("div", { className: "space-y-4", children: videoRequests.length > 0 ? (videoRequests.map((req) => (_jsxs("div", { className: "p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm", children: _jsx(VideoIcon, { size: 24 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-900", children: req.patientName || 'Patient' }), _jsx("p", { className: "text-xs text-slate-500", children: req.reason || 'Video consultation' }), _jsx("p", { className: "text-[10px] text-slate-400 mt-1", children: new Date(req.requestTime).toLocaleString() })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => handleAcceptVideoCall(req.id), className: "px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all", children: "Accept" }), _jsx("button", { onClick: () => handleRejectVideoCall(req.id), className: "px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all", children: "Reject" })] })] }, req.id)))) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(VideoIcon, { size: 32, className: "text-slate-400" }) }), _jsx("p", { className: "text-slate-500 font-medium", children: "No pending video calls" }), _jsx("p", { className: "text-slate-400 text-sm mt-2", children: "Video call requests from patients will appear here" })] })) })] }) }, "vid")), activeTab === 'staff' && (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: [successMessage && (_jsx("div", { className: "bg-green-50 text-green-600 p-4 rounded-2xl font-bold text-center", children: successMessage })), _jsxs("div", { className: "bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h3", { className: "text-xl font-bold font-outfit", children: "My Staff" }), _jsxs("button", { onClick: handleAddStaff, className: "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all", children: [_jsx(UserPlus, { size: 18 }), " Add Staff"] })] }), addingStaff && (_jsxs("div", { className: "mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100", children: [_jsx("h4", { className: "font-bold text-slate-900 mb-4", children: "Add New Staff Member" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { type: "text", placeholder: "Username", value: staffForm.username, onChange: (e) => setStaffForm({ ...staffForm, username: e.target.value }), className: "p-3 bg-white border border-slate-200 rounded-xl" }), _jsx("input", { type: "password", placeholder: "Password", value: staffForm.password, onChange: (e) => setStaffForm({ ...staffForm, password: e.target.value }), className: "p-3 bg-white border border-slate-200 rounded-xl" }), _jsx("input", { type: "text", placeholder: "Full Name", value: staffForm.name, onChange: (e) => setStaffForm({ ...staffForm, name: e.target.value }), className: "p-3 bg-white border border-slate-200 rounded-xl" }), _jsx("input", { type: "email", placeholder: "Email", value: staffForm.email, onChange: (e) => setStaffForm({ ...staffForm, email: e.target.value }), className: "p-3 bg-white border border-slate-200 rounded-xl" }), _jsx("input", { type: "text", placeholder: "Phone", value: staffForm.phone, onChange: (e) => setStaffForm({ ...staffForm, phone: e.target.value }), className: "p-3 bg-white border border-slate-200 rounded-xl md:col-span-2" })] }), _jsxs("div", { className: "flex gap-3 mt-4", children: [_jsx("button", { onClick: handleSaveStaff, className: "px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all", children: "Save" }), _jsx("button", { onClick: () => setAddingStaff(false), className: "px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all", children: "Cancel" })] })] })), _jsx("div", { className: "space-y-4", children: staff.length > 0 ? (staff.map((member) => (_jsxs("div", { className: "p-6 bg-slate-50 rounded-3xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm font-bold", children: member.name?.[0] || 'S' }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-slate-900", children: member.name || 'Staff Member' }), _jsx("p", { className: "text-xs text-slate-500", children: member.email || member.username }), _jsx("p", { className: "text-[10px] text-slate-400 mt-1", children: member.phone || 'No phone' })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `px-3 py-1 rounded-lg text-xs font-bold ${member.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'}`, children: member.isActive ? 'Active' : 'Inactive' }), _jsx("button", { onClick: () => handleDeleteStaff(member.id), className: "p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all", children: _jsx(Trash2, { size: 16 }) })] })] }, member.id)))) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Users, { size: 32, className: "text-slate-400" }) }), _jsx("p", { className: "text-slate-500 font-medium", children: "No staff members" }), _jsx("p", { className: "text-slate-400 text-sm mt-2", children: "Add staff members to help manage your clinic" })] })) })] })] }, "stf"))] })] }), _jsx("nav", { className: "fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 px-6 py-4 flex justify-around z-[100] shadow-2xl", children: [
                    { id: 'dashboard', icon: LayoutDashboard },
                    { id: 'appointments', icon: Calendar },
                    { id: 'video', icon: Video },
                    { id: 'profile', icon: User },
                ].map(item => (_jsx("button", { onClick: () => setActiveTab(item.id), className: `p-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400'}`, children: _jsx(item.icon, { size: 24 }) }, item.id))) })] }));
};
export default DoctorDashboard;
//# sourceMappingURL=DoctorDashboard.js.map