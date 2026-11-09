import React, { useState } from 'react';
import { RemixIcon } from './RemixIcon';
import { MealPlannerPreferences, RecipeRecommendation, MealType, KhmerRecipe } from '../types/schedule';
import { SmartMealPlannerService } from '../services/smartMealPlannerService';
import { RecipeService } from '../services/recipeService';
import { ShoppingAndBudgetService } from '../services/shoppingAndBudgetService';
import { Language, TRANSLATIONS } from '../services/languageService';

interface SmartMealPlannerProps {
  onAssignMealToDate: (recipe: KhmerRecipe) => void;
  onViewRecipeDetails: (recipe: KhmerRecipe) => void;
  onShowToast: (msg: string) => void;
  language: Language;
}

export const SmartMealPlanner: React.FC<SmartMealPlannerProps> = ({
  onAssignMealToDate,
  onViewRecipeDetails,
  onShowToast,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const allPrices = RecipeService.getIngredientPrices();
  const commonIngredients = allPrices.slice(0, 14);

  // Form states
  const [budgetKHR, setBudgetKHR] = useState<number>(18000);
  const [servings, setServings] = useState<number>(4);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [maxCookingTime, setMaxCookingTime] = useState<number>(45);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>(['ing-rice', 'ing-garlic', 'ing-fish-sauce']);

  // Nutrition preference toggles
  const [highProtein, setHighProtein] = useState(false);
  const [highFiber, setHighFiber] = useState(false);
  const [lowerSodium, setLowerSodium] = useState(false);
  const [moreVegetables, setMoreVegetables] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);

  // Results
  const [recommendations, setRecommendations] = useState<RecipeRecommendation[]>(() => {
    return SmartMealPlannerService.recommendMeals({
      budgetKHR: 18000,
      servings: 4,
      mealType: 'lunch',
      availableIngredientIds: ['ing-rice', 'ing-garlic', 'ing-fish-sauce'],
      nutritionGoals: {},
      maxCookingTimeMinutes: 45,
    });
  });

  const handleGenerateRecommendations = () => {
    const preferences: MealPlannerPreferences = {
      budgetKHR,
      servings,
      mealType,
      availableIngredientIds: availableIngredients,
      nutritionGoals: {
        highProtein,
        highFiber,
        lowerSodium,
        moreVegetables,
        vegetarian,
      },
      maxCookingTimeMinutes: maxCookingTime,
    };

    const results = SmartMealPlannerService.recommendMeals(preferences);
    setRecommendations(results);
    onShowToast(language === 'km' ? 'បានធ្វើបច្ចុប្បន្នភាពមុខម្ហូបណែនាំដោយក្បួនគណនា!' : 'Updated smart meal recommendations using local recipe algorithm!');
  };

  const toggleIngredient = (id: string) => {
    setAvailableIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddShopping = (rec: RecipeRecommendation) => {
    ShoppingAndBudgetService.addRecipeToShoppingList(rec.recipe, servings);
    onShowToast(
      language === 'km'
        ? `បានបញ្ចូលគ្រឿងផ្សំសម្រាប់ ${rec.recipe.nameKh} ទៅក្នុងបញ្ជីទិញ!`
        : `Added ingredients for ${rec.recipe.nameKh} to shopping list!`
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner Notice: Algorithm Transparency */}
      <div className="bg-[#ebf7ef] dark:bg-emerald-950/30 border border-[#d2edd9] dark:border-emerald-800/50 rounded-2xl p-4 flex items-start gap-3 shadow-xs transition-colors">
        <RemixIcon name="ri-sparkling-fill" className="text-xl text-[#1A8D5F] dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-[#113e2e] dark:text-emerald-300">
            {language === 'km'
              ? 'ម៉ាស៊ីនណែនាំមុខម្ហូបឆ្លាតវៃ (ក្បួនគណនា TypeScript ក្នុងមូលដ្ឋាន)'
              : 'Smart Household Meal Planner (Local Algorithm Engine)'}
          </h3>
          <p className="text-xs text-gray-600 dark:text-slate-300 mt-0.5 leading-relaxed">
            {language === 'km'
              ? 'វាយតម្លៃមុខម្ហូបខ្មែរពិតប្រាកដដោយផ្អែកលើថវិការៀល (KHR) គ្រឿងផ្សំក្នុងផ្ទះបាយ ចំនួនសមាជិក រយៈពេលចម្អិន និងគោលដៅសុខភាព។ ដំណើរការដោយក្បួន TypeScript ក្នុងម៉ាស៊ីនផ្ទាល់ ១០០% — មិនប្រើប្រាស់ External AI API ឡើយ។'
              : 'Evaluates authentic Khmer recipes locally based on budget in Cambodian Riel (KHR), available pantry items, servings, cooking time, and dietary goals. 100% deterministic local TypeScript algorithms — no external AI API or latency.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Left Controls (Form) & Right (3 Recommended Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Settings Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs space-y-4 transition-colors">
          <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 border-b border-gray-100 dark:border-slate-800 pb-2.5 flex items-center justify-between">
            <span>{language === 'km' ? 'ប៉ារ៉ាម៉ែត្ររៀបចំផែនការ' : 'Planner Parameters'}</span>
            <span className="text-[11px] font-normal text-gray-500 dark:text-slate-400">
              {language === 'km' ? 'ក្បួនគណនា' : 'Local Scoring'}
            </span>
          </h4>

          {/* Budget in KHR */}
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <RemixIcon name="ri-money-cny-circle-line" className="text-sm text-[#1A8D5F] dark:text-emerald-400" />
                <span>{language === 'km' ? 'ថវិកាម្ហូបគោលដៅ (៛)' : 'Target Meal Budget (KHR)'}</span>
              </span>
              <span className="text-[#1A8D5F] dark:text-emerald-400 font-extrabold">{budgetKHR.toLocaleString()} ៛</span>
            </label>
            <input
              type="range"
              min={6000}
              max={40000}
              step={1000}
              value={budgetKHR}
              onChange={(e) => setBudgetKHR(Number(e.target.value))}
              className="w-full accent-[#1A8D5F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
              <span>6,000 ៛</span>
              <span>20,000 ៛</span>
              <span>40,000 ៛</span>
            </div>
          </div>

          {/* Number of People / Servings */}
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <RemixIcon name="ri-group-line" className="text-sm text-[#1A8D5F] dark:text-emerald-400" />
                <span>{language === 'km' ? 'ចំនួនអ្នកទទួលទាន' : 'Household Servings'}</span>
              </span>
              <span className="text-gray-900 dark:text-slate-100 font-bold">
                {servings} {language === 'km' ? 'នាក់' : 'People'}
              </span>
            </label>
            <div className="grid grid-cols-5 gap-1">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setServings(num)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    servings === num
                      ? 'bg-[#1A8D5F] border-[#1A8D5F] text-white shadow-2xs'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5">
              {language === 'km' ? 'ពេលទទួលទាន' : 'Meal Slot'}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  className={`py-1.5 text-xs font-bold rounded-lg capitalize border transition-all cursor-pointer ${
                    mealType === type
                      ? 'bg-[#1A8D5F] border-[#1A8D5F] text-white shadow-2xs'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {type === 'breakfast'
                    ? (language === 'km' ? 'ព្រឹក' : 'Breakfast')
                    : type === 'lunch'
                    ? (language === 'km' ? 'ថ្ងៃត្រង់' : 'Lunch')
                    : (language === 'km' ? 'ល្ងាច' : 'Dinner')}
                </button>
              ))}
            </div>
          </div>

          {/* Max Cooking Time */}
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <RemixIcon name="ri-time-line" className="text-sm text-gray-500 dark:text-slate-400" />
                <span>{language === 'km' ? 'រយៈពេលចម្អិនអតិបរមា' : 'Max Cooking Time'}</span>
              </span>
              <span className="text-gray-900 dark:text-slate-100 font-bold">
                {maxCookingTime} {language === 'km' ? 'នាទី' : 'mins'}
              </span>
            </label>
            <input
              type="range"
              min={15}
              max={60}
              step={5}
              value={maxCookingTime}
              onChange={(e) => setMaxCookingTime(Number(e.target.value))}
              className="w-full accent-[#1A8D5F] cursor-pointer"
            />
          </div>

          {/* Nutrition Preferences */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              {language === 'km' ? 'ចំណូលចិត្តសុខភាព និងអាហារូបត្ថម្ភ' : 'Nutrition Preferences'}
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highProtein}
                  onChange={(e) => setHighProtein(e.target.checked)}
                  className="rounded text-[#1A8D5F] focus:ring-[#1A8D5F]"
                />
                <span>{language === 'km' ? 'សំបូរប្រូតេអ៊ីន (High Protein)' : 'High Protein'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highFiber}
                  onChange={(e) => setHighFiber(e.target.checked)}
                  className="rounded text-[#1A8D5F] focus:ring-[#1A8D5F]"
                />
                <span>{language === 'km' ? 'ជាតិសរសៃខ្ពស់ (High Fiber)' : 'High Fiber'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={moreVegetables}
                  onChange={(e) => setMoreVegetables(e.target.checked)}
                  className="rounded text-[#1A8D5F] focus:ring-[#1A8D5F]"
                />
                <span>{language === 'km' ? 'បន្លែច្រើន (More Vegetables)' : 'More Vegetables'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowerSodium}
                  onChange={(e) => setLowerSodium(e.target.checked)}
                  className="rounded text-[#1A8D5F] focus:ring-[#1A8D5F]"
                />
                <span>{language === 'km' ? 'ជាតិប្រៃទាប (Lower Sodium)' : 'Lower Sodium'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vegetarian}
                  onChange={(e) => setVegetarian(e.target.checked)}
                  className="rounded text-[#1A8D5F] focus:ring-[#1A8D5F]"
                />
                <span>{language === 'km' ? 'ម្ហូបបួស (Vegetarian Only)' : 'Vegetarian Only'}</span>
              </label>
            </div>
          </div>

          {/* Available Pantry Ingredients */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              {language === 'km' ? 'គ្រឿងផ្សំមានស្រាប់ក្នុងផ្ទះបាយ' : 'Available in Kitchen'} ({availableIngredients.length})
            </label>
            <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pr-1">
              {commonIngredients.map((ing) => {
                const isSelected = availableIngredients.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => toggleIngredient(ing.id)}
                    className={`text-[10px] px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-[#113e2e] dark:text-emerald-300 ring-1 ring-[#1A8D5F]'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {language === 'km' ? ing.nameKh : (ing.nameKh || ing.nameEn)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleGenerateRecommendations}
            className="w-full bg-[#1A8D5F] hover:bg-[#157a51] active:bg-[#0f603f] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xs transition-colors cursor-pointer"
          >
            <RemixIcon name="ri-refresh-line" className="text-sm" />
            <span>{language === 'km' ? 'បង្កើតមុខម្ហូបណែនាំថ្មី' : 'Generate Recommendations'}</span>
          </button>
        </div>

        {/* Right Recommended Results (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <RemixIcon name="ri-sparkling-fill" className="text-base text-[#1A8D5F] dark:text-emerald-400" />
              <span>{language === 'km' ? 'មុខម្ហូបខ្មែរកំពូលទាំង ៣ ណែនាំសម្រាប់អ្នក' : 'Top 3 Recommended Khmer Meals'}</span>
            </h4>
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
              {language === 'km' ? 'ចាត់ថ្នាក់តាមរូបមន្ត ៥ចំណុច' : 'Ranked by 5-Point Formula'}
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 rounded-2xl p-8 text-center text-gray-500 dark:text-slate-400 transition-colors">
              <RemixIcon name="ri-information-line" className="text-3xl text-gray-400 dark:text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">
                {language === 'km' ? 'មិនមានមុខម្ហូបត្រូវតាមលក្ខខណ្ឌដែលបានកំណត់ឡើយ។' : 'No recipes matching all current constraints.'}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {language === 'km' ? 'សូមសាកល្បងកែសម្រួលថវិកា ឬរយៈពេលចម្អិន។' : 'Try adjusting the budget or cooking time.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, rankIdx) => {
                const { recipe, totalScore, estimatedTotalCostKHR, costPerPersonKHR, whyRecommended } = rec;
                return (
                  <div
                    key={recipe.id}
                    className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Rank Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#1A8D5F] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {language === 'km' ? `ជម្រើសលេខ #${rankIdx + 1}` : `Top #${rankIdx + 1} Choice`}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-amber-200 dark:border-amber-800">
                        <span>{totalScore}/100</span>
                      </div>
                    </div>

                    {/* Meal Name */}
                    <div>
                      <h5 className="text-base font-extrabold text-[#113e2e] dark:text-emerald-400 leading-snug">
                        {recipe.nameKh}
                      </h5>
                      <span className="text-xs text-gray-500 dark:text-slate-400 font-medium block mt-0.5">
                        {recipe.nameEn}
                      </span>
                    </div>

                    {/* Cost & Time Pill Bar */}
                    <div className="my-3 p-2.5 bg-gray-50/80 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-gray-500 dark:text-slate-400 text-[11px]">
                          {language === 'km' ? 'ថ្លៃសរុប:' : 'Total Cost:'}
                        </span>
                        <span className="text-[#1A8D5F] dark:text-emerald-400">{estimatedTotalCostKHR.toLocaleString()} ៛</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-slate-300">
                        <span>{language === 'km' ? 'ម្នាក់:' : 'Per Person:'}</span>
                        <span className="font-semibold">{costPerPersonKHR.toLocaleString()} ៛</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 pt-0.5 border-t border-gray-200/60 dark:border-slate-700">
                        <span>{language === 'km' ? 'រយៈពេល:' : 'Cook Time:'}</span>
                        <span className="font-medium text-gray-700 dark:text-slate-200">{recipe.cookingTimeMinutes} {language === 'km' ? 'នាទី' : 'mins'}</span>
                      </div>
                    </div>

                    {/* Nutrition Micro Strip */}
                    <div className="grid grid-cols-3 gap-1 text-center py-1.5 border-y border-gray-100 dark:border-slate-800 text-[10px] mb-3">
                      <div>
                        <span className="text-gray-400 dark:text-slate-500 block">
                          {language === 'km' ? 'កាឡូរី' : 'Calories'}
                        </span>
                        <span className="font-bold text-gray-800 dark:text-slate-200">{recipe.nutritionPerServing.calories || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 dark:text-slate-500 block">
                          {language === 'km' ? 'ប្រូតេអ៊ីន' : 'Protein'}
                        </span>
                        <span className="font-bold text-[#1A8D5F] dark:text-emerald-400">{recipe.nutritionPerServing.protein || '-'}g</span>
                      </div>
                      <div>
                        <span className="text-gray-400 dark:text-slate-500 block">
                          {language === 'km' ? 'ជាតិសរសៃ' : 'Fiber'}
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{recipe.nutritionPerServing.fiber || '-'}g</span>
                      </div>
                    </div>

                    {/* Why Suitable List */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                        {language === 'km' ? 'មូលហេតុសមស្រប:' : 'Why Recommended:'}
                      </span>
                      <ul className="text-[11px] text-gray-600 dark:text-slate-300 space-y-1">
                        {whyRecommended.map((reason, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <RemixIcon name="ri-checkbox-circle-fill" className="text-xs text-[#1A8D5F] dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-slate-800">
                      <button
                        onClick={() => onAssignMealToDate(recipe)}
                        className="w-full bg-[#1A8D5F] hover:bg-[#157a51] text-white py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <RemixIcon name="ri-calendar-2-line" className="text-sm" />
                        <span>{language === 'km' ? 'ដាក់ក្នុងកាលវិភាគ' : 'Assign to Schedule'}</span>
                      </button>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleAddShopping(rec)}
                          className="bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#1A8D5F] dark:text-emerald-300 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Add ingredients to shopping list"
                        >
                          <RemixIcon name="ri-shopping-cart-2-line" className="text-xs" />
                          <span>{language === 'km' ? 'ទិញគ្រឿង' : 'Buy List'}</span>
                        </button>
                        <button
                          onClick={() => onViewRecipeDetails(recipe)}
                          className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <RemixIcon name="ri-eye-line" className="text-xs" />
                          <span>{language === 'km' ? 'រូបមន្ត' : 'Recipe'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
