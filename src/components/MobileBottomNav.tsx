import React from 'react';
import { RemixIcon } from './RemixIcon';
import { AppTab } from './Header';
import { Language, TRANSLATIONS } from '../services/languageService';

interface MobileBottomNavProps {
  activeTab: AppTab;
  onNavigateTab: (tab: AppTab) => void;
  shoppingCount?: number;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigateTab,
  shoppingCount = 0,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-t border-gray-200/80 dark:border-slate-800 px-2 py-1.5 md:hidden no-print shadow-lg transition-colors">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {/* 1. Calendar */}
        <button
          onClick={() => onNavigateTab('calendar')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'calendar'
              ? 'text-[#1A8D5F] dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <RemixIcon name="ri-calendar-2-line" className="text-xl" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[50px]">{t.calendar}</span>
        </button>

        {/* 2. Smart Meal Planner */}
        <button
          onClick={() => onNavigateTab('meal-planner')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'meal-planner'
              ? 'text-[#1A8D5F] dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <RemixIcon name="ri-sparkling-fill" className="text-xl text-amber-500" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[50px]">{t.mealPlanner}</span>
        </button>

        {/* 3. Khmer Food Recipes */}
        <button
          onClick={() => onNavigateTab('recipes')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'recipes'
              ? 'text-[#1A8D5F] dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <RemixIcon name="ri-restaurant-2-line" className="text-xl" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[50px]">{t.khmerFood}</span>
        </button>

        {/* 4. Budget & Shop */}
        <button
          onClick={() => onNavigateTab('shopping-budget')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'shopping-budget'
              ? 'text-[#1A8D5F] dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <RemixIcon name="ri-shopping-bag-3-line" className="text-xl" />
          {shoppingCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-amber-500" />
          )}
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[50px]">{t.budgetShop}</span>
        </button>

        {/* 5. Team / Stats */}
        <button
          onClick={() => onNavigateTab('statistics')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'statistics'
              ? 'text-[#1A8D5F] dark:text-emerald-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <RemixIcon name="ri-team-line" className="text-xl" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[50px]">{t.statistics}</span>
        </button>
      </div>
    </nav>
  );
};
