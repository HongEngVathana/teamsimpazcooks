import React from 'react';
import { RemixIcon } from './RemixIcon';
import { Language, TRANSLATIONS } from '../services/languageService';

interface MobileActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateSchedule: () => void;
  onExportCSV: () => void;
  onPrintSchedule: () => void;
  onOpenSettings: () => void;
  isGenerating?: boolean;
  language: Language;
}

export const MobileActionsDrawer: React.FC<MobileActionsDrawerProps> = ({
  isOpen,
  onClose,
  onGenerateSchedule,
  onExportCSV,
  onPrintSchedule,
  onOpenSettings,
  isGenerating = false,
  language,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full bg-white dark:bg-[#0f172a] rounded-t-3xl p-5 shadow-2xl border-t border-gray-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200 transition-colors">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-slate-100">
              {language === 'km' ? 'មុខងារផ្ទះបាយ' : 'Kitchen Actions'}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
              {language === 'km' ? 'គ្រប់គ្រង ទាញយក និងបង្កើតកាលវិភាគ' : 'Manage, export, and automate schedule'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <RemixIcon name="ri-close-line" className="text-xl" />
          </button>
        </div>

        {/* Action Items */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onGenerateSchedule();
              onClose();
            }}
            disabled={isGenerating}
            className="w-full bg-[#1A8D5F] hover:bg-[#157a51] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-colors cursor-pointer"
          >
            <RemixIcon name={`ri-refresh-line ${isGenerating ? 'animate-spin' : ''}`} className="text-base" />
            <span>{t.generateSchedule}</span>
          </button>

          <button
            onClick={() => {
              onExportCSV();
              onClose();
            }}
            className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-2xs transition-colors cursor-pointer"
          >
            <RemixIcon name="ri-download-2-line" className="text-base text-gray-600 dark:text-slate-400" />
            <span>{t.exportCSV}</span>
          </button>

          <button
            onClick={() => {
              onPrintSchedule();
              onClose();
            }}
            className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-2xs transition-colors cursor-pointer"
          >
            <RemixIcon name="ri-printer-line" className="text-base text-gray-600 dark:text-slate-400" />
            <span>{t.printSchedule}</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full bg-gray-50 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer"
          >
            <RemixIcon name="ri-settings-3-line" className="text-base text-gray-500 dark:text-slate-400" />
            <span>{t.settings}</span>
          </button>
        </div>

        {/* Cancel */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-gray-500 dark:text-slate-400 text-center cursor-pointer"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
