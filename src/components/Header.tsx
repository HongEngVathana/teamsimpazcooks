import React from 'react';
import { RemixIcon } from './RemixIcon';
import { Language, TRANSLATIONS } from '../services/languageService';
import { Theme } from '../services/themeService';

export type AppTab = 'calendar' | 'meal-planner' | 'recipes' | 'shopping-budget' | 'statistics' | 'settings';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenMobileActions?: () => void;
  shoppingCount?: number;
  currentLanguage: Language;
  onToggleLanguage: () => void;
  currentTheme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  shoppingCount = 0,
  currentLanguage,
  onToggleLanguage,
  currentTheme,
  onToggleTheme,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="bg-white dark:bg-[#0f172a] border-b border-gray-100/90 dark:border-slate-800/80 px-3.5 md:px-8 py-2 md:py-3 sticky top-0 z-40 no-print backdrop-blur-md bg-white/95 dark:bg-[#0f172a]/95 transition-colors">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Subtitle */}
        <div
          onClick={() => onTabChange('calendar')}
          className="flex items-center gap-2.5 md:gap-3 min-w-0 cursor-pointer group"
        >
          <img
            src="/kitchen-logo.png"
            alt="Our Kitchen Logo"
            className="w-9 h-9 md:w-10 md:h-10 object-contain rounded-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-extrabold text-[#113e2e] dark:text-emerald-400 tracking-tight leading-tight truncate">
              {t.brandTitle}
            </h1>
            <p className="text-[10px] md:text-[11px] text-gray-500 dark:text-slate-400 font-medium tracking-wide truncate">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Center: Navigation (Desktop & Tablet) with Remix Icons */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {/* Calendar Tab */}
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-[#1A8D5F] text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800'
            }`}
          >
            <RemixIcon name="ri-calendar-2-line" className="text-base" />
            <span>{t.calendar}</span>
          </button>

          {/* Smart Meal Planner Tab */}
          <button
            onClick={() => onTabChange('meal-planner')}
            className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'meal-planner'
                ? 'bg-[#1A8D5F] text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800'
            }`}
          >
            <RemixIcon name="ri-sparkling-fill" className="text-base text-amber-500 dark:text-amber-400" />
            <span>{t.mealPlanner}</span>
          </button>

          {/* Khmer Food Recipes Tab */}
          <button
            onClick={() => onTabChange('recipes')}
            className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'recipes'
                ? 'bg-[#1A8D5F] text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800'
            }`}
          >
            <RemixIcon name="ri-restaurant-2-line" className="text-base" />
            <span>{t.khmerFood}</span>
          </button>

          {/* Shopping & Budget Tab */}
          <button
            onClick={() => onTabChange('shopping-budget')}
            className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer relative ${
              activeTab === 'shopping-budget'
                ? 'bg-[#1A8D5F] text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800'
            }`}
          >
            <RemixIcon name="ri-shopping-bag-3-line" className="text-base" />
            <span>{t.budgetShop}</span>
            {shoppingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center -ml-0.5">
                {shoppingCount}
              </span>
            )}
          </button>

          {/* Statistics Tab */}
          <button
            onClick={() => onTabChange('statistics')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'statistics'
                ? 'bg-[#1A8D5F] text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800'
            }`}
          >
            <RemixIcon name="ri-bar-chart-2-line" className="text-base" />
            <span>{t.statistics}</span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#1A8D5F] text-white shadow-xs'
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800'
            }`}
          >
            <RemixIcon name="ri-settings-3-line" className="text-base" />
            <span>{t.settings}</span>
          </button>
        </nav>

        {/* Right Side: Language Toggle + Dark Mode Toggle + Motto */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-gray-200/60 dark:border-slate-700"
            title="Switch Language / ប្តូរភាសា"
            aria-label="Toggle Language"
          >
            <RemixIcon name="ri-translate-2" className="text-base text-[#1A8D5F] dark:text-emerald-400" />
            <span className="text-[11px] font-bold">
              {currentLanguage === 'en' ? 'ខ្មែរ' : 'EN'}
            </span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-xs rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-gray-200/60 dark:border-slate-700 flex items-center justify-center w-8 h-8"
            title={currentTheme === 'dark' ? t.lightMode : t.darkMode}
            aria-label="Toggle Theme"
          >
            {currentTheme === 'dark' ? (
              <RemixIcon name="ri-sun-line" className="text-base text-amber-400" />
            ) : (
              <RemixIcon name="ri-moon-line" className="text-base text-slate-700" />
            )}
          </button>

          {/* Desktop Motto */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 ml-1">
            <RemixIcon name="ri-leaf-line" className="text-base text-[#1A8D5F] dark:text-emerald-400" />
            <span className="whitespace-nowrap">{t.motto}</span>
            <RemixIcon name="ri-heart-fill" className="text-sm text-red-500" />
          </div>
        </div>
      </div>
    </header>
  );
};
