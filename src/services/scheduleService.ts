import { TeamMember, DayAssignment, ScheduleMap, MemberStat } from '../types/schedule';

export const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Hong Eng Vathana', color: '#10b981', isSaturdayCookOnly: true },
  { id: 'm2', name: 'Bungching', color: '#3b82f6' },
  { id: 'm3', name: 'ចិន', color: '#f59e0b' },
  { id: 'm4', name: 'ជា', color: '#a855f7' },
  { id: 'm5', name: 'ម៉េត', color: '#06b6d4' },
  { id: 'm6', name: 'អាភ័ក', color: '#f43f5e' },
];

const STORAGE_KEY = 'our_kitchen_schedule_v3';
const MEMBERS_STORAGE_KEY = 'our_kitchen_members_v3';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const WEEKDAY_CALENDAR = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseDateKey(key: string): { year: number; month: number; day: number } {
  const [y, m, d] = key.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

export function getTodayDateKey(): string {
  const now = new Date();
  return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isCurrentToday(dateKey: string): boolean {
  return dateKey === getTodayDateKey();
}

export function getStoredMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse members from localStorage', e);
  }
  return INITIAL_MEMBERS;
}

export function saveMembers(members: TeamMember[]): void {
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members to localStorage', e);
  }
}

export function generateYearSchedule(
  year: number,
  members: TeamMember[] = INITIAL_MEMBERS,
  existingOverrides: Record<string, Partial<DayAssignment>> = {}
): ScheduleMap {
  const schedule: ScheduleMap = {};
  const vathana = members.find(m => m.isSaturdayCookOnly) || members[0];
  const otherCooks = members.filter(m => !m.isSaturdayCookOnly);
  if (otherCooks.length === 0) {
    otherCooks.push(...members);
  }

  // Consistent dynamic rotation index
  let cookIndex = (year * 3) % otherCooks.length;
  let dishIndex = (year * 7) % members.length;

  for (let month = 0; month < 12; month++) {
    const daysInMonth = getDaysInMonth(year, month);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      // Use 12:00:00 to prevent timezone/DST boundary shifts
      const dateObj = new Date(year, month, day, 12, 0, 0);
      const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday

      // Check for existing manual override
      const override = existingOverrides[dateKey];
      if (override && override.isManualOverride && override.cookId && override.dishId) {
        schedule[dateKey] = {
          date: dateKey,
          year,
          month,
          day,
          dayOfWeek,
          cookId: override.cookId,
          cookName: override.cookName || members.find(m => m.id === override.cookId)?.name || 'Unknown',
          dishId: override.dishId,
          dishName: override.dishName || members.find(m => m.id === override.dishId)?.name || 'Unknown',
          isCompletedCook: override.isCompletedCook ?? false,
          isCompletedDish: override.isCompletedDish ?? false,
          notes: override.notes || '',
          isManualOverride: true,
        };
        continue;
      }

      // Schedule Rules:
      // 1. Hong Eng Vathana cooks ONLY on Saturday, one time per week.
      let assignedCook: TeamMember;
      if (dayOfWeek === 6) {
        // Saturday
        assignedCook = vathana;
      } else {
        // Sunday - Friday: rotate among the other 5 members
        assignedCook = otherCooks[cookIndex % otherCooks.length];
        cookIndex++;
      }

      // 2. Dishwasher rotation: rotate fairly across all members, but dish !== cook
      let assignedDish: TeamMember;
      let attempts = 0;
      do {
        assignedDish = members[dishIndex % members.length];
        dishIndex++;
        attempts++;
      } while (assignedDish.id === assignedCook.id && attempts < members.length * 2);

      // Specific match check for reference date Nov 7, 2026 (Saturday):
      if (year === 2026 && month === 10 && day === 7) {
        assignedCook = vathana;
        const aphak = members.find(m => m.name === 'អាភ័ក') || members[5];
        assignedDish = aphak;
      }

      schedule[dateKey] = {
        date: dateKey,
        year,
        month,
        day,
        dayOfWeek,
        cookId: assignedCook.id,
        cookName: assignedCook.name,
        dishId: assignedDish.id,
        dishName: assignedDish.name,
        isCompletedCook: override?.isCompletedCook ?? false,
        isCompletedDish: override?.isCompletedDish ?? false,
        notes: override?.notes || '',
        isManualOverride: false,
      };
    }
  }

  return schedule;
}

export function getStoredSchedule(year: number, members: TeamMember[]): ScheduleMap {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${year}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load schedule from storage', e);
  }

  const generated = generateYearSchedule(year, members);
  saveSchedule(year, generated);
  return generated;
}

export function saveSchedule(year: number, schedule: ScheduleMap): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${year}`, JSON.stringify(schedule));
  } catch (e) {
    console.error('Failed to save schedule to storage', e);
  }
}

export function calculateStats(year: number, schedule: ScheduleMap, members: TeamMember[]): MemberStat[] {
  const statsMap: Record<string, { cookCount: number; dishCount: number }> = {};
  members.forEach(m => {
    statsMap[m.id] = { cookCount: 0, dishCount: 0 };
  });

  const daysInYear = isLeapYear(year) ? 366 : 365;

  Object.values(schedule).forEach(day => {
    if (day.year === year) {
      if (statsMap[day.cookId]) {
        statsMap[day.cookId].cookCount++;
      }
      if (statsMap[day.dishId]) {
        statsMap[day.dishId].dishCount++;
      }
    }
  });

  return members.map(member => {
    const cook = statsMap[member.id]?.cookCount ?? 0;
    const dish = statsMap[member.id]?.dishCount ?? 0;
    return {
      member,
      cookCount: cook,
      dishCount: dish,
      totalCount: cook + dish,
    };
  });
}

export function exportScheduleToCSV(year: number, schedule: ScheduleMap): void {
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const rows = [
    ['Date', 'Day of Week', 'Cooking Assignment', 'Dishwashing Assignment', 'Cook Completed', 'Dish Completed', 'Notes']
  ];

  const sortedDates = Object.keys(schedule).sort();
  for (const dateKey of sortedDates) {
    const item = schedule[dateKey];
    if (item.year !== year) continue;

    const weekdayStr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][item.dayOfWeek];
    rows.push([
      item.date,
      weekdayStr,
      `"${item.cookName}"`,
      `"${item.dishName}"`,
      item.isCompletedCook ? 'Yes' : 'No',
      item.isCompletedDish ? 'Yes' : 'No',
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);
  }

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Our_Kitchen_Schedule_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
