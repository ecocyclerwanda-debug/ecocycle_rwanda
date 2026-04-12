import React from 'react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-lime-300 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20">
            <img
              src={logoImg}
              alt="EcoCycle Rwanda Logo"
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-3xl md:text-5xl font-black text-white tracking-wide"
        >
          EcoCycle Rwanda
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-3 text-emerald-100 text-sm md:text-lg font-medium"
        >
          Regenerating Agriculture. Empowering Communities. Including Everyone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex justify-center"
        >
          <div className="w-40 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-full bg-emerald-300 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;