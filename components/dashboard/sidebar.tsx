'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import {
  Menu,
  X,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Crown,
  Star,
  Heart,
  Zap,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  title: string;
  onLogout?: () => void;
}

export function Sidebar({ items, title, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Ultra Mobile Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 md:hidden w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl shadow-2xl shadow-pink-500/50 flex items-center justify-center backdrop-blur-sm border border-white/20"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={20} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Ultra Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -320 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -320 } : { x: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className={`fixed left-0 top-0 h-screen md:h-auto md:static md:translate-x-0 w-80 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-r border-white/10 z-40 overflow-y-auto shadow-2xl shadow-purple-500/20`}
          >
            {/* Ultra Header */}
            <motion.div
              className="p-8 border-b border-white/10 relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 opacity-50" />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 mb-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/50"
                  >
                    <BarChart3 size={24} className="text-white" />
                  </motion.div>

                  <div>
                    <motion.h1
                      className="text-2xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.02 }}
                    >
                      {title}
                    </motion.h1>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400 font-medium">Ultra Styled</span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Welcome Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30"
                >
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-300 font-medium">Club Admin Dashboard</span>
                </motion.div>
              </div>

              {/* Floating Sparkles */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1
                }}
                className="absolute top-4 right-4 w-3 h-3 bg-pink-400 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: 2
                }}
                className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full"
              />
            </motion.div>

            {/* Ultra Navigation */}
            <nav className="p-6 space-y-3">
              {items.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{
                          scale: 1.02,
                          x: 8,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-white/20 shadow-lg shadow-purple-500/20'
                            : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                        }`}
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 via-purple-400 to-cyan-400 rounded-r-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}

                        {/* Icon Container */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isActive
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/50'
                              : 'bg-white/10 group-hover:bg-white/20'
                          }`}
                        >
                          {item.icon}
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <span className={`font-medium transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-gray-300 group-hover:text-white'
                          }`}>
                            {item.label}
                          </span>

                          {/* Subtle description for active items */}
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-gray-400 mt-1"
                            >
                              Currently active
                            </motion.div>
                          )}
                        </div>

                        {/* Badge */}
                        {item.badge && (
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg shadow-red-500/50"
                          >
                            {item.badge}
                          </motion.span>
                        )}

                        {/* Hover Sparkle */}
                        <motion.div
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                          className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"
                        />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Ultra Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-gradient-to-r from-slate-900/50 to-purple-900/50 backdrop-blur-sm"
            >
              {onLogout && (
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 5px 15px rgba(239, 68, 68, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50"
                  >
                    <LogOut size={20} className="text-white" />
                  </motion.div>

                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                      Logout
                    </span>
                    <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      End session
                    </div>
                  </div>

                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-gray-400 group-hover:text-red-400"
                  >
                    →
                  </motion.div>
                </motion.button>
              )}

              {/* Ultra Branding */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span className="text-xs text-gray-500 font-medium">Ultra Styled</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-gray-600">
                  © 2024 EthioScore
                </div>
              </motion.div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Ultra Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
