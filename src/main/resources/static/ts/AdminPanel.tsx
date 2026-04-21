import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, UserPlus, Settings, 
  Trash2, Edit3, Plus, Search, Filter, 
  LayoutDashboard, Database, 
  Shield, Activity, Calendar, Info, 
  LogOut, Star, CheckCircle, XCircle, 
  Bell, HelpCircle, ChevronRight, Download, RefreshCw, ImageIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    siteName: 'Sehat24X7',
    supportEmail: '',
    supportPhone: '',
    maintenanceMode: 'false',
    allowDoctorRegistration: 'true'
  });
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    imagePosition: 'CENTER',
    primaryLinkText: '',
    primaryLinkUrl: '',
    secondaryLinkText: '',
    secondaryLinkUrl: '',
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchStats();
    loadTabData(activeTab);
    if (activeTab === 'settings') {
      loadSettings();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const result = await response.json();
      setStats(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
      setStats(null);
    }
  };

  const loadTabData = async (tab: string) => {
    if (tab === 'dashboard' || tab === 'settings') {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      switch(tab) {
        case 'doctors': endpoint = '/api/admin/doctors'; break;
        case 'admins': endpoint = '/api/admin/admins'; break;
        case 'users': endpoint = '/api/admin/users'; break;
        case 'announcements': endpoint = '/api/announcements/all'; break;
        case 'hero-banners': endpoint = '/api/hero-banners/all'; break;
        default: setLoading(false); return;
      }
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Failed to fetch ${tab}`);
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
      setError(null);
    } catch (err) {
      console.error(`Error loading ${tab}:`, err);
      setError(`Failed to load ${tab}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to load settings');
      const result = await response.json();
      setSettings((prev) => ({ ...prev, ...result }));
    } catch (err) {
      setError('Failed to load settings');
    }
  };

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error('Failed to save settings');
      setError(null);
      alert('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const handleDeleteRow = async (row: any) => {
    const typeEndpointMap: Record<string, string> = {
      doctors: `/api/admin/doctors/${row.id}`,
      admins: `/api/admin/admins/${row.id}`,
      users: `/api/admin/users/${row.id}`,
      announcements: `/api/announcements/${row.id}`
    };
    const endpoint = typeEndpointMap[activeTab];
    if (!endpoint) return;
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setActionLoadingId(`delete-${row.id}`);
    try {
      const response = await fetch(endpoint, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      await loadTabData(activeTab);
      if (activeTab !== 'announcements') await fetchStats();
    } catch (err) {
      setError('Failed to delete record');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (row: any) => {
    const typeEndpointMap: Record<string, { endpoint: string; method?: string }> = {
      doctors: { endpoint: `/api/admin/doctors/${row.id}/toggle-availability`, method: 'POST' },
      users: { endpoint: `/api/admin/users/${row.id}/toggle-active`, method: 'POST' },
      announcements: { endpoint: `/api/announcements/${row.id}/${row.isActive ? 'deactivate' : 'activate'}`, method: 'POST' }
    };
    const cfg = typeEndpointMap[activeTab];
    if (!cfg) return;
    setActionLoadingId(`toggle-${row.id}`);
    try {
      const response = await fetch(cfg.endpoint, { method: cfg.method || 'POST' });
      if (!response.ok) throw new Error('Toggle failed');
      await loadTabData(activeTab);
      if (activeTab !== 'announcements') await fetchStats();
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleQuickEdit = async (row: any) => {
    const newName = window.prompt('Enter updated name/title', row.name || row.title || '');
    if (newName === null || !newName.trim()) return;
    try {
      let endpoint = '';
      let payload: any = {};
      if (activeTab === 'doctors') {
        endpoint = `/api/admin/doctors/${row.id}`;
        payload = { ...row, name: newName };
      } else if (activeTab === 'admins') {
        endpoint = `/api/admin/admins/${row.id}`;
        payload = { ...row, user: { ...row.user, name: newName } };
      } else if (activeTab === 'users') {
        endpoint = `/api/admin/users/${row.id}`;
        payload = { ...row, name: newName };
      } else if (activeTab === 'announcements') {
        endpoint = `/api/announcements/${row.id}`;
        payload = { ...row, text: newName };
      } else {
        return;
      }
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Update failed');
      await loadTabData(activeTab);
    } catch (err) {
      setError('Failed to update record');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctor Roster', icon: UserCheck },
    { id: 'admins', label: 'System Admins', icon: Shield },
    { id: 'users', label: 'Patient Registry', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'hero-banners', label: 'Hero Banners', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      imagePosition: 'CENTER',
      primaryLinkText: '',
      primaryLinkUrl: '',
      secondaryLinkText: '',
      secondaryLinkUrl: '',
      displayOrder: 0,
      isActive: true
    });
    setEditingBannerId(null);
  };

  const handleEditBanner = (banner: any) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      imagePosition: banner.imagePosition || 'CENTER',
      primaryLinkText: banner.primaryLinkText || '',
      primaryLinkUrl: banner.primaryLinkUrl || '',
      secondaryLinkText: banner.secondaryLinkText || '',
      secondaryLinkUrl: banner.secondaryLinkUrl || '',
      displayOrder: banner.displayOrder || 0,
      isActive: banner.isActive !== false
    });
  };

  const saveBanner = async () => {
    try {
      const url = editingBannerId ? `/api/hero-banners/${editingBannerId}` : '/api/hero-banners';
      const method = editingBannerId ? 'PUT' : 'POST';
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerForm)
      });
      if (!resp.ok) throw new Error('Failed to save banner');
      resetBannerForm();
      loadTabData('hero-banners');
    } catch (err) {
      setError('Failed to save banner');
    }
  };

  const deleteBanner = async (id: number) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      const resp = await fetch(`/api/hero-banners/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Failed to delete banner');
      loadTabData('hero-banners');
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-inter">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-950 text-white flex flex-col fixed inset-y-0 left-0 z-50 overflow-hidden shadow-2xl">
         <div className="p-10">
            <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Shield size={24} className="text-white" />
               </div>
               <div>
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Sehat24X7 Admin</h1>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Enterprise v4.0</p>
               </div>
            </div>

            <nav className="space-y-2">
               {menuItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                     <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                     <span className="font-bold text-sm tracking-wide">{item.label}</span>
                     {activeTab === item.id && (
                       <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                     )}
                  </button>
               ))}
            </nav>
         </div>

         <div className="mt-auto p-10 space-y-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Service Status</p>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-xs font-bold text-slate-300">API Gateway Online</span>
                </div>
            </div>
            <button 
               onClick={logout}
               className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all"
             >
               <LogOut size={20} />
               <span className="font-bold text-sm">Sign Out</span>
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="ml-80 flex-1 p-12">
         {/* Navigation Bar */}
         <header className="flex justify-between items-center mb-12">
            <div>
               <h2 className="text-3xl font-bold text-slate-900 font-outfit capitalize">{activeTab.replace('-', ' ')}</h2>
               <p className="text-slate-500">Welcome back, Super Admin. Everything is looking good.</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Global search..." 
                    className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100/50 w-72 shadow-sm transition-all"
                  />
               </div>
               <button className="p-3 bg-white text-slate-400 rounded-2xl border border-slate-100 hover:text-blue-600 transition-all shadow-sm">
                  <RefreshCw size={20} onClick={fetchStats} />
               </button>
            </div>
         </header>

         {error && (
           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
             {error}
           </div>
         )}

         {/* Stats Cards Dashboard Header */}
         {activeTab === 'dashboard' && stats && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-b-4 border-b-blue-600">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserCheck size={24} />
                     </div>
                     <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-1">{stats.totalDoctors}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Doctors</p>
                  <div className="absolute -right-4 -bottom-4 text-blue-50 group-hover:rotate-12 transition-transform duration-500"><UserCheck size={80} /></div>
               </div>

               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-b-4 border-b-emerald-600">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users size={24} />
                     </div>
                     <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+5%</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-1">{stats.totalUsers}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Patients</p>
                  <div className="absolute -right-4 -bottom-4 text-emerald-50 group-hover:rotate-12 transition-transform duration-500"><Users size={80} /></div>
               </div>

               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-b-4 border-b-purple-600">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield size={24} />
                     </div>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-1">{stats.totalAdmins}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff Admins</p>
                  <div className="absolute -right-4 -bottom-4 text-purple-50 group-hover:rotate-12 transition-transform duration-500"><Shield size={80} /></div>
               </div>

               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-b-4 border-b-amber-600">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Activity size={24} />
                     </div>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-1">{stats.activeDoctors}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctors Online</p>
                  <div className="absolute -right-4 -bottom-4 text-amber-50 group-hover:rotate-12 transition-transform duration-500"><Activity size={80} /></div>
               </div>
            </section>
         )}

         {/* Dynamic Content Panel */}
         {activeTab === 'hero-banners' && (
         <section className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden mb-12">
            <div className="p-10 border-b border-slate-50 bg-slate-50/30">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><ImageIcon size={18} className="text-blue-600" /> Hero Banner Manager</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="px-4 py-3 border border-slate-200 rounded-xl" placeholder="Banner title" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} />
                <input className="px-4 py-3 border border-slate-200 rounded-xl" placeholder="Subtitle" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} />
                <input className="px-4 py-3 border border-slate-200 rounded-xl md:col-span-2" placeholder="Image URL" value={bannerForm.imageUrl} onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })} />
                <textarea className="px-4 py-3 border border-slate-200 rounded-xl md:col-span-2 resize-none h-[100px]" placeholder="Description text over banner" value={bannerForm.description} onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })} />
                <select className="px-4 py-3 border border-slate-200 rounded-xl" value={bannerForm.imagePosition} onChange={(e) => setBannerForm({ ...bannerForm, imagePosition: e.target.value })}>
                  <option value="LEFT">Image Left</option>
                  <option value="CENTER">Image Center</option>
                  <option value="RIGHT">Image Right</option>
                </select>
                <input type="number" className="px-4 py-3 border border-slate-200 rounded-xl" placeholder="Display order" value={bannerForm.displayOrder} onChange={(e) => setBannerForm({ ...bannerForm, displayOrder: Number(e.target.value) })} />
                <input className="px-4 py-3 border border-slate-200 rounded-xl" placeholder="Primary link text" value={bannerForm.primaryLinkText} onChange={(e) => setBannerForm({ ...bannerForm, primaryLinkText: e.target.value })} />
                <input className="px-4 py-3 border border-slate-200 rounded-xl" placeholder="Primary link URL" value={bannerForm.primaryLinkUrl} onChange={(e) => setBannerForm({ ...bannerForm, primaryLinkUrl: e.target.value })} />
                <input className="px-4 py-3 border border-slate-200 rounded-xl" placeholder="Secondary link text" value={bannerForm.secondaryLinkText} onChange={(e) => setBannerForm({ ...bannerForm, secondaryLinkText: e.target.value })} />
                <input className="px-4 py-3 border border-slate-200 rounded-xl" placeholder="Secondary link URL" value={bannerForm.secondaryLinkUrl} onChange={(e) => setBannerForm({ ...bannerForm, secondaryLinkUrl: e.target.value })} />
              </div>
              <div className="flex gap-3 mt-6">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl" onClick={saveBanner}>{editingBannerId ? 'Update Banner' : 'Create Banner'}</button>
                {editingBannerId && <button className="px-6 py-3 bg-slate-100 rounded-xl" onClick={resetBannerForm}>Cancel Edit</button>}
              </div>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.map((banner) => (
                <div key={banner.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-[180px] object-cover" />
                  <div className="p-5">
                    <p className="font-bold text-slate-900">{banner.title}</p>
                    <p className="text-xs text-slate-500 mb-3">{banner.subtitle || 'No subtitle'}</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold" onClick={() => handleEditBanner(banner)}>Edit</button>
                      <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold" onClick={() => deleteBanner(banner.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </section>
         )}

         {(activeTab === 'doctors' || activeTab === 'admins' || activeTab === 'users' || activeTab === 'announcements') && (
         <section className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden mb-12">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                     <Database size={18} className="text-blue-600" />
                     {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Database
                  </h4>
               </div>
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all">
                     <Download size={16} /> Export CSV
                  </button>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                     <Plus size={16} /> Create New
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto">
               {loading ? (
                 <div className="p-24 flex flex-col items-center justify-center text-slate-400">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="mb-4">
                       <RefreshCw size={40} />
                    </motion.div>
                    <p className="text-sm font-bold tracking-widest uppercase">Fetching Records...</p>
                 </div>
               ) : data.length === 0 ? (
                 <div className="p-24 flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm font-bold tracking-widest uppercase">No records found</p>
                 </div>
               ) : (
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                           <th className="px-10 py-6">ID</th>
                           <th className="px-10 py-6">Name / Detail</th>
                           <th className="px-10 py-6">Status / Contact</th>
                           <th className="px-10 py-6">Metadata</th>
                           <th className="px-10 py-6 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {data.map((row) => (
                           <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-10 py-6 text-slate-400 text-xs font-bold">#{row.id}</td>
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
                                       {row.name ? row.name.charAt(0) : 'U'}
                                    </div>
                                    <div>
                                       <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{row.name || row.title || row.user?.name || row.text || 'N/A'}</p>
                                       <p className="text-xs text-slate-400">{row.email || row.user?.email || row.type || 'No additional data'}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 {row.available !== undefined || row.isActive !== undefined ? (
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${row.available || row.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                       {row.available || row.isActive ? 'Active' : 'Offline'}
                                    </span>
                                 ) : (
                                    <p className="text-xs text-slate-600 font-medium">{row.phone || 'Registry record'}</p>
                                 )}
                              </td>
                              <td className="px-10 py-6">
                                 <p className="text-xs font-bold text-slate-400">{row.specialization?.name || row.role || 'Enterprise'}</p>
                                 <p className="text-[10px] text-slate-300 font-bold tracking-tighter uppercase">{row.joiningDate || 'MEMBER SINCE 2024'}</p>
                              </td>
                              <td className="px-10 py-6">
                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" onClick={() => handleQuickEdit(row)} disabled={actionLoadingId !== null}>
                                       <Edit3 size={16} />
                                    </button>
                                    {(activeTab === 'doctors' || activeTab === 'users' || activeTab === 'announcements') && (
                                      <button className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" onClick={() => handleToggleStatus(row)} disabled={actionLoadingId !== null}>
                                        <Activity size={16} />
                                      </button>
                                    )}
                                    <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" onClick={() => handleDeleteRow(row)} disabled={actionLoadingId !== null}>
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
         </section>
         )}

         {activeTab === 'settings' && (
         <section className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-10 mb-12">
            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
               <Settings size={18} className="text-blue-600" /> Platform Settings Control
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Site Name</p>
                <input className="w-full px-4 py-3 border border-slate-200 rounded-xl" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Support Email</p>
                <input className="w-full px-4 py-3 border border-slate-200 rounded-xl" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Support Phone</p>
                <input className="w-full px-4 py-3 border border-slate-200 rounded-xl" value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Maintenance Mode</p>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl" value={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.value })}>
                  <option value="false">Disabled</option>
                  <option value="true">Enabled</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Allow Doctor Registration</p>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl" value={settings.allowDoctorRegistration} onChange={(e) => setSettings({ ...settings, allowDoctorRegistration: e.target.value })}>
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
            <div className="mt-7">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm" onClick={saveSettings}>
                Save All Settings
              </button>
            </div>
         </section>
         )}

         {/* Announcements / Quick Notes Footer */}
         <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-10 rounded-[48px] text-white overflow-hidden relative shadow-2xl">
               <div className="absolute -right-12 -top-12 opacity-10 rotate-12"><Activity size={240} /></div>
               <h4 className="text-xl font-bold mb-6 font-outfit flex items-center gap-2">
                  <Activity className="text-blue-500" /> Advanced Diagnostics
               </h4>
               <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm">All system components are reporting optimal performance. Database latency is within acceptable limits (18ms average).</p>
               <button className="px-8 py-4 bg-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">System Report</button>
            </div>

            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
               <h4 className="text-xl font-bold mb-8 font-outfit flex items-center gap-2 text-slate-900">
                  <Bell className="text-orange-500" /> Pending Notifications
               </h4>
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-6 items-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group cursor-pointer hover:bg-white transition-all">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-amber-500 transition-colors shadow-sm">
                          <Info size={24} />
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 mb-0.5">Hardware verification pending</p>
                          <p className="text-xs text-slate-400">System alert generated for node #{i + 2341}</p>
                       </div>
                       <ChevronRight size={18} className="text-slate-200" />
                    </div>
                  ))}
               </div>
            </div>
         </section>
      </main>
    </div>
  );
};

export default AdminPanel;
