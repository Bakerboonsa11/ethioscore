'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Trophy, TrendingUp, Settings, Plus, UserCheck } from 'lucide-react';
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
    icon: <Users size={20} />,
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
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <StatCard
                key={i}
                {...stat}
                delay={i * 0.1}
              />
            ))}
          </motion.div>

          {/* Chart and Table Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 glass-card p-6 rounded-xl"
            >
              <h3 className="text-lg font-bold mb-6">Platform Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 74, 107, 0.2)" />
                  <XAxis stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 42, 71, 0.9)',
                      border: '1px solid rgba(45, 74, 107, 0.5)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#f5f5f5' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="organizations"
                    stroke="#0b5d3b"
                    strokeWidth={2}
                    dot={{ fill: '#0b5d3b' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leagues"
                    stroke="#1a8b5e"
                    strokeWidth={2}
                    dot={{ fill: '#1a8b5e' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="matches"
                    stroke="#f2c94c"
                    strokeWidth={2}
                    dot={{ fill: '#f2c94c' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 rounded-xl"
            >
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Revenue', value: '$45,800', change: '+12%' },
                  { label: 'Conversion', value: '8.2%', change: '+2.1%' },
                  { label: 'Engagement', value: '94%', change: '+5.3%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{item.value}</p>
                      <p className="text-xs text-green-400">{item.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Organizations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Organizations</h3>
              <a href="#" className="text-accent hover:underline text-sm font-semibold">
                View All
              </a>
            </div>
            <DataTable columns={orgColumns} data={organizations} />
          </motion.div>
        </div>
      </DashboardLayout>
    </div>
    </ProtectedRoute>
  );
}
