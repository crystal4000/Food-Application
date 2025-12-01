import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types for API responses
export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  price?: number;
}

export interface DrinksResponse {
  drinks: Drink[] | null;
}

export interface DrinkCategory {
  strCategory: string;
}

export interface DrinkCategoriesResponse {
  drinks: DrinkCategory[];
}

export interface DetailedDrink extends Drink {
  strInstructions: string;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  // Adding ingredients and measures (up to 15 per drink in the API)
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  // ... strIngredient4 through strIngredient15
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  // ... strMeasure4 through strMeasure15
}

export interface DrinkDetailsResponse {
  drinks: DetailedDrink[] | null;
}

// Create the API service using RTK Query
export const cocktailDbApi = createApi({
  reducerPath: "cocktailDbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.thecocktaildb.com/api/json/v1/1/",
  }),
  tagTypes: ["DrinkCategories", "Drinks"],
  endpoints: (builder) => ({
    // Get all drink categories
    getDrinkCategories: builder.query<DrinkCategoriesResponse, void>({
      query: () => "list.php?c=list",
      providesTags: ["DrinkCategories"],
    }),

    // Get drinks by category
    getDrinksByCategory: builder.query<DrinksResponse, string>({
      query: (category) => `filter.php?c=${category}`,
      providesTags: (result, error, category) => [
        { type: "Drinks", id: category },
      ],
      // Transform the result to add prices (since API doesn't have prices)
      transformResponse: (response: DrinksResponse) => {
        if (!response.drinks) return { drinks: null };

        // Add simulated prices to drinks
        const drinksWithPrices = response.drinks.map((drink) => ({
          ...drink,
          price: parseFloat((Math.random() * 10 + 5).toFixed(2)), // Random price between $5-$15
        }));

        return { drinks: drinksWithPrices };
      },
    }),

    // Get detailed drink information by ID
    getDrinkDetails: builder.query<DrinkDetailsResponse, string>({
      query: (id) => `lookup.php?i=${id}`,
    }),

    // Search drinks by name
    searchDrinks: builder.query<DrinksResponse, string>({
      query: (searchTerm) => `search.php?s=${searchTerm}`,
    }),

    // List alcoholic filters
    getAlcoholicFilters: builder.query<
      { drinks: { strAlcoholic: string }[] },
      void
    >({
      query: () => "list.php?a=list",
    }),

    // Filter by alcoholic or non-alcoholic
    getAlcoholicDrinks: builder.query<DrinksResponse, string>({
      query: (type) => `filter.php?a=${type}`, // 'Alcoholic' or 'Non_Alcoholic'
      transformResponse: (response: DrinksResponse) => {
        if (!response.drinks) return { drinks: null };

        // Add simulated prices to drinks
        const drinksWithPrices = response.drinks.map((drink) => ({
          ...drink,
          price: parseFloat((Math.random() * 10 + 5).toFixed(2)), // Random price between $5-$15
        }));

        return { drinks: drinksWithPrices };
      },
    }),
  }),
});

export const {
  useGetDrinkCategoriesQuery,
  useGetDrinksByCategoryQuery,
  useGetDrinkDetailsQuery,
  useSearchDrinksQuery,
  useGetAlcoholicFiltersQuery,
  useGetAlcoholicDrinksQuery,
} = cocktailDbApi;
