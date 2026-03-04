'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Camera
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

export default function ClubAdminProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    colors: { primary: '#1e40af', secondary: '#ffffff' },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
    },
  });

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
        colors: userTeam.colors || { primary: '#1e40af', secondary: '#ffffff' },
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
        colors: userTeam.colors || { primary: '#1e40af', secondary: '#ffffff' },
        socialMedia: {
          facebook: userTeam.socialMedia?.facebook || '',
          twitter: userTeam.socialMedia?.twitter || '',
          instagram: userTeam.socialMedia?.instagram || '',
        },
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading team profile...</p>
        </div>
      </div>
    );
  }

  if (!userTeam) {
    return (
      <ProtectedRoute requiredRole="club-admin">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center glass-card p-8 rounded-2xl max-w-md mx-4">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Team Not Assigned</h2>
            <p className="text-muted-foreground mb-6">
              You haven't been assigned to manage a team yet.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="club-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="Club Admin"
          headerTitle="Team Profile"
          headerDescription="Manage your team's information and branding"
          navItems={navItems}
          headerActions={
            <div className="flex gap-3">
              {!isEditing ? (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  <Edit2 size={20} />
                  Edit Profile
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={handleCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg font-semibold"
                  >
                    <X size={20} />
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    disabled={isSaving}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
            {/* Team Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center text-4xl shadow-lg overflow-hidden">
                    {formData.logo ? (
                      <img src={formData.logo} alt={formData.name} className="w-full h-full object-cover" />
                    ) : (
                      formData.name.charAt(0)
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-accent/80 transition-colors">
                      <Camera size={16} />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="text-3xl font-bold bg-transparent border-b border-accent focus:outline-none focus:border-accent/80"
                      />
                    ) : (
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {formData.name}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar size={18} />
                      Founded {isEditing ? (
                        <input
                          type="number"
                          value={formData.founded}
                          onChange={(e) => setFormData(prev => ({ ...prev, founded: parseInt(e.target.value) }))}
                          min="1800"
                          max={new Date().getFullYear()}
                          className="w-20 bg-transparent border-b border-accent focus:outline-none"
                        />
                      ) : (
                        formData.founded
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={18} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, Country"
                          className="bg-transparent border-b border-accent focus:outline-none"
                        />
                      ) : (
                        formData.location
                      )}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      userTeam.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : userTeam.status === 'inactive'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}>
                      {userTeam.status.charAt(0).toUpperCase() + userTeam.status.slice(1)}
                    </span>
                    <span className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-semibold">
                      Club Admin
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users size={20} className="text-accent" />
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Team Logo URL</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.logo}
                          onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                            <Upload size={16} className="text-accent" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formData.logo ? 'Logo uploaded' : 'No logo uploaded'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Stadium</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.stadium}
                          onChange={(e) => setFormData(prev => ({ ...prev, stadium: e.target.value }))}
                          placeholder="Home stadium name"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      ) : (
                        <p className="text-foreground">{formData.stadium || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Manager</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.manager}
                          onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                          placeholder="Current manager"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      ) : (
                        <p className="text-foreground">{formData.manager || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Website</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://teamwebsite.com"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      ) : (
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 underline"
                        >
                          {formData.website || 'Not specified'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Branding & Colors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-accent" />
                    Team Colors
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Primary Color</label>
                        <div className="flex gap-2">
                          {isEditing ? (
                            <input
                              type="color"
                              value={formData.colors.primary}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                colors: { ...prev.colors, primary: e.target.value }
                              }))}
                              className="w-12 h-10 border border-border rounded cursor-pointer"
                            />
                          ) : (
                            <div
                              className="w-12 h-10 border border-border rounded"
                              style={{ backgroundColor: formData.colors.primary }}
                            />
                          )}
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.colors.primary}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                colors: { ...prev.colors, primary: e.target.value }
                              }))}
                              placeholder="#1e40af"
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                            />
                          ) : (
                            <span className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-center font-mono">
                              {formData.colors.primary}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Secondary Color</label>
                        <div className="flex gap-2">
                          {isEditing ? (
                            <input
                              type="color"
                              value={formData.colors.secondary}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                colors: { ...prev.colors, secondary: e.target.value }
                              }))}
                              className="w-12 h-10 border border-border rounded cursor-pointer"
                            />
                          ) : (
                            <div
                              className="w-12 h-10 border border-border rounded"
                              style={{ backgroundColor: formData.colors.secondary }}
                            />
                          )}
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.colors.secondary}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                colors: { ...prev.colors, secondary: e.target.value }
                              }))}
                              placeholder="#ffffff"
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                            />
                          ) : (
                            <span className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-center font-mono">
                              {formData.colors.secondary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Color Preview */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">Preview</label>
                      <div
                        className="w-full h-16 rounded-lg shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${formData.colors.primary} 0%, ${formData.colors.secondary} 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-accent" />
                    Social Media
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Facebook</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                          }))}
                          placeholder="https://facebook.com/team"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      ) : (
                        <a
                          href={formData.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 underline block"
                        >
                          {formData.socialMedia.facebook || 'Not specified'}
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Twitter</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.socialMedia.twitter}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                          }))}
                          placeholder="https://twitter.com/team"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      ) : (
                        <a
                          href={formData.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 underline block"
                        >
                          {formData.socialMedia.twitter || 'Not specified'}
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Instagram</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.socialMedia.instagram}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                          }))}
                          placeholder="https://instagram.com/team"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      ) : (
                        <a
                          href={formData.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 underline block"
                        >
                          {formData.socialMedia.instagram || 'Not specified'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
