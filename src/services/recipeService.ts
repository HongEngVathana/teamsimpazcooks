import { KhmerRecipe, IngredientPriceItem, MealCategory, MealType, NutritionInfo } from '../types/schedule';
import defaultRecipesData from '../assets/data/khmer-food/recipes.json';
import defaultPricesData from '../assets/data/ingredients/ingredient-prices.json';

const RECIPES_STORAGE_KEY = 'our_kitchen_recipes_v2';
const PRICES_STORAGE_KEY = 'our_kitchen_ingredient_prices_v2';

export class RecipeService {
  private static cachedRecipes: KhmerRecipe[] | null = null;
  private static cachedPrices: IngredientPriceItem[] | null = null;

  // Load Ingredient Prices (with localStorage overrides)
  public static getIngredientPrices(): IngredientPriceItem[] {
    if (this.cachedPrices) return this.cachedPrices;

    try {
      const stored = localStorage.getItem(PRICES_STORAGE_KEY);
      if (stored) {
        this.cachedPrices = JSON.parse(stored);
        return this.cachedPrices!;
      }
    } catch (e) {
      console.warn('Failed to parse stored ingredient prices', e);
    }

    this.cachedPrices = defaultPricesData as unknown as IngredientPriceItem[];
    return this.cachedPrices;
  }

  // Save/Update Ingredient Prices
  public static saveIngredientPrices(prices: IngredientPriceItem[]): void {
    this.cachedPrices = prices;
    try {
      localStorage.setItem(PRICES_STORAGE_KEY, JSON.stringify(prices));
    } catch (e) {
      console.error('Failed to save ingredient prices to storage', e);
    }
  }

  // Update a single ingredient price
  public static updatePrice(ingredientId: string, newPriceKHR: number): void {
    const prices = this.getIngredientPrices().map(p => {
      if (p.id === ingredientId) {
        return {
          ...p,
          pricePerUnitKHR: newPriceKHR,
          lastUpdated: new Date().toISOString().split('T')[0],
          priceSource: 'Manual user update'
        };
      }
      return p;
    });
    this.saveIngredientPrices(prices);
  }

  // Calculate dynamic recipe cost in KHR using current prices
  public static calculateRecipeCost(recipe: KhmerRecipe, servingsCount = 4): number {
    const pricesMap = new Map<string, IngredientPriceItem>();
    this.getIngredientPrices().forEach(p => pricesMap.set(p.id, p));

    const servingRatio = servingsCount / (recipe.servings || 4);
    let totalCost = 0;

    for (const ing of recipe.ingredients) {
      const priceItem = pricesMap.get(ing.ingredientId);
      if (!priceItem) continue;

      const neededQty = ing.quantity * servingRatio;
      let costForIngredient = 0;

      // Unit conversion math:
      if (priceItem.unit === 'kg' && ing.unit === 'g') {
        costForIngredient = (neededQty / 1000) * priceItem.pricePerUnitKHR;
      } else if (priceItem.unit === 'l' && ing.unit === 'ml') {
        costForIngredient = (neededQty / 1000) * priceItem.pricePerUnitKHR;
      } else if (priceItem.unit === ing.unit) {
        costForIngredient = neededQty * priceItem.pricePerUnitKHR;
      } else {
        // Fallback ratio
        costForIngredient = neededQty * (priceItem.pricePerUnitKHR / 100);
      }

      totalCost += costForIngredient;
    }

    // Round to nearest 100 Riel (standard Cambodian retail step)
    return Math.round(totalCost / 100) * 100;
  }

  // Get all recipes
  public static getAllRecipes(): KhmerRecipe[] {
    if (this.cachedRecipes) return this.cachedRecipes;

    let recipes: KhmerRecipe[] = [];
    try {
      const stored = localStorage.getItem(RECIPES_STORAGE_KEY);
      if (stored) {
        recipes = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load user recipes', e);
    }

    if (!recipes || recipes.length === 0) {
      recipes = defaultRecipesData as unknown as KhmerRecipe[];
    }

    // Recalculate estimated dynamic costs
    this.cachedRecipes = recipes.map(r => ({
      ...r,
      estimatedCostKHR: this.calculateRecipeCost(r, r.servings)
    }));

    return this.cachedRecipes;
  }

  // Search and filter recipes
  public static filterRecipes(params: {
    query?: string;
    category?: MealCategory | 'all';
    mealType?: MealType | 'all';
    maxTime?: number;
    maxBudgetKHR?: number;
    healthTag?: string;
  }): KhmerRecipe[] {
    const all = this.getAllRecipes();
    return all.filter(r => {
      if (params.category && params.category !== 'all' && r.category !== params.category) {
        return false;
      }
      if (params.mealType && params.mealType !== 'all' && !r.mealTypes.includes(params.mealType)) {
        return false;
      }
      if (params.maxTime && r.cookingTimeMinutes > params.maxTime) {
        return false;
      }
      if (params.maxBudgetKHR && r.estimatedCostKHR && r.estimatedCostKHR > params.maxBudgetKHR) {
        return false;
      }
      if (params.healthTag && !r.healthTags.includes(params.healthTag)) {
        return false;
      }
      if (params.query && params.query.trim()) {
        const q = params.query.toLowerCase().trim();
        const matchesNameKh = r.nameKh.toLowerCase().includes(q);
        const matchesNameEn = r.nameEn.toLowerCase().includes(q);
        const matchesIng = r.ingredients.some(i => i.nameKh.includes(q) || (i.nameEn && i.nameEn.toLowerCase().includes(q)));
        if (!matchesNameKh && !matchesNameEn && !matchesIng) {
          return false;
        }
      }
      return true;
    });
  }

  // Get recipe by ID
  public static getRecipeById(id: string): KhmerRecipe | null {
    const all = this.getAllRecipes();
    return all.find(r => r.id === id) || null;
  }

  // Add custom recipe
  public static addRecipe(recipe: KhmerRecipe): void {
    const all = this.getAllRecipes();
    const updated = [recipe, ...all];
    this.cachedRecipes = updated;
    try {
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recipe', e);
    }
  }
}
