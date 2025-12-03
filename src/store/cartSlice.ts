import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCart as addToCartService,
  removeFromCart as removeFromCartService,
  updateCartItemQuantity,
  getUserCart,
  clearCart as clearCartService,
} from "../services/cartService";
import { CartItem } from "../types/cart.types";
import { Meal } from "../types/mealDB.types";
import { Drink } from "../services/cocktailDbApi";

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserCart = createAsyncThunk(
  "cart/fetchUserCart",
  async (userId: string) => {
    const cart = await getUserCart(userId);
    return cart;
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { userId, meal }: { userId: string; meal: Meal | Drink },
    { dispatch }
  ) => {
    await addToCartService(userId, meal);
    // Refetch cart to get updated data
    dispatch(fetchUserCart(userId));
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    { userId, cartItemId }: { userId: string; cartItemId: string },
    { dispatch }
  ) => {
    await removeFromCartService(userId, cartItemId);
    dispatch(fetchUserCart(userId));
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    {
      userId,
      cartItemId,
      quantity,
    }: { userId: string; cartItemId: string; quantity: number },
    { dispatch }
  ) => {
    await updateCartItemQuantity(userId, cartItemId, quantity);
    dispatch(fetchUserCart(userId));
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId: string, { dispatch }) => {
    await clearCartService(userId);
    dispatch(fetchUserCart(userId));
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
