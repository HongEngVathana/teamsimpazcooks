import React from 'react';
import { RemixIcon } from './RemixIcon';
import { Language, TRANSLATIONS } from '../services/languageService';

interface ActionButtonsProps {
  onGenerateSchedule: () => void;
  onExportCSV: () => void;
  onPrintSchedule: () => void;
  isGenerating?: boolean;
  language: Language;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onGenerateSchedule,
  onExportCSV,
  onPrintSchedule,
  isGenerating = false,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex flex-col gap-2.5 mt-4">
      {/* 1. Generate New Schedule Button */}
      <button
        onClick={onGenerateSchedule}
        disabled={isGenerating}
        className="w-full bg-[#1A8D5F] hover:bg-[#157a51] active:bg-[#0f603f] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-70"
      >
        <RemixIcon name={`ri-refresh-line ${isGenerating ? 'animate-spin' : ''}`} className="text-base" />
        <span>{t.generateSchedule}</span>
      </button>

      {/* 2. Export to CSV Button */}
      <button
        onClick={onExportCSV}
        className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 border border-gray-300/90 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-2xs transition-colors cursor-pointer"
      >
        <RemixIcon name="ri-download-2-line" className="text-base text-gray-600 dark:text-slate-400" />
        <span>{t.exportCSV}</span>
      </button>

      {/* 3. Print Schedule Button */}
      <button
        onClick={onPrintSchedule}
        className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 border border-gray-300/90 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-2xs transition-colors cursor-pointer"
      >
        <RemixIcon name="ri-printer-line" className="text-base text-gray-600 dark:text-slate-400" />
        <span>{t.printSchedule}</span>
      </button>
    </div>
  );
};
