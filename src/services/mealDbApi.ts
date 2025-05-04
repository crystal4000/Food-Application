import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";
import {
  CategoriesResponse,
  MealsResponse,
  MealDetailsResponse,
} from "../types/mealDB.types";

// Create the API service using RTK Query
export const mealdbApi = createApi({
  reducerPath: "mealdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.themealdb.com/api/json/v1/1/",
  }),
  tagTypes: ["Categories", "Meals"],
  endpoints: (
    builder: EndpointBuilder<
      ReturnType<typeof fetchBaseQuery>,
      "Categories" | "Meals",
      "mealdbApi"
    >
  ) => ({
    // Get all meal categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "categories.php",
      providesTags: ["Categories"],
    }),

    // Get meals by category
    getMealsByCategory: builder.query<MealsResponse, string>({
      query: (category: string) => `filter.php?c=${category}`,
      providesTags: (
        result?: MealsResponse,
        error?: unknown,
        category?: string
      ) => [{ type: "Meals", id: category }],
      // Transform the result to add prices (since API doesn't have prices)
      transformResponse: (response: MealsResponse) => {
        if (!response.meals) return { meals: null };

        // Add simulated prices to meals
        const mealsWithPrices = response.meals.map((meal) => ({
          ...meal,
          price: parseFloat((Math.random() * 15 + 8).toFixed(2)),
        }));

        return { meals: mealsWithPrices };
      },
    }),

    // Get detailed meal information by ID
    getMealDetails: builder.query<MealDetailsResponse, string>({
      query: (id: string) => `lookup.php?i=${id}`,
    }),

    // Search meals by name
    searchMeals: builder.query<MealsResponse, string>({
      query: (searchTerm: string) => `search.php?s=${searchTerm}`,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetMealsByCategoryQuery,
  useGetMealDetailsQuery,
  useSearchMealsQuery,
} = mealdbApi;
