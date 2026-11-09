export type Language = 'en' | 'km';

const LANG_STORAGE_KEY = 'our_kitchen_lang_v1';

export const TRANSLATIONS = {
  en: {
    brandTitle: 'Our Kitchen',
    brandSubtitle: 'Weekly • Monthly • Yearly Schedule',
    calendar: 'Calendar',
    mealPlanner: 'Meal Planner',
    khmerFood: 'Khmer Food',
    budgetShop: 'Budget & Shop',
    statistics: 'Statistics',
    settings: 'Settings',
    motto: 'Share • Cook • Enjoy Together',
    todaysCooking: "Today's Cooking",
    todaysDishwashing: "Today's Dishwashing",
    cookingDuty: 'Cooking Duty',
    dishwashingDuty: 'Dishwashing Duty',
    nextDay: 'Next Day',
    nextDayDuties: 'Next Day Duties',
    thisYearSummary: 'This Year Summary',
    cooking: 'Cooking',
    dishwashing: 'Dishwashing',
    days: 'Days',
    annualCalendar: 'Annual Calendar',
    today: 'Today',
    searchDate: 'Search date...',
    filterAll: 'All (Show Everyone)',
    filterByMember: 'Filter by Member',
    clearFilter: 'Clear Filter',
    quickView: 'Quick View',
    teamMembers: 'Team Members',
    generateSchedule: 'Generate New Schedule',
    exportCSV: 'Export to CSV',
    printSchedule: 'Print Schedule',
    heroTitle: 'Our Kitchen Schedule',
    heroSubtitle: 'A fair and organized plan for a happy home 😁',
    goodFood: 'Good Food Good Mood!',
    saturdaySpecialist: 'Saturday Specialist',
    dutiesCompleted: 'Duties Completed',
    totalDays: 'Total Calendar Days',
    avgDuties: 'Avg Duties / Person',
    monthView: 'Month View',
    fullYearView: 'Full Year',
    selectDatePrompt: 'Select a date to view duties',
    plannedKhmerDish: 'Planned Khmer Dish',
    noMealAssigned: '-- No meal assigned --',
    markCookingCompleted: 'Mark cooking as completed',
    markDishCompleted: 'Mark dishwashing as completed',
    markComplete: 'Mark as completed',
    markIncomplete: 'Mark as incomplete',
    notesRemarks: 'Notes / Meal Remarks',
    saveAssignment: 'Save Assignment',
    cancel: 'Cancel',
    close: 'Close',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    khmer: 'ភាសាខ្មែរ',
    english: 'English',
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdaysShort: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  km: {
    brandTitle: 'ផ្ទះបាយយើង',
    brandSubtitle: 'កាលវិភាគ ប្រចាំសប្តាហ៍ • ប្រចាំខែ • ប្រចាំឆ្នាំ',
    calendar: 'ប្រតិទិន',
    mealPlanner: 'គម្រោងម្ហូប',
    khmerFood: 'មុខម្ហូបខ្មែរ',
    budgetShop: 'ថវិកា & ផ្សារ',
    statistics: 'ស្ថិតិ',
    settings: 'ការកំណត់',
    motto: 'ចែករំលែក • ចម្អិន • រីករាយជាមួយគ្នា',
    todaysCooking: 'អ្នកចម្អិនថ្ងៃនេះ',
    todaysDishwashing: 'អ្នកលាងចានថ្ងៃនេះ',
    cookingDuty: 'អ្នកត្រូវចម្អិន',
    dishwashingDuty: 'អ្នកត្រូវលាងចាន',
    nextDay: 'ថ្ងៃបន្ទាប់',
    nextDayDuties: 'ភារកិច្ចថ្ងៃបន្ទាប់',
    thisYearSummary: 'សង្ខេបប្រចាំឆ្នាំ',
    cooking: 'ចម្អិនម្ហូប',
    dishwashing: 'លាងចាន',
    days: 'ថ្ងៃ',
    annualCalendar: 'ប្រតិទិនប្រចាំឆ្នាំ',
    today: 'ថ្ងៃនេះ',
    searchDate: 'ស្វែងរកថ្ងៃខែ...',
    filterAll: 'ទាំងអស់ (បង្ហាញទាំងអស់)',
    filterByMember: 'ជ្រើសតាមសមាជិក',
    clearFilter: 'សម្អាតការជ្រើស',
    quickView: 'ទិដ្ឋភាពរហ័ស',
    teamMembers: 'Team',
    generateSchedule: 'បង្កើតកាលវិភាគថ្មី',
    exportCSV: 'ទាញយកជា CSV',
    printSchedule: 'បោះពុម្ពកាលវិភាគ',
    heroTitle: 'កាលវិភាគផ្ទះបាយយើង',
    heroSubtitle: 'ផែនការយុត្តិធម៌ និងមានរបៀបរៀបរយ ដើម្បីផ្ទះប្រកបដោយសុភមង្គល 😁',
    goodFood: 'ម្ហូបឆ្ងាញ់ អារម្មណ៍ស្រស់ស្រាយ!',
    saturdaySpecialist: 'អ្នកជំនាញថ្ងៃសៅរ៍',
    dutiesCompleted: 'ភារកិច្ចបានបំពេញ',
    totalDays: 'ចំនួនថ្ងៃសរុប',
    avgDuties: 'មធ្យមភាគ / ម្នាក់',
    monthView: 'ទិដ្ឋភាពខែ',
    fullYearView: 'ពេញមួយឆ្នាំ',
    selectDatePrompt: 'សូមជ្រើសរើសកាលបរិច្ឆេទដើម្បីមើលភារកិច្ច',
    plannedKhmerDish: 'មុខម្ហូបខ្មែរដែលបានគ្រោងទុក',
    noMealAssigned: '-- មិនទាន់មានមុខម្ហូប --',
    markCookingCompleted: 'កត់ត្រាថាបានចម្អិនរួចរាល់',
    markDishCompleted: 'កត់ត្រាថាបានលាងចានរួចរាល់',
    markComplete: 'កត់ត្រាថាបានរួចរាល់',
    markIncomplete: 'កត់ត្រាថាមិនទាន់រួចរាល់',
    notesRemarks: 'កំណត់ចំណាំផ្សេងៗ',
    saveAssignment: 'រក្សាទុកកាលវិភាគ',
    cancel: 'បោះបង់',
    close: 'បិទ',
    darkMode: 'ផ្ទៃងងឹត (Dark)',
    lightMode: 'ផ្ទៃភ្លឺ (Light)',
    language: 'ភាសា (Language)',
    khmer: 'ភាសាខ្មែរ',
    english: 'English',
    months: [
      'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
      'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
    ],
    monthsShort: ['មក', 'កុ', 'មី', 'មេ', 'ឧស', 'មិថុ', 'កក្ក', 'សី', 'កញ', 'តុ', 'វិច្ឆ', 'ធ្នូ'],
    weekdaysShort: ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'],
    weekdaysFull: ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'],
  },
};

export class LanguageService {
  public static getStoredLanguage(): Language {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (stored === 'en' || stored === 'km') {
        return stored;
      }
    } catch (e) {
      console.warn('Failed to load language', e);
    }
    return 'en';
  }

  public static setStoredLanguage(lang: Language): void {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  }

  public static getTranslations(lang: Language) {
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
  }
}
