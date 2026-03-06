'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Crown, Star, Zap, Heart, Flame, Rocket, Zap as Thunderbolt } from 'lucide-react';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-40 md:pt-40 md:pb-60 min-h-screen flex items-center">
      {/* Ultra Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        {/* Massive gradient orbs */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              background: `linear-gradient(135deg, ${
                [
                  '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b',
                  '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#e84393',
                  '#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#fdcb6e'
                ][i % 15]
              }, transparent)`,
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              left: `${(i * 23) % 100}%`,
              top: `${(i * 31) % 100}%`,
            }}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.4, 0.6, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Ultra sparkle effects */}
        {isClient && [...Array(25)].map((_, i) => (
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
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating geometric shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className={`absolute border-2 ${
              ['border-pink-400/30', 'border-purple-400/30', 'border-cyan-400/30', 'border-yellow-400/30', 'border-green-400/30', 'border-red-400/30'][i]
            }`}
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${15 + (i * 15)}%`,
              top: `${10 + (i * 12)}%`,
              borderRadius: i % 2 === 0 ? '50%' : '4px',
              transform: `rotate(${i * 60}deg)`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center space-y-12"
        >
          {/* Ultra Animated Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-white/20 rounded-full backdrop-blur-xl shadow-2xl"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-5 h-5 text-yellow-400" />
            </motion.div>
            <span className="text-white font-semibold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🇪🇹 Powering Ethiopian Football Ultra Style
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-pink-400" />
            </motion.div>
          </motion.div>

          {/* Ultra Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-6"
          >
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-black leading-none"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 25%, #fdf2f8 50%, #fef3c7 75%, #ffffff 100%)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 8s ease-in-out infinite',
              }}
              animate={{
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.5)',
                  '0 0 40px rgba(236,72,153,0.8)',
                  '0 0 20px rgba(255,255,255,0.5)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Ultra
              </motion.span>
              <br />
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text"
              >
                Transform
              </motion.span>
              <br />
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Football
              </motion.span>
            </motion.h1>

            {/* Ultra Animated Underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 rounded-full mx-auto"
            />
          </motion.div>

          {/* Ultra Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the future of Ethiopian football management with
            <motion.span
              className="font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {' '}ultra modern technology
            </motion.span>
            {' '}and breathtaking design. Join thousands transforming their leagues digitally.
          </motion.p>

          {/* Ultra CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
          >
            <Link href="/auth/signup">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 50px rgba(236, 72, 153, 0.6)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-black text-xl rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />

                <span className="relative z-10 flex items-center gap-3">
                  Register Organization
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={24} />
                  </motion.div>
                </span>

                {/* Sparkle effects on button */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      top: `${20 + i * 30}%`,
                      right: `${10 + i * 30}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.8,
                    }}
                  />
                ))}
              </motion.button>
            </Link>

            <Link href="/auth/signin">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  y: -5,
                  boxShadow: "0 0 30px rgba(255,255,255,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group px-10 py-5 border-2 border-white/30 text-white font-black text-xl rounded-2xl backdrop-blur-xl hover:border-white/60 transition-all"
              >
                <span className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-6 h-6" />
                  </motion.div>
                  Sign In
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-6 h-6 text-pink-400" />
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Ultra Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                value: '1000+',
                label: 'Organizations',
                icon: <Rocket className="w-8 h-8" />,
                gradient: 'from-pink-500 to-rose-500',
                delay: 0
              },
              {
                value: '1000+',
                label: 'Leagues',
                icon: <Thunderbolt className="w-8 h-8" />,
                gradient: 'from-purple-500 to-violet-500',
                delay: 0.2
              },
              {
                value: '10000+',
                label: 'Matches',
                icon: <Flame className="w-8 h-8" />,
                gradient: 'from-cyan-500 to-blue-500',
                delay: 0.4
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 1.3 + stat.delay,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.1,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                <div className="relative z-10 text-center space-y-4">
                  <motion.div
                    className={`w-16 h-16 mx-auto bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {stat.icon}
                  </motion.div>

                  <motion.p
                    className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    {stat.value}
                  </motion.p>

                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.8,
                  }}
                  className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Ultra Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Ultra Floating Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-30"
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-10 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl opacity-40"
        animate={{
          scale: [1, 1.8, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Ultra particle effects */}
      {isClient && [...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
        />
      ))}
    </section>
  );
}
