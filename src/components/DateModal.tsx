import React, { useState, useEffect } from 'react';
import { RemixIcon } from './RemixIcon';
import { DayAssignment, TeamMember } from '../types/schedule';
import { RecipeService } from '../services/recipeService';
import { Language, TRANSLATIONS } from '../services/languageService';

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: DayAssignment | null;
  members: TeamMember[];
  onSaveAssignment: (updated: DayAssignment) => void;
  language: Language;
}

export const DateModal: React.FC<DateModalProps> = ({
  isOpen,
  onClose,
  assignment,
  members,
  onSaveAssignment,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [cookId, setCookId] = useState('');
  const [dishId, setDishId] = useState('');
  const [mealId, setMealId] = useState<string>('');
  const [isCompletedCook, setIsCompletedCook] = useState(false);
  const [isCompletedDish, setIsCompletedDish] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recipes = RecipeService.getAllRecipes();

  useEffect(() => {
    if (assignment) {
      setCookId(assignment.cookId);
      setDishId(assignment.dishId);
      setMealId(assignment.mealId || '');
      setIsCompletedCook(!!assignment.isCompletedCook);
      setIsCompletedDish(!!assignment.isCompletedDish);
      setNotes(assignment.notes || '');
      setError(null);
    }
  }, [assignment]);

  if (!isOpen || !assignment) return null;

  const monthName = t.months[assignment.month];
  const weekday = t.weekdaysFull[assignment.dayOfWeek];
  const selectedRecipe = recipes.find((r) => r.id === mealId);

  const handleSave = () => {
    if (cookId === dishId) {
      setError(language === 'km' ? 'មនុស្សម្នាក់មិនអាចចម្អិន និងលាងចានក្នុងថ្ងៃតែមួយបានទេ!' : 'A person cannot be assigned to cook and wash dishes on the same day.');
      return;
    }

    const cook = members.find((m) => m.id === cookId);
    const dish = members.find((m) => m.id === dishId);

    const updated: DayAssignment = {
      ...assignment,
      cookId,
      cookName: cook ? cook.name : assignment.cookName,
      dishId,
      dishName: dish ? dish.name : assignment.dishName,
      mealId: mealId || null,
      mealNameKh: selectedRecipe ? selectedRecipe.nameKh : (assignment.mealNameKh || null),
      estimatedCostKHR: selectedRecipe ? selectedRecipe.estimatedCostKHR : null,
      isCompletedCook,
      isCompletedDish,
      notes: notes.trim(),
      isManualOverride: true,
    };

    onSaveAssignment(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="bg-[#ebf7ef] dark:bg-emerald-950/40 px-6 py-4 flex items-center justify-between border-b border-[#d4edd9] dark:border-emerald-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <RemixIcon name="ri-calendar-2-line" className="text-xl text-[#1A8D5F] dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-[#113e2e] dark:text-emerald-300">
                {monthName} {assignment.day}, {assignment.year}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                {weekday} • {language === 'km' ? 'កាលវិភាគ និងម្ហូប' : 'Kitchen Assignment & Meal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
          >
            <RemixIcon name="ri-close-line" className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-rose-800/50 text-red-700 dark:text-rose-300 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Assigned Khmer Meal Selection */}
          <div className="space-y-1.5 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-800/40">
            <label className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <RemixIcon name="ri-restaurant-2-line" className="text-sm text-[#1A8D5F] dark:text-emerald-400" />
                <span>{t.plannedKhmerDish}</span>
              </span>
              {selectedRecipe?.estimatedCostKHR && (
                <span className="text-[#1A8D5F] dark:text-emerald-400 font-black">
                  ≈ {selectedRecipe.estimatedCostKHR.toLocaleString()} ៛
                </span>
              )}
            </label>
            <select
              value={mealId}
              onChange={(e) => setMealId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A8D5F]"
            >
              <option value="">{t.noMealAssigned}</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nameKh} ({r.nameEn}) - {(r.estimatedCostKHR || 0).toLocaleString()} ៛
                </option>
              ))}
            </select>
          </div>

          {/* Cooking Assignment */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-300">
              <RemixIcon name="ri-restaurant-line" className="text-base text-[#1A8D5F] dark:text-emerald-400" />
              <span>{t.cooking}</span>
            </label>
            <select
              value={cookId}
              onChange={(e) => {
                setCookId(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A8D5F]"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.isSaturdayCookOnly ? `(${t.saturdaySpecialist})` : ''}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 pt-1 text-xs text-gray-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompletedCook}
                onChange={(e) => setIsCompletedCook(e.target.checked)}
                className="rounded text-[#1A8D5F] focus:ring-[#1A8D5F]"
              />
              <span>{t.markCookingCompleted}</span>
            </label>
          </div>

          {/* Dishwashing Assignment */}
          <div className="space-y-1.5 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-300">
              <RemixIcon name="ri-disc-line" className="text-base text-[#3b82f6] dark:text-blue-400" />
              <span>{t.dishwashing}</span>
            </label>
            <select
              value={dishId}
              onChange={(e) => {
                setDishId(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 pt-1 text-xs text-gray-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompletedDish}
                onChange={(e) => setIsCompletedDish(e.target.checked)}
                className="rounded text-[#3b82f6] focus:ring-[#3b82f6]"
              />
              <span>{t.markDishCompleted}</span>
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-300">
              <RemixIcon name="ri-file-text-line" className="text-sm text-gray-500 dark:text-slate-400" />
              <span>{t.notesRemarks}</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra spicy, guests visiting..."
              rows={2}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A8D5F]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-900 px-6 py-3 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1A8D5F] hover:bg-[#157a51] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RemixIcon name="ri-checkbox-circle-line" className="text-sm" />
            <span>{t.saveAssignment}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
