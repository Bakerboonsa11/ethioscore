'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Target,
  Trophy,
  Activity,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/club-admin', icon: <User size={20} /> },
  { label: 'Team Profile', href: '/club-admin/profile', icon: <User size={20} /> },
  { label: 'Players', href: '/club-admin/players', icon: <User size={20} /> },
  { label: 'Matches', href: '/club-admin/matches', icon: <User size={20} /> },
  { label: 'Statistics', href: '/club-admin/stats', icon: <User size={20} /> },
  { label: 'Settings', href: '/club-admin/settings', icon: <User size={20} /> },
];

const positions = [
  {
    id: 'Goalkeeper',
    name: 'Goalkeeper',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    icon: Shield,
    description: 'The last line of defense'
  },
  {
    id: 'Defender',
    name: 'Defender',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    icon: Shield,
    description: 'The protective barrier'
  },
  {
    id: 'Midfielder',
    name: 'Midfielder',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    icon: Activity,
    description: 'The engine of the team'
  },
  {
    id: 'Forward',
    name: 'Forward',
    color: 'from-red-400 to-pink-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    icon: Target,
    description: 'The goal scorers'
  }
];

export default function AddPlayerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPlayer, user, teams } = useAppStore();

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    jerseyNumber: '',
    position: '',

    // Step 2: Personal Details
    dateOfBirth: '',
    nationality: '',
    placeOfBirth: '',
    address: '',
    height: '',
    weight: '',
    preferredFoot: '',

    // Step 3: Contact & Contract
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    joinedDate: '',
    contractEnd: '',

    // Step 4: Stats (optional)
    goals: 0,
    assists: 0,
    appearances: 0
  });

  const userTeam = teams.find(team => {
    const clubAdminId = typeof team.clubAdmin === 'object' ? team.clubAdmin?._id : team.clubAdmin;
    return clubAdminId === user?._id;
  });

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
    setFormData(prev => ({ ...prev, position }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!userTeam) return;

    setIsSubmitting(true);
    try {
      const playerData = {
        ...formData,
        team: userTeam._id,
        age: formData.dateOfBirth ? new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear() : 0,
        status: 'active'
      };

      await createPlayer(playerData);
      router.push('/club-admin/players');
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Failed to create player. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Player Basics';
      case 2: return 'Personal Details';
      case 3: return 'Contact & Contract';
      case 4: return 'Statistics';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Choose position and basic information';
      case 2: return 'Personal and physical details';
      case 3: return 'Contact information and contract';
      case 4: return 'Performance statistics';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Position Selection */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Choose Player Position
                </h3>
                <p className="text-muted-foreground">Select the position where this player excels</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {positions.map((position) => {
                  const Icon = position.icon;
                  const isSelected = selectedPosition === position.id;

                  return (
                    <motion.button
                      key={position.id}
                      onClick={() => handlePositionSelect(position.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-8 rounded-2xl border-2 transition-all duration-300 group ${
                        isSelected
                          ? `${position.borderColor} ${position.bgColor} shadow-xl`
                          : 'border-border hover:border-accent/50 hover:shadow-lg'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                        >
                          <Check size={16} className="text-accent-foreground" />
                        </motion.div>
                      )}

                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${position.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon size={32} className="text-white" />
                      </div>

                      <h4 className="text-xl font-bold mb-2">{position.name}</h4>
                      <p className={`text-sm ${isSelected ? position.textColor : 'text-muted-foreground'}`}>
                        {position.description}
                      </p>

                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`mt-4 px-4 py-2 rounded-lg bg-gradient-to-r ${position.color} text-white text-sm font-semibold`}
                        >
                          Selected Position
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Basic Information</h3>
                <p className="text-muted-foreground">Enter the player's fundamental details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Jersey Number *</label>
                  <input
                    type="number"
                    value={formData.jerseyNumber}
                    onChange={(e) => handleInputChange('jerseyNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Enter jersey number"
                    min="1"
                    max="99"
                    required
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Personal Details
              </h3>
              <p className="text-muted-foreground">Physical and personal information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nationality *</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="Enter nationality"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Place of Birth</label>
                <input
                  type="text"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="Enter place of birth"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Preferred Foot</label>
                <select
                  value={formData.preferredFoot}
                  onChange={(e) => handleInputChange('preferredFoot', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                >
                  <option value="">Select preferred foot</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="Enter height in cm"
                  min="140"
                  max="220"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="Enter weight in kg"
                  min="50"
                  max="120"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                placeholder="Enter full address"
                rows={3}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Contact & Contract
              </h3>
              <p className="text-muted-foreground">Communication details and contract information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Joined Date *</label>
                <input
                  type="date"
                  value={formData.joinedDate}
                  onChange={(e) => handleInputChange('joinedDate', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Contract End Date *</label>
                <input
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) => handleInputChange('contractEnd', e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="Phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Relationship</label>
                  <input
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="e.g., Father, Mother"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Performance Statistics
              </h3>
              <p className="text-muted-foreground">Optional: Add current season statistics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Goals</label>
                <input
                  type="number"
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Assists</label>
                <input
                  type="number"
                  value={formData.assists}
                  onChange={(e) => handleInputChange('assists', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Appearances</label>
                <input
                  type="number"
                  value={formData.appearances}
                  onChange={(e) => handleInputChange('appearances', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 rounded-2xl text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star size={40} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Ready to Add Player!</h4>
              <p className="text-muted-foreground mb-6">
                Review the information and click "Create Player" to add {formData.name || 'the player'} to your team.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{formData.goals}</div>
                  <div className="text-muted-foreground">Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{formData.assists}</div>
                  <div className="text-muted-foreground">Assists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{formData.appearances}</div>
                  <div className="text-muted-foreground">Apps</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute requiredRole="club-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="Club Admin"
          headerTitle="Add New Player"
          headerDescription="Create a new player profile with detailed information"
          navItems={navItems}
        >
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step <= currentStep
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-card border-2 border-border text-muted-foreground'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {step < currentStep ? <Check size={16} /> : step}
                    </motion.div>
                    {step < 4 && (
                      <div className={`w-12 h-1 mx-2 ${
                        step < currentStep ? 'bg-accent' : 'bg-border'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{getStepTitle(currentStep)}</h2>
                <p className="text-muted-foreground">{getStepDescription(currentStep)}</p>
              </div>
            </motion.div>

            {/* Form Content */}
            <motion.div
              layout
              className="glass-card p-8 rounded-2xl mb-8"
            >
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between items-center"
            >
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 1}
                whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
                whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-card hover:bg-card/80 border border-border'
                }`}
              >
                <ArrowLeft size={20} />
                Previous
              </motion.button>

              {currentStep < 4 ? (
                <motion.button
                  onClick={nextStep}
                  disabled={!formData.name || !formData.jerseyNumber || !selectedPosition}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    !formData.name || !formData.jerseyNumber || !selectedPosition
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-accent text-accent-foreground hover:shadow-lg'
                  }`}
                >
                  Next
                  <ArrowRight size={20} />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent to-secondary text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Create Player
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
