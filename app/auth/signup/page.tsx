'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Building2, Globe, User, Eye, EyeOff, Trophy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { GradientBackground } from '@/components/dashboard/gradient-background';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupStatus, setSignupStatus] = useState<'form' | 'checking' | 'approved' | 'pending'>('form');
  const [organizationStatus, setOrganizationStatus] = useState<string>('');

  const [formData, setFormData] = useState({
    orgName: '',
    country: '',
    adminName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { signup, user } = useAppStore();

  const checkOrganizationStatus = async (organizationId: string) => {
    try {
      const response = await fetch(`/api/organizations/status?id=${organizationId}`);
      if (response.ok) {
        const orgData = await response.json();
        setOrganizationStatus(orgData.status);
        return orgData.status;
      }
    } catch (error) {
      console.error('Error checking organization status:', error);
    }
    return 'unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userData = await signup(formData, 'org-admin');
      setSignupStatus('checking');
      
      // Check organization status
      if (userData.organization) {
        const status = await checkOrganizationStatus(userData.organization.toString());
        
        if (status === 'approved') {
          setSignupStatus('approved');
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/org-admin');
          }, 2000);
        } else {
          setSignupStatus('pending');
        }
      } else {
        setSignupStatus('pending');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      setSignupStatus('form');
    } finally {
      setIsLoading(false);
    }
  };

  // Render different UI based on signup status
  if (signupStatus === 'checking') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <GradientBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-8 rounded-2xl max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Checking Organization Status</h2>
          <p className="text-muted-foreground mb-6">
            We're verifying your organization details...
          </p>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (signupStatus === 'approved') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <GradientBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-8 rounded-2xl max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-green-400">Registration Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your organization has been approved. Redirecting you to your dashboard...
          </p>
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle size={20} />
            <span className="font-semibold">Organization Approved</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (signupStatus === 'pending') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
          {/* Left side - Success illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex items-center justify-center p-12 bg-card/50"
          >
            <div className="max-w-md">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Registration Complete!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your account has been created successfully. We're reviewing your organization details.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: '✅', title: 'Account Created', desc: 'Your login credentials are ready' },
                    { icon: '🏢', title: 'Organization Submitted', desc: 'Under review by our team' },
                    { icon: '⏳', title: 'Approval Pending', desc: 'Usually takes 24-48 hours' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Waiting content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center p-6 md:p-12"
          >
            <div className="w-full max-w-md text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="text-yellow-400" size={32} />
                </div>
                <h1 className="text-3xl font-bold mb-2">Waiting for Approval</h1>
                <p className="text-muted-foreground mb-6">
                  Your organization is currently under review by our super administrators.
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="text-yellow-400" size={20} />
                    <span className="font-semibold text-yellow-400">Approval Required</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your organization "{formData.orgName}" needs to be approved before you can access the dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-card/50 rounded-lg">
                    <p className="text-sm font-semibold mb-1">What happens next?</p>
                    <p className="text-xs text-muted-foreground">
                      Our team will review your organization details and approve it within 24-48 hours.
                    </p>
                  </div>
                  <div className="p-3 bg-card/50 rounded-lg">
                    <p className="text-sm font-semibold mb-1">Need help?</p>
                    <p className="text-xs text-muted-foreground">
                      Contact our support team if you have any questions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/auth/signin"
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold rounded-lg hover:shadow-lg transition-shadow block text-center"
                >
                  Go to Sign In
                </Link>

                <p className="text-sm text-muted-foreground">
                  You'll receive an email notification once your organization is approved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GradientBackground />

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex items-center justify-center p-12 bg-card/50"
        >
          <div className="max-w-md">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Trophy className="text-primary" size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Join EthioScore</h2>
                <p className="text-muted-foreground mb-6">
                  Manage your football league with professional tools and real-time analytics.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: '⚡', title: 'Real-time Updates', desc: 'Live match scores' },
                  { icon: '📊', title: 'Analytics', desc: 'Detailed performance metrics' },
                  { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center p-6 md:p-12"
        >
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">
                Register your football organization
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Ethiopian Premier League"
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Kenya">Kenya</option>
                  </select>
                </div>
              </div>

              {/* Admin Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Admin Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251 911 123 456"
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 cursor-disabled"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Sign In Link */}
            <p className="mt-6 text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-accent hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
