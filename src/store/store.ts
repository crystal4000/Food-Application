import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { mealdbApi } from "../services/mealDbApi";
import favoritesReducer from "./favoritesSlice";
// Optional: Create a food dashboard slice for local state management
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Meal } from "../types/mealDB.types";

interface FoodDashboardState {
  activeCategory: string;
  cart: Meal[];
}

const initialState: FoodDashboardState = {
  activeCategory: "",
  cart: [],
};

export const foodDashboardSlice = createSlice({
  name: "foodDashboard",
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
    addToCart: (state, action: PayloadAction<Meal>) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.idMeal !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { setActiveCategory, addToCart, removeFromCart, clearCart } =
  foodDashboardSlice.actions;

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [mealdbApi.reducerPath]: mealdbApi.reducer,
    foodDashboard: foodDashboardSlice.reducer,
    favorites: favoritesReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mealdbApi.middleware),
});

// Optional: Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
