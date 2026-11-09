export interface TeamMember {
  id: string;
  name: string;
  nameKhmer?: string;
  color: string;
  isSaturdayCookOnly?: boolean;
  unavailableDates?: string[]; // YYYY-MM-DD
  cookingRestrictions?: string[];
  dishwashingRestrictions?: string[];
}

export interface DayAssignment {
  date: string; // YYYY-MM-DD
  year: number;
  month: number; // 0-11
  day: number;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  cookId: string;
  cookName: string;
  dishId: string;
  dishName: string;
  mealId?: string | null;
  mealNameKh?: string | null;
  isCompletedCook?: boolean;
  isCompletedDish?: boolean;
  notes?: string;
  isManualOverride?: boolean;
  estimatedCostKHR?: number | null;
}

export type ScheduleMap = Record<string, DayAssignment>;

export interface MemberStat {
  member: TeamMember;
  cookCount: number;
  dishCount: number;
  totalCount: number;
}

// ----------------- KHMER RECIPE & INGREDIENT TYPES -----------------

export interface RecipeIngredient {
  ingredientId: string;
  nameKh: string;
  nameEn?: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'piece' | 'bundle' | 'stalk';
}

export interface NutritionInfo {
  calories: number | null;
  protein: number | null; // grams
  carbohydrates: number | null; // grams
  fat: number | null; // grams
  fiber: number | null; // grams
  sodiumMg?: number | null;
  vitamins?: string[];
  minerals?: string[];
}

export type MealCategory =
  | 'soup'
  | 'fried'
  | 'steamed'
  | 'grilled'
  | 'salad'
  | 'curry'
  | 'breakfast'
  | 'dessert'
  | 'vegetable'
  | 'vegetarian';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface KhmerRecipe {
  id: string;
  nameKh: string;
  nameEn: string;
  category: MealCategory;
  mealTypes: MealType[];
  ingredients: RecipeIngredient[];
  servings: number;
  cookingTimeMinutes: number;
  estimatedCostKHR: number | null;
  nutritionPerServing: NutritionInfo;
  healthTags: string[];
  instructionsKh: string[];
  source: string | null;
  verified: boolean;
  image?: string;
}

// ----------------- INGREDIENT PRICE & PANTRY TYPES -----------------

export interface IngredientPriceItem {
  id: string;
  nameKh: string;
  nameEn: string;
  category: 'meat' | 'seafood' | 'vegetable' | 'spice' | 'staple' | 'fruit' | 'seasoning';
  unit: 'kg' | 'g' | 'l' | 'ml' | 'piece' | 'bundle';
  pricePerUnitKHR: number; // in Cambodian Riel
  lastUpdated: string;
  priceSource: string;
}

export interface PantryItem {
  ingredientId: string;
  nameKh: string;
  availableQuantity: number;
  unit: string;
}

export interface ShoppingListItem {
  id: string;
  ingredientId: string;
  nameKh: string;
  nameEn?: string;
  requiredQuantity: number;
  availableQuantity: number;
  toPurchaseQuantity: number;
  unit: string;
  estimatedPriceKHR: number;
  isPurchased: boolean;
  mealSource?: string;
}

// ----------------- SMART MEAL PLANNER INPUT & OUTPUT -----------------

export interface MealPlannerPreferences {
  budgetKHR: number;
  servings: number;
  mealType: MealType;
  availableIngredientIds: string[];
  nutritionGoals: {
    highProtein?: boolean;
    highFiber?: boolean;
    lowerSodium?: boolean;
    moreVegetables?: boolean;
    vegetarian?: boolean;
    balanced?: boolean;
  };
  maxCookingTimeMinutes?: number;
  avoidRecentRecipeIds?: string[];
  preferredCategories?: MealCategory[];
}

export interface RecipeRecommendation {
  recipe: KhmerRecipe;
  totalScore: number; // 0 - 100
  breakdown: {
    budgetScore: number; // 30%
    nutritionScore: number; // 30%
    pantryScore: number; // 20%
    preferenceScore: number; // 10%
    timeScore: number; // 10%
  };
  estimatedTotalCostKHR: number;
  costPerPersonKHR: number;
  whyRecommended: string[];
}

// ----------------- BUDGET TRACKING -----------------

export interface BudgetConfig {
  dailyBudgetKHR: number;
  weeklyBudgetKHR: number;
  monthlyBudgetKHR: number;
  annualBudgetKHR: number;
  targetHouseholdSize: number;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  amountKHR: number;
  category: 'grocery' | 'fresh_market' | 'seasoning' | 'meat' | 'vegetable' | 'other';
  notes: string;
  mealId?: string;
}
