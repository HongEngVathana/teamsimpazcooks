import React, { useState } from 'react';
import { RemixIcon } from './RemixIcon';
import { MonthCalendar } from './MonthCalendar';
import { ScheduleMap, TeamMember } from '../types/schedule';
import { MONTH_NAMES, parseDateKey } from '../services/scheduleService';
import { Language, TRANSLATIONS } from '../services/languageService';

interface AnnualCalendarProps {
  year: number;
  onYearChange: (year: number) => void;
  schedule: ScheduleMap;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  members: TeamMember[];
  filteredMemberId: string | null;
  onFilterMemberChange: (memberId: string | null) => void;
  onJumpToToday: () => void;
  language: Language;
}

export const AnnualCalendar: React.FC<AnnualCalendarProps> = ({
  year,
  onYearChange,
  schedule,
  selectedDate,
  onSelectDate,
  members,
  filteredMemberId,
  onFilterMemberChange,
  onJumpToToday,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'month' | 'all'>('month');

  const activeMonthIndex = React.useMemo(() => {
    if (selectedDate) {
      const parsed = parseDateKey(selectedDate);
      if (parsed.year === year) {
        return parsed.month;
      }
    }
    return 10; // Default November
  }, [selectedDate, year]);

  const [mobileMonth, setMobileMonth] = useState<number>(activeMonthIndex);

  React.useEffect(() => {
    if (selectedDate) {
      const parsed = parseDateKey(selectedDate);
      if (parsed.year === year) {
        setMobileMonth(parsed.month);
      }
    }
  }, [selectedDate, year]);

  const yearOptions = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const matchingKey = Object.keys(schedule).find((k) => {
      const item = schedule[k];
      const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthName = MONTH_NAMES[item.month].toLowerCase();
      const khmerMonth = t.months[item.month].toLowerCase();
      const shortMonth = shortMonths[item.month];
      const fullDateStr = `${monthName} ${item.day}`;
      const shortDateStr = `${shortMonth} ${item.day}`;
      const khmerDateStr = `${khmerMonth} ${item.day}`;

      return (
        k.includes(query) ||
        fullDateStr.includes(query) ||
        shortDateStr.includes(query) ||
        khmerDateStr.includes(query) ||
        item.cookName.toLowerCase().includes(query) ||
        item.dishName.toLowerCase().includes(query) ||
        (item.mealNameKh && item.mealNameKh.toLowerCase().includes(query))
      );
    });

    if (matchingKey) {
      onSelectDate(matchingKey);
      const parsed = parseDateKey(matchingKey);
      setMobileMonth(parsed.month);
    }
  };

  const currentFilterLabel = filteredMemberId
    ? members.find((m) => m.id === filteredMemberId)?.name || 'Filtered'
    : t.filterAll;

  return (
    <div id="calendar-section" className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-3 md:p-5 shadow-xs scroll-mt-16 transition-colors">
      {/* Calendar Top Bar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 md:mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
        {/* Title & Mobile View Switcher */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center gap-2">
            <RemixIcon name="ri-calendar-2-line" className="text-xl text-[#1A8D5F] dark:text-emerald-400 shrink-0" />
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 dark:text-slate-100 tracking-tight truncate">
              {t.annualCalendar} – {year}
            </h2>
          </div>

          {/* Mobile view toggle */}
          <div className="flex sm:hidden items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setMobileViewMode('month')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                mobileViewMode === 'month'
                  ? 'bg-white dark:bg-slate-700 text-[#1A8D5F] dark:text-emerald-400 shadow-2xs'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
              }`}
              title={t.monthView}
            >
              <RemixIcon name="ri-calendar-event-line" className="text-sm" />
            </button>
            <button
              onClick={() => setMobileViewMode('all')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                mobileViewMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-[#1A8D5F] dark:text-emerald-400 shadow-2xs'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
              }`}
              title={t.fullYearView}
            >
              <RemixIcon name="ri-grid-fill" className="text-sm" />
            </button>
          </div>
        </div>

        {/* Toolbar: Navigation, Today, Search, Filter */}
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          {/* Previous Year Button */}
          <button
            onClick={() => onYearChange(year - 1)}
            title="Previous Year"
            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-slate-300 transition-colors cursor-pointer active:scale-95 shrink-0"
          >
            <RemixIcon name="ri-arrow-left-s-line" className="text-lg" />
          </button>

          {/* Year Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="border border-gray-200 dark:border-slate-700 px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <span>{year}</span>
              <RemixIcon name="ri-arrow-down-s-line" className="text-xs text-gray-500 dark:text-slate-400" />
            </button>

            {showYearDropdown && (
              <div className="absolute top-full mt-1 left-0 z-30 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-1 w-28 max-h-48 overflow-y-auto">
                {yearOptions.map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      onYearChange(y);
                      setShowYearDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-slate-800 ${
                      y === year ? 'text-[#1A8D5F] dark:text-emerald-400 bg-emerald-50/50 dark:bg-slate-800/80' : 'text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Next Year Button */}
          <button
            onClick={() => onYearChange(year + 1)}
            title="Next Year"
            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-slate-300 transition-colors cursor-pointer active:scale-95 shrink-0"
          >
            <RemixIcon name="ri-arrow-right-s-line" className="text-lg" />
          </button>

          {/* Today Button */}
          <button
            onClick={onJumpToToday}
            className="bg-[#1A8D5F] hover:bg-[#157a51] active:bg-[#0f603f] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            {t.today}
          </button>

          {/* Search Date Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center flex-1 sm:flex-none min-w-[110px]">
            <RemixIcon name="ri-search-line" className="text-sm text-gray-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchDate}
              className="w-full sm:w-28 md:w-36 pl-8 pr-2 py-1.5 text-xs bg-gray-50/80 dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1A8D5F] text-gray-800 dark:text-slate-100 transition-all"
            />
          </form>

          {/* Filter Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="border border-gray-200 dark:border-slate-700 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-300 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[65px] md:max-w-[80px]">{currentFilterLabel}</span>
              <RemixIcon name="ri-arrow-down-s-line" className="text-xs text-gray-500 dark:text-slate-400" />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full mt-1 right-0 z-30 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-1 w-48">
                <button
                  onClick={() => {
                    onFilterMemberChange(null);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-slate-800 ${
                    !filteredMemberId ? 'text-[#1A8D5F] dark:text-emerald-400 bg-emerald-50/50 dark:bg-slate-800/80' : 'text-gray-700 dark:text-slate-300'
                  }`}
                >
                  {t.filterAll}
                </button>
                <div className="border-t border-gray-100 dark:border-slate-800 my-1" />
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.filterByMember}
                </div>
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onFilterMemberChange(m.id);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2 ${
                      filteredMemberId === m.id ? 'text-[#1A8D5F] dark:text-emerald-400 bg-emerald-50/50 dark:bg-slate-800/80' : 'text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                    <span className="truncate">{m.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE-ONLY SINGLE MONTH CAROUSEL VIEW (< 640px) */}
      <div className={`sm:hidden ${mobileViewMode === 'month' ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between mb-2 px-1">
          <button
            onClick={() => setMobileMonth((prev) => (prev > 0 ? prev - 1 : 11))}
            className="p-1.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg active:scale-95"
          >
            <RemixIcon name="ri-arrow-left-s-line" className="text-lg" />
          </button>
          <span className="text-sm font-bold text-[#14532d] dark:text-emerald-400">
            {t.months[mobileMonth]} {year}
          </span>
          <button
            onClick={() => setMobileMonth((prev) => (prev < 11 ? prev + 1 : 0))}
            className="p-1.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg active:scale-95"
          >
            <RemixIcon name="ri-arrow-right-s-line" className="text-lg" />
          </button>
        </div>

        {/* Horizontal month pill quick scroll */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none mb-2 px-0.5">
          {t.months.map((name, idx) => (
            <button
              key={name}
              onClick={() => setMobileMonth(idx)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shrink-0 transition-colors ${
                mobileMonth === idx
                  ? 'bg-[#1A8D5F] text-white shadow-2xs'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {name.substring(0, 3)}
            </button>
          ))}
        </div>

        {/* Focused Month Calendar */}
        <div className="max-w-md mx-auto">
          <MonthCalendar
            year={year}
            monthIndex={mobileMonth}
            schedule={schedule}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            filteredMemberId={filteredMemberId}
            members={members}
            isMobileExpanded={true}
            language={language}
          />
        </div>
      </div>

      {/* FULL ANNUAL GRID */}
      <div
        className={`${
          mobileViewMode === 'all' ? 'grid' : 'hidden sm:grid'
        } grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3.5`}
      >
        {Array.from({ length: 12 }, (_, monthIndex) => (
          <MonthCalendar
            key={monthIndex}
            year={year}
            monthIndex={monthIndex}
            schedule={schedule}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            filteredMemberId={filteredMemberId}
            members={members}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};
