import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-b from-[#0B0B12] via-[#0B0B12] to-[#0E0E18] text-white">
      {/* Decorative radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-500/30 via-indigo-500/20 to-cyan-400/20 blur-3xl" />
        <div className="absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-gradient-to-tr from-cyan-400/20 via-purple-500/10 to-pink-400/10 blur-3xl" />
        <div className="absolute -right-10 top-10 h-56 w-56 rounded-full bg-gradient-to-tr from-amber-300/20 via-violet-400/20 to-blue-400/10 blur-2xl" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-24 md:grid-cols-2 md:pt-28">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur"
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live AI voice agent
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl"
          >
            Meet your futuristic, hands‑free Jarvis
            <span className="bg-gradient-to-r from-violet-300 via-cyan-200 to-amber-200 bg-clip-text text-transparent"> assistant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 max-w-xl text-white/70 md:text-lg"
          >
            Issue commands, get instant answers, and control your world with natural voice. Designed with smooth motion and a clean, minimal aesthetic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex items-center gap-4"
          >
            <a
              href="#voice"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition hover:brightness-110"
            >
              Try Voice Console
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a
              href="#features"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/80 backdrop-blur transition hover:border-white/30 hover:text-white"
            >
              Explore features
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative aspect-square w-full"
        >
          {/* Spline 3D Scene */}
          <div className="absolute inset-0">
            <Spline
              scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Soft gradient ring overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-radial from-white/5 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
