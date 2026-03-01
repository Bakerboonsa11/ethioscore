'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Settings,
  Save,
  ArrowLeft,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Upload,
  X
} from 'lucide-react';

export default function CreateLeaguePage() {
  const router = useRouter();
  const { user, createLeague } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    year: new Date().getFullYear(),
    region: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    tier: '',
    type: {
      format: 'league' as 'league' | 'knockout' | 'group_stage',
      hasHomeAway: true,
      groupCount: '',
      knockoutRounds: ''
    },
    status: 'draft' as 'draft' | 'active' | 'completed'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'socialMedia') {
        setFormData(prev => ({
          ...prev,
          socialMedia: {
            ...prev.socialMedia,
            [child]: value
          }
        }));
      } else if (parent === 'type') {
        setFormData(prev => ({
          ...prev,
          type: {
            ...prev.type,
            [child]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || '' : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const leagueData = {
        ...formData,
        organization: user?.organization,
        type: {
          ...formData.type,
          groupCount: formData.type.format === 'group_stage' ? parseInt(formData.type.groupCount as string) || undefined : undefined,
          knockoutRounds: formData.type.format === 'knockout' ? parseInt(formData.type.knockoutRounds as string) || undefined : undefined
        },
        tier: formData.tier ? parseInt(formData.tier as string) : undefined
      };

      await createLeague(leagueData);
      router.push('/org-admin/leagues');
    } catch (err: any) {
      setError(err.message || 'Failed to create league');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="org-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-3">
                    <Trophy className="text-accent" size={28} />
                    Create New League
                  </h1>
                  <p className="text-muted-foreground">Set up a new competition for your organization</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Trophy size={24} className="text-accent" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* League Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">League Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Premier League 2024"
                    className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                    required
                  />
                </div>

                {/* Year & Region */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="2020"
                    max="2050"
                    className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="e.g., Addis Ababa"
                    className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </div>

                {/* Logo URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Logo URL</label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="https://example.com/logo.png"
                      className="flex-1 px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                    />
                    <button
                      type="button"
                      className="px-4 py-3 bg-accent/20 hover:bg-accent/30 rounded-xl transition-colors"
                    >
                      <Upload size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Competition Format */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Settings size={24} className="text-accent" />
                Competition Format
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Competition Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Competition Type *</label>
                  <select
                    name="type.format"
                    value={formData.type.format}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                    required
                  >
                    <option value="league">League</option>
                    <option value="knockout">Knockout Tournament</option>
                    <option value="group_stage">Group Stage + Knockout</option>
                  </select>
                </div>

                {/* Tier */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tier</label>
                  <input
                    type="number"
                    name="tier"
                    value={formData.tier}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 1"
                    className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </div>

                {/* Home & Away */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="type.hasHomeAway"
                    checked={formData.type.hasHomeAway}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border bg-card accent-accent"
                  />
                  <label className="text-sm font-medium">Home & Away Matches</label>
                </div>

                {/* Group Count (only for group_stage) */}
                {formData.type.format === 'group_stage' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Groups</label>
                    <input
                      type="number"
                      name="type.groupCount"
                      value={formData.type.groupCount}
                      onChange={handleChange}
                      min="2"
                      max="16"
                      className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                    />
                  </div>
                )}

                {/* Knockout Rounds (only for knockout) */}
                {(formData.type.format === 'knockout' || formData.type.format === 'group_stage') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Knockout Rounds</label>
                    <input
                      type="number"
                      name="type.knockoutRounds"
                      value={formData.type.knockoutRounds}
                      onChange={handleChange}
                      min="1"
                      max="6"
                      className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Globe size={24} className="text-accent" />
                Social Media Links
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Facebook size={16} className="text-blue-500" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/league"
                    className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Twitter size={16} className="text-blue-400" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="socialMedia.twitter"
                    value={formData.socialMedia.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/league"
                    className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Instagram size={16} className="text-pink-500" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/league"
                    className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end gap-4"
            >
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-card hover:bg-card/80 border border-border rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                    Creating League...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create League
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
