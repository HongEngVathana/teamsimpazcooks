import React from 'react';
import { Language, TRANSLATIONS } from '../services/languageService';

interface HeroBannerProps {
  language?: Language;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#d5ecdc] dark:border-emerald-800/40 shadow-xs relative bg-[#ebf7ef] dark:bg-emerald-950/20 transition-colors">
      {/* Desktop/Tablet Banner (Pixel-Perfect from reference) */}
      <img
        src="/hero-banner-full.png"
        alt="Our Kitchen Schedule - A fair and organized plan for a happy home. Good Food Good Mood!"
        className="w-full h-auto object-cover hidden md:block dark:brightness-95"
      />

      {/* Clean, Mobile-Optimized Hero Banner (< 768px) */}
      <div className="block md:hidden p-3.5 bg-gradient-to-br from-[#ebf7ef] via-[#f0faf3] to-[#def2e3] dark:from-[#0f241c] dark:via-[#112d22] dark:to-[#0f2018]">
        <div className="flex items-center gap-3">
          <img
            src="/kitchen-left.png"
            alt="Kitchen scene"
            className="w-20 h-20 object-cover rounded-xl shadow-xs shrink-0 border border-white dark:border-emerald-800"
          />
          <div className="min-w-0 flex-1">
            <span className="inline-block text-[10px] font-bold text-[#1A8D5F] dark:text-emerald-400 bg-[#1A8D5F]/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full mb-1">
              {t.brandTitle}
            </span>
            <h2 className="text-base font-black text-[#113e2e] dark:text-emerald-300 tracking-tight leading-tight">
              {t.heroTitle}
            </h2>
            <p className="text-[11px] text-gray-600 dark:text-slate-300 line-clamp-1 mt-0.5">
              {t.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Good Food Good Mood script badge on mobile */}
        <div className="mt-2.5 pt-2 border-t border-[#d4edd9] dark:border-emerald-800/50 flex items-center justify-between text-xs font-semibold">
          <span className="font-handwriting text-[#1A8D5F] dark:text-emerald-400 text-base font-bold">
            {t.goodFood} ✨
          </span>
          <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
            2026 Rotation
          </span>
        </div>
      </div>
    </div>
  );
};
