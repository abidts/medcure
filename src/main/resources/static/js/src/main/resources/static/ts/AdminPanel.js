import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, Settings, Trash2, Edit3, Plus, LayoutDashboard, Database, Shield, Activity, Info, LogOut, Bell, ChevronRight, Download, RefreshCw, ImageIcon, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { apiFetch } from './api';
const AdminPanel = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [settings, setSettings] = useState({
        siteName: 'Sehat24X7',
        supportEmail: '',
        supportPhone: '',
        maintenanceMode: 'false',
        allowDoctorRegistration: 'true'
    });
    const [editingBannerId, setEditingBannerId] = useState(null);
    const [quickEditModal, setQuickEditModal] = useState({ isOpen: false, row: null, value: '' });
    const [bannerForm, setBannerForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        titleColor: '#FFFFFF',
        subtitleColor: '#E2E8F0',
        descriptionColor: '#F8FAFC',
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
            const response = await apiFetch('/api/admin/dashboard/stats');
            if (!response.ok)
                throw new Error('Failed to fetch stats');
            const result = await response.json();
            setStats(result);
            setError(null);
        }
        catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to load dashboard statistics');
            setStats(null);
        }
    };
    const loadTabData = async (tab) => {
        if (tab === 'dashboard' || tab === 'settings') {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            let endpoint = '';
            switch (tab) {
                case 'doctors':
                    endpoint = '/api/admin/doctors';
                    break;
                case 'admins':
                    endpoint = '/api/admin/admins';
                    break;
                case 'users':
                    endpoint = '/api/admin/users';
                    break;
                case 'announcements':
                    endpoint = '/api/announcements/all';
                    break;
                case 'hero-banners':
                    endpoint = '/api/hero-banners/all';
                    break;
                default:
                    setLoading(false);
                    return;
            }
            const response = await apiFetch(endpoint);
            if (!response.ok)
                throw new Error(`Failed to fetch ${tab}`);
            const result = await response.json();
            setData(Array.isArray(result) ? result : []);
            setError(null);
        }
        catch (err) {
            console.error(`Error loading ${tab}:`, err);
            setError(`Failed to load ${tab}`);
            setData([]);
        }
        finally {
            setLoading(false);
        }
    };
    const loadSettings = async () => {
        try {
            const response = await apiFetch('/api/admin/settings');
            if (!response.ok)
                throw new Error('Failed to load settings');
            const result = await response.json();
            setSettings((prev) => ({ ...prev, ...result }));
        }
        catch (err) {
            setError('Failed to load settings');
        }
    };
    const saveSettings = async () => {
        try {
            const response = await apiFetch('/api/admin/settings', {
                method: 'POST',
                body: JSON.stringify(settings)
            });
            if (!response.ok)
                throw new Error('Failed to save settings');
            setError(null);
            alert('Settings saved successfully');
        }
        catch (err) {
            setError('Failed to save settings');
        }
    };
    const handleDeleteRow = async (row) => {
        const typeEndpointMap = {
            doctors: `/api/admin/doctors/${row.id}`,
            admins: `/api/admin/admins/${row.id}`,
            users: `/api/admin/users/${row.id}`,
            announcements: `/api/announcements/${row.id}`
        };
        const endpoint = typeEndpointMap[activeTab];
        if (!endpoint)
            return;
        if (!window.confirm('Are you sure you want to delete this record?'))
            return;
        setActionLoadingId(`delete-${row.id}`);
        try {
            const response = await apiFetch(endpoint, { method: 'DELETE' });
            if (!response.ok)
                throw new Error('Delete failed');
            await loadTabData(activeTab);
            if (activeTab !== 'announcements')
                await fetchStats();
        }
        catch (err) {
            setError('Failed to delete record');
        }
        finally {
            setActionLoadingId(null);
        }
    };
    const handleToggleStatus = async (row) => {
        const typeEndpointMap = {
            doctors: { endpoint: `/api/admin/doctors/${row.id}/toggle-availability`, method: 'POST' },
            users: { endpoint: `/api/admin/users/${row.id}/toggle-active`, method: 'POST' },
            announcements: { endpoint: `/api/announcements/${row.id}/${row.isActive ? 'deactivate' : 'activate'}`, method: 'POST' }
        };
        const cfg = typeEndpointMap[activeTab];
        if (!cfg)
            return;
        setActionLoadingId(`toggle-${row.id}`);
        try {
            const response = await apiFetch(cfg.endpoint, { method: cfg.method || 'POST' });
            if (!response.ok)
                throw new Error('Toggle failed');
            await loadTabData(activeTab);
            if (activeTab !== 'announcements')
                await fetchStats();
        }
        catch (err) {
            setError('Failed to update status');
        }
        finally {
            setActionLoadingId(null);
        }
    };
    const handleQuickEdit = (row) => {
        setQuickEditModal({
            isOpen: true,
            row,
            value: row.name || row.title || row.text || ''
        });
    };
    const saveQuickEdit = async () => {
        const { row, value } = quickEditModal;
        if (!value.trim())
            return;
        try {
            let endpoint = '';
            let payload = {};
            if (activeTab === 'doctors') {
                endpoint = `/api/admin/doctors/${row.id}`;
                payload = { ...row, name: value };
            }
            else if (activeTab === 'admins') {
                endpoint = `/api/admin/admins/${row.id}`;
                payload = { ...row, user: { ...row.user, name: value } };
            }
            else if (activeTab === 'users') {
                endpoint = `/api/admin/users/${row.id}`;
                payload = { ...row, name: value };
            }
            else if (activeTab === 'announcements') {
                endpoint = `/api/announcements/${row.id}`;
                payload = { ...row, text: value };
            }
            else {
                return;
            }
            const response = await apiFetch(endpoint, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            if (!response.ok)
                throw new Error('Update failed');
            await loadTabData(activeTab);
            setQuickEditModal({ isOpen: false, row: null, value: '' });
        }
        catch (err) {
            setError('Failed to update record');
        }
    };
    const cancelQuickEdit = () => {
        setQuickEditModal({ isOpen: false, row: null, value: '' });
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
            titleColor: '#FFFFFF',
            subtitleColor: '#E2E8F0',
            descriptionColor: '#F8FAFC',
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
    const handleEditBanner = (banner) => {
        setEditingBannerId(banner.id);
        setBannerForm({
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            titleColor: banner.titleColor || '#FFFFFF',
            subtitleColor: banner.subtitleColor || '#E2E8F0',
            descriptionColor: banner.descriptionColor || '#F8FAFC',
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
            const resp = await apiFetch(url, {
                method,
                body: JSON.stringify(bannerForm)
            });
            if (!resp.ok)
                throw new Error('Failed to save banner');
            resetBannerForm();
            loadTabData('hero-banners');
        }
        catch (err) {
            setError('Failed to save banner');
        }
    };
    const deleteBanner = async (id) => {
        if (!window.confirm('Delete this banner?'))
            return;
        try {
            const resp = await apiFetch(`/api/hero-banners/${id}`, { method: 'DELETE' });
            if (!resp.ok)
                throw new Error('Failed to delete banner');
            loadTabData('hero-banners');
        }
        catch (err) {
            setError('Failed to delete banner');
        }
    };
    return (_jsxs("div", { className: "admin-panel flex min-h-screen bg-[#F8FAFC] font-inter", children: [_jsx(AnimatePresence, { children: sidebarOpen && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 z-40 lg:hidden", onClick: () => setSidebarOpen(false) })) }), _jsxs("aside", { className: `
        fixed top-0 left-0 z-50 h-full bg-slate-950 text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 sm:w-72 lg:w-80
      `, children: [_jsxs("div", { className: "p-4 sm:p-6 lg:p-10", children: [_jsxs("div", { className: "flex items-center justify-between mb-8 lg:mb-12", children: [_jsxs("div", { className: "flex items-center gap-3 lg:gap-4", children: [_jsx("div", { className: "w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center", children: _jsx(Shield, { size: 20, className: "lg:size-24 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent", children: "Sehat24X7 Admin" }), _jsx("p", { className: "text-[8px] lg:text-[10px] text-blue-500 font-black uppercase tracking-widest hidden sm:block", children: "Enterprise v4.0" })] })] }), _jsx("button", { onClick: () => setSidebarOpen(false), className: "lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors", children: _jsx(X, { size: 20, className: "text-white" }) })] }), _jsx("nav", { className: "space-y-1 lg:space-y-2", children: menuItems.map((item) => (_jsxs("button", { onClick: () => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false); // Close sidebar on mobile after selection
                                    }, className: `w-full flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`, children: [_jsx(item.icon, { size: 18, className: "lg:size-20" }), _jsx("span", { className: "font-bold text-xs lg:text-sm tracking-wide", children: item.label }), activeTab === item.id && (_jsx(motion.div, { layoutId: "activeInd", className: "ml-auto w-1.5 h-1.5 bg-white rounded-full" }))] }, item.id))) })] }), _jsxs("div", { className: "mt-auto p-4 sm:p-6 lg:p-10 space-y-3 lg:space-y-4", children: [_jsxs("div", { className: "p-4 lg:p-6 bg-white/5 rounded-2xl lg:rounded-3xl border border-white/5", children: [_jsx("p", { className: "text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2", children: "Service Status" }), _jsxs("div", { className: "flex items-center gap-2 lg:gap-3", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-xs lg:text-xs font-bold text-slate-300 hidden sm:block", children: "API Gateway Online" }), _jsx("span", { className: "text-xs lg:text-xs font-bold text-slate-300 sm:hidden", children: "Online" })] })] }), _jsxs("button", { onClick: logout, className: "w-full flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl lg:rounded-2xl transition-all", children: [_jsx(LogOut, { size: 18, className: "lg:size-20" }), _jsx("span", { className: "font-bold text-xs lg:text-sm", children: "Sign Out" })] })] })] }), _jsxs("main", { className: "flex-1 lg:ml-80 min-h-screen", children: [_jsxs("header", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 lg:p-12 mb-6 sm:mb-12", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setSidebarOpen(true), className: "lg:hidden p-2 bg-white rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors", children: _jsx(Menu, { size: 20, className: "text-slate-600" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-outfit capitalize", children: activeTab.replace('-', ' ') }), _jsx("p", { className: "text-sm sm:text-base text-slate-500 hidden sm:block", children: "Welcome back, Super Admin. Everything is looking good." }), _jsx("p", { className: "text-xs text-slate-500 sm:hidden", children: "Welcome back, Super Admin" })] })] }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-4 w-full sm:w-auto", children: [_jsx("div", { className: "relative group flex-1 sm:flex-initial", children: _jsx("input", { type: "text", placeholder: "Global search...", className: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white border border-slate-100 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-100/50 w-full sm:w-48 lg:w-72 shadow-sm transition-all" }) }), _jsx("button", { className: "p-2 sm:p-3 bg-white text-slate-400 rounded-xl sm:rounded-2xl border border-slate-100 hover:text-blue-600 transition-all shadow-sm", children: _jsx(RefreshCw, { size: 16, className: "sm:size-20", onClick: fetchStats }) }), _jsxs("button", { onClick: logout, className: "hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl border border-red-100 hover:bg-red-100 transition-all font-bold text-xs sm:text-sm", children: [_jsx(LogOut, { size: 14, className: "sm:size-16" }), _jsx("span", { className: "hidden sm:block", children: "Logout" })] })] })] }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium", children: error })), activeTab === 'dashboard' && stats && (_jsxs("section", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4 sm:px-0", children: [_jsxs("div", { className: "bg-white p-4 sm:p-6 lg:p-8 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-b-4 border-b-blue-600", children: [_jsxs("div", { className: "flex justify-between items-start mb-4 sm:mb-6", children: [_jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", children: _jsx(UserCheck, { size: 18, className: "sm:size-24" }) }), _jsx("span", { className: "text-[10px] sm:text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg", children: "+12%" })] }), _jsx("h3", { className: "text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-1", children: stats.totalDoctors }), _jsx("p", { className: "text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Total Doctors" }), _jsx("div", { className: "absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 text-blue-50 group-hover:rotate-12 transition-transform duration-500 hidden sm:block", children: _jsx(UserCheck, { size: 40, className: "sm:size-80" }) })] }), _jsxs("div", { className: "bg-white p-4 sm:p-6 lg:p-8 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-b-4 border-b-emerald-600", children: [_jsxs("div", { className: "flex justify-between items-start mb-4 sm:mb-6", children: [_jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", children: _jsx(Users, { size: 18, className: "sm:size-24" }) }), _jsx("span", { className: "text-[10px] sm:text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg", children: "+5%" })] }), _jsx("h3", { className: "text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-1", children: stats.totalUsers }), _jsx("p", { className: "text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Active Patients" }), _jsx("div", { className: "absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 text-emerald-50 group-hover:rotate-12 transition-transform duration-500 hidden sm:block", children: _jsx(Users, { size: 40, className: "sm:size-80" }) })] }), _jsxs("div", { className: "bg-white p-4 sm:p-6 lg:p-8 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-b-4 border-b-purple-600", children: [_jsx("div", { className: "flex justify-between items-start mb-4 sm:mb-6", children: _jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 text-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", children: _jsx(Shield, { size: 18, className: "sm:size-24" }) }) }), _jsx("h3", { className: "text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-1", children: stats.totalAdmins }), _jsx("p", { className: "text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Staff Admins" }), _jsx("div", { className: "absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 text-purple-50 group-hover:rotate-12 transition-transform duration-500 hidden sm:block", children: _jsx(Shield, { size: 40, className: "sm:size-80" }) })] }), _jsxs("div", { className: "bg-white p-4 sm:p-6 lg:p-8 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all border-b-4 border-b-amber-600", children: [_jsx("div", { className: "flex justify-between items-start mb-4 sm:mb-6", children: _jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 text-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", children: _jsx(Activity, { size: 18, className: "sm:size-24" }) }) }), _jsx("h3", { className: "text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-1", children: stats.activeDoctors }), _jsx("p", { className: "text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Doctors Online" }), _jsx("div", { className: "absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 text-amber-50 group-hover:rotate-12 transition-transform duration-500 hidden sm:block", children: _jsx(Activity, { size: 40, className: "sm:size-80" }) })] })] })), activeTab === 'hero-banners' && (_jsxs("section", { className: "bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden mb-12", children: [_jsxs("div", { className: "p-10 border-b border-slate-50 bg-slate-50/30", children: [_jsxs("h4", { className: "font-bold text-slate-900 mb-6 flex items-center gap-2", children: [_jsx(ImageIcon, { size: 18, className: "text-blue-600" }), " Hero Banner Manager"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { className: "px-4 py-3 border border-slate-200 rounded-xl", placeholder: "Banner title", value: bannerForm.title, onChange: (e) => setBannerForm({ ...bannerForm, title: e.target.value }) }), _jsx("input", { className: "px-4 py-3 border border-slate-200 rounded-xl", placeholder: "Subtitle", value: bannerForm.subtitle, onChange: (e) => setBannerForm({ ...bannerForm, subtitle: e.target.value }) }), _jsx("input", { className: "px-4 py-3 border border-slate-200 rounded-xl md:col-span-2", placeholder: "Image URL", value: bannerForm.imageUrl, onChange: (e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value }) }), _jsx("textarea", { className: "px-4 py-3 border border-slate-200 rounded-xl md:col-span-2 resize-none h-[100px]", placeholder: "Description text over banner", value: bannerForm.description, onChange: (e) => setBannerForm({ ...bannerForm, description: e.target.value }) }), _jsxs("div", { className: "md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("label", { className: "flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl bg-white", children: [_jsx("span", { className: "text-xs font-bold text-slate-500 uppercase tracking-[0.14em]", children: "Title Color" }), _jsx("input", { type: "color", value: bannerForm.titleColor, onChange: (e) => setBannerForm({ ...bannerForm, titleColor: e.target.value }), className: "w-10 h-10 p-0 border-0 rounded-xl" })] }), _jsxs("label", { className: "flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl bg-white", children: [_jsx("span", { className: "text-xs font-bold text-slate-500 uppercase tracking-[0.14em]", children: "Subtitle Color" }), _jsx("input", { type: "color", value: bannerForm.subtitleColor, onChange: (e) => setBannerForm({ ...bannerForm, subtitleColor: e.target.value }), className: "w-10 h-10 p-0 border-0 rounded-xl" })] }), _jsxs("label", { className: "flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl bg-white", children: [_jsx("span", { className: "text-xs font-bold text-slate-500 uppercase tracking-[0.14em]", children: "Description Color" }), _jsx("input", { type: "color", value: bannerForm.descriptionColor, onChange: (e) => setBannerForm({ ...bannerForm, descriptionColor: e.target.value }), className: "w-10 h-10 p-0 border-0 rounded-xl" })] })] }), _jsxs("select", { className: "px-4 py-3 border border-slate-200 rounded-xl", value: bannerForm.imagePosition, onChange: (e) => setBannerForm({ ...bannerForm, imagePosition: e.target.value }), children: [_jsx("option", { value: "LEFT", children: "Image Left" }), _jsx("option", { value: "CENTER", children: "Image Center" }), _jsx("option", { value: "RIGHT", children: "Image Right" })] }), _jsx("input", { type: "number", className: "px-4 py-3 border border-slate-200 rounded-xl", placeholder: "Display order", value: bannerForm.displayOrder, onChange: (e) => setBannerForm({ ...bannerForm, displayOrder: Number(e.target.value) }) }), _jsx("input", { className: "px-4 py-3 border border-slate-200 rounded-xl", placeholder: "Primary link text", value: bannerForm.primaryLinkText, onChange: (e) => setBannerForm({ ...bannerForm, primaryLinkText: e.target.value }) }), _jsx("input", { className: "px-4 py-3 border border-slate-200 rounded-xl", placeholder: "Primary link URL", value: bannerForm.primaryLinkUrl, onChange: (e) => setBannerForm({ ...bannerForm, primaryLinkUrl: e.target.value }) }), _jsx("input", { className: "px-4 py-3 border border-slate-200 rounded-xl", placeholder: "Secondary link text", value: bannerForm.secondaryLinkText, onChange: (e) => setBannerForm({ ...bannerForm, secondaryLinkText: e.target.value }) }), _jsx("input", { className: "px-4 py-3 border border-slate-200 rounded-xl", placeholder: "Secondary link URL", value: bannerForm.secondaryLinkUrl, onChange: (e) => setBannerForm({ ...bannerForm, secondaryLinkUrl: e.target.value }) })] }), _jsxs("div", { className: "flex gap-3 mt-6", children: [_jsx("button", { className: "px-6 py-3 bg-blue-600 text-white rounded-xl", onClick: saveBanner, children: editingBannerId ? 'Update Banner' : 'Create Banner' }), editingBannerId && _jsx("button", { className: "px-6 py-3 bg-slate-100 rounded-xl", onClick: resetBannerForm, children: "Cancel Edit" })] })] }), _jsx("div", { className: "p-10 grid grid-cols-1 md:grid-cols-2 gap-6", children: data.map((banner) => (_jsxs("div", { className: "border border-slate-200 rounded-2xl overflow-hidden", children: [_jsx("img", { src: banner.imageUrl, alt: banner.title, className: "w-full h-[180px] object-cover" }), _jsxs("div", { className: "p-5", children: [_jsx("p", { className: "font-bold", style: { color: banner.titleColor || '#0F172A' }, children: banner.title }), _jsx("p", { className: "text-xs mb-1", style: { color: banner.subtitleColor || '#64748B' }, children: banner.subtitle || 'No subtitle' }), banner.description && (_jsx("p", { className: "text-xs mb-3", style: { color: banner.descriptionColor || '#64748B' }, children: banner.description })), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold", onClick: () => handleEditBanner(banner), children: "Edit" }), _jsx("button", { className: "px-4 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold", onClick: () => deleteBanner(banner.id), children: "Delete" })] })] })] }, banner.id))) })] })), (activeTab === 'doctors' || activeTab === 'admins' || activeTab === 'users' || activeTab === 'announcements') && (_jsxs("section", { className: "bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden mb-12", children: [_jsxs("div", { className: "p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30", children: [_jsx("div", { children: _jsxs("h4", { className: "font-bold text-slate-900 flex items-center gap-2", children: [_jsx(Database, { size: 18, className: "text-blue-600" }), activeTab.charAt(0).toUpperCase() + activeTab.slice(1), " Database"] }) }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("button", { className: "px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all", children: [_jsx(Download, { size: 16 }), " Export CSV"] }), _jsxs("button", { className: "px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100", children: [_jsx(Plus, { size: 16 }), " Create New"] })] })] }), _jsx("div", { className: "px-4 sm:px-0", children: loading ? (_jsxs("div", { className: "p-12 sm:p-24 flex flex-col items-center justify-center text-slate-400", children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { repeat: Infinity, duration: 1, ease: 'linear' }, className: "mb-4", children: _jsx(RefreshCw, { size: 30, className: "sm:size-40" }) }), _jsx("p", { className: "text-xs sm:text-sm font-bold tracking-widest uppercase", children: "Fetching Records..." })] })) : data.length === 0 ? (_jsx("div", { className: "p-12 sm:p-24 flex flex-col items-center justify-center text-slate-400", children: _jsx("p", { className: "text-xs sm:text-sm font-bold tracking-widest uppercase", children: "No records found" }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "hidden lg:block overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest", children: [_jsx("th", { className: "px-6 lg:px-10 py-6", children: "ID" }), _jsx("th", { className: "px-6 lg:px-10 py-6", children: "Name / Detail" }), _jsx("th", { className: "px-6 lg:px-10 py-6", children: "Status / Contact" }), _jsx("th", { className: "px-6 lg:px-10 py-6", children: "Metadata" }), _jsx("th", { className: "px-6 lg:px-10 py-6 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-50", children: data.map((row) => (_jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors group", children: [_jsxs("td", { className: "px-6 lg:px-10 py-6 text-slate-400 text-xs font-bold", children: ["#", row.id] }), _jsx("td", { className: "px-6 lg:px-10 py-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm", children: row.name ? row.name.charAt(0) : 'U' }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-slate-900 group-hover:text-blue-600 transition-colors", children: row.name || row.title || row.user?.name || row.text || 'N/A' }), _jsx("p", { className: "text-xs text-slate-400", children: row.email || row.user?.email || row.type || 'No additional data' })] })] }) }), _jsx("td", { className: "px-6 lg:px-10 py-6", children: row.available !== undefined || row.isActive !== undefined ? (_jsx("span", { className: `px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${row.available || row.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`, children: row.available || row.isActive ? 'Active' : 'Offline' })) : (_jsx("p", { className: "text-xs text-slate-600 font-medium", children: row.phone || 'Registry record' })) }), _jsxs("td", { className: "px-6 lg:px-10 py-6", children: [_jsx("p", { className: "text-xs font-bold text-slate-400", children: row.specialization?.name || row.role || 'Enterprise' }), _jsx("p", { className: "text-[10px] text-slate-300 font-bold tracking-tighter uppercase", children: row.joiningDate || 'MEMBER SINCE 2024' })] }), _jsx("td", { className: "px-6 lg:px-10 py-6", children: _jsxs("div", { className: "flex justify-end gap-2 opacity-100", children: [_jsx("button", { className: "p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all", onClick: () => handleQuickEdit(row), disabled: actionLoadingId !== null, children: _jsx(Edit3, { size: 16 }) }), (activeTab === 'doctors' || activeTab === 'users' || activeTab === 'announcements') && (_jsx("button", { className: "p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all", onClick: () => handleToggleStatus(row), disabled: actionLoadingId !== null, children: _jsx(Activity, { size: 16 }) })), _jsx("button", { className: "p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all", onClick: () => handleDeleteRow(row), disabled: actionLoadingId !== null, children: _jsx(Trash2, { size: 16 }) })] }) })] }, row.id))) })] }) }), _jsx("div", { className: "lg:hidden space-y-4", children: data.map((row) => (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm", children: row.name ? row.name.charAt(0) : 'U' }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-slate-900 text-sm", children: row.name || row.title || row.user?.name || row.text || 'N/A' }), _jsxs("p", { className: "text-xs text-slate-400", children: ["#", row.id] })] })] }), row.available !== undefined || row.isActive !== undefined ? (_jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.available || row.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`, children: row.available || row.isActive ? 'Active' : 'Offline' })) : null] }), _jsxs("div", { className: "space-y-2 mb-4", children: [row.email || row.user?.email ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase", children: "Email:" }), _jsx("span", { className: "text-xs text-slate-600", children: row.email || row.user?.email })] })) : null, row.phone ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase", children: "Phone:" }), _jsx("span", { className: "text-xs text-slate-600", children: row.phone })] })) : null, row.specialization?.name ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase", children: "Role:" }), _jsx("span", { className: "text-xs text-slate-600", children: row.specialization.name })] })) : null, row.role ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase", children: "Role:" }), _jsx("span", { className: "text-xs text-slate-600", children: row.role })] })) : null] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { className: "p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all", onClick: () => handleQuickEdit(row), disabled: actionLoadingId !== null, children: _jsx(Edit3, { size: 14 }) }), (activeTab === 'doctors' || activeTab === 'users' || activeTab === 'announcements') && (_jsx("button", { className: "p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all", onClick: () => handleToggleStatus(row), disabled: actionLoadingId !== null, children: _jsx(Activity, { size: 14 }) })), _jsx("button", { className: "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all", onClick: () => handleDeleteRow(row), disabled: actionLoadingId !== null, children: _jsx(Trash2, { size: 14 }) })] })] }, row.id))) })] })) })] })), activeTab === 'settings' && (_jsxs("section", { className: "bg-white rounded-[48px] border border-slate-100 shadow-sm p-10 mb-12", children: [_jsxs("h4", { className: "font-bold text-slate-900 mb-6 flex items-center gap-2", children: [_jsx(Settings, { size: 18, className: "text-blue-600" }), " Platform Settings Control"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-black uppercase tracking-widest text-slate-400 mb-2", children: "Site Name" }), _jsx("input", { className: "w-full px-4 py-3 border border-slate-200 rounded-xl", value: settings.siteName, onChange: (e) => setSettings({ ...settings, siteName: e.target.value }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black uppercase tracking-widest text-slate-400 mb-2", children: "Support Email" }), _jsx("input", { className: "w-full px-4 py-3 border border-slate-200 rounded-xl", value: settings.supportEmail, onChange: (e) => setSettings({ ...settings, supportEmail: e.target.value }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black uppercase tracking-widest text-slate-400 mb-2", children: "Support Phone" }), _jsx("input", { className: "w-full px-4 py-3 border border-slate-200 rounded-xl", value: settings.supportPhone, onChange: (e) => setSettings({ ...settings, supportPhone: e.target.value }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black uppercase tracking-widest text-slate-400 mb-2", children: "Maintenance Mode" }), _jsxs("select", { className: "w-full px-4 py-3 border border-slate-200 rounded-xl", value: settings.maintenanceMode, onChange: (e) => setSettings({ ...settings, maintenanceMode: e.target.value }), children: [_jsx("option", { value: "false", children: "Disabled" }), _jsx("option", { value: "true", children: "Enabled" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black uppercase tracking-widest text-slate-400 mb-2", children: "Allow Doctor Registration" }), _jsxs("select", { className: "w-full px-4 py-3 border border-slate-200 rounded-xl", value: settings.allowDoctorRegistration, onChange: (e) => setSettings({ ...settings, allowDoctorRegistration: e.target.value }), children: [_jsx("option", { value: "true", children: "Enabled" }), _jsx("option", { value: "false", children: "Disabled" })] })] })] }), _jsx("div", { className: "mt-7", children: _jsx("button", { className: "px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm", onClick: saveSettings, children: "Save All Settings" }) })] })), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-slate-900 p-10 rounded-[48px] text-white overflow-hidden relative shadow-2xl", children: [_jsx("div", { className: "absolute -right-12 -top-12 opacity-10 rotate-12", children: _jsx(Activity, { size: 240 }) }), _jsxs("h4", { className: "text-xl font-bold mb-6 font-outfit flex items-center gap-2", children: [_jsx(Activity, { className: "text-blue-500" }), " Advanced Diagnostics"] }), _jsx("p", { className: "text-slate-400 text-sm mb-8 leading-relaxed max-w-sm", children: "All system components are reporting optimal performance. Database latency is within acceptable limits (18ms average)." }), _jsx("button", { className: "px-8 py-4 bg-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20", children: "System Report" })] }), _jsxs("div", { className: "bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm", children: [_jsxs("h4", { className: "text-xl font-bold mb-8 font-outfit flex items-center gap-2 text-slate-900", children: [_jsx(Bell, { className: "text-orange-500" }), " Pending Notifications"] }), _jsx("div", { className: "space-y-4", children: [1, 2, 3].map(i => (_jsxs("div", { className: "flex gap-6 items-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group cursor-pointer hover:bg-white transition-all", children: [_jsx("div", { className: "w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-amber-500 transition-colors shadow-sm", children: _jsx(Info, { size: 24 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-bold text-slate-900 mb-0.5", children: "Hardware verification pending" }), _jsxs("p", { className: "text-xs text-slate-400", children: ["System alert generated for node #", i + 2341] })] }), _jsx(ChevronRight, { size: 18, className: "text-slate-200" })] }, i))) })] })] })] }), _jsx(AnimatePresence, { children: quickEditModal.isOpen && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", onClick: cancelQuickEdit, children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("h3", { className: "text-xl font-bold text-slate-900 mb-6", children: ["Edit ", activeTab === 'announcements' ? 'Announcement' : 'Name'] }), _jsx("input", { type: "text", value: quickEditModal.value, onChange: (e) => setQuickEditModal(prev => ({ ...prev, value: e.target.value })), className: "w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-6", placeholder: `Enter updated ${activeTab === 'announcements' ? 'announcement text' : 'name/title'}`, autoFocus: true }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx("button", { onClick: cancelQuickEdit, className: "px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all", children: "Cancel" }), _jsx("button", { onClick: saveQuickEdit, className: "px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all", children: "Save Changes" })] })] }) })) })] }));
};
export default AdminPanel;
//# sourceMappingURL=AdminPanel.js.map