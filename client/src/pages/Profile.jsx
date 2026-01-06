import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUserProfile, updateUserProfile, changePassword } from '../services/api';
import { User, Lock, Mail, Save, Key, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getUserProfile();
            setProfile(data);
            setUsername(data.username);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        setProfileMessage({ type: '', text: '' });

        try {
            const response = await updateUserProfile({ username });
            setProfile({ ...profile, username: response.user.username });

            // Update localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.username = response.user.username;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setProfileMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        setChangingPassword(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            await changePassword({ currentPassword, newPassword });
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-netflix-dark min-h-screen">
                <Navbar />
                <div className="h-24 md:h-32 text-white flex items-center justify-center">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="bg-netflix-dark min-h-screen pb-20">
            <Navbar />
            <div className="h-24 md:h-32"></div>

            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-netflix-red to-red-900 rounded-full flex items-center justify-center border-4 border-zinc-800 shadow-2xl relative z-10">
                            <User size={40} className="text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute inset-0 bg-netflix-red blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Account Settings</h1>
                        <p className="text-gray-400">Manage your profile and security</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Section */}
                    <div className="bg-zinc-900/50 p-6 md:p-8 rounded-xl border border-zinc-800 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-netflix-red/10 rounded-lg">
                                <User className="text-netflix-red" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Public Profile</h2>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Email Address</label>
                                <div className="flex items-center gap-3 bg-zinc-800/50 p-3 rounded text-gray-500 border border-zinc-800">
                                    <Mail size={18} />
                                    <span>{profile?.email}</span>
                                </div>
                                <p className="text-[10px] text-gray-600 mt-1 italic">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm block mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-zinc-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red/50 border border-zinc-700"
                                    required
                                />
                            </div>

                            {profileMessage.text && (
                                <div className={`flex items-center gap-2 text-sm p-3 rounded ${profileMessage.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                                    }`}>
                                    {profileMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    <span>{profileMessage.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={updatingProfile || username === profile?.username}
                                className="w-full flex items-center justify-center gap-2 bg-netflix-red hover:bg-red-700 text-white p-3 rounded font-bold transition disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                {updatingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Security Section */}
                    <div className="bg-zinc-900/50 p-6 md:p-8 rounded-xl border border-zinc-800 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-netflix-red/10 rounded-lg">
                                <Lock className="text-netflix-red" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Security Settings</h2>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="text-gray-300 text-sm block mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-zinc-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red/50 border border-zinc-700"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm block mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-zinc-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red/50 border border-zinc-700"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm block mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-zinc-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red/50 border border-zinc-700"
                                    required
                                />
                            </div>

                            {passwordMessage.text && (
                                <div className={`flex items-center gap-2 text-sm p-3 rounded ${passwordMessage.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                                    }`}>
                                    {passwordMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    <span>{passwordMessage.text}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={changingPassword || !currentPassword || !newPassword}
                                    className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 p-3 rounded font-bold transition disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg"
                                >
                                    <Key size={18} />
                                    {changingPassword ? 'Updating...' : 'Update Password'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-sm text-gray-400 hover:text-netflix-red transition text-center underline underline-offset-4"
                                >
                                    Forgot your current password?
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 bg-zinc-900/30 p-4 rounded text-center">
                    <p className="text-gray-500 text-xs">
                        Member since: {new Date(profile?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
