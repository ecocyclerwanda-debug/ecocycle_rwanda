import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../i18n';

type Props = {
  onSelect: (lang: Language) => void;
};

export default function LanguageSelector({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-black text-emerald-900 mb-3">
          Choose Your Language
        </h2>
        <p className="text-slate-600 mb-8">
          Please select the language you want to use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onSelect('en')}
            className="py-5 px-4 rounded-2xl bg-emerald-900 text-white font-bold hover:bg-emerald-800 transition-colors"
          >
            English
          </button>

          <button
            onClick={() => onSelect('rw')}
            className="py-5 px-4 rounded-2xl border-2 border-emerald-900 text-emerald-900 font-bold hover:bg-emerald-50 transition-colors"
          >
            Ikinyarwanda
          </button>

          <button
            onClick={() => onSelect('fr')}
            className="py-5 px-4 rounded-2xl border-2 border-emerald-900 text-emerald-900 font-bold hover:bg-emerald-50 transition-colors"
          >
            Français
          </button>
        </div>
      </motion.div>
    </div>
  );
}