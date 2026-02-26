'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Building2, Globe, User, Eye, EyeOff, Trophy } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { GradientBackground } from '@/components/dashboard/gradient-background';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signup(formData, 'org-admin');
      // Redirect based on role
      if (user?.role === 'super-admin') {
        router.push('/super-admin');
      } else {
        router.push('/org-admin');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

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
