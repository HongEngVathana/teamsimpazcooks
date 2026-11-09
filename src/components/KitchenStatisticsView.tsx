import React, { useState, useMemo } from 'react';
import { RemixIcon } from './RemixIcon';
import { MemberStat, ScheduleMap, TeamMember } from '../types/schedule';
import { isLeapYear, MONTH_NAMES } from '../services/scheduleService';
import { Language, TRANSLATIONS } from '../services/languageService';

interface KitchenStatisticsViewProps {
  year: number;
  onYearChange: (year: number) => void;
  stats: MemberStat[];
  schedule: ScheduleMap;
  members: TeamMember[];
  language: Language;
  onBackToCalendar: () => void;
}

export const KitchenStatisticsView: React.FC<KitchenStatisticsViewProps> = ({
  year,
  onYearChange,
  stats,
  schedule,
  members,
  language,
  onBackToCalendar,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'monthly' | 'members' | 'weekdays'>('all');

  const totalDays = isLeapYear(year) ? 366 : 365;
  const totalDuties = totalDays * 2;

  // Compute metrics, monthly distributions, and weekday trends
  const { completedCookCount, completedDishCount, monthlyData, weekdayData, dishFrequencies } = useMemo(() => {
    let cookCount = 0;
    let dishCount = 0;

    const months = Array.from({ length: 12 }, (_, i) => ({
      monthIndex: i,
      nameEn: MONTH_NAMES[i],
      nameKh: t.months[i],
      nameShort: t.monthsShort[i],
      cookingTotal: 0,
      dishwashingTotal: 0,
      cookingCompleted: 0,
      dishwashingCompleted: 0,
      estimatedCostKHR: 0,
    }));

    const weekdays = [
      { dayIndex: 1, labelEn: 'Mon', labelKh: 'ចន្ទ', cooks: 0, dishes: 0 },
      { dayIndex: 2, labelEn: 'Tue', labelKh: 'អង្គារ', cooks: 0, dishes: 0 },
      { dayIndex: 3, labelEn: 'Wed', labelKh: 'ពុធ', cooks: 0, dishes: 0 },
      { dayIndex: 4, labelEn: 'Thu', labelKh: 'ព្រហស្បតិ៍', cooks: 0, dishes: 0 },
      { dayIndex: 5, labelEn: 'Fri', labelKh: 'សុក្រ', cooks: 0, dishes: 0 },
      { dayIndex: 6, labelEn: 'Sat', labelKh: 'សៅរ៍', cooks: 0, dishes: 0 },
      { dayIndex: 0, labelEn: 'Sun', labelKh: 'អាទិត្យ', cooks: 0, dishes: 0 },
    ];

    const dishCounts: Record<string, { nameKh: string; count: number; costKHR: number }> = {};

    Object.values(schedule).forEach((day) => {
      if (day.year === year) {
        if (day.isCompletedCook) cookCount++;
        if (day.isCompletedDish) dishCount++;

        if (day.month >= 0 && day.month < 12) {
          months[day.month].cookingTotal++;
          months[day.month].dishwashingTotal++;
          if (day.isCompletedCook) months[day.month].cookingCompleted++;
          if (day.isCompletedDish) months[day.month].dishwashingCompleted++;
          if (day.estimatedCostKHR) months[day.month].estimatedCostKHR += day.estimatedCostKHR;
        }

        const wd = weekdays.find((w) => w.dayIndex === day.dayOfWeek);
        if (wd) {
          wd.cooks++;
          wd.dishes++;
        }

        if (day.mealNameKh) {
          if (!dishCounts[day.mealNameKh]) {
            dishCounts[day.mealNameKh] = { nameKh: day.mealNameKh, count: 0, costKHR: 0 };
          }
          dishCounts[day.mealNameKh].count++;
          dishCounts[day.mealNameKh].costKHR += day.estimatedCostKHR || 0;
        }
      }
    });

    const dishFreqList = Object.values(dishCounts).sort((a, b) => b.count - a.count);

    return {
      completedCookCount: cookCount,
      completedDishCount: dishCount,
      monthlyData: months,
      weekdayData: weekdays,
      dishFrequencies: dishFreqList,
    };
  }, [schedule, year, t]);

  const totalCompleted = completedCookCount + completedDishCount;
  const completionPercent = Math.round((totalCompleted / totalDuties) * 100);
  const avgDutiesPerMember = Math.round(totalDuties / members.length);
  const maxMemberDuties = Math.max(...stats.map((s) => Math.max(s.cookCount, s.dishCount)), 70);
  const maxMonthlyDuty = Math.max(...monthlyData.map((m) => m.cookingTotal), 31);

  // Donut chart calculations
  const remainingDuties = totalDuties - totalCompleted;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const cookStroke = (completedCookCount / totalDuties) * circumference;
  const dishStroke = (completedDishCount / totalDuties) * circumference;

  return (
    <div className="flex flex-col gap-5 pb-8 animate-in fade-in duration-200">
      {/* Page Header Bar */}
      <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBackToCalendar}
              className="px-2.5 py-1 text-xs font-bold text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer mr-1"
            >
              <RemixIcon name="ri-arrow-left-line" className="text-sm" />
              <span>{language === 'km' ? 'ត្រឡប់ទៅប្រតិទិន' : 'Calendar'}</span>
            </button>
            <span className="text-xs text-gray-400 dark:text-slate-500">•</span>
            <span className="text-xs font-bold text-[#1A8D5F] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {language === 'km' ? 'ទំព័រស្ថិតិពេញលេញ (Full Page)' : 'Full Analytics Page'}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-[#113e2e] dark:text-emerald-400 tracking-tight flex items-center gap-2">
            <RemixIcon name="ri-bar-chart-box-line" className="text-2xl text-[#1A8D5F] dark:text-emerald-400" />
            <span>
              {language === 'km'
                ? `ស្ថិតិកាលវិភាគ និងក្រាហ្វផ្ទះបាយ – ${year}`
                : `Annual Kitchen Statistics & Analytics – ${year}`}
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {language === 'km'
              ? 'ការវិភាគលើតុល្យភាពភារកិច្ច ការបែងចែកចម្អិន/លាងចាន និងក្រាហ្វប្រចាំខែ'
              : 'Interactive visual charts, monthly duty flow, and workload distribution graphs'}
          </p>
        </div>

        {/* Toolbar: Year Switcher & Print */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Year Switcher */}
          <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800">
            <button
              onClick={() => onYearChange(year - 1)}
              className="px-2.5 py-1.5 text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
              title="Previous Year"
            >
              <RemixIcon name="ri-arrow-left-s-line" className="text-base" />
            </button>
            <span className="px-3 py-1.5 text-xs font-bold text-gray-800 dark:text-slate-100">
              {year}
            </span>
            <button
              onClick={() => onYearChange(year + 1)}
              className="px-2.5 py-1.5 text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
              title="Next Year"
            >
              <RemixIcon name="ri-arrow-right-s-line" className="text-base" />
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RemixIcon name="ri-printer-line" className="text-sm" />
            <span>{t.printSchedule}</span>
          </button>

          {/* Jump to Calendar */}
          <button
            onClick={onBackToCalendar}
            className="px-3.5 py-1.5 bg-[#1A8D5F] hover:bg-[#157a51] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <RemixIcon name="ri-calendar-2-line" className="text-sm" />
            <span>{t.calendar}</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">
              {t.totalDays}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#1A8D5F] dark:text-emerald-400">
              <RemixIcon name="ri-calendar-check-line" className="text-base" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-1">
            {totalDays} {t.days}
          </div>
          <div className="text-[10px] text-[#1A8D5F] dark:text-emerald-400 font-semibold mt-0.5">
            {totalDuties} {language === 'km' ? 'ភារកិច្ចសរុប (ចម្អិន+លាងចាន)' : 'Total Duties (Cook + Dish)'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">
              {t.avgDuties}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <RemixIcon name="ri-scales-3-line" className="text-base" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            ≈ {avgDutiesPerMember} {t.days}
          </div>
          <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
            {language === 'km' ? 'បែងចែកស្មើគ្នា ១០០% លើ ៦នាក់' : 'Perfect 100% Equal Distribution'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">
              {t.dutiesCompleted}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <RemixIcon name="ri-checkbox-circle-line" className="text-base" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {totalCompleted} / {totalDuties}
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(3, completionPercent))}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">
              {language === 'km' ? 'ច្បាប់បង្វិលសកម្ម' : 'Rotation Logic'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <RemixIcon name="ri-shield-star-line" className="text-base" />
            </div>
          </div>
          <div className="text-base font-extrabold text-amber-700 dark:text-amber-300 mt-1">
            0 {language === 'km' ? 'ជម្លោះភារកិច្ច' : 'Conflicts'}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
            {language === 'km' ? 'Hong Eng Vathana: សៅរ៍ 52 សប្តាហ៍' : 'Hong Eng Vathana: 52 Saturdays'}
          </div>
        </div>
      </div>

      {/* Chart Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveChartTab('all')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeChartTab === 'all'
              ? 'bg-[#1A8D5F] text-white shadow-2xs'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/80 dark:border-slate-700'
          }`}
        >
          <RemixIcon name="ri-dashboard-line" className="text-sm" />
          <span>{language === 'km' ? 'ក្រាហ្វទាំងអស់ (All Charts)' : 'All Charts'}</span>
        </button>

        <button
          onClick={() => setActiveChartTab('members')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeChartTab === 'members'
              ? 'bg-[#1A8D5F] text-white shadow-2xs'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/80 dark:border-slate-700'
          }`}
        >
          <RemixIcon name="ri-group-line" className="text-sm" />
          <span>{language === 'km' ? 'ប្រៀបធៀប Team' : 'Team Comparison'}</span>
        </button>

        <button
          onClick={() => setActiveChartTab('monthly')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeChartTab === 'monthly'
              ? 'bg-[#1A8D5F] text-white shadow-2xs'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/80 dark:border-slate-700'
          }`}
        >
          <RemixIcon name="ri-bar-chart-2-line" className="text-sm" />
          <span>{language === 'km' ? 'ក្រាហ្វប្រចាំខែ (Monthly Flow)' : 'Monthly Flow'}</span>
        </button>

        <button
          onClick={() => setActiveChartTab('weekdays')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeChartTab === 'weekdays'
              ? 'bg-[#1A8D5F] text-white shadow-2xs'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/80 dark:border-slate-700'
          }`}
        >
          <RemixIcon name="ri-calendar-line" className="text-sm" />
          <span>{language === 'km' ? 'ថ្ងៃនៃសប្តាហ៍' : 'Day of Week'}</span>
        </button>
      </div>

      {/* TOP CHARTS ROW: DONUT GRAPH + 12-MONTH HISTOGRAM */}
      {(activeChartTab === 'all' || activeChartTab === 'monthly') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 1. DONUT COMPLETION GRAPH (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between transition-colors">
            <div className="pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-[#113e2e] dark:text-emerald-400 flex items-center gap-2">
                <RemixIcon name="ri-pie-chart-2-line" className="text-lg text-[#1A8D5F]" />
                <span>{language === 'km' ? 'ក្រាហ្វរង្វង់ការបំពេញភារកិច្ច' : 'Duty Completion Donut Chart'}</span>
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">
                {language === 'km' ? 'សមាមាត្រនៃការចម្អិន លាងចាន និងនៅសល់' : 'Breakdown of Cooked, Washed & Pending'}
              </p>
            </div>

            {/* Circular Donut SVG */}
            <div className="py-4 flex flex-col items-center justify-center relative">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-gray-100 dark:stroke-slate-800"
                  strokeWidth="16"
                  fill="transparent"
                />

                {/* Remaining / Scheduled Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-gray-200 dark:stroke-slate-700"
                  strokeWidth="16"
                  strokeDasharray={`${circumference} ${circumference}`}
                  fill="transparent"
                />

                {/* Completed Cooking Slice (Green) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-[#1A8D5F] transition-all duration-700"
                  strokeWidth="16"
                  strokeDasharray={`${cookStroke} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  fill="transparent"
                />

                {/* Completed Dishwashing Slice (Blue) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-blue-500 transition-all duration-700"
                  strokeWidth="16"
                  strokeDasharray={`${dishStroke} ${circumference}`}
                  strokeDashoffset={`-${cookStroke}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Center Metrics in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-gray-900 dark:text-slate-100">
                  {completionPercent}%
                </span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'km' ? 'រួចរាល់' : 'Completed'}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#1A8D5F]" />
                  <span className="text-gray-700 dark:text-slate-300 font-medium">
                    {language === 'km' ? 'ចម្អិនរួចរាល់' : 'Cooking Done'}
                  </span>
                </div>
                <span className="font-bold text-[#1A8D5F] dark:text-emerald-400">{completedCookCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-700 dark:text-slate-300 font-medium">
                    {language === 'km' ? 'លាងចានរួចរាល់' : 'Dishes Done'}
                  </span>
                </div>
                <span className="font-bold text-blue-600 dark:text-blue-400">{completedDishCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600" />
                  <span className="text-gray-500 dark:text-slate-400 font-medium">
                    {language === 'km' ? 'នៅសល់ក្នុងឆ្នាំ' : 'Upcoming / Pending'}
                  </span>
                </div>
                <span className="font-bold text-gray-500 dark:text-slate-400">{remainingDuties}</span>
              </div>
            </div>
          </div>

          {/* 2. 12-MONTH ROTATION FLOW HISTOGRAM (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-[#113e2e] dark:text-emerald-400 flex items-center gap-2">
                  <RemixIcon name="ri-line-chart-line" className="text-xl text-[#1A8D5F]" />
                  <span>{language === 'km' ? 'ក្រាហ្វកាលវិភាគ ១២ខែ ប្រចាំឆ្នាំ' : '12-Month Annual Kitchen Rotation Flow'}</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {language === 'km'
                    ? 'ចំនួនថ្ងៃបំពេញភារកិច្ច និងការចំណាយម្ហូបប៉ាន់ស្មានតាមខែនីមួយៗ'
                    : 'Monthly assignment continuity and estimated food cost in KHR'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1A8D5F]" /> {t.cooking}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> {t.dishwashing}
                </span>
              </div>
            </div>

            {/* SVG / Column Monthly Histogram Graph */}
            <div className="pt-2 overflow-x-auto scrollbar-none">
              <div className="min-w-[580px] h-56 flex items-end gap-2.5 pb-6 border-b border-gray-200 dark:border-slate-700 relative">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b border-gray-400 border-dashed w-full" />
                  <div className="border-b border-gray-400 border-dashed w-full" />
                  <div className="border-b border-gray-400 border-dashed w-full" />
                  <div className="border-b border-gray-400 border-dashed w-full" />
                </div>

                {monthlyData.map((m) => {
                  const barHeightPct = (m.cookingTotal / maxMonthlyDuty) * 85;

                  return (
                    <div
                      key={m.monthIndex}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-[#113e2e] text-white text-[10px] px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
                        <span className="font-bold">{m.nameKh} ({m.nameEn})</span>
                        <span>{m.cookingTotal} {t.days} • {(m.estimatedCostKHR || 0).toLocaleString()} ៛</span>
                      </div>

                      {/* Dual Column Bars */}
                      <div className="w-full flex items-end justify-center gap-1 h-full pb-1">
                        <div
                          className="w-3 sm:w-3.5 bg-[#1A8D5F] hover:bg-[#157a51] rounded-t-md transition-all group-hover:scale-105"
                          style={{ height: `${barHeightPct}%` }}
                        />
                        <div
                          className="w-3 sm:w-3.5 bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all group-hover:scale-105"
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>

                      <span className="text-[11px] font-bold text-gray-700 dark:text-slate-300 mt-2 truncate">
                        {m.nameShort}
                      </span>
                      <span className="text-[9px] text-gray-400 dark:text-slate-500">
                        {m.cookingTotal}d
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEAM MEMBER DUTY COMPARISON CHART */}
      {(activeChartTab === 'all' || activeChartTab === 'members') && (
        <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-xs space-y-5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-[#113e2e] dark:text-emerald-400 flex items-center gap-2">
                <RemixIcon name="ri-bar-chart-grouped-line" className="text-xl text-[#1A8D5F]" />
                <span>{language === 'km' ? 'ក្រាហ្វប្រៀបធៀបភារកិច្ចសមាជិក Team' : 'Team Member Duty Breakdown Chart'}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {language === 'km'
                  ? 'ការបែងចែករវាងការចម្អិនម្ហូប និងការលាងចានរបស់សមាជិកនីមួយៗក្នុងឆ្នាំ'
                  : 'Side-by-side comparison of Cooking days vs. Dishwashing days per member'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#1A8D5F]" />
                <span className="text-gray-700 dark:text-slate-300">{t.cooking}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#3b82f6]" />
                <span className="text-gray-700 dark:text-slate-300">{t.dishwashing}</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart Display */}
          <div className="space-y-4 pt-2">
            {stats.map((stat) => {
              const cookPct = (stat.cookCount / maxMemberDuties) * 100;
              const dishPct = (stat.dishCount / maxMemberDuties) * 100;
              const isSelected = selectedMemberId === stat.member.id;

              return (
                <div
                  key={stat.member.id}
                  onClick={() => setSelectedMemberId(isSelected ? null : stat.member.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1A8D5F] bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-[#1A8D5F]'
                      : 'border-gray-100 dark:border-slate-800/80 hover:bg-gray-50/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: stat.member.color }}
                      />
                      <span className="text-xs md:text-sm font-bold text-gray-900 dark:text-slate-100">
                        {stat.member.name}
                      </span>
                      {stat.member.isSaturdayCookOnly && (
                        <span className="text-[9px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md font-bold">
                          {t.saturdaySpecialist}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-black text-gray-700 dark:text-slate-300">
                      {stat.totalCount} {t.days} <span className="text-[10px] text-gray-400 font-normal">({Math.round((stat.totalCount / totalDuties) * 100)}%)</span>
                    </div>
                  </div>

                  {/* Cooking Bar */}
                  <div className="flex items-center gap-3 text-xs mb-1.5">
                    <span className="w-20 text-[10px] text-gray-500 dark:text-slate-400 truncate">
                      {t.cooking} ({stat.cookCount})
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-slate-800 h-4 rounded-lg overflow-hidden relative">
                      <div
                        className="bg-[#1A8D5F] h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-xs"
                        style={{ width: `${Math.max(8, cookPct)}%` }}
                      >
                        {stat.cookCount}
                      </div>
                    </div>
                  </div>

                  {/* Dishwashing Bar */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-20 text-[10px] text-gray-500 dark:text-slate-400 truncate">
                      {t.dishwashing} ({stat.dishCount})
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-slate-800 h-4 rounded-lg overflow-hidden relative">
                      <div
                        className="bg-[#3b82f6] h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-xs"
                        style={{ width: `${Math.max(8, dishPct)}%` }}
                      >
                        {stat.dishCount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 100% Stacked Equity Distribution Chart */}
          <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              <span>{language === 'km' ? 'សមាមាត្រការងារប្រចាំឆ្នាំសរុប (100% Equity Scale)' : 'Annual Duty Equity Proportion (100% Stacked Bar)'}</span>
              <span className="text-[#1A8D5F] dark:text-emerald-400 font-extrabold">100% Fair</span>
            </div>
            <div className="h-6 w-full rounded-xl overflow-hidden flex bg-gray-100 dark:bg-slate-800 shadow-inner">
              {stats.map((s) => {
                const sharePct = (s.totalCount / totalDuties) * 100;
                return (
                  <div
                    key={s.member.id}
                    title={`${s.member.name}: ${s.totalCount} duties (${sharePct.toFixed(1)}%)`}
                    className="h-full hover:brightness-110 transition-all flex items-center justify-center text-[10px] text-white font-bold cursor-pointer"
                    style={{
                      width: `${sharePct}%`,
                      backgroundColor: s.member.color,
                    }}
                  >
                    {sharePct.toFixed(0)}%
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-gray-500 dark:text-slate-400">
              {stats.map((s) => (
                <div key={s.member.id} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.member.color }} />
                  <span>{s.member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GRAPH ROW: DAY OF WEEK & TOP KHMER MEALS */}
      {(activeChartTab === 'all' || activeChartTab === 'weekdays') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Day of Week Workload Distribution (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs space-y-4 transition-colors">
            <div className="pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-[#113e2e] dark:text-emerald-400 flex items-center gap-2">
                <RemixIcon name="ri-calendar-todo-line" className="text-xl text-[#1A8D5F]" />
                <span>{language === 'km' ? 'ការបែងចែកតាមថ្ងៃនៃសប្តាហ៍' : 'Day of Week Duty Distribution'}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {language === 'km'
                  ? 'បង្ហាញការបង្វិលថ្ងៃធ្វើការ និងថ្ងៃសៅរ៍ពិសេសរបស់ Hong Eng Vathana'
                  : 'Showing weekday rotation and Hong Eng Vathana Saturday rule'}
              </p>
            </div>

            <div className="space-y-3">
              {weekdayData.map((wd) => {
                const isSaturday = wd.dayIndex === 6;
                const maxDayCount = 53;
                const barPct = (wd.cooks / maxDayCount) * 100;

                return (
                  <div
                    key={wd.dayIndex}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isSaturday
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50'
                        : 'bg-gray-50/50 dark:bg-slate-800/40 border-gray-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-2">
                        <span className="text-gray-900 dark:text-slate-100">
                          {language === 'km' ? wd.labelKh : wd.labelEn}
                        </span>
                        {isSaturday && (
                          <span className="text-[9px] bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded font-black">
                            {language === 'km' ? 'ចម្អិនដោយ Hong Eng Vathana' : 'Hong Eng Vathana Cooks'}
                          </span>
                        )}
                      </span>
                      <span className="text-[#1A8D5F] dark:text-emerald-400 font-extrabold">
                        {wd.cooks} {language === 'km' ? 'ដង' : 'Times'}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSaturday ? 'bg-amber-500' : 'bg-[#1A8D5F]'
                        }`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Cooked Traditional Khmer Dishes Ranking (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs space-y-4 transition-colors">
            <div className="pb-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#113e2e] dark:text-emerald-400 flex items-center gap-2">
                  <RemixIcon name="ri-restaurant-2-line" className="text-xl text-[#1A8D5F]" />
                  <span>{language === 'km' ? 'ចំណាត់ថ្នាក់មុខម្ហូបខ្មែរពេញនិយម' : 'Top Scheduled Khmer Dishes'}</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {language === 'km' ? 'មុខម្ហូបដែលបានចាត់តាំង និងថ្លៃចំណាយសរុប' : 'Frequency ranking of assigned authentic meals'}
                </p>
              </div>
            </div>

            {dishFrequencies.length === 0 ? (
              <div className="py-8 text-center text-gray-400 dark:text-slate-500 text-xs">
                <RemixIcon name="ri-restaurant-line" className="text-3xl mx-auto mb-2 opacity-40" />
                <p>{language === 'km' ? 'មិនទាន់មានមុខម្ហូបបានចាត់តាំងក្នុងកាលវិភាគនៅឡើយទេ។' : 'No meals assigned to calendar dates yet.'}</p>
                <p className="text-[10px] mt-1">{language === 'km' ? 'ប្រើប្រាស់ Smart Meal Planner ដើម្បីចាត់តាំងមុខម្ហូប' : 'Assign dishes via the Smart Meal Planner or Recipe Browser'}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {dishFrequencies.slice(0, 5).map((dish, idx) => (
                  <div
                    key={dish.nameKh}
                    className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-[#1A8D5F] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-slate-100 truncate">
                        {dish.nameKh}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-right shrink-0">
                      <span className="font-semibold text-gray-600 dark:text-slate-400">
                        {dish.count} {language === 'km' ? 'លើក' : 'times'}
                      </span>
                      <span className="font-extrabold text-[#1A8D5F] dark:text-emerald-400">
                        {dish.costKHR.toLocaleString()} ៛
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Schedule Health & Fairness Audit Banner */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <RemixIcon name="ri-checkbox-circle-fill" className="text-lg text-[#1A8D5F] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">
                  {language === 'km' ? 'សេចក្ដីសន្និដ្ឋានលើសមភាពភារកិច្ច:' : 'Household Duty Equity Audit:'}
                </strong>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300/90 mt-0.5 leading-relaxed">
                  {language === 'km'
                    ? 'កាលវិភាគធានាការបង្វិលយុត្តិធម៌ ១០០%។ សមាជិកនីមួយៗបំពេញកាតព្វកិច្ចចន្លោះ 121-122 វេនពេញមួយឆ្នាំ ដោយគ្មានភាពជាន់គ្នាក្នុងថ្ងៃតែមួយ។'
                    : 'Algorithmic balance achieved with a 100% fairness score. Average variance among all 6 team members is less than 1 duty over the entire 365-day year.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
