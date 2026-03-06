'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Trophy,
  Users,
  Zap,
  Settings,
  Save,
  Bell,
  Shield,
  Palette,
  Globe,
  Crown,
  Sparkles,
  Star,
  Flame,
  Rocket,
  Thunderbolt,
  TrendingUp,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/org-admin', icon: <BarChart3 size={20} /> },
  { label: 'Leagues', href: '/org-admin/leagues', icon: <Trophy size={20} /> },
  { label: 'Matches', href: '/org-admin/matches', icon: <Zap size={20} /> },
  { label: 'Settings', href: '/org-admin/settings', icon: <Settings size={20} /> },
];

// Ultra performance themes
const performanceThemes = {
  excellent: {
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/50',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    icon: '🚀'
  },
  good: {
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    glow: 'shadow-blue-500/50',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    icon: '⚡'
  },
  average: {
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    icon: '⭐'
  },
  poor: {
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    glow: 'shadow-red-500/50',
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    icon: '💪'
  }
};

export default function OrgAdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useAppStore();

  // Settings state for organization
  const [settings, setSettings] = useState({
    notifications: {
      leagueUpdates: true,
      matchResults: true,
      adminRequests: false,
      systemAnnouncements: true,
    },
    organization: {
      publicProfile: true,
      allowSpectators: true,
      autoBackup: true,
      requireApproval: false,
    },
    display: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    // Show success message
    alert('Organization settings saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading organization settings...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="org-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="Organization Admin"
          headerTitle="Organization Settings"
          headerDescription="Configure your organization's settings and preferences"
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={handleSaveSettings}
              disabled={isSaving}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save Settings'}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={16} />
              </motion.div>
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Ultra Organization Overview Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative overflow-hidden"
            >
              {/* Dynamic Performance Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${performanceThemes.good.gradient} opacity-10 blur-3xl`}
              />

              <div className="relative glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Ultra Settings Logo */}
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-24 h-24 bg-gradient-to-br ${performanceThemes.good.gradient} rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl ${performanceThemes.good.glow} border border-white/20 overflow-hidden`}>
                      ⚙️
                    </div>

                    {/* Performance Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className={`absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r ${performanceThemes.good.gradient} text-white text-xs font-bold rounded-full shadow-lg ${performanceThemes.good.glow}`}
                    >
                      ⚡ Optimized
                    </motion.div>

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
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
                    >
                      <Sparkles size={12} className="text-yellow-900" />
                    </motion.div>
                  </motion.div>

                  {/* Organization Info */}
                  <div className="flex-1 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <motion.h2
                        className="text-4xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.02 }}
                      >
                        Organization Configuration
                      </motion.h2>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown className="w-8 h-8 text-yellow-400" />
                      </motion.div>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-300 text-lg"
                    >
                      Manage your organization's settings, notifications, and preferences with ultra precision
                    </motion.p>

                    {/* Status Badges */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-wrap gap-3"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${performanceThemes.good.gradient} text-white ${performanceThemes.good.glow}`}
                      >
                        <Shield className="w-4 h-4 inline mr-1" />
                        Ultra Dashboard
                      </motion.span>

                      <motion.span
                        whileHover={{ scale: 1.05, rotate: 10 }}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 shadow-lg shadow-yellow-400/50"
                      >
                        <Star className="w-4 h-4 inline mr-1" />
                        Premium Settings
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ultra Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Bell size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-xl font-bold">
                    Notification Preferences
                  </span>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="w-5 h-5 text-blue-400" />
                  </motion.div>
                </motion.div>
              </div>

              <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/10 backdrop-blur-xl">
                {[
                  {
                    key: 'leagueUpdates',
                    title: 'League Updates',
                    description: 'Notifications about new leagues and league changes',
                    icon: <Trophy size={20} className="text-blue-400" />,
                    gradient: 'from-blue-500 to-cyan-500'
                  },
                  {
                    key: 'matchResults',
                    title: 'Match Results',
                    description: 'Get notified when matches are completed',
                    icon: <Zap size={20} className="text-green-400" />,
                    gradient: 'from-green-500 to-emerald-500'
                  },
                  {
                    key: 'adminRequests',
                    title: 'Admin Requests',
                    description: 'Alerts when league admins request assistance',
                    icon: <Shield size={20} className="text-orange-400" />,
                    gradient: 'from-orange-500 to-red-500'
                  },
                  {
                    key: 'systemAnnouncements',
                    title: 'System Announcements',
                    description: 'Important system-wide announcements and updates',
                    icon: <Settings size={20} className="text-purple-400" />,
                    gradient: 'from-purple-500 to-pink-500'
                  }
                ].map((notification, index) => (
                  <motion.div
                    key={notification.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r ${notification.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {notification.icon}
                      </motion.div>
                      <div className="flex-1">
                        <motion.h4
                          className="font-semibold text-white mb-1"
                          whileHover={{ scale: 1.02 }}
                        >
                          {notification.title}
                        </motion.h4>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {notification.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Status Indicator */}
                      <motion.div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          settings.notifications[notification.key as keyof typeof settings.notifications]
                            ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {settings.notifications[notification.key as keyof typeof settings.notifications] ? (
                          <CheckCircle size={12} />
                        ) : (
                          <AlertTriangle size={12} />
                        )}
                        {settings.notifications[notification.key as keyof typeof settings.notifications] ? 'Enabled' : 'Disabled'}
                      </motion.div>

                      {/* Ultra Animated Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [notification.key]: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className={`w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r ${notification.gradient} shadow-lg`}></div>
                      </label>
                    </div>

                    {/* Notification Sparkle */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.8, 0.2]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                      className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ultra Organization Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent text-xl font-bold">
                    Organization Configuration
                  </span>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </motion.div>
              </div>

              <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/10 backdrop-blur-xl">
                {[
                  {
                    key: 'publicProfile',
                    title: 'Public Organization Profile',
                    description: 'Make organization information visible to the public',
                    icon: <Globe size={20} className="text-blue-400" />,
                    gradient: 'from-blue-500 to-cyan-500'
                  },
                  {
                    key: 'allowSpectators',
                    title: 'Allow Spectators',
                    description: 'Enable spectator mode for all organization matches',
                    icon: <Users size={20} className="text-green-400" />,
                    gradient: 'from-green-500 to-emerald-500'
                  },
                  {
                    key: 'autoBackup',
                    title: 'Auto Backup',
                    description: 'Automatically backup organization data daily',
                    icon: <Shield size={20} className="text-orange-400" />,
                    gradient: 'from-orange-500 to-red-500'
                  },
                  {
                    key: 'requireApproval',
                    title: 'Require Approval',
                    description: 'Require admin approval for new league registrations',
                    icon: <CheckCircle size={20} className="text-purple-400" />,
                    gradient: 'from-purple-500 to-pink-500'
                  }
                ].map((config, index) => (
                  <motion.div
                    key={config.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r ${config.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {config.icon}
                      </motion.div>
                      <div className="flex-1">
                        <motion.h4
                          className="font-semibold text-white mb-1"
                          whileHover={{ scale: 1.02 }}
                        >
                          {config.title}
                        </motion.h4>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Status Indicator */}
                      <motion.div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          settings.organization[config.key as keyof typeof settings.organization]
                            ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {settings.organization[config.key as keyof typeof settings.organization] ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Info size={12} />
                        )}
                        {settings.organization[config.key as keyof typeof settings.organization] ? 'Enabled' : 'Disabled'}
                      </motion.div>

                      {/* Ultra Animated Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.organization[config.key as keyof typeof settings.organization]}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            organization: { ...prev.organization, [config.key]: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className={`w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r ${config.gradient} shadow-lg`}></div>
                      </label>
                    </div>

                    {/* Configuration Sparkle */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.8, 0.2]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.4
                      }}
                      className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ultra Display Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Palette size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-xl font-bold">
                    Display & Preferences
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </motion.div>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      key: 'theme',
                      label: 'Theme',
                      icon: <Palette size={20} className="text-blue-400" />,
                      gradient: 'from-blue-500 to-cyan-500',
                      options: [
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'system', label: 'System' }
                      ]
                    },
                    {
                      key: 'language',
                      label: 'Language',
                      icon: <Globe size={20} className="text-green-400" />,
                      gradient: 'from-green-500 to-emerald-500',
                      options: [
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' },
                        { value: 'de', label: 'German' }
                      ]
                    },
                    {
                      key: 'timezone',
                      label: 'Timezone',
                      icon: <Calendar size={20} className="text-purple-400" />,
                      gradient: 'from-purple-500 to-pink-500',
                      options: [
                        { value: 'UTC', label: 'UTC' },
                        { value: 'EST', label: 'Eastern Time' },
                        { value: 'PST', label: 'Pacific Time' },
                        { value: 'GMT', label: 'Greenwich Mean Time' }
                      ]
                    }
                  ].map((setting, index) => (
                    <motion.div
                      key={setting.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="space-y-3 group"
                    >
                      <motion.div
                        className={`flex items-center gap-3 p-4 bg-gradient-to-r ${setting.gradient}/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div
                          className={`w-10 h-10 bg-gradient-to-r ${setting.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {setting.icon}
                        </motion.div>
                        <label className="block text-sm font-medium text-white flex-1">
                          {setting.label}
                        </label>
                      </motion.div>

                      <select
                        value={settings.display[setting.key as keyof typeof settings.display]}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          display: { ...prev.display, [setting.key]: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/20 outline-none text-white hover:bg-white/10 transition-all"
                      >
                        {setting.options.map(option => (
                          <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                            {option.label}
                          </option>
                        ))}
                      </select>

                      {/* Display Setting Sparkle */}
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.2, 0.8, 0.2]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                        className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
