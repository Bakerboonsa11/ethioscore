'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Trophy, TrendingUp, Settings, Plus, CheckCircle, XCircle, Edit, Trash2, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable } from '@/components/dashboard/data-table';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { label: 'Overview', href: '/super-admin', icon: <BarChart3 size={20} /> },
  {
    label: 'Organizations',
    href: '/super-admin/organizations',
    icon: <Users size={20} />,
  },
  {
    label: 'Settings',
    href: '/super-admin/settings',
    icon: <Settings size={20} />,
  },
];

export default function OrganizationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { organizations, fetchOrganizations } = useAppStore();

  useEffect(() => {
    fetchOrganizations().finally(() => setIsLoading(false));
  }, [fetchOrganizations]);

  const approvedCount = organizations.filter(org => org.status === 'approved').length;
  const pendingCount = organizations.filter(org => org.status === 'pending').length;

  const stats = [
    {
      title: 'Total Organizations',
      value: organizations.length,
      icon: '🏢',
      trend: { value: 12, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Approved',
      value: approvedCount,
      icon: '✅',
      trend: { value: 8, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Pending',
      value: pendingCount,
      icon: '⏳',
      trend: { value: -2, isPositive: false },
      color: 'gold' as const,
    },
    {
      title: 'Active Leagues',
      value: organizations.reduce((sum, org) => sum + (org.leaguesCount || 0), 0),
      icon: '🏆',
      trend: { value: 23, isPositive: true },
      color: 'red' as const,
    },
  ];

  const handleApprove = async (orgId: string) => {
    // TODO: Implement approve API call
    console.log('Approve organization:', orgId);
  };

  const handleReject = async (orgId: string) => {
    // TODO: Implement reject API call
    console.log('Reject organization:', orgId);
  };

  const handleEdit = (orgId: string) => {
    // TODO: Open edit modal
    console.log('Edit organization:', orgId);
  };

  const handleDelete = async (orgId: string) => {
    // TODO: Implement delete API call
    console.log('Delete organization:', orgId);
  };

  const columns = [
    {
      key: 'name',
      label: 'Organization Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{row.country}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {value}
        </Badge>
      ),
    },
    {
      key: 'leaguesCount',
      label: 'Leagues',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-accent" />
          <span className="font-semibold">{value || 0}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={value === 'approved' ? 'default' : 'secondary'}
          className={
            value === 'approved'
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
          }
        >
          {value === 'approved' ? (
            <>
              <CheckCircle size={14} className="mr-1" />
              Approved
            </>
          ) : (
            <>
              <TrendingUp size={14} className="mr-1" />
              Pending
            </>
          )}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleApprove(row._id || row.id)}
                className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
              >
                <CheckCircle size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleReject(row._id || row.id)}
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <XCircle size={16} />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(row._id || row.id)}
            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            <Edit size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(row._id || row.id)}
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 size={16} />
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
          <p className="text-muted-foreground">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GradientBackground />

      <DashboardLayout
        title="EthioScore"
        headerTitle="Organizations Management"
        headerDescription="Manage all registered organizations and their approval status"
        navItems={navItems}
        headerActions={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Add Organization
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

          {/* Organizations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">All Organizations</h3>
                <p className="text-muted-foreground mt-1">
                  Review and manage organization registrations
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <DataTable columns={columns} data={organizations} />
          </motion.div>
        </div>
      </DashboardLayout>
    </div>
  );
}
