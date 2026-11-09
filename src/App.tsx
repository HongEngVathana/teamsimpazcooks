/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header, AppTab } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { DashboardSummary } from './components/DashboardSummary';
import { YearSummaryCard } from './components/YearSummaryCard';
import { AnnualCalendar } from './components/AnnualCalendar';
import { QuickView } from './components/QuickView';
import { TeamMembers } from './components/TeamMembers';
import { ActionButtons } from './components/ActionButtons';
import { DateModal } from './components/DateModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileActionsDrawer } from './components/MobileActionsDrawer';
import { SmartMealPlanner } from './components/SmartMealPlanner';
import { RecipeBrowser } from './components/RecipeBrowser';
import { ShoppingAndBudgetView } from './components/ShoppingAndBudgetView';
import { KitchenStatisticsView } from './components/KitchenStatisticsView';
import { RemixIcon } from './components/RemixIcon';

import {
  INITIAL_MEMBERS,
  getStoredMembers,
  saveMembers,
  getStoredSchedule,
  saveSchedule,
  generateYearSchedule,
  calculateStats,
  exportScheduleToCSV,
  formatDateKey,
  getTodayDateKey,
  parseDateKey,
} from './services/scheduleService';
import { TeamMember, DayAssignment, ScheduleMap, KhmerRecipe } from './types/schedule';
import { ShoppingAndBudgetService } from './services/shoppingAndBudgetService';
import { Language, LanguageService, TRANSLATIONS } from './services/languageService';
import { Theme, ThemeService } from './services/themeService';

export default function App() {
  // Theme & Language
  const [language, setLanguage] = useState<Language>(() => LanguageService.getStoredLanguage());
  const [theme, setTheme] = useState<Theme>(() => ThemeService.getStoredTheme());

  useEffect(() => {
    ThemeService.applyTheme(theme);
  }, [theme]);

  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'km' : 'en';
      LanguageService.setStoredLanguage(next);
      return next;
    });
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      ThemeService.applyTheme(next);
      return next;
    });
  }, []);

  const [year, setYear] = useState<number>(() => {
    return parseDateKey(getTodayDateKey()).year;
  });
  const [members, setMembers] = useState<TeamMember[]>(getStoredMembers);
  const [schedule, setSchedule] = useState<ScheduleMap>(() => {
    const y = parseDateKey(getTodayDateKey()).year;
    return getStoredSchedule(y, INITIAL_MEMBERS);
  });

  // Current selected date - defaults to current actual today
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateKey);

  // Active Navigation & Modals
  const [activeTab, setActiveTab] = useState<AppTab>('calendar');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileActionsDrawerOpen, setIsMobileActionsDrawerOpen] = useState(false);

  // Shopping list item count for header badge
  const [shoppingCount, setShoppingCount] = useState<number>(() => {
    return ShoppingAndBudgetService.getShoppingList().filter(i => !i.isPurchased).length;
  });

  // Filter state
  const [filteredMemberId, setFilteredMemberId] = useState<string | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    // Refresh shopping count in case it was modified
    setShoppingCount(ShoppingAndBudgetService.getShoppingList().filter(i => !i.isPurchased).length);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Sync schedule whenever year or members change
  useEffect(() => {
    const loaded = getStoredSchedule(year, members);
    setSchedule(loaded);
  }, [year, members]);

  // Handle header tab changes
  const handleTabChange = (tab: AppTab) => {
    if (tab === 'settings') {
      setIsSettingsModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    return calculateStats(year, schedule, members);
  }, [year, schedule, members]);

  // Selected Day Assignment for Quick View
  const selectedAssignment = useMemo(() => {
    if (schedule[selectedDate]) {
      return schedule[selectedDate];
    }
    const todayKey = getTodayDateKey();
    return schedule[todayKey] || Object.values(schedule)[0] || null;
  }, [schedule, selectedDate]);

  // Today's Assignment for Dashboard Summary Card
  const todaySummaryAssignment = useMemo<DayAssignment | null>(() => {
    if (selectedAssignment) {
      return selectedAssignment;
    }
    const todayKey = getTodayDateKey();
    return schedule[todayKey] || Object.values(schedule)[0] || null;
  }, [selectedAssignment, schedule]);

  // Next Day Assignment
  const nextDayAssignment = useMemo<DayAssignment | null>(() => {
    if (!selectedAssignment) return null;
    const current = new Date(selectedAssignment.year, selectedAssignment.month, selectedAssignment.day, 12, 0, 0);
    current.setDate(current.getDate() + 1);
    const nextKey = formatDateKey(current.getFullYear(), current.getMonth(), current.getDate());
    return schedule[nextKey] || null;
  }, [selectedAssignment, schedule]);

  // Jump to today (dynamically detects current system date)
  const handleJumpToToday = useCallback(() => {
    const todayKey = getTodayDateKey();
    const parsed = parseDateKey(todayKey);
    setYear(parsed.year);
    setSelectedDate(todayKey);
    const dateObj = new Date(parsed.year, parsed.month, parsed.day, 12, 0, 0);
    const dayOfWeekStr = TRANSLATIONS[language].weekdaysFull[dateObj.getDay()];
    const monthStr = TRANSLATIONS[language].monthsShort[parsed.month];
    const formatted = language === 'km'
      ? `${parsed.day} ${monthStr} ${parsed.year} (${dayOfWeekStr})`
      : `${monthStr} ${parsed.day}, ${parsed.year} (${dayOfWeekStr})`;
    showToast(language === 'km' ? `បានផ្លាស់ទីទៅថ្ងៃនេះ (${formatted})` : `Jumped to Today (${formatted})`);
  }, [language, showToast]);

  // Generate new schedule
  const handleGenerateSchedule = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateYearSchedule(year, members);
      setSchedule(generated);
      saveSchedule(year, generated);
      setIsGenerating(false);
      showToast(
        language === 'km'
          ? `បានបង្កើតកាលវិភាគថ្មីដោយយុត្តិធម៌សម្រាប់ឆ្នាំ ${year}!`
          : `Generated fair kitchen schedule for ${year}!`
      );
    }, 350);
  }, [year, members, language, showToast]);

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    exportScheduleToCSV(year, schedule);
    showToast(
      language === 'km'
        ? `បានទាញយកកាលវិភាគឆ្នាំ ${year} ជាឯកសារ CSV`
        : `Exported ${year} schedule to CSV`
    );
  }, [year, schedule, language, showToast]);

  // Print schedule
  const handlePrintSchedule = useCallback(() => {
    window.print();
  }, []);

  // Update a single day assignment (from DateModal)
  const handleSaveAssignment = useCallback((updated: DayAssignment) => {
    setSchedule((prev) => {
      const next = { ...prev, [updated.date]: updated };
      saveSchedule(year, next);
      return next;
    });
    showToast(
      language === 'km'
        ? `បានកែប្រែកាលវិភាគសម្រាប់ថ្ងៃ ${updated.date}`
        : `Updated schedule for ${updated.date}`
    );
  }, [year, language, showToast]);

  // Assign Khmer Meal directly to selected date
  const handleAssignMealToDate = useCallback((recipe: KhmerRecipe) => {
    if (!selectedAssignment) return;

    const updated: DayAssignment = {
      ...selectedAssignment,
      mealId: recipe.id,
      mealNameKh: recipe.nameKh,
      estimatedCostKHR: recipe.estimatedCostKHR,
      isManualOverride: true,
    };

    handleSaveAssignment(updated);

    // Also prompt or automatically add to shopping list
    ShoppingAndBudgetService.addRecipeToShoppingList(recipe, 4);
    setShoppingCount(ShoppingAndBudgetService.getShoppingList().filter(i => !i.isPurchased).length);

    showToast(
      language === 'km'
        ? `បានកំណត់ "${recipe.nameKh}" សម្រាប់ថ្ងៃ ${selectedAssignment.date} & បញ្ចូលក្នុងបញ្ជីទិញ!`
        : `Assigned "${recipe.nameKh}" to ${selectedAssignment.date} & added to shopping list!`
    );
    setActiveTab('calendar');
  }, [selectedAssignment, handleSaveAssignment, language, showToast]);

  // Toggle completion in Quick View
  const handleToggleCompleteCook = useCallback(() => {
    if (!selectedAssignment) return;
    const updated: DayAssignment = {
      ...selectedAssignment,
      isCompletedCook: !selectedAssignment.isCompletedCook,
    };
    handleSaveAssignment(updated);
  }, [selectedAssignment, handleSaveAssignment]);

  const handleToggleCompleteDish = useCallback(() => {
    if (!selectedAssignment) return;
    const updated: DayAssignment = {
      ...selectedAssignment,
      isCompletedDish: !selectedAssignment.isCompletedDish,
    };
    handleSaveAssignment(updated);
  }, [selectedAssignment, handleSaveAssignment]);

  // Save updated members
  const handleUpdateMembers = useCallback((updatedMembers: TeamMember[]) => {
    setMembers(updatedMembers);
    saveMembers(updatedMembers);
    const regenerated = generateYearSchedule(year, updatedMembers);
    setSchedule(regenerated);
    saveSchedule(year, regenerated);
    showToast(
      language === 'km'
        ? 'បានកែប្រែ Team និងធ្វើបច្ចុប្បន្នភាពកាលវិភាគ!'
        : 'Updated team members & refreshed schedule!'
    );
  }, [year, language, showToast]);

  // Reset to default reference schedule
  const handleResetSchedule = useCallback(() => {
    localStorage.removeItem(`our_kitchen_schedule_v2_${year}`);
    localStorage.removeItem(`our_kitchen_schedule_v3_${year}`);
    const fresh = generateYearSchedule(year, INITIAL_MEMBERS);
    setSchedule(fresh);
    saveSchedule(year, fresh);
    setMembers(INITIAL_MEMBERS);
    saveMembers(INITIAL_MEMBERS);
    setSelectedDate(getTodayDateKey());
    showToast(
      language === 'km'
        ? 'បានកំណត់កាលវិភាគឡើងវិញទៅស្ថានភាពលំនាំដើម'
        : 'Reset schedule to default reference state'
    );
  }, [year, language, showToast]);

  return (
    <div className="min-h-screen bg-[#fbfdfc] dark:bg-[#090d16] flex flex-col antialiased text-gray-800 dark:text-slate-100 pb-16 md:pb-0 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-5 right-5 z-50 bg-[#113e2e] dark:bg-emerald-950 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        shoppingCount={shoppingCount}
        currentLanguage={language}
        onToggleLanguage={handleToggleLanguage}
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenMobileActions={() => setIsMobileActionsDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-3 sm:px-4 md:px-8 py-3 sm:py-5 flex flex-col gap-4 md:gap-5">
        {/* Hero Kitchen Banner (Visible on all views) */}
        <section aria-label="Our Kitchen Schedule Banner" className="print-break-inside-avoid">
          <HeroBanner language={language} />
        </section>

        {/* 1. PRIMARY CALENDAR VIEW (Pixel-Perfect Dashboard) */}
        {activeTab === 'calendar' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* Left Main Column: Dashboard Summary Cards + Annual Calendar */}
            <div className="w-full lg:w-[73%] xl:w-[75%] flex flex-col gap-4">
              {/* Dashboard Summary Cards */}
              <DashboardSummary
                todayAssignment={todaySummaryAssignment}
                nextDayAssignment={nextDayAssignment}
                onTodayClick={() => setIsDateModalOpen(true)}
                onNextDayClick={() => {
                  if (nextDayAssignment) {
                    setSelectedDate(nextDayAssignment.date);
                  }
                }}
                language={language}
              />

              {/* Annual Calendar Grid */}
              <AnnualCalendar
                year={year}
                onYearChange={setYear}
                schedule={schedule}
                selectedDate={selectedDate}
                onSelectDate={(dateKey) => {
                  setSelectedDate(dateKey);
                }}
                members={members}
                filteredMemberId={filteredMemberId}
                onFilterMemberChange={setFilteredMemberId}
                onJumpToToday={handleJumpToToday}
                language={language}
              />
            </div>

            {/* Right Sidebar Column */}
            <aside className="w-full lg:w-[27%] xl:w-[25%] flex flex-col gap-4 shrink-0">
              {/* This Year Summary Card */}
              <YearSummaryCard
                avgCookingDays={61}
                avgDishwashingDays={61}
                language={language}
                onNavigateToStats={() => setActiveTab('statistics')}
              />

              {/* Quick View Card */}
              <QuickView
                assignment={selectedAssignment}
                onEditClick={() => setIsDateModalOpen(true)}
                onToggleCompleteCook={handleToggleCompleteCook}
                onToggleCompleteDish={handleToggleCompleteDish}
                language={language}
              />

              {/* Team Members List */}
              <TeamMembers
                members={members}
                stats={stats}
                selectedMemberFilter={filteredMemberId}
                onSelectMemberFilter={setFilteredMemberId}
                language={language}
              />

              {/* Action Buttons */}
              <ActionButtons
                onGenerateSchedule={handleGenerateSchedule}
                onExportCSV={handleExportCSV}
                onPrintSchedule={handlePrintSchedule}
                isGenerating={isGenerating}
                language={language}
              />
            </aside>
          </div>
        )}

        {/* 2. SMART MEAL PLANNER VIEW */}
        {activeTab === 'meal-planner' && (
          <SmartMealPlanner
            onAssignMealToDate={handleAssignMealToDate}
            onViewRecipeDetails={() => {
              setActiveTab('recipes');
            }}
            onShowToast={showToast}
            language={language}
          />
        )}

        {/* 3. KHMER RECIPES DATABASE BROWSER */}
        {activeTab === 'recipes' && (
          <RecipeBrowser
            onAssignMealToDate={handleAssignMealToDate}
            onShowToast={showToast}
            language={language}
          />
        )}

        {/* 4. SHOPPING LIST & BUDGET MANAGEMENT */}
        {activeTab === 'shopping-budget' && (
          <ShoppingAndBudgetView
            onShowToast={showToast}
            language={language}
          />
        )}

        {/* 5. ANNUAL KITCHEN STATISTICS PAGE (Charts & Graphs) */}
        {activeTab === 'statistics' && (
          <KitchenStatisticsView
            year={year}
            onYearChange={setYear}
            stats={stats}
            schedule={schedule}
            members={members}
            language={language}
            onBackToCalendar={() => setActiveTab('calendar')}
          />
        )}
      </main>

      {/* Footer Attribution */}
      <footer className="mt-auto py-5 px-4 text-center border-t border-gray-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xs">
        <div className="max-w-[1536px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-bold text-gray-700 dark:text-slate-200">Our Kitchen</span>
            <span>•</span>
            <span>{language === 'km' ? 'កាលវិភាគផ្ទះបាយឆ្លាតវៃ' : 'Smart Household Kitchen Management'}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span>{language === 'km' ? 'អភិវឌ្ឍន៍ដោយ' : 'Developed by'}</span>
            <span className="font-extrabold text-[#1A8D5F] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
              HongEngVathana
            </span>
            <RemixIcon name="ri-heart-3-fill" className="text-rose-500 text-xs ml-0.5" />
          </div>
        </div>
      </footer>

      {/* Date Edit Modal */}
      <DateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        assignment={selectedAssignment}
        members={members}
        onSaveAssignment={handleSaveAssignment}
        language={language}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false);
          setActiveTab('calendar');
        }}
        members={members}
        onUpdateMembers={handleUpdateMembers}
        onResetSchedule={handleResetSchedule}
        language={language}
      />

      {/* Mobile Bottom Navigation Bar (Visible only on < 768px) */}
      <MobileBottomNav
        activeTab={activeTab}
        onNavigateTab={handleTabChange}
        shoppingCount={shoppingCount}
        language={language}
      />

      {/* Mobile Actions Bottom Sheet / Drawer */}
      <MobileActionsDrawer
        isOpen={isMobileActionsDrawerOpen}
        onClose={() => setIsMobileActionsDrawerOpen(false)}
        onGenerateSchedule={handleGenerateSchedule}
        onExportCSV={handleExportCSV}
        onPrintSchedule={handlePrintSchedule}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isGenerating={isGenerating}
        language={language}
      />
    </div>
  );
}
