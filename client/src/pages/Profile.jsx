import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, changePassword, getMyList } from '../services/api';
import { User, Lock, Mail, Key, AlertCircle, CheckCircle, Calendar, Shield, CreditCard, ChevronRight, Film, Home, ArrowUpRight, Loader, LayoutGrid, List, Save } from 'lucide-react';

const Profile = () => {
    const { updateUser, user } = useAuth();
    const [profile, setProfile] = useState({ username: '', email: '', createdAt: '' });
    const [watchlistCount, setWatchlistCount] = useState(0);
    const [activeTab, setActiveTab] = useState('account');
    
    // Forms State
    const [usernameInput, setUsernameInput] = useState('');
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileData, watchlistData] = await Promise.all([
                    getUserProfile(),
                    getMyList()
                ]);
                
                setProfile(profileData);
                setUsernameInput(profileData.username);
                // Fix: Access the .watchlist property from the response
                setWatchlistCount(watchlistData?.watchlist?.length || 0);
            } catch (error) {
                console.error('Failed to load profile data:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await updateUserProfile({ username: usernameInput });
            setProfile({ ...profile, username: response.user.username });
            updateUser({ username: response.user.username });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await changePassword({ currentPassword: passwords.current, newPassword: passwords.new });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Date Formatter
    const getJoinDate = (dateString) => {
        if (!dateString) return 'Reader';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => { setActiveTab(id); setMessage({ type: '', text: '' }); }}
            className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 ${
                activeTab === id 
                ? 'border-netflix-red text-white bg-white/5' 
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    if (loading) {
         return (
            <div className="bg-black min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-netflix-red border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-netflix-dark text-white font-sans">
            <Navbar />
            
            {/* Hero Background */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900"></div>
                <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-20">
                
                {/* Main Profile Header Card */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-10 shadow-2xl flex flex-col md:flex-row items-center md:items-end gap-8">
                    
                    {/* Avatar Group */}
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-netflix-red to-purple-600 shadow-xl">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative border-4 border-black">
                                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
                                    {profile?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left mb-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{profile?.username}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-400 text-sm font-medium">
                            <span className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                <Mail size={14} className="text-netflix-red" /> {profile?.email}
                            </span>
                            <span className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                <Calendar size={14} className="text-netflix-red" /> Joined {getJoinDate(profile?.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Header Quick Actions (Like Headers: Home, MyList) */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <Link to="/" className="flex-1 md:flex-initial group">
                            <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                                <Home size={18} /> Home
                            </button>
                        </Link>
                        <Link to="/my-list" className="flex-1 md:flex-initial group">
                            <button className="w-full bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2">
                                <Film size={18} /> My List 
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-1">{watchlistCount}</span>
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar: Stats & Menu */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Watchlist Stat Card */}
                        <Link to="/my-list">
                            <div className="group bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 hover:border-netflix-red/50 transition-all cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                    <Film size={80} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-zinc-400 font-medium mb-1 flex items-center gap-2">
                                        Watchlist <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-netflix-red" />
                                    </h3>
                                    <p className="text-4xl font-bold text-white group-hover:text-netflix-red transition-colors">{watchlistCount}</p>
                                    <p className="text-xs text-zinc-500 mt-2">Movies saved for later</p>
                                </div>
                            </div>
                        </Link>

                        {/* Membership Card */}
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Shield size={14} /> Subscription
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-bold text-white text-lg">Free Plan</p>
                                    <p className="text-xs text-zinc-500">Ad-supported access</p>
                                </div>
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                                    ACTIVE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Forms */}
                    <div className="lg:col-span-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl min-h-[500px]">
                        
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-zinc-800 overflow-x-auto">
                            <TabButton id="account" label="Account Details" icon={LayoutGrid} />
                            <TabButton id="security" label="Security & Privacy" icon={Shield} />
                            <TabButton id="preferences" label="Preferences" icon={List} />
                        </div>

                         <div className="p-8 md:p-12">
                             
                            {/* Feedback Messages */}
                            {message.text && (
                                <div className={`mb-8 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    {message.text}
                                </div>
                            )}

                             {/* ACCOUNT TAB */}
                            {activeTab === 'account' && (
                                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Username</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        value={usernameInput}
                                                        onChange={(e) => setUsernameInput(e.target.value)}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-12 pr-4 text-white focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                                                    <input
                                                        type="email"
                                                        value={profile.email}
                                                        disabled
                                                        className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-lg py-3 pl-12 pr-4 text-zinc-400 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button 
                                                type="submit" 
                                                disabled={actionLoading || usernameInput === profile?.username}
                                                className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {actionLoading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            
                             {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-2xl font-bold mb-2">Password Management</h2>
                                    <p className="text-zinc-400 mb-8 text-sm">Ensure your account is secure by using a strong, unique password.</p>
                                    
                                    <form onSubmit={handleChangePassword} className="space-y-6 bg-zinc-950/30 p-8 rounded-xl border border-zinc-800/50">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Current Password</label>
                                            <div className="relative group">
                                                <Key className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                                                <input
                                                    type="password"
                                                    value={passwords.current}
                                                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-12 pr-4 text-white focus:border-netflix-red/50 focus:ring-1 focus:ring-netflix-red/50 outline-none transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">New Password</label>
                                                <div className="relative group">
                                                    <Key className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                                                    <input
                                                        type="password"
                                                        value={passwords.new}
                                                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-12 pr-4 text-white focus:border-netflix-red/50 focus:ring-1 focus:ring-netflix-red/50 outline-none transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Confirm New Password</label>
                                                <div className="relative group">
                                                    <Key className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                                                    <input
                                                        type="password"
                                                        value={passwords.confirm}
                                                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-12 pr-4 text-white focus:border-netflix-red/50 focus:ring-1 focus:ring-netflix-red/50 outline-none transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex justify-end">
                                            <button 
                                                type="submit" 
                                                disabled={actionLoading}
                                                className="bg-zinc-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {actionLoading ? <Loader className="animate-spin" size={18} /> : <Shield size={18} />}
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                             {/* PREFERENCES TAB (Placeholder) */}
                             {activeTab === 'preferences' && (
                                <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                                        <List size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Content Preferences</h3>
                                    <p className="text-zinc-500 max-w-sm mx-auto">
                                        Coming soon! You'll be able to customize your genres, language settings, and recommendation filters here.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
