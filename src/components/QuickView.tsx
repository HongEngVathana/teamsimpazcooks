import React from 'react';
import { RemixIcon } from './RemixIcon';
import { DayAssignment } from '../types/schedule';
import { Language, TRANSLATIONS } from '../services/languageService';

interface QuickViewProps {
  assignment: DayAssignment | null;
  onEditClick: () => void;
  onToggleCompleteCook: () => void;
  onToggleCompleteDish: () => void;
  language: Language;
}

export const QuickView: React.FC<QuickViewProps> = ({
  assignment,
  onEditClick,
  onToggleCompleteCook,
  onToggleCompleteDish,
  language,
}) => {
  const t = TRANSLATIONS[language];

  if (!assignment) {
    return (
      <div id="quickview-section" className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">
          <RemixIcon name="ri-flashlight-fill" className="text-amber-500 text-base" />
          <span>{t.quickView}</span>
        </div>
        <div className="text-center py-6 text-xs text-gray-400 dark:text-slate-500">
          {t.selectDatePrompt}
        </div>
      </div>
    );
  }

  const monthShort = t.monthsShort[assignment.month];
  const dayNameShort = t.weekdaysFull[assignment.dayOfWeek];

  return (
    <div id="quickview-section" className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-3.5 md:p-4 shadow-xs relative scroll-mt-16 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-slate-100">
          <RemixIcon name="ri-flashlight-fill" className="text-amber-500 text-base" />
          <span>{t.quickView}</span>
        </div>
        <button
          onClick={onEditClick}
          className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Edit assignment"
          aria-label="Edit"
        >
          <RemixIcon name="ri-edit-2-line" className="text-sm" />
        </button>
      </div>

      <div className="flex items-stretch gap-3">
        {/* Left: Date Display */}
        <div className="w-[84px] shrink-0 flex flex-col justify-center items-start pl-1 relative">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-1" />
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            {dayNameShort}
          </span>
          <span className="text-xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight">
            {monthShort} {assignment.day}
          </span>
          <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">
            {assignment.year}
          </span>
        </div>

        {/* Right: Duties */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Cooking Duty Card */}
          <div className="bg-[#eaf7ee] dark:bg-emerald-950/30 rounded-xl p-2.5 flex items-center justify-between border border-[#d5ecdc]/60 dark:border-emerald-800/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#1A8D5F] dark:bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <RemixIcon name="ri-restaurant-line" className="text-sm" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gray-500 dark:text-emerald-300/70 font-medium leading-none">
                  {t.cooking}
                </div>
                <div className="text-xs font-extrabold text-[#113e2e] dark:text-emerald-200 leading-tight mt-0.5 truncate">
                  {assignment.cookName}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleCompleteCook}
              title={assignment.isCompletedCook ? t.markIncomplete : t.markComplete}
              className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                assignment.isCompletedCook
                  ? 'bg-[#1A8D5F] border-[#1A8D5F] text-white'
                  : 'border-gray-300 dark:border-slate-600 hover:border-[#1A8D5F] text-transparent hover:text-gray-300'
              }`}
            >
              <RemixIcon name="ri-check-line" className="text-xs font-bold" />
            </button>
          </div>

          {/* Dishwashing Duty Card */}
          <div className="bg-[#edf7fd] dark:bg-blue-950/30 rounded-xl p-2.5 flex items-center justify-between border border-[#d4eaf7]/60 dark:border-blue-800/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#3b82f6] dark:bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <RemixIcon name="ri-disc-line" className="text-sm" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gray-500 dark:text-blue-300/70 font-medium leading-none">
                  {t.dishwashing}
                </div>
                <div className="text-xs font-extrabold text-[#1e3a8a] dark:text-blue-200 leading-tight mt-0.5 truncate">
                  {assignment.dishName}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleCompleteDish}
              title={assignment.isCompletedDish ? t.markIncomplete : t.markComplete}
              className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                assignment.isCompletedDish
                  ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                  : 'border-gray-300 dark:border-slate-600 hover:border-[#3b82f6] text-transparent hover:text-gray-300'
              }`}
            >
              <RemixIcon name="ri-check-line" className="text-xs font-bold" />
            </button>
          </div>

          {/* Assigned Meal Highlight */}
          {assignment.mealNameKh && (
            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-200">
              <span className="font-semibold truncate">
                🍲 {assignment.mealNameKh}
              </span>
              {assignment.estimatedCostKHR && (
                <span className="font-bold text-amber-800 dark:text-amber-300 text-[10px] shrink-0 ml-1">
                  {assignment.estimatedCostKHR.toLocaleString()} ៛
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
