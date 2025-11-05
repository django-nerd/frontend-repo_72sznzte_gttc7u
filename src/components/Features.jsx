import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Shield, Zap, Settings } from 'lucide-react';

const features = [
  {
    icon: Rocket,
    title: 'Real-time voice',
    desc: 'Low-latency capture with on-device speech for instant feedback.',
    color: 'from-violet-500/20 to-cyan-400/20',
  },
  {
    icon: Shield,
    title: 'Private by design',
    desc: 'Transcription and responses can run locally for your privacy.',
    color: 'from-emerald-500/20 to-teal-400/20',
  },
  {
    icon: Zap,
    title: 'Smart intents',
    desc: 'Understands common commands like time, date, jokes, and more.',
    color: 'from-amber-400/20 to-orange-400/20',
  },
  {
    icon: Settings,
    title: 'Modular skills',
    desc: 'Extend with custom actions to control apps and devices.',
    color: 'from-fuchsia-400/20 to-indigo-400/20',
  },
];

const Item = ({ Icon, title, desc, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 text-white backdrop-blur"
  >
    <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${color} ring-1 ring-white/10`}> 
      <Icon className="h-5 w-5 text-white" />
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-white/70">{desc}</p>
  </motion.div>
);

const Features = () => {
  return (
    <section id="features" className="relative w-full bg-[#0E0E18] py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-500/10 via-cyan-500/10 to-amber-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-semibold text-white md:text-4xl"
          >
            Built for a smooth, futuristic experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-white/70"
          >
            Clean design, subtle motion, and an ambient 3D aura make interacting with your assistant delightful.
          </motion.p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => (
            <Item key={idx} Icon={f.icon} title={f.title} desc={f.desc} color={f.color} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
