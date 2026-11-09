import React, { useState } from 'react';
import { RemixIcon } from './RemixIcon';
import { ShoppingListItem, BudgetConfig, ExpenseRecord, IngredientPriceItem } from '../types/schedule';
import { ShoppingAndBudgetService } from '../services/shoppingAndBudgetService';
import { RecipeService } from '../services/recipeService';
import { Language, TRANSLATIONS } from '../services/languageService';

interface ShoppingAndBudgetViewProps {
  onShowToast: (msg: string) => void;
  language: Language;
}

export const ShoppingAndBudgetView: React.FC<ShoppingAndBudgetViewProps> = ({
  onShowToast,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [activeSubTab, setActiveSubTab] = useState<'shopping' | 'budget' | 'prices'>('shopping');

  // Shopping state
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => ShoppingAndBudgetService.getShoppingList());

  // Budget state
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(() => ShoppingAndBudgetService.getBudgetConfig());
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => ShoppingAndBudgetService.getExpenses());

  // Expense form
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseRecord['category']>('fresh_market');
  const [expenseNotes, setExpenseNotes] = useState<string>('');

  // Prices state
  const [prices, setPrices] = useState<IngredientPriceItem[]>(() => RecipeService.getIngredientPrices());
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<number>(0);

  // Shopping handlers
  const handleTogglePurchased = (id: string) => {
    const updated = ShoppingAndBudgetService.togglePurchased(id);
    setShoppingList(updated);
  };

  const handleClearShopping = () => {
    const confirmMsg = language === 'km' ? 'តើអ្នកចង់សម្អាតបញ្ជីទិញទំនិញទាំងស្រុងមែនទេ?' : 'Clear all items from your shopping list?';
    if (window.confirm(confirmMsg)) {
      ShoppingAndBudgetService.clearShoppingList();
      setShoppingList([]);
      onShowToast(language === 'km' ? 'បានសម្អាតបញ្ជីទិញទំនិញ' : 'Shopping list cleared');
    }
  };

  const handleExportCSV = () => {
    ShoppingAndBudgetService.exportShoppingListCSV();
    onShowToast(language === 'km' ? 'បានទាញយកបញ្ជីទិញទំនិញជា CSV' : 'Exported shopping list to CSV');
  };

  const handlePrintShopping = () => {
    window.print();
  };

  // Budget calculations
  const totalSpent = expenses.reduce((sum, e) => sum + e.amountKHR, 0);
  const remainingMonthlyBalance = Math.max(0, budgetConfig.monthlyBudgetKHR - totalSpent);
  const costPerPersonMonthly = Math.round(budgetConfig.monthlyBudgetKHR / budgetConfig.targetHouseholdSize);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(expenseAmount);
    if (!amount || amount <= 0) return;

    const updated = ShoppingAndBudgetService.addExpense({
      amountKHR: amount,
      date: expenseDate,
      category: expenseCategory,
      notes: expenseNotes.trim() || (language === 'km' ? 'ទិញម្ហូបផ្សារ' : 'Market shopping'),
    });

    setExpenses(updated);
    setExpenseAmount('');
    setExpenseNotes('');
    onShowToast(
      language === 'km'
        ? `បានកត់ត្រាការចំណាយ ${amount.toLocaleString()} ៛`
        : `Recorded expense of ${amount.toLocaleString()} ៛`
    );
  };

  // Price update handler
  const handleSavePrice = (id: string) => {
    RecipeService.updatePrice(id, editingPriceValue);
    setPrices(RecipeService.getIngredientPrices());
    setEditingPriceId(null);
    onShowToast(
      language === 'km'
        ? 'បានធ្វើបច្ចុប្បន្នភាពតម្លៃទីផ្សារ និងគណនាថ្លៃមុខម្ហូបឡើងវិញ!'
        : 'Updated ingredient price & recalculated all recipes in KHR!'
    );
  };

  const totalShoppingCost = shoppingList.reduce((sum, item) => sum + (item.isPurchased ? 0 : item.estimatedPriceKHR), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Tabs Bar */}
      <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-2 shadow-xs flex items-center gap-2 max-w-xl transition-colors">
        <button
          onClick={() => setActiveSubTab('shopping')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'shopping'
              ? 'bg-[#1A8D5F] text-white shadow-2xs'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <RemixIcon name="ri-shopping-cart-2-line" className="text-base" />
          <span>{language === 'km' ? 'បញ្ជីផ្សារ' : 'Shopping List'} ({shoppingList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('budget')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'budget'
              ? 'bg-[#1A8D5F] text-white shadow-2xs'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <RemixIcon name="ri-money-cny-circle-line" className="text-base" />
          <span>{language === 'km' ? 'ថវិកា (៛)' : 'Food Budget (KHR)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prices')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'prices'
              ? 'bg-[#1A8D5F] text-white shadow-2xs'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <RemixIcon name="ri-price-tag-3-line" className="text-base" />
          <span>{language === 'km' ? 'តម្លៃទីផ្សារ' : 'Market Prices'}</span>
        </button>
      </div>

      {/* TAB 1: SHOPPING LIST */}
      {activeSubTab === 'shopping' && (
        <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-xs space-y-4 transition-colors">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-[#113e2e] dark:text-emerald-400">
                {language === 'km' ? 'បញ្ជីទិញទំនិញផ្សារស្វ័យប្រវត្តិ' : 'Automated Kitchen Shopping List'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                {language === 'km'
                  ? 'បូកសរុបគ្រឿងផ្សំដោយស្វ័យប្រវត្តិពីមុខម្ហូប និងកាលវិភាគដែលបានកំណត់'
                  : 'Consolidated and deduplicated across selected meals and schedule assignments'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <RemixIcon name="ri-download-2-line" className="text-sm" />
                <span>{language === 'km' ? 'ទាញយក CSV' : 'Export CSV'}</span>
              </button>
              <button
                onClick={handlePrintShopping}
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <RemixIcon name="ri-printer-line" className="text-sm" />
                <span>{language === 'km' ? 'បោះពុម្ព' : 'Print'}</span>
              </button>
              {shoppingList.length > 0 && (
                <button
                  onClick={handleClearShopping}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  title="Clear Shopping List"
                >
                  <RemixIcon name="ri-delete-bin-line" className="text-base" />
                </button>
              )}
            </div>
          </div>

          {/* List or Empty State */}
          {shoppingList.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-slate-500">
              <RemixIcon name="ri-shopping-cart-2-line" className="text-5xl mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">
                {language === 'km' ? 'បញ្ជីទិញទំនិញទទេស្អាត។' : 'Your shopping list is currently empty.'}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {language === 'km'
                  ? 'សូមជ្រើសរើសមុខម្ហូបពីផ្ទាំងគម្រោងម្ហូប ឬមុខម្ហូបខ្មែរ ដើម្បីបញ្ចូលគ្រឿងផ្សំ។'
                  : 'Add dishes from the Smart Meal Planner or Recipe Browser to populate ingredients.'}
              </p>
            </div>
          ) : (
            <>
              {/* Estimated Total Bar */}
              <div className="bg-[#ebf7ef] dark:bg-emerald-950/30 border border-[#d2edd9] dark:border-emerald-800/50 rounded-xl p-3 flex items-center justify-between transition-colors">
                <span className="text-xs font-bold text-[#113e2e] dark:text-emerald-300">
                  {language === 'km' ? 'ថវិកាប៉ាន់ស្មានសរុបដែលត្រូវចំណាយ:' : 'Estimated Pending Purchase Budget:'}
                </span>
                <span className="text-base font-black text-[#1A8D5F] dark:text-emerald-400">
                  {totalShoppingCost.toLocaleString()} ៛ (KHR)
                </span>
              </div>

              {/* Items Table */}
              <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
                {shoppingList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleTogglePurchased(item.id)}
                    className={`p-3 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      item.isPurchased
                        ? 'bg-gray-50 dark:bg-slate-900/50 opacity-60'
                        : 'bg-white dark:bg-[#0f172a] hover:bg-gray-50/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.isPurchased}
                        onChange={() => {}} // handled by row click
                        className="rounded text-[#1A8D5F] focus:ring-[#1A8D5F] w-4 h-4 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <div className={`font-bold text-gray-900 dark:text-slate-100 ${item.isPurchased ? 'line-through text-gray-400 dark:text-slate-500' : ''}`}>
                          {item.nameKh}
                        </div>
                        {item.nameEn && (
                          <div className="text-[10px] text-gray-400 dark:text-slate-500">
                            {item.nameEn} {item.mealSource ? `• for ${item.mealSource}` : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <span className="font-semibold text-gray-700 dark:text-slate-300">
                        {item.toPurchaseQuantity} {item.unit}
                      </span>
                      <span className="font-extrabold text-[#1A8D5F] dark:text-emerald-400 w-20">
                        {item.estimatedPriceKHR.toLocaleString()} ៛
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: BUDGET & EXPENSES */}
      {activeSubTab === 'budget' && (
        <div className="space-y-5">
          {/* Budget Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 block">
                {language === 'km' ? 'ថវិកាប្រចាំថ្ងៃ' : 'Daily Food Budget'}
              </span>
              <div className="text-xl font-black text-[#1A8D5F] dark:text-emerald-400 mt-1">
                {budgetConfig.dailyBudgetKHR.toLocaleString()} ៛
              </div>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">
                {language === 'km' ? 'គោលដៅចំណាយប្រចាំថ្ងៃ' : 'Target daily allocation'}
              </span>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 block">
                {language === 'km' ? 'ថវិកាប្រចាំខែ' : 'Monthly Budget'}
              </span>
              <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {budgetConfig.monthlyBudgetKHR.toLocaleString()} ៛
              </div>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">
                ≈ {costPerPersonMonthly.toLocaleString()} ៛ / {language === 'km' ? 'ម្នាក់' : 'person'}
              </span>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 block">
                {language === 'km' ? 'ការចំណាយបានកត់ត្រា' : 'Logged Expenses'}
              </span>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {totalSpent.toLocaleString()} ៛
              </div>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">
                {expenses.length} {language === 'km' ? 'ប្រតិបត្តិការ' : 'grocery transactions'}
              </span>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 block">
                {language === 'km' ? 'សមតុល្យនៅសល់' : 'Remaining Monthly'}
              </span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                {remainingMonthlyBalance.toLocaleString()} ៛
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {language === 'km' ? 'សុវត្ថិភាពថវិកា' : 'Safe spending margin'}
              </span>
            </div>
          </div>

          {/* Expense Log Form & History */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Record Form (4 cols) */}
            <form onSubmit={handleAddExpense} className="lg:col-span-4 bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs space-y-3 transition-colors">
              <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 border-b border-gray-100 dark:border-slate-800 pb-2">
                {language === 'km' ? 'កត់ត្រាការចំណាយផ្សារ' : 'Record Market Expense'}
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ចំនួនទឺកប្រាក់ (៛)' : 'Amount in Riel (KHR)'}
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1A8D5F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'កាលបរិច្ឆេទ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1A8D5F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ប្រភេទមុខទំនិញ' : 'Category'}
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1A8D5F]"
                >
                  <option value="fresh_market">{language === 'km' ? 'ផ្សារស្រស់ (Fresh Market)' : 'Fresh Market'}</option>
                  <option value="meat">{language === 'km' ? 'សាច់ និងត្រី (Meat & Fish)' : 'Meat & Poultry'}</option>
                  <option value="vegetable">{language === 'km' ? 'បន្លែ និងផ្លែឈើ (Vegetables)' : 'Vegetables'}</option>
                  <option value="seasoning">{language === 'km' ? 'គ្រឿងទេស (Spices & Sauces)' : 'Spices & Sauces'}</option>
                  <option value="grocery">{language === 'km' ? 'ផ្សារទំនើប (Supermarket)' : 'Supermarket'}</option>
                  <option value="other">{language === 'km' ? 'ផ្សេងៗ (Other)' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'កំណត់ចំណាំ' : 'Notes'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fish & kroeung for dinner"
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1A8D5F]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A8D5F] hover:bg-[#157a51] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <RemixIcon name="ri-add-line" className="text-sm" />
                <span>{language === 'km' ? 'កត់ត្រាការចំណាយ' : 'Add Expense Log'}</span>
              </button>
            </form>

            {/* Expense History (8 cols) */}
            <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs transition-colors">
              <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">
                {language === 'km' ? 'ប្រវត្តិនៃការចំណាយចុងក្រោយ' : 'Recent Expense History'}
              </h4>
              <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
                {expenses.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 dark:text-slate-500 text-xs">
                    {language === 'km' ? 'មិនទាន់មានទិន្នន័យចំណាយនៅឡើយទេ។' : 'No recorded expenses yet.'}
                  </div>
                ) : (
                  expenses.map((exp) => (
                    <div key={exp.id} className="p-3 flex items-center justify-between text-xs bg-white dark:bg-[#0f172a]">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-slate-100">{exp.notes}</div>
                        <div className="text-[10px] text-gray-400 dark:text-slate-500 capitalize">
                          {exp.date} • {exp.category.replace('_', ' ')}
                        </div>
                      </div>
                      <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                        -{exp.amountKHR.toLocaleString()} ៛
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CAMBODIAN INGREDIENT MARKET PRICES */}
      {activeSubTab === 'prices' && (
        <div className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-[#113e2e] dark:text-emerald-400">
                {language === 'km' ? 'តារាងតម្លៃគ្រឿងផ្សំទីផ្សារកម្ពុជា (៛)' : 'Cambodian Market Ingredient Prices (KHR)'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                {language === 'km'
                  ? 'តម្លៃគោលសម្រាប់គណនាថ្លៃដើមមុខម្ហូប និងបញ្ជីទិញផ្សារ។ ចុចលើ Edit ដើម្បីកែប្រែ។'
                  : 'Baseline prices for calculating exact recipe and shopping costs. Click to update.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {prices.map((p) => {
              const isEditing = editingPriceId === p.id;
              return (
                <div
                  key={p.id}
                  className="p-3 border border-gray-100 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-slate-100 text-xs">{p.nameKh}</h5>
                      <span className="text-[10px] text-gray-500 dark:text-slate-400">{p.nameEn}</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-200/70 dark:bg-slate-700 text-gray-600 dark:text-slate-300 uppercase">
                      /{p.unit}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full">
                        <input
                          type="number"
                          value={editingPriceValue}
                          onChange={(e) => setEditingPriceValue(Number(e.target.value))}
                          className="w-24 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-[#1A8D5F] text-gray-900 dark:text-slate-100 rounded-lg"
                        />
                        <button
                          onClick={() => handleSavePrice(p.id)}
                          className="p-1 bg-[#1A8D5F] text-white rounded-lg cursor-pointer"
                          title="Save"
                        >
                          <RemixIcon name="ri-save-line" className="text-sm" />
                        </button>
                        <button
                          onClick={() => setEditingPriceId(null)}
                          className="p-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg cursor-pointer"
                          title="Cancel"
                        >
                          <RemixIcon name="ri-close-line" className="text-sm" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-black text-[#1A8D5F] dark:text-emerald-400">
                          {p.pricePerUnitKHR.toLocaleString()} ៛
                        </span>
                        <button
                          onClick={() => {
                            setEditingPriceId(p.id);
                            setEditingPriceValue(p.pricePerUnitKHR);
                          }}
                          className="text-[10px] text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          <RemixIcon name="ri-edit-2-line" className="text-xs" />
                          <span>{language === 'km' ? 'កែប្រែ' : 'Edit'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
