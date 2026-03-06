'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Edit2,
  Save,
  X,
  Calendar,
  MapPin,
  Trophy,
  Palette,
  Globe,
  Upload,
  Camera,
  Sparkles,
  Zap,
  Star,
  Heart,
  Crown,
  Shield,
  Target,
  Award,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/club-admin', icon: <Users size={20} /> },
  { label: 'Team Profile', href: '/club-admin/profile', icon: <Users size={20} /> },
  { label: 'Players', href: '/club-admin/players', icon: <Users size={20} /> },
  { label: 'Matches', href: '/club-admin/matches', icon: <Users size={20} /> },
  { label: 'Statistics', href: '/club-admin/stats', icon: <Users size={20} /> },
  { label: 'Settings', href: '/club-admin/settings', icon: <Users size={20} /> },
];

// Ultra colorful team themes
const teamThemes = [
  {
    name: 'Royal Blue',
    primary: '#1e40af',
    secondary: '#60a5fa',
    accent: '#3b82f6',
    gradient: 'from-blue-600 via-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/50'
  },
  {
    name: 'Emerald Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    gradient: 'from-emerald-600 via-green-500 to-teal-600',
    glow: 'shadow-emerald-500/50'
  },
  {
    name: 'Crimson Red',
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#f87171',
    gradient: 'from-red-600 via-rose-500 to-pink-600',
    glow: 'shadow-red-500/50'
  },
  {
    name: 'Golden Yellow',
    primary: '#d97706',
    secondary: '#f59e0b',
    accent: '#fbbf24',
    gradient: 'from-yellow-600 via-amber-500 to-orange-600',
    glow: 'shadow-yellow-500/50'
  },
  {
    name: 'Purple Passion',
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#c084fc',
    gradient: 'from-purple-600 via-violet-500 to-fuchsia-600',
    glow: 'shadow-purple-500/50'
  },
  {
    name: 'Ocean Blue',
    primary: '#0891b2',
    secondary: '#06b6d4',
    accent: '#22d3ee',
    gradient: 'from-cyan-600 via-blue-500 to-teal-600',
    glow: 'shadow-cyan-500/50'
  }
];

export default function ClubAdminProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const { user, teams, updateTeam } = useAppStore();

  // Get the team that this club admin manages
  const userTeam = teams.find(team => {
    const clubAdminId = typeof team.clubAdmin === 'object' ? team.clubAdmin?._id : team.clubAdmin;
    return clubAdminId === user?._id;
  });

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    founded: new Date().getFullYear(),
    location: '',
    stadium: '',
    manager: '',
    website: '',
    colors: { primary: '#1e40af', secondary: '#60a5fa' },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
    },
  });

  // Get current theme
  const currentTheme = teamThemes.find(theme =>
    theme.primary === formData.colors.primary
  ) || teamThemes[0];

  useEffect(() => {
    if (userTeam) {
      setFormData({
        name: userTeam.name || '',
        logo: userTeam.logo || '',
        founded: userTeam.founded || new Date().getFullYear(),
        location: userTeam.location || '',
        stadium: userTeam.stadium || '',
        manager: userTeam.manager || '',
        website: userTeam.website || '',
        colors: userTeam.colors || { primary: '#1e40af', secondary: '#60a5fa' },
        socialMedia: {
          facebook: userTeam.socialMedia?.facebook || '',
          twitter: userTeam.socialMedia?.twitter || '',
          instagram: userTeam.socialMedia?.instagram || '',
        },
      });
    }
    setIsLoading(false);
  }, [userTeam]);

  const handleSave = async () => {
    if (!userTeam) return;

    setIsSaving(true);
    try {
      await updateTeam(userTeam._id!, formData);
      setIsEditing(false);
    } catch (error: any) {
      alert(`Failed to update team profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userTeam) {
      setFormData({
        name: userTeam.name || '',
        logo: userTeam.logo || '',
        founded: userTeam.founded || new Date().getFullYear(),
        location: userTeam.location || '',
        stadium: userTeam.stadium || '',
        manager: userTeam.manager || '',
        website: userTeam.website || '',
        colors: userTeam.colors || { primary: '#1e40af', secondary: '#60a5fa' },
        socialMedia: {
          facebook: userTeam.socialMedia?.facebook || '',
          twitter: userTeam.socialMedia?.twitter || '',
          instagram: userTeam.socialMedia?.instagram || '',
        },
      });
    }
    setIsEditing(false);
  };

  const applyTheme = (theme: typeof teamThemes[0]) => {
    setFormData(prev => ({
      ...prev,
      colors: { primary: theme.primary, secondary: theme.secondary }
    }));
    setShowThemePicker(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-pink-500 border-purple-500/30 rounded-full mx-auto mb-6"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
          >
            Loading Team Profile...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!userTeam) {
    return (
      <ProtectedRoute requiredRole="club-admin">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass-card p-8 rounded-3xl max-w-md mx-4 border border-white/10"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Team Not Assigned
            </h2>
            <p className="text-gray-300 mb-6">
              You haven't been assigned to manage a team yet. Please contact your league administrator.
            </p>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="club-admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <GradientBackground />

        <DashboardLayout
          title="Club Admin"
          headerTitle="Team Profile"
          headerDescription="Showcase your team's identity with ultra stylish design"
          navItems={navItems}
          headerActions={
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <motion.button
                    onClick={() => setShowThemePicker(true)}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition-all"
                  >
                    <Palette size={20} />
                    Change Theme
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all"
                  >
                    <Edit2 size={20} />
                    Edit Profile
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={handleCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-semibold shadow-lg transition-all"
                  >
                    <X size={20} />
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    disabled={isSaving}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </>
              )}
            </div>
          }
        >
          <div className="space-y-8">
            {/* Ultra Stylish Team Hero Header */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative overflow-hidden"
            >
              {/* Dynamic Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-20 blur-3xl`}
              />

              <div className="relative glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Ultra Stylish Team Logo */}
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-32 h-32 bg-gradient-to-br ${currentTheme.gradient} rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl ${currentTheme.glow} border border-white/20 overflow-hidden`}>
                      {formData.logo ? (
                        <motion.img
                          src={formData.logo}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <motion.span
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {formData.name.charAt(0)}
                        </motion.span>
                      )}
                    </div>

                    {/* Animated Sparkles */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Sparkles size={16} className="text-yellow-900" />
                    </motion.div>

                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-pink-500/50"
                      >
                        <Camera size={18} />
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Team Info */}
                  <div className="flex-1 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      {isEditing ? (
                        <motion.input
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="text-4xl font-bold bg-transparent border-b-2 border-pink-400 focus:border-purple-400 focus:outline-none text-white placeholder-gray-400"
                          placeholder="Team Name"
                        />
                      ) : (
                        <motion.h1
                          className="text-4xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent"
                          whileHover={{ scale: 1.02 }}
                        >
                          {formData.name}
                        </motion.h1>
                      )}
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown className="w-8 h-8 text-yellow-400" />
                      </motion.div>
                    </motion.div>

                    {/* Team Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap items-center gap-6 text-gray-300"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                      >
                        <Calendar size={18} className="text-pink-400" />
                        <span className="font-medium">
                          Founded {isEditing ? (
                            <motion.input
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              type="number"
                              value={formData.founded}
                              onChange={(e) => setFormData(prev => ({ ...prev, founded: parseInt(e.target.value) }))}
                              min="1800"
                              max={new Date().getFullYear()}
                              className="w-20 bg-transparent border-b border-pink-400 focus:border-purple-400 focus:outline-none text-center"
                            />
                          ) : (
                            formData.founded
                          )}
                        </span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                      >
                        <MapPin size={18} className="text-blue-400" />
                        <span className="font-medium">
                          {isEditing ? (
                            <motion.input
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              type="text"
                              value={formData.location}
                              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="City, Country"
                              className="bg-transparent border-b border-blue-400 focus:border-cyan-400 focus:outline-none"
                            />
                          ) : (
                            formData.location || 'Location TBD'
                          )}
                        </span>
                      </motion.div>
                    </motion.div>

                    {/* Status Badges */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-wrap gap-3"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                          userTeam.status === 'active'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/50'
                            : userTeam.status === 'inactive'
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/50'
                              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/50'
                        }`}
                      >
                        {userTeam.status.charAt(0).toUpperCase() + userTeam.status.slice(1)}
                      </motion.span>

                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${currentTheme.gradient} text-white ${currentTheme.glow}`}
                      >
                        <Shield className="w-4 h-4 inline mr-1" />
                        Club Admin
                      </motion.span>

                      <motion.span
                        whileHover={{ scale: 1.05, rotate: 10 }}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 shadow-lg shadow-yellow-400/50"
                      >
                        <Star className="w-4 h-4 inline mr-1" />
                        Ultra Styled
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ultra Stylish Basic Information Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
              >
                <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <motion.h3
                    className="text-xl font-bold mb-6 flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.gradient} rounded-xl flex items-center justify-center shadow-lg ${currentTheme.glow}`}>
                      <Users className="text-white" size={20} />
                    </div>
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Basic Information
                    </span>
                  </motion.h3>

                  <div className="space-y-6">
                    {/* Logo Upload */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Upload size={16} className="text-pink-400" />
                        Team Logo URL
                      </label>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="url"
                          value={formData.logo}
                          onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.gradient} rounded-lg flex items-center justify-center`}>
                            <Upload size={18} className="text-white" />
                          </div>
                          <span className="text-sm text-gray-300">
                            {formData.logo ? 'Logo uploaded successfully' : 'No logo uploaded'}
                          </span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Stadium */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Target size={16} className="text-blue-400" />
                        Home Stadium
                      </label>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="text"
                          value={formData.stadium}
                          onChange={(e) => setFormData(prev => ({ ...prev, stadium: e.target.value }))}
                          placeholder="Stadium Name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      ) : (
                        <motion.p
                          className="text-white font-medium p-3 bg-white/5 rounded-xl border border-white/10"
                          whileHover={{ scale: 1.01 }}
                        >
                          {formData.stadium || 'Not specified'}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Manager */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Crown size={16} className="text-yellow-400" />
                        Team Manager
                      </label>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="text"
                          value={formData.manager}
                          onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                          placeholder="Manager Name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      ) : (
                        <motion.p
                          className="text-white font-medium p-3 bg-white/5 rounded-xl border border-white/10"
                          whileHover={{ scale: 1.01 }}
                        >
                          {formData.manager || 'Not specified'}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Website */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Globe size={16} className="text-green-400" />
                        Official Website
                      </label>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://teamwebsite.com"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      ) : (
                        formData.website ? (
                          <motion.a
                            href={formData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-green-400 hover:text-green-300 underline font-medium p-3 bg-white/5 rounded-xl border border-white/10"
                            whileHover={{ scale: 1.01 }}
                          >
                            {formData.website}
                          </motion.a>
                        ) : (
                          <motion.p
                            className="text-gray-400 p-3 bg-white/5 rounded-xl border border-white/10"
                            whileHover={{ scale: 1.01 }}
                          >
                            Not specified
                          </motion.p>
                        )
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Ultra Stylish Branding & Social Media */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Team Colors */}
                <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <motion.h3
                    className="text-xl font-bold mb-6 flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.gradient} rounded-xl flex items-center justify-center shadow-lg ${currentTheme.glow}`}>
                      <Palette className="text-white" size={20} />
                    </div>
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Team Colors
                    </span>
                  </motion.h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Primary Color
                        </label>
                        <div className="flex gap-2">
                          {isEditing ? (
                            <motion.input
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              type="color"
                              value={formData.colors.primary}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                colors: { ...prev.colors, primary: e.target.value }
                              }))}
                              className="w-12 h-12 border-2 border-white/20 rounded-xl cursor-pointer shadow-lg"
                            />
                          ) : (
                            <div
                              className="w-12 h-12 border-2 border-white/20 rounded-xl shadow-lg"
                              style={{ backgroundColor: formData.colors.primary }}
                            />
                          )}
                          {isEditing ? (
                            <motion.input
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              type="text"
                              value={formData.colors.primary}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                colors: { ...prev.colors, primary: e.target.value }
                              }))}
                              placeholder="#1e40af"
                              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none text-white placeholder-gray-400 font-mono text-sm backdrop-blur-sm"
                            />
                          ) : (
                            <span className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center font-mono text-sm text-white">
                              {formData.colors.primary}
                            </span>
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex gap-2">
                          {isEditing ? (
                            <motion.input
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              type="color"
                              value={formData.colors.secondary}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                colors: { ...prev.colors, secondary: e.target.value }
                              }))}
                              className="w-12 h-12 border-2 border-white/20 rounded-xl cursor-pointer shadow-lg"
                            />
                          ) : (
                            <div
                              className="w-12 h-12 border-2 border-white/20 rounded-xl shadow-lg"
                              style={{ backgroundColor: formData.colors.secondary }}
                            />
                          )}
                          {isEditing ? (
                            <motion.input
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              type="text"
                              value={formData.colors.secondary}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                colors: { ...prev.colors, secondary: e.target.value }
                              }))}
                              placeholder="#60a5fa"
                              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none text-white placeholder-gray-400 font-mono text-sm backdrop-blur-sm"
                            />
                          ) : (
                            <span className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center font-mono text-sm text-white">
                              {formData.colors.secondary}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Ultra Stylish Color Preview */}
                    <motion.div
                      className="space-y-2"
                      whileHover={{ scale: 1.01 }}
                    >
                      <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-400" />
                        Live Preview
                      </label>
                      <motion.div
                        className="w-full h-20 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${formData.colors.primary} 0%, ${formData.colors.secondary} 100%)`,
                        }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-full h-full bg-gradient-to-r from-white/20 to-transparent" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <motion.h3
                    className="text-xl font-bold mb-6 flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.gradient} rounded-xl flex items-center justify-center shadow-lg ${currentTheme.glow}`}>
                      <Globe className="text-white" size={20} />
                    </div>
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Social Media
                    </span>
                  </motion.h3>

                  <div className="space-y-4">
                    {/* Facebook */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Facebook size={16} className="text-blue-400" />
                        Facebook
                      </label>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          type="url"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                          }))}
                          placeholder="https://facebook.com/team"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      ) : (
                        formData.socialMedia.facebook ? (
                          <motion.a
                            href={formData.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-blue-400 hover:text-blue-300 underline font-medium p-3 bg-white/5 rounded-xl border border-white/10"
                            whileHover={{ scale: 1.01, x: 2 }}
                          >
                            <Facebook size={18} />
                            {formData.socialMedia.facebook}
                          </motion.a>
                        ) : (
                          <motion.div
                            className="flex items-center gap-3 text-gray-400 p-3 bg-white/5 rounded-xl border border-white/10"
                            whileHover={{ scale: 1.01 }}
                          >
                            <Facebook size={18} />
                            Not specified
                          </motion.div>
                        )
                      )}
                    </motion.div>

                    {/* Twitter */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Twitter size={16} className="text-sky-400" />
                        Twitter
                      </label>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          type="url"
                          value={formData.socialMedia.twitter}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                          }))}
                          placeholder="https://twitter.com/team"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      ) : (
                        formData.socialMedia.twitter ? (
                          <motion.a
                            href={formData.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sky-400 hover:text-sky-300 underline font-medium p-3 bg-white/5 rounded-xl border border-white/10"
                            whileHover={{ scale: 1.01, x: 2 }}
                          >
                            <Twitter size={18} />
                            {formData.socialMedia.twitter}
                          </motion.a>
                        ) : (
                          <motion.div
                            className="flex items-center gap-3 text-gray-400 p-3 bg-white/5 rounded-xl border border-white/10"
                            whileHover={{ scale: 1.01 }}
                          >
                            <Twitter size={18} />
                            Not specified
                          </motion.div>
                        )
                      )}
                    </motion.div>

                    {/* Instagram */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Instagram size={16} className="text-pink-400" />
                        Instagram
                      </label>
                      {isEditing ? (
                        <motion.input
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          type="url"
                          value={formData.socialMedia.instagram}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                          }))}
                          placeholder="https://instagram.com/team"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                      ) : (
                        formData.socialMedia.instagram ? (
                          <motion.a
                            href={formData.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-pink-400 hover:text-pink-300 underline font-medium p-3 bg-white/5 rounded-xl border border-white/10"
                            whileHover={{ scale: 1.01, x: 2 }}
                          >
                            <Instagram size={18} />
                            {formData.socialMedia.instagram}
                          </motion.a>
                        ) : (
                          <motion.div
                            className="flex items-center gap-3 text-gray-400 p-3 bg-white/5 rounded-xl border border-white/10"
                            whileHover={{ scale: 1.01 }}
                          >
                            <Instagram size={18} />
                            Not specified
                          </motion.div>
                        )
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </DashboardLayout>

        {/* Ultra Stylish Theme Picker Modal */}
        <AnimatePresence>
          {showThemePicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowThemePicker(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-card p-8 rounded-3xl border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.h2
                  className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  Choose Your Ultra Theme
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamThemes.map((theme, index) => (
                    <motion.button
                      key={theme.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => applyTheme(theme)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        currentTheme.name === theme.name
                          ? 'border-white shadow-2xl shadow-white/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg shadow-lg"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <span className="font-semibold text-white">{theme.name}</span>
                        </div>
                        <div
                          className={`w-full h-12 rounded-xl shadow-lg bg-gradient-to-r ${theme.gradient}`}
                        />
                        <div className="flex gap-2">
                          <div
                            className="w-6 h-6 rounded-md shadow-sm"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-md shadow-sm"
                            style={{ backgroundColor: theme.secondary }}
                          />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowThemePicker(false)}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-gray-500/50 transition-all"
                >
                  Close Theme Picker
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
