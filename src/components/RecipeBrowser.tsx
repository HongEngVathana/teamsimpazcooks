import React, { useState, useMemo } from 'react';
import { RemixIcon } from './RemixIcon';
import { KhmerRecipe, MealCategory } from '../types/schedule';
import { RecipeService } from '../services/recipeService';
import { ShoppingAndBudgetService } from '../services/shoppingAndBudgetService';
import { Language, TRANSLATIONS } from '../services/languageService';

interface RecipeBrowserProps {
  onAssignMealToDate: (recipe: KhmerRecipe) => void;
  onShowToast: (msg: string) => void;
  language: Language;
}

export const RecipeBrowser: React.FC<RecipeBrowserProps> = ({
  onAssignMealToDate,
  onShowToast,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | 'all'>('all');
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState<KhmerRecipe | null>(null);

  const categories = [
    { id: 'all', labelKh: 'ទាំងអស់ (All)' },
    { id: 'soup', labelKh: 'សម្លខ្មែរ (Soups)' },
    { id: 'fried', labelKh: 'ឆា និងចៀន (Stir-fry)' },
    { id: 'steamed', labelKh: 'ចំហុយ (Steamed)' },
    { id: 'grilled', labelKh: 'អាំង (Grilled)' },
    { id: 'vegetable', labelKh: 'បន្លែសុទ្ធ (Vegetables)' },
    { id: 'breakfast', labelKh: 'ពេលព្រឹក (Breakfast)' },
    { id: 'curry', labelKh: 'ការី និងប្រហុក (Curry/Dips)' },
  ];

  const filteredRecipes = useMemo(() => {
    return RecipeService.filterRecipes({
      query: searchQuery,
      category: selectedCategory,
    });
  }, [searchQuery, selectedCategory]);

  const handleAddShopping = (recipe: KhmerRecipe) => {
    ShoppingAndBudgetService.addRecipeToShoppingList(recipe, 4);
    onShowToast(
      language === 'km'
        ? `បានបញ្ចូល ${recipe.nameKh} ទៅក្នុងបញ្ជីទិញទំនិញ!`
        : `Added ${recipe.nameKh} to shopping list!`
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Search and Category Filter Toolbar */}
      <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <RemixIcon name="ri-search-line" className="text-sm text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'km' ? 'ស្វែងរកមុខម្ហូប (ឈ្មោះម្ហូប ឬគ្រឿងផ្សំ)...' : 'Search Khmer dish, ingredient...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1A8D5F]"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as MealCategory | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1A8D5F] text-white shadow-2xs'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.labelKh}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              {/* Category & Verified Tag */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#1A8D5F] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
                  {recipe.category}
                </span>
                <span className="text-[10px] font-medium text-gray-400 dark:text-slate-500">
                  {recipe.id}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-base font-extrabold text-[#113e2e] dark:text-emerald-400 leading-snug group-hover:text-[#1A8D5F] dark:group-hover:text-emerald-300 transition-colors">
                {recipe.nameKh}
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5">
                {recipe.nameEn}
              </p>

              {/* Quick stats strip */}
              <div className="flex items-center justify-between mt-3 py-2 px-2.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-xs">
                <div className="flex items-center gap-1 text-gray-600 dark:text-slate-300">
                  <RemixIcon name="ri-time-line" className="text-sm text-gray-400 dark:text-slate-500" />
                  <span>{recipe.cookingTimeMinutes}m</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-[#1A8D5F] dark:text-emerald-400">
                  <RemixIcon name="ri-money-cny-circle-line" className="text-sm" />
                  <span>{(recipe.estimatedCostKHR || 0).toLocaleString()} ៛</span>
                </div>
              </div>

              {/* Nutrition summary */}
              <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-slate-400 mt-2">
                <span>{recipe.nutritionPerServing.calories || '-'} kcal</span>
                <span>•</span>
                <span>{recipe.nutritionPerServing.protein || '-'}g protein</span>
                <span>•</span>
                <span>{recipe.ingredients.length} {language === 'km' ? 'គ្រឿងផ្សំ' : 'ingredients'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 mt-4">
              <button
                onClick={() => setSelectedRecipeForModal(recipe)}
                className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <RemixIcon name="ri-eye-line" className="text-sm" />
                <span>{language === 'km' ? 'មើលរូបមន្ត' : 'View Recipe'}</span>
              </button>
              <button
                onClick={() => onAssignMealToDate(recipe)}
                className="bg-[#1A8D5F] hover:bg-[#157a51] text-white py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Assign meal to calendar date"
              >
                <RemixIcon name="ri-calendar-2-line" className="text-sm" />
              </button>
              <button
                onClick={() => handleAddShopping(recipe)}
                className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#1A8D5F] dark:text-emerald-300 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Add to shopping list"
              >
                <RemixIcon name="ri-shopping-cart-2-line" className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col transition-colors">
            {/* Modal Header */}
            <div className="bg-[#ebf7ef] dark:bg-emerald-950/40 px-6 py-4 flex items-center justify-between border-b border-[#d4edd9] dark:border-emerald-800/40">
              <div>
                <h3 className="text-lg font-extrabold text-[#113e2e] dark:text-emerald-300">
                  {selectedRecipeForModal.nameKh}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  {selectedRecipeForModal.nameEn} • {selectedRecipeForModal.category}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecipeForModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
              >
                <RemixIcon name="ri-close-line" className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Cost and Servings Strip */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-center text-xs">
                <div>
                  <span className="text-gray-400 dark:text-slate-500 block text-[10px]">
                    {language === 'km' ? 'តម្លៃប៉ាន់ស្មាន' : 'Estimated Cost'}
                  </span>
                  <span className="font-extrabold text-[#1A8D5F] dark:text-emerald-400 text-sm">
                    {(selectedRecipeForModal.estimatedCostKHR || 0).toLocaleString()} ៛
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-slate-500 block text-[10px]">
                    {language === 'km' ? 'ចំនួនទទួលទាន' : 'Servings'}
                  </span>
                  <span className="font-extrabold text-gray-800 dark:text-slate-100 text-sm">
                    {selectedRecipeForModal.servings} {language === 'km' ? 'នាក់' : 'People'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-slate-500 block text-[10px]">
                    {language === 'km' ? 'ពេលចម្អិន' : 'Cooking Time'}
                  </span>
                  <span className="font-extrabold text-gray-800 dark:text-slate-100 text-sm">
                    {selectedRecipeForModal.cookingTimeMinutes} {language === 'km' ? 'នាទី' : 'mins'}
                  </span>
                </div>
              </div>

              {/* Nutrition Analysis */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  {language === 'km' ? 'តម្លៃអាហារូបត្ថម្ភ (ក្នុងម្នាក់)' : 'Nutritional Value (Per Serving)'}
                </h4>
                <div className="grid grid-cols-5 gap-2 text-center bg-emerald-50/50 dark:bg-emerald-950/25 p-2.5 rounded-xl text-xs border border-emerald-100 dark:border-emerald-800/40">
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Calories</span>
                    <span className="font-bold text-gray-900 dark:text-slate-100">{selectedRecipeForModal.nutritionPerServing.calories || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Protein</span>
                    <span className="font-bold text-[#1A8D5F] dark:text-emerald-400">{selectedRecipeForModal.nutritionPerServing.protein || '-'}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Carbs</span>
                    <span className="font-bold text-gray-900 dark:text-slate-100">{selectedRecipeForModal.nutritionPerServing.carbohydrates || '-'}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Fat</span>
                    <span className="font-bold text-gray-900 dark:text-slate-100">{selectedRecipeForModal.nutritionPerServing.fat || '-'}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Fiber</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{selectedRecipeForModal.nutritionPerServing.fiber || '-'}g</span>
                  </div>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  {language === 'km' ? 'គ្រឿងផ្សំ' : 'Ingredients'} ({selectedRecipeForModal.ingredients.length})
                </h4>
                <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
                  {selectedRecipeForModal.ingredients.map((ing, i) => (
                    <div key={i} className="px-3 py-2 flex items-center justify-between text-xs bg-white dark:bg-[#0f172a]">
                      <span className="font-semibold text-gray-800 dark:text-slate-200">{ing.nameKh}</span>
                      <span className="text-gray-500 dark:text-slate-400 font-medium">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  {language === 'km' ? 'របៀបចម្អិន' : 'Cooking Instructions'}
                </h4>
                <ol className="space-y-2 text-xs text-gray-700 dark:text-slate-300">
                  {selectedRecipeForModal.instructionsKh.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-gray-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="w-5 h-5 rounded-full bg-[#1A8D5F] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 dark:bg-slate-900 px-6 py-3 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => {
                  handleAddShopping(selectedRecipeForModal);
                  setSelectedRecipeForModal(null);
                }}
                className="px-3.5 py-2 text-xs font-bold text-[#1A8D5F] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RemixIcon name="ri-shopping-cart-2-line" className="text-sm" />
                <span>{language === 'km' ? 'បញ្ចូលក្នុងបញ្ជីទិញ' : 'Add to Shopping List'}</span>
              </button>

              <button
                onClick={() => {
                  onAssignMealToDate(selectedRecipeForModal);
                  setSelectedRecipeForModal(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1A8D5F] hover:bg-[#157a51] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RemixIcon name="ri-calendar-2-line" className="text-sm" />
                <span>{language === 'km' ? 'ដាក់ក្នុងកាលវិភាគ' : 'Assign to Schedule'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
