import React from 'react';
import { RemixIcon } from './RemixIcon';
import { DayAssignment } from '../types/schedule';
import { Language, TRANSLATIONS } from '../services/languageService';

import { isCurrentToday } from '../services/scheduleService';

interface DashboardSummaryProps {
  todayAssignment: DayAssignment | null;
  nextDayAssignment: DayAssignment | null;
  onNextDayClick?: () => void;
  onTodayClick?: () => void;
  language: Language;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  todayAssignment,
  nextDayAssignment,
  onNextDayClick,
  onTodayClick,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const isKm = language === 'km';

  // Format current date badge
  let currentDateBadge = '';
  let isToday = false;
  if (todayAssignment) {
    isToday = isCurrentToday(todayAssignment.date);
    const monthShort = t.monthsShort[todayAssignment.month];
    const dayShort = t.weekdaysFull[todayAssignment.dayOfWeek];
    currentDateBadge = isKm
      ? `${todayAssignment.day} ${monthShort} (${dayShort})`
      : `${monthShort} ${todayAssignment.day} (${dayShort})`;
  }

  // Format next day text
  let nextDayText = '';
  if (nextDayAssignment) {
    const monthShort = t.monthsShort[nextDayAssignment.month];
    const dayShort = t.weekdaysFull[nextDayAssignment.dayOfWeek];
    nextDayText = isKm
      ? `${nextDayAssignment.day} ${monthShort}, ${nextDayAssignment.year} (${dayShort})`
      : `${monthShort} ${nextDayAssignment.day}, ${nextDayAssignment.year} (${dayShort})`;
  }

  const cookName = todayAssignment?.cookName || '';
  const dishName = todayAssignment?.dishName || '';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-3.5">
      {/* 1. Cooking Assignment Card */}
      <div
        onClick={onTodayClick}
        className="cursor-pointer bg-[#ecf7f1] dark:bg-emerald-950/25 border border-[#d6efdf] dark:border-emerald-800/50 rounded-2xl p-3 md:p-4 relative overflow-hidden flex items-center justify-between transition-all hover:shadow-xs active:scale-[0.99] group min-h-[78px]"
      >
        <div className="flex items-center gap-3 md:gap-3.5 z-10 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1A8D5F] dark:bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <RemixIcon name="ri-restaurant-line" className="text-xl md:text-2xl" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] md:text-xs font-semibold text-gray-600 dark:text-emerald-200/80 tracking-tight block">
                {isToday ? t.todaysCooking : t.cookingDuty}
              </span>
              {currentDateBadge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#1A8D5F]/10 dark:bg-emerald-400/15 text-[#1A8D5F] dark:text-emerald-300">
                  {currentDateBadge}
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#1A8D5F] dark:text-emerald-400 leading-tight mt-0.5 truncate flex items-center gap-1.5">
              <span>{cookName}</span>
              {todayAssignment?.isCompletedCook && (
                <RemixIcon name="ri-checkbox-circle-fill" className="text-base text-emerald-600 dark:text-emerald-400" />
              )}
            </h3>
            {todayAssignment?.mealNameKh && (
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold truncate block mt-0.5">
                🍲 {todayAssignment.mealNameKh}
              </span>
            )}
          </div>
        </div>

        {/* Cooking Watermark Background */}
        <div className="absolute -right-2 -bottom-2 text-[#1A8D5F]/15 dark:text-emerald-400/10 pointer-events-none transform -rotate-12">
          <RemixIcon name="ri-restaurant-2-line" className="text-7xl md:text-8xl" />
        </div>
      </div>

      {/* 2. Dishwashing Assignment Card */}
      <div
        onClick={onTodayClick}
        className="cursor-pointer bg-[#edf5ff] dark:bg-blue-950/25 border border-[#d5e6fd] dark:border-blue-800/50 rounded-2xl p-3 md:p-4 relative overflow-hidden flex items-center justify-between transition-all hover:shadow-xs active:scale-[0.99] group min-h-[78px]"
      >
        <div className="flex items-center gap-3 md:gap-3.5 z-10 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2563eb] dark:bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <RemixIcon name="ri-disc-line" className="text-xl md:text-2xl" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] md:text-xs font-semibold text-gray-600 dark:text-blue-200/80 tracking-tight block">
                {isToday ? t.todaysDishwashing : t.dishwashingDuty}
              </span>
              {currentDateBadge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#2563eb]/10 dark:bg-blue-400/15 text-[#2563eb] dark:text-blue-300">
                  {currentDateBadge}
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#2563eb] dark:text-blue-400 leading-tight mt-0.5 truncate flex items-center gap-1.5">
              <span>{dishName}</span>
              {todayAssignment?.isCompletedDish && (
                <RemixIcon name="ri-checkbox-circle-fill" className="text-base text-blue-600 dark:text-blue-400" />
              )}
            </h3>
          </div>
        </div>

        {/* Dish Plate Watermark Background */}
        <div className="absolute -right-2 -bottom-2 text-[#2563eb]/15 dark:text-blue-400/10 pointer-events-none">
          <RemixIcon name="ri-disc-line" className="text-7xl md:text-8xl" />
        </div>
      </div>

      {/* 3. Next Day Card */}
      <div
        onClick={onNextDayClick}
        className="cursor-pointer bg-[#f6f2fc] dark:bg-purple-950/25 border border-[#e8dcf7] dark:border-purple-800/50 rounded-2xl p-3 md:p-4 relative overflow-hidden flex items-center justify-between transition-all hover:shadow-xs active:scale-[0.99] group min-h-[78px]"
      >
        <div className="flex items-center gap-3 md:gap-3.5 z-10 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#8b5cf6] dark:bg-purple-600 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <RemixIcon name="ri-calendar-event-line" className="text-xl md:text-2xl" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] md:text-xs font-semibold text-gray-600 dark:text-purple-200/80 tracking-tight block">
              {t.nextDay}
            </span>
            <h3 className="text-xs md:text-sm font-extrabold text-[#201c3d] dark:text-purple-300 leading-tight mt-0.5 truncate">
              {nextDayText}
            </h3>
            {nextDayAssignment && (
              <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                <span className="flex items-center gap-1 truncate">
                  <RemixIcon name="ri-restaurant-line" className="text-xs shrink-0 text-[#1A8D5F] dark:text-emerald-400" />
                  <span className="truncate">{nextDayAssignment.cookName}</span>
                </span>
                <span className="text-purple-400">•</span>
                <span className="flex items-center gap-1 truncate">
                  <RemixIcon name="ri-disc-line" className="text-xs shrink-0 text-[#2563eb] dark:text-blue-400" />
                  <span className="truncate">{nextDayAssignment.dishName}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Arrow Chevron */}
        <div className="text-[#7c3aed] dark:text-purple-400 pr-1 group-hover:translate-x-1 transition-transform shrink-0">
          <RemixIcon name="ri-arrow-right-s-line" className="text-2xl" />
        </div>
      </div>
    </div>
  );
};
