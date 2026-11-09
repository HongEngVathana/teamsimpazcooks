import { ShoppingListItem, BudgetConfig, ExpenseRecord, KhmerRecipe } from '../types/schedule';
import { RecipeService } from './recipeService';

const SHOPPING_STORAGE_KEY = 'our_kitchen_shopping_list_v2';
const BUDGET_CONFIG_STORAGE_KEY = 'our_kitchen_budget_config_v2';
const EXPENSES_STORAGE_KEY = 'our_kitchen_expenses_v2';

export const DEFAULT_BUDGET: BudgetConfig = {
  dailyBudgetKHR: 20000,
  weeklyBudgetKHR: 140000,
  monthlyBudgetKHR: 600000,
  annualBudgetKHR: 7200000,
  targetHouseholdSize: 6,
};

export class ShoppingAndBudgetService {
  // ----------------- SHOPPING LIST -----------------

  public static getShoppingList(): ShoppingListItem[] {
    try {
      const stored = localStorage.getItem(SHOPPING_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load shopping list', e);
    }
    return [];
  }

  public static saveShoppingList(items: ShoppingListItem[]): void {
    try {
      localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save shopping list', e);
    }
  }

  // Generate or add ingredients from a recipe to the shopping list
  public static addRecipeToShoppingList(recipe: KhmerRecipe, servingsCount = 4): ShoppingListItem[] {
    const currentList = this.getShoppingList();
    const pricesMap = new Map<string, number>();
    RecipeService.getIngredientPrices().forEach(p => pricesMap.set(p.id, p.pricePerUnitKHR));

    const servingRatio = servingsCount / (recipe.servings || 4);
    const updatedMap = new Map<string, ShoppingListItem>();

    // Index existing
    currentList.forEach(item => {
      updatedMap.set(item.ingredientId, { ...item });
    });

    // Merge recipe ingredients
    for (const ing of recipe.ingredients) {
      const neededQty = Math.round(ing.quantity * servingRatio);
      const unitPrice = pricesMap.get(ing.ingredientId) || 0;

      if (updatedMap.has(ing.ingredientId)) {
        const existing = updatedMap.get(ing.ingredientId)!;
        const newReq = existing.requiredQuantity + neededQty;
        const newToBuy = Math.max(0, newReq - existing.availableQuantity);

        let estimatedPrice = 0;
        if (ing.unit === 'g') {
          estimatedPrice = (newToBuy / 1000) * unitPrice;
        } else if (ing.unit === 'ml') {
          estimatedPrice = (newToBuy / 1000) * unitPrice;
        } else {
          estimatedPrice = newToBuy * unitPrice;
        }

        updatedMap.set(ing.ingredientId, {
          ...existing,
          requiredQuantity: newReq,
          toPurchaseQuantity: newToBuy,
          estimatedPriceKHR: Math.round(estimatedPrice / 100) * 100,
          mealSource: `${existing.mealSource ? existing.mealSource + ', ' : ''}${recipe.nameKh}`,
        });
      } else {
        const toBuy = neededQty;
        let estimatedPrice = 0;
        if (ing.unit === 'g') {
          estimatedPrice = (toBuy / 1000) * unitPrice;
        } else if (ing.unit === 'ml') {
          estimatedPrice = (toBuy / 1000) * unitPrice;
        } else {
          estimatedPrice = toBuy * unitPrice;
        }

        updatedMap.set(ing.ingredientId, {
          id: `shop-${Date.now()}-${ing.ingredientId}`,
          ingredientId: ing.ingredientId,
          nameKh: ing.nameKh,
          nameEn: ing.nameEn,
          requiredQuantity: neededQty,
          availableQuantity: 0,
          toPurchaseQuantity: toBuy,
          unit: ing.unit,
          estimatedPriceKHR: Math.round(estimatedPrice / 100) * 100,
          isPurchased: false,
          mealSource: recipe.nameKh,
        });
      }
    }

    const result = Array.from(updatedMap.values());
    this.saveShoppingList(result);
    return result;
  }

  // Toggle purchased
  public static togglePurchased(itemId: string): ShoppingListItem[] {
    const list = this.getShoppingList().map(item => {
      if (item.id === itemId) {
        return { ...item, isPurchased: !item.isPurchased };
      }
      return item;
    });
    this.saveShoppingList(list);
    return list;
  }

  // Clear or reset shopping list
  public static clearShoppingList(): void {
    this.saveShoppingList([]);
  }

  // Export Shopping List to CSV
  public static exportShoppingListCSV(): void {
    const list = this.getShoppingList();
    const rows = [
      ['Ingredient (Khmer)', 'Ingredient (English)', 'Quantity to Buy', 'Unit', 'Estimated Price (KHR)', 'Status', 'Dishes']
    ];

    list.forEach(item => {
      rows.push([
        `"${item.nameKh}"`,
        `"${item.nameEn || ''}"`,
        item.toPurchaseQuantity.toString(),
        item.unit,
        item.estimatedPriceKHR.toString(),
        item.isPurchased ? 'Purchased' : 'Pending',
        `"${item.mealSource || ''}"`
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Our_Kitchen_Shopping_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ----------------- BUDGET TRACKING -----------------

  public static getBudgetConfig(): BudgetConfig {
    try {
      const stored = localStorage.getItem(BUDGET_CONFIG_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load budget config', e);
    }
    return DEFAULT_BUDGET;
  }

  public static saveBudgetConfig(config: BudgetConfig): void {
    try {
      localStorage.setItem(BUDGET_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save budget config', e);
    }
  }

  public static getExpenses(): ExpenseRecord[] {
    try {
      const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load expenses', e);
    }
    return [
      {
        id: 'exp-1',
        date: '2026-11-06',
        amountKHR: 18500,
        category: 'fresh_market',
        notes: 'Snakehead fish & morning glory for Samlor Korko'
      },
      {
        id: 'exp-2',
        date: '2026-11-07',
        amountKHR: 16000,
        category: 'meat',
        notes: 'Chicken & ginger for lunch'
      }
    ];
  }

  public static saveExpenses(expenses: ExpenseRecord[]): void {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses', e);
    }
  }

  public static addExpense(record: Omit<ExpenseRecord, 'id'>): ExpenseRecord[] {
    const current = this.getExpenses();
    const newRecord: ExpenseRecord = {
      ...record,
      id: `exp-${Date.now()}`
    };
    const updated = [newRecord, ...current];
    this.saveExpenses(updated);
    return updated;
  }
}
