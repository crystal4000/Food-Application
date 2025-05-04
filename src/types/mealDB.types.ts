// src/types/mealdb.types.ts

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  price?: number;
}

export interface MealsResponse {
  meals: Meal[] | null;
}

export interface DetailedMeal extends Meal {
  strInstructions: string;
  strArea: string;
  strTags: string | null;
}

export interface MealDetailsResponse {
  meals: DetailedMeal[] | null;
}
