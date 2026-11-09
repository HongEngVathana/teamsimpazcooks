import { KhmerRecipe, MealPlannerPreferences, RecipeRecommendation } from '../types/schedule';
import { RecipeService } from './recipeService';

export class SmartMealPlannerService {
  /**
   * Local Smart Recommendation Algorithm (100% deterministic local TypeScript, no external AI API)
   * Evaluates recipes across 5 weighted dimensions:
   * 1. Budget Fit (30%)
   * 2. Nutrition Alignment (30%)
   * 3. Available Pantry Ingredients (20%)
   * 4. User Preferences & Categories (10%)
   * 5. Cooking Time (10%)
   */
  public static recommendMeals(
    preferences: MealPlannerPreferences,
    allRecipes: KhmerRecipe[] = RecipeService.getAllRecipes()
  ): RecipeRecommendation[] {
    const {
      budgetKHR = 15000,
      servings = 4,
      mealType = 'lunch',
      availableIngredientIds = [],
      nutritionGoals = {},
      maxCookingTimeMinutes = 60,
      avoidRecentRecipeIds = [],
      preferredCategories = [],
    } = preferences;

    const scoredList: RecipeRecommendation[] = [];

    for (const recipe of allRecipes) {
      // Step 1: Filter by Meal Type
      if (mealType && !recipe.mealTypes.includes(mealType)) {
        continue;
      }

      // Step 2: Avoid recent recipes if requested
      if (avoidRecentRecipeIds.includes(recipe.id)) {
        continue;
      }

      // Vegetarian filter constraint
      if (nutritionGoals.vegetarian && recipe.category !== 'vegetable' && !recipe.healthTags.includes('vegetarian')) {
        continue;
      }

      // Step 3: Calculate dynamic cost for requested servings
      const totalEstimatedCostKHR = RecipeService.calculateRecipeCost(recipe, servings);
      const costPerPersonKHR = Math.round(totalEstimatedCostKHR / servings);

      // Step 4: Dimension 1 - Budget Fit Score (Max 30 points)
      let budgetScore = 0;
      const whyRecommended: string[] = [];

      if (totalEstimatedCostKHR <= budgetKHR) {
        // Full score if within budget, slight bonus for extra savings
        const savingsRatio = (budgetKHR - totalEstimatedCostKHR) / budgetKHR;
        budgetScore = 25 + Math.min(5, Math.round(savingsRatio * 5));
        const savingsKHR = budgetKHR - totalEstimatedCostKHR;
        if (savingsKHR > 0) {
          whyRecommended.push(`សន្សំបាន ${savingsKHR.toLocaleString()} រៀលក្រោមថវិកា (Saves ${savingsKHR.toLocaleString()} KHR under budget)`);
        } else {
          whyRecommended.push(`សមស្របនឹងថវិកាដែលបានកំណត់ (Fits budget perfectly)`);
        }
      } else if (totalEstimatedCostKHR <= budgetKHR * 1.15) {
        // Minor penalty if slightly exceeds budget by <= 15%
        budgetScore = 15;
      } else {
        budgetScore = 5;
      }

      // Step 5: Dimension 2 - Nutrition Alignment (Max 30 points)
      let nutritionScore = 15; // baseline healthy score
      const nutrition = recipe.nutritionPerServing;

      if (nutritionGoals.highProtein) {
        if ((nutrition.protein || 0) >= 25) {
          nutritionScore += 6;
          whyRecommended.push(`ប្រូតេអ៊ីនខ្ពស់ ${nutrition.protein}g/ចាន (High protein ${nutrition.protein}g/serving)`);
        } else if ((nutrition.protein || 0) >= 18) {
          nutritionScore += 3;
        }
      }

      if (nutritionGoals.highFiber || nutritionGoals.moreVegetables) {
        if ((nutrition.fiber || 0) >= 4 || recipe.category === 'vegetable' || recipe.category === 'soup') {
          nutritionScore += 5;
          whyRecommended.push(`សំបូរជាតិសរសៃបន្លែជំនួយរំលាយអាហារ (Rich in healthy vegetable fiber)`);
        }
      }

      if (nutritionGoals.lowerSodium) {
        if ((nutrition.sodiumMg || 0) <= 500) {
          nutritionScore += 4;
          whyRecommended.push(`ជាតិសូដ្យូមទាបល្អចំពោះសុខភាព (Lower sodium)`);
        }
      }

      if (recipe.healthTags.includes('iron-rich')) {
        nutritionScore += 2;
      }

      nutritionScore = Math.min(30, nutritionScore);

      // Step 6: Dimension 3 - Available Pantry Ingredients (Max 20 points)
      let pantryScore = 0;
      if (availableIngredientIds.length > 0 && recipe.ingredients.length > 0) {
        const matched = recipe.ingredients.filter(ing => availableIngredientIds.includes(ing.ingredientId));
        const matchRatio = matched.length / recipe.ingredients.length;
        pantryScore = Math.round(matchRatio * 20);
        if (matched.length > 0) {
          whyRecommended.push(`មានគ្រឿងផ្សំស្រាប់ក្នុងផ្ទះបាយ ${matched.length} មុខ (${matched.length} pantry ingredients available)`);
        }
      } else {
        // Neutral default score if no pantry ingredients specified
        pantryScore = 12;
      }

      // Step 7: Dimension 4 - User Preferences & Category (Max 10 points)
      let preferenceScore = 5;
      if (preferredCategories.length > 0 && preferredCategories.includes(recipe.category)) {
        preferenceScore = 10;
        whyRecommended.push(`ត្រូវនឹងប្រភេទមុខម្ហូបដែលអ្នកចូលចិត្ត (Matches preferred category)`);
      } else if (recipe.verified) {
        preferenceScore = 8;
      }

      // Step 8: Dimension 5 - Cooking Time (Max 10 points)
      let timeScore = 0;
      if (recipe.cookingTimeMinutes <= maxCookingTimeMinutes) {
        timeScore = 10;
        whyRecommended.push(`ចំណាយពេលចម្អិនតែ ${recipe.cookingTimeMinutes} នាទី (Quick cooking time: ${recipe.cookingTimeMinutes}m)`);
      } else if (recipe.cookingTimeMinutes <= maxCookingTimeMinutes + 15) {
        timeScore = 6;
      } else {
        timeScore = 2;
      }

      // Total Weighted Score (0 - 100)
      const totalScore = Math.min(100, budgetScore + nutritionScore + pantryScore + preferenceScore + timeScore);

      scoredList.push({
        recipe,
        totalScore,
        breakdown: {
          budgetScore,
          nutritionScore,
          pantryScore,
          preferenceScore,
          timeScore,
        },
        estimatedTotalCostKHR: totalEstimatedCostKHR,
        costPerPersonKHR,
        whyRecommended: whyRecommended.slice(0, 3),
      });
    }

    // Step 9: Rank descending by score
    scoredList.sort((a, b) => b.totalScore - a.totalScore);

    // Step 10: Return top 3 recommendations
    return scoredList.slice(0, 3);
  }
}
