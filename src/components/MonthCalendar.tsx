import React from 'react';
import { getDaysInMonth, formatDateKey, isCurrentToday } from '../services/scheduleService';
import { ScheduleMap, TeamMember } from '../types/schedule';
import { Language, TRANSLATIONS } from '../services/languageService';

interface MonthCalendarProps {
  year: number;
  monthIndex: number;
  schedule: ScheduleMap;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  filteredMemberId?: string | null;
  members: TeamMember[];
  isMobileExpanded?: boolean;
  language: Language;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  monthIndex,
  schedule,
  selectedDate,
  onSelectDate,
  filteredMemberId,
  members,
  isMobileExpanded = false,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const monthName = t.months[monthIndex];
  const daysInMonth = getDaysInMonth(year, monthIndex);

  // JS getDay(): 0 is Sunday, 1 is Monday... 6 is Saturday
  // Calendar starts on Monday (Mo=0, Tu=1, ..., Su=6)
  const firstDayOfWeek = new Date(year, monthIndex, 1, 12, 0, 0).getDay();
  const leadingBlanks = (firstDayOfWeek + 6) % 7;

  const memberMap = React.useMemo(() => {
    const map = new Map<string, TeamMember>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  const days = [];
  for (let i = 0; i < leadingBlanks; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-colors">
      {/* Month Header Banner */}
      <div className="bg-[#eaf7ee] dark:bg-emerald-950/40 py-1 px-2 text-center text-xs md:text-sm font-bold text-[#14532d] dark:text-emerald-300 tracking-wide">
        {monthName}
      </div>

      {/* Weekday Labels (Mo - Su or ច - អា) */}
      <div className="grid grid-cols-7 text-center text-[10px] md:text-[11px] font-semibold text-gray-500 dark:text-slate-400 py-1 px-1 bg-white dark:bg-slate-900 border-b border-gray-100/60 dark:border-slate-800">
        {t.weekdaysShort.map((w, idx) => (
          <div key={`${w}-${idx}`} className="py-0.5">
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className={`grid grid-cols-7 gap-y-1 gap-x-0.5 text-center p-1 pb-2 ${isMobileExpanded ? 'text-sm gap-y-2 py-2' : 'text-xs'}`}>
        {days.map((dayNum, idx) => {
          if (dayNum === null) {
            return <div key={`blank-${idx}`} className={isMobileExpanded ? 'h-10' : 'h-6'} />;
          }

          const dateKey = formatDateKey(year, monthIndex, dayNum);
          const assignment = schedule[dateKey];
          const isSelected = selectedDate === dateKey;
          const isTodayDate = isCurrentToday(dateKey);

          let isFilterMatch = true;
          if (filteredMemberId && assignment) {
            if (assignment.cookId === filteredMemberId || assignment.dishId === filteredMemberId) {
              isFilterMatch = true;
            } else {
              isFilterMatch = false;
            }
          }

          const cookMember = assignment ? memberMap.get(assignment.cookId) : null;
          const dishMember = assignment ? memberMap.get(assignment.dishId) : null;

          return (
            <div
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              title={
                assignment
                  ? `${dateKey} (${monthName} ${dayNum})\nCooking: ${assignment.cookName}\nDishwashing: ${assignment.dishName}${
                      assignment.mealNameKh ? `\nMeal: ${assignment.mealNameKh}` : ''
                    }${assignment.notes ? `\nNote: ${assignment.notes}` : ''}`
                  : `${dateKey}`
              }
              className={`${
                isMobileExpanded ? 'h-10 min-h-[40px]' : 'h-6'
              } flex flex-col items-center justify-center cursor-pointer select-none rounded-lg transition-all relative group ${
                isSelected
                  ? ''
                  : isTodayDate
                  ? 'ring-1.5 ring-[#1A8D5F] font-bold text-[#1A8D5F] dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40'
                  : isFilterMatch && filteredMemberId
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-300'
                  : 'hover:bg-gray-100/80 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200'
              } ${filteredMemberId && !isFilterMatch ? 'opacity-30' : ''}`}
            >
              {isSelected ? (
                <span
                  className={`${
                    isMobileExpanded ? 'w-7 h-7 text-xs' : 'w-5 h-5 text-[10px]'
                  } rounded-full bg-[#1A8D5F] text-white font-bold flex items-center justify-center shadow-2xs`}
                >
                  {dayNum}
                </span>
              ) : (
                <span className={`${isMobileExpanded ? 'text-xs font-bold' : 'text-[11px] font-medium'} leading-none`}>
                  {dayNum}
                </span>
              )}

              {/* Duty indicator dots underneath */}
              {!isSelected && assignment && (
                <div className={`flex items-center gap-0.5 ${isMobileExpanded ? 'mt-1 h-1.5' : 'mt-0.5 h-1'}`}>
                  <span
                    className={`${isMobileExpanded ? 'w-1.5 h-1.5' : 'w-1 h-1'} rounded-full shrink-0`}
                    style={{ backgroundColor: cookMember?.color || '#1A8D5F' }}
                  />
                  <span
                    className={`${isMobileExpanded ? 'w-1.5 h-1.5' : 'w-1 h-1'} rounded-full shrink-0`}
                    style={{ backgroundColor: dishMember?.color || '#3b82f6' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
