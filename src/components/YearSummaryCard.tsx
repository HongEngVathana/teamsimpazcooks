import React from 'react';
import { RemixIcon } from './RemixIcon';
import { Language, TRANSLATIONS } from '../services/languageService';

interface YearSummaryCardProps {
  avgCookingDays?: number;
  avgDishwashingDays?: number;
  language: Language;
  onNavigateToStats?: () => void;
}

export const YearSummaryCard: React.FC<YearSummaryCardProps> = ({
  avgCookingDays = 61,
  avgDishwashingDays = 61,
  language,
  onNavigateToStats,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div
      onClick={onNavigateToStats}
      className={`bg-[#eaf7ee] dark:bg-emerald-950/25 border border-[#d2edd9] dark:border-emerald-800/50 rounded-2xl p-4 shadow-xs transition-all ${
        onNavigateToStats ? 'cursor-pointer hover:shadow-sm hover:border-[#1A8D5F]/40 group' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-emerald-200 tracking-tight">
          {t.thisYearSummary}
        </h3>
        {onNavigateToStats && (
          <span className="text-[10px] text-[#1A8D5F] dark:text-emerald-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <span>{language === 'km' ? 'ក្រាហ្វ' : 'Charts'}</span>
            <RemixIcon name="ri-arrow-right-s-line" className="text-xs" />
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Cooking Stat */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1A8D5F] dark:bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <RemixIcon name="ri-restaurant-line" className="text-lg" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-gray-500 dark:text-emerald-300/70 leading-none">
              {t.cooking}
            </div>
            <div className="text-sm font-extrabold text-gray-900 dark:text-emerald-100 mt-1">
              ≈ {avgCookingDays} {t.days}
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] h-9 bg-[#cae6d2] dark:bg-emerald-800/60 mx-2" />

        {/* Dishwashing Stat */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#1A8D5F] dark:border-emerald-500 flex items-center justify-center text-[#1A8D5F] dark:text-emerald-400 shrink-0 p-1">
            <div className="w-3.5 h-3.5 rounded-full bg-[#1A8D5F] dark:bg-emerald-500" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-gray-500 dark:text-emerald-300/70 leading-none">
              {t.dishwashing}
            </div>
            <div className="text-sm font-extrabold text-gray-900 dark:text-emerald-100 mt-1">
              ≈ {avgDishwashingDays} {t.days}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
