import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
  Favorite,
} from "../services/favoritesService";
import { Meal } from "../types/mealDB.types";

interface FavoritesState {
  items: Favorite[];
  favoriteIds: string[]; // Array of meal IDs for quick lookup
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  favoriteIds: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserFavorites = createAsyncThunk(
  "favorites/fetchUserFavorites",
  async (userId: string) => {
    const favorites = await getUserFavorites(userId);
    return favorites;
  }
);

export const addToFavorites = createAsyncThunk(
  "favorites/addToFavorites",
  async ({ userId, meal }: { userId: string; meal: Meal }) => {
    await addFavorite(userId, meal);
    return meal.idMeal;
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorites/removeFromFavorites",
  async ({ userId, mealId }: { userId: string; mealId: string }) => {
    await removeFavorite(userId, mealId);
    return mealId;
  }
);

export const checkIsFavorite = createAsyncThunk(
  "favorites/checkIsFavorite",
  async ({ userId, mealId }: { userId: string; mealId: string }) => {
    const isFavorite = await checkFavorite(userId, mealId);
    return { mealId, isFavorite };
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // In-memory favorite toggle for quick UI updates before API call completes
    toggleFavoriteOptimistic: (state, action: PayloadAction<string>) => {
      const mealId = action.payload;

      if (state.favoriteIds.includes(mealId)) {
        // Remove from favorites
        state.favoriteIds = state.favoriteIds.filter((id) => id !== mealId);
        state.items = state.items.filter((item) => item.mealId !== mealId);
      } else {
        // We'll add the ID, but the full object will be added when the API call succeeds
        state.favoriteIds.push(mealId);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
      state.favoriteIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.favoriteIds = action.payload.map((fav) => fav.mealId);
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch favorites";
      })

      // Add to favorites
      .addCase(addToFavorites.fulfilled, () => {
        // We already optimistically added the ID, so we don't need to do anything here
        // The full object will be fetched next time we fetch user favorites
      })

      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, () => {
        // We already optimistically removed the item, so we don't need to do anything here
      });
  },
});

export const { toggleFavoriteOptimistic, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
