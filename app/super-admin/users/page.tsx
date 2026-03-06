'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Trophy, TrendingUp, Settings, Plus, CheckCircle, XCircle, Edit, Trash2, Eye, Mail, Phone, Building, Crown, Sparkles, Star, Flame, Rocket, Thunderbolt, Search, Filter, UserCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable } from '@/components/dashboard/data-table';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import type { IUser as User } from '@/lib/models/User';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    email: '',
    role: '',
    phone: '',
    organization: '',
  });
  const { users, organizations, fetchUsers } = useAppStore();

  useEffect(() => {
    fetchUsers().finally(() => setIsLoading(false));
  }, [fetchUsers]);

  const adminCount = users.filter(user => user.role === 'super-admin').length;
  const orgAdminCount = users.filter(user => user.role === 'org-admin').length;
  const totalCount = users.length;

  const stats = [
    {
      title: 'Total Users',
      value: totalCount,
      icon: '👥',
      trend: { value: 15, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Super Admins',
      value: adminCount,
      icon: '👑',
      trend: { value: 1, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Org Admins',
      value: orgAdminCount,
      icon: '🏢',
      trend: { value: 12, isPositive: true },
      color: 'gold' as const,
    },
    {
      title: 'Active Users',
      value: users.filter(user => user.organization).length,
      icon: '✅',
      trend: { value: 8, isPositive: true },
      color: 'red' as const,
    },
  ];

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      organization: user.organization?.id?.toString() || user.organization?._id?.toString() || '',
    });
    setEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    setActionLoading(selectedUser._id.toString());
    try {
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        await fetchUsers();
        setEditModalOpen(false);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(selectedUser._id.toString());
    try {
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchUsers();
        setDeleteModalOpen(false);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
            <Mail size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <Badge
          variant={value === 'super-admin' ? 'default' : 'secondary'}
          className={
            value === 'super-admin'
              ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
              : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
          }
        >
          {value === 'super-admin' ? 'Super Admin' : 'Org Admin'}
        </Badge>
      ),
    },
    {
      key: 'organization',
      label: 'Organization',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <Building size={16} className="text-accent" />
          <span className="font-medium">{value?.name || 'None'}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-muted-foreground" />
          <span>{value || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(row)}
            disabled={actionLoading === (row._id?.toString() || row.id)}
            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            <Edit size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(row)}
            disabled={actionLoading === (row._id?.toString() || row.id)}
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            {actionLoading === (row._id?.toString() || row.id) ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GradientBackground />

      <DashboardLayout
        title="EthioScore"
        headerTitle="Users Management"
        headerDescription="Manage all system users and their permissions"
        navItems={navItems}
        headerActions={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Add User
          </motion.button>
        }
      >
        <div className="space-y-8">
          {/* Ultra User Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'Total Users',
                value: totalCount.toString(),
                icon: '👥',
                trend: { value: 15, isPositive: true },
                gradient: 'from-blue-500 to-cyan-500',
                glow: 'shadow-blue-500/50'
              },
              {
                title: 'Super Admins',
                value: adminCount.toString(),
                icon: '👑',
                trend: { value: 1, isPositive: true },
                gradient: 'from-purple-500 to-pink-500',
                glow: 'shadow-purple-500/50'
              },
              {
                title: 'Org Admins',
                value: orgAdminCount.toString(),
                icon: '🏢',
                trend: { value: 12, isPositive: true },
                gradient: 'from-green-500 to-emerald-500',
                glow: 'shadow-green-500/50'
              },
              {
                title: 'Active Users',
                value: users.filter(user => user.organization).length.toString(),
                icon: '✅',
                trend: { value: 8, isPositive: true },
                gradient: 'from-yellow-500 to-orange-500',
                glow: 'shadow-yellow-500/50'
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

          {/* Ultra Users Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCheck size={20} className="text-white" />
                </div>
                <div>
                  <motion.h3
                    className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.02 }}
                  >
                    User Management
                  </motion.h3>
                  <motion.p
                    className="text-gray-400 mt-1"
                    whileHover={{ scale: 1.01 }}
                  >
                    Manage user accounts, roles, and permissions across the platform
                  </motion.p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Crown className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </motion.div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:border-white/20 transition-all"
                >
                  <Eye size={16} />
                  Export Data
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles size={14} />
                  </motion.div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all shadow-lg"
                >
                  <Plus size={16} />
                  Add User
                </motion.button>
              </div>
            </div>

            <div className="relative">
              <DataTable columns={columns} data={users} />

              {/* Table Sparkle Effects */}
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
                className="absolute top-6 right-6 w-3 h-3 bg-blue-400 rounded-full shadow-lg"
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
                className="absolute bottom-6 left-6 w-2 h-2 bg-green-400 rounded-full shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </DashboardLayout>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="org-admin">Organization Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="organization" className="text-right">
                Organization
              </Label>
              <Select value={editForm.organization} onValueChange={(value) => setEditForm({ ...editForm, organization: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id || org._id || org.name} value={org.id || org._id || org.name}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit} disabled={actionLoading === selectedUser?._id.toString()}>
              {actionLoading === selectedUser?._id.toString() ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedUser?.email}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={actionLoading === selectedUser?._id.toString()}>
              {actionLoading === selectedUser?._id.toString() ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}