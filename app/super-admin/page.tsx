'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Trophy, TrendingUp, Settings, Plus, UserCheck, Crown, Sparkles, Star, Flame, Rocket, Thunderbolt, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable } from '@/components/dashboard/data-table';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { mockOrganizations, mockChartData } from '@/lib/mock-data';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const navItems = [
  { label: 'Overview', href: '/super-admin', icon: <BarChart3 size={20} /> },
  {
    label: 'Organizations',
    href: '/super-admin/organizations',
    icon: <Building size={20} />,
  },
  {
    label: 'Users',
    href: '/super-admin/users',
    icon: <UserCheck size={20} />,
  },
  {
    label: 'Settings',
    href: '/super-admin/settings',
    icon: <Settings size={20} />,
  },
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

export default function SuperAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { organizations, setOrganizations } = useAppStore();

  useEffect(() => {
    setOrganizations(mockOrganizations);
    setIsLoading(false);
  }, [setOrganizations]);

  const stats = [
    {
      title: 'Total Organizations',
      value: organizations.length,
      icon: '🏢',
      trend: { value: 12, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Active Leagues',
      value: '42',
      icon: '🏆',
      trend: { value: 8, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Total Matches',
      value: '1,247',
      icon: '⚽',
      trend: { value: 23, isPositive: true },
      color: 'gold' as const,
    },
    {
      title: 'Active Users',
      value: '892',
      icon: '👥',
      trend: { value: 5, isPositive: false },
      color: 'red' as const,
    },
  ];

  const orgColumns = [
    { key: 'name', label: 'Organization Name', sortable: true },
    { key: 'country', label: 'Country', sortable: true },
    { 
      key: 'leaguesCount', 
      label: 'Leagues',
      render: (value: number) => (
        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            value === 'active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="super-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="EthioScore"
          headerTitle="Dashboard"
          headerDescription="Global platform overview"
          navItems={navItems}
          headerActions={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus size={20} />
              New Organization
            </motion.button>
          }
        >
        <div className="space-y-8">
          {/* Ultra Super Admin Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'Total Organizations',
                value: organizations.length.toString(),
                icon: '🏢',
                trend: { value: 12, isPositive: true },
                gradient: 'from-blue-500 to-cyan-500',
                glow: 'shadow-blue-500/50'
              },
              {
                title: 'Active Leagues',
                value: '42',
                icon: '🏆',
                trend: { value: 8, isPositive: true },
                gradient: 'from-yellow-500 to-orange-500',
                glow: 'shadow-yellow-500/50'
              },
              {
                title: 'Total Matches',
                value: '1,247',
                icon: '⚽',
                trend: { value: 23, isPositive: true },
                gradient: 'from-green-500 to-emerald-500',
                glow: 'shadow-green-500/50'
              },
              {
                title: 'Active Users',
                value: '892',
                icon: '👥',
                trend: { value: 5, isPositive: false },
                gradient: 'from-purple-500 to-pink-500',
                glow: 'shadow-purple-500/50'
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl relative overflow-hidden group ${stat.glow} hover:${stat.glow}`}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>

                  <motion.h3
                    className="text-3xl font-bold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    {stat.value}
                  </motion.h3>

                  <p className="text-gray-400 text-sm mb-2">{stat.title}</p>

                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.02 }}
                  >
                    <TrendingUp size={12} className={stat.trend.isPositive ? "text-green-400" : "text-red-400"} />
                    <span className={`text-xs font-medium ${stat.trend.isPositive ? "text-green-400" : "text-red-400"}`}>
                      {stat.trend.isPositive ? '+' : ''}{stat.trend.value}
                    </span>
                  </motion.div>
                </div>

                {/* Animated Sparkles */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Chart and Table Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ultra Platform Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent text-xl font-bold">
                    Platform Growth
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-5 h-5 text-green-400" />
                  </motion.div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <Eye size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">Last 30 days</span>
                </motion.div>
              </div>

              <div className="relative">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                      }}
                      labelStyle={{ color: '#f1f5f9' }}
                      itemStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend
                      wrapperStyle={{ color: '#94a3b8' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="organizations"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="leagues"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2, fill: '#ffffff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="matches"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Chart Sparkle Effects */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 1
                  }}
                  className="absolute top-6 right-6 w-3 h-3 bg-green-400 rounded-full shadow-lg"
                />

                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 2
                  }}
                  className="absolute bottom-6 left-6 w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                />
              </div>
            </motion.div>

            {/* Ultra Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-xl font-bold">
                    Quick Stats
                  </span>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Crown className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </motion.div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Revenue', value: '$45,800', change: '+12%', icon: '💰', gradient: 'from-green-500 to-emerald-500' },
                  { label: 'Conversion', value: '8.2%', change: '+2.1%', icon: '📈', gradient: 'from-blue-500 to-cyan-500' },
                  { label: 'Engagement', value: '94%', change: '+5.3%', icon: '🎯', gradient: 'from-purple-500 to-pink-500' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        className={`w-10 h-10 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span className="text-lg">{item.icon}</span>
                      </motion.div>

                      <div className="flex-1">
                        <motion.p
                          className="font-medium text-white mb-1"
                          whileHover={{ scale: 1.02 }}
                        >
                          {item.label}
                        </motion.p>
                        <div className="flex items-center gap-2">
                          <motion.span
                            className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                          >
                            {item.value}
                          </motion.span>
                          <motion.span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item.change.startsWith('+')
                                ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                                : 'bg-red-500/20 text-red-400 border border-red-400/30'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {item.change}
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Sparkle */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.8, 0.2]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Ultra Organizations Table */}
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users size={20} className="text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-xl font-bold">
                  Organizations
                </span>
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Rocket className="w-5 h-5 text-blue-400" />
                </motion.div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-accent hover:text-accent/80 font-semibold text-sm flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                View All
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
              <DataTable columns={orgColumns} data={organizations} />
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </div>
    </ProtectedRoute>
  );
}
