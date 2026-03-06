'use client';

import Link from 'next/link';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { BarChart3, Sparkles, Crown, Star, Heart, Zap, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <GradientBackground />

      {/* Ultra Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating orbs with different colors and animations */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              background: `linear-gradient(135deg, ${
                ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'][i]
              }, transparent)`,
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Sparkle effects */}
        {isClient && [...Array(15)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Ultra Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-500/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Ultra Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <Link href="/" className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/50"
                >
                  <BarChart3 size={24} className="text-white" />
                </motion.div>
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-2xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.02 }}
                  >
                    EthioScore
                  </motion.span>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="relative text-gray-300 hover:text-white font-medium transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/auth/signin">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/auth/signup">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(236, 72, 153, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-pink-500/50 transition-all flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    Get Started
                    <ChevronRight size={16} />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/50"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Menu size={20} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 text-gray-300 hover:text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <Link href="/auth/signin">
                    <motion.button
                      className="w-full px-4 py-3 text-gray-300 hover:text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </motion.button>
                  </Link>

                  <Link href="/auth/signup">
                    <motion.button
                      className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Sparkles size={16} />
                      Get Started
                      <ChevronRight size={16} />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <HeroSection />
      <FeaturesSection />

      {/* Ultra Footer */}
      <footer className="relative border-t border-white/10 bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-xl py-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/50"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <BarChart3 size={24} className="text-white" />
                </motion.div>
                <motion.h3
                  className="text-2xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  EthioScore
                </motion.h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Powering Ethiopian football digitally with ultra modern technology and stunning design.
                Join thousands of organizations already transforming their leagues.
              </p>

              {/* Status Badge */}
              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30 w-fit"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium text-sm">Ultra Styled & Operational</span>
              </motion.div>
            </motion.div>

            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-lg mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'Pricing', href: '#' },
                  { label: 'API Docs', href: '#' },
                  { label: 'Integrations', href: '#' },
                ].map((item, index) => (
                  <motion.li
                    key={item.label}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-lg mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', href: '#' },
                  { label: 'Blog', href: '#' },
                  { label: 'Careers', href: '#' },
                  { label: 'Contact', href: '#contact' },
                ].map((item, index) => (
                  <motion.li
                    key={item.label}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.p
                  className="text-gray-400 text-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  © 2024 EthioScore. Made with
                </motion.p>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-red-400" />
                </motion.div>
                <motion.p
                  className="text-gray-400 text-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  in Ethiopia 🇪🇹
                </motion.p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-6">
                {[
                  { icon: 'twitter', color: 'hover:text-blue-400' },
                  { icon: 'facebook', color: 'hover:text-blue-600' },
                  { icon: 'instagram', color: 'hover:text-pink-400' },
                  { icon: 'linkedin', color: 'hover:text-blue-500' },
                ].map((social, index) => (
                  <motion.a
                    key={social.icon}
                    href="#"
                    className={`text-gray-400 ${social.color} transition-colors`}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-lg font-bold">{social.icon.charAt(0).toUpperCase()}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Ultra Branding */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-5 h-5 text-yellow-400" />
                </motion.div>
                <span className="text-xs text-gray-500 font-medium">Ultra Styled by Cascade AI</span>
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-5 h-5 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Final sparkle effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`footer-sparkle-${i}`}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
            style={{
              left: `${10 + (i * 12)}%`,
              bottom: `${5 + (i * 3)}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
      </footer>
    </div>
  );
}
