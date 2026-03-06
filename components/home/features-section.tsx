'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Trophy,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Sparkles,
  Crown,
  Star,
  Heart,
  Flame,
  Rocket,
  Zap as Thunderbolt,
  Target,
  Award,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: Trophy,
    title: 'League Management',
    description: 'Create and manage multiple leagues with comprehensive tournament structures and real-time standings.',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
    emoji: '🏆',
    color: 'text-yellow-400'
  },
  {
    icon: Users,
    title: 'Team & Player Management',
    description: 'Track teams, players, and their performance across seasons with detailed analytics and statistics.',
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    glow: 'shadow-blue-500/50',
    emoji: '👥',
    color: 'text-blue-400'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Get actionable insights with advanced dashboards, performance metrics, and predictive analytics.',
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
    glow: 'shadow-purple-500/50',
    emoji: '📊',
    color: 'text-purple-400'
  },
  {
    icon: Zap,
    title: 'Live Match Updates',
    description: 'Update match scores and statistics in real-time with instant notifications and live commentary.',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    glow: 'shadow-pink-500/50',
    emoji: '⚡',
    color: 'text-pink-400'
  },
  {
    icon: Shield,
    title: 'Secure Access Control',
    description: 'Role-based access for super admins, league managers, and team officials with enterprise security.',
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/50',
    emoji: '🛡️',
    color: 'text-emerald-400'
  },
  {
    icon: TrendingUp,
    title: 'Performance Tracking',
    description: 'Monitor player and team performance metrics over time with advanced trend analysis and insights.',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
    glow: 'shadow-indigo-500/50',
    emoji: '📈',
    color: 'text-indigo-400'
  },
];

export function FeaturesSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Ultra Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Massive floating orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`feature-orb-${i}`}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              background: `linear-gradient(135deg, ${
                ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'][i]
              }, transparent)`,
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${(i * 25) % 80}%`,
              top: `${20 + (i * 15) % 60}%`,
            }}
            animate={{
              x: [0, 80, -80, 0],
              y: [0, -60, 60, 0],
              scale: [1, 1.3, 0.7, 1],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: 25 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}

        {/* Ultra sparkle effects */}
        {[...Array(30)].map((_, i) => {
          // Deterministic positions to avoid hydration mismatch
          const left = ((i * 7.3) % 100).toFixed(2);
          const top = ((i * 11.7) % 100).toFixed(2);
          const xOffset = ((i * 13.1) % 200) - 100;
          const yOffset = ((i * 17.9) % 200) - 100;
          const duration = 5 + ((i * 23.7) % 4);
          const delay = ((i * 31.3) % 12);

          return (
            <motion.div
              key={`feature-sparkle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full shadow-lg shadow-white/50"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
                x: [0, xOffset, 0],
                y: [0, yOffset, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Geometric shapes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`feature-shape-${i}`}
            className={`absolute border-2 ${
              ['border-pink-400/20', 'border-cyan-400/20', 'border-yellow-400/20', 'border-purple-400/20', 'border-green-400/20'][i]
            }`}
            style={{
              width: `${50 + i * 30}px`,
              height: `${50 + i * 30}px`,
              left: `${20 + (i * 20)}%`,
              top: `${30 + (i * 10)}%`,
              borderRadius: i % 2 === 0 ? '50%' : '8px',
              transform: `rotate(${i * 45}deg)`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-white/20 rounded-full backdrop-blur-xl mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-6 h-6 text-yellow-400" />
            </motion.div>
            <span className="text-white font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ultra Powerful Features
            </span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-pink-400" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-6"
          >
            <motion.span
              className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Everything You Need
            </motion.span>
            <br />
            <motion.span
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              To Dominate Football
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Discover the most comprehensive platform for Ethiopian football management,
            packed with <motion.span
              className="font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ultra powerful features
            </motion.span>
            {' '}designed for champions.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -12,
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: `0 25px 50px rgba(0,0,0,0.4), 0 0 30px ${feature.gradient.split(' ')[1].replace('via-', '').replace('-500', '')}40`
                }}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden cursor-pointer ${feature.glow} hover:${feature.glow}`}
              >
                {/* Ultra Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-500`} />

                {/* Floating particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-40"
                    style={{
                      top: `${20 + i * 30}%`,
                      right: `${15 + i * 25}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.8,
                    }}
                  />
                ))}

                <div className="relative z-10">
                  {/* Ultra Icon */}
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -10, 10, 0],
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`w-16 h-16 mb-6 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center shadow-2xl ${feature.glow} group-hover:shadow-3xl`}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Title with emoji */}
                  <motion.div
                    className="flex items-center gap-3 mb-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.span
                      className="text-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      {feature.emoji}
                    </motion.span>
                    <motion.h3
                      className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.02 }}
                    >
                      {feature.title}
                    </motion.h3>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    {feature.description}
                  </motion.p>

                  {/* Ultra hover indicator */}
                  <motion.div
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className={`w-8 h-8 border-2 ${feature.color.replace('text-', 'border-')} rounded-full flex items-center justify-center`}
                    >
                      <ArrowRight className={`w-4 h-4 ${feature.color}`} />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Corner gradient accent */}
                <motion.div
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.gradient} opacity-20 rounded-bl-full`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.7,
                  }}
                />

                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `linear-gradient(45deg, transparent, ${feature.gradient.split(' ')[1].replace('via-', '').replace('-500', '')}40, transparent)`,
                  }}
                  animate={{
                    backgroundPosition: ['200% 0', '-200% 0'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Ultra Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block p-8 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-white/20 rounded-3xl backdrop-blur-xl"
          >
            <motion.h3
              className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              Ready to Transform Your League?
            </motion.h3>
            <motion.p
              className="text-gray-400 mb-6 max-w-2xl"
              whileHover={{ scale: 1.01 }}
            >
              Join thousands of Ethiopian football organizations already using EthioScore
              to manage their leagues with ultra modern technology and stunning design.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 40px rgba(236, 72, 153, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Start Your Ultra Journey
                  <Sparkles className="w-5 h-5" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl backdrop-blur-xl hover:border-white/60 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Learn More
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
