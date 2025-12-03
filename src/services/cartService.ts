import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  Timestamp,
  FirestoreError,
  writeBatch,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { CartItem } from "../types/cart.types";
import { Meal } from "../types/mealDB.types";
import { Drink } from "./cocktailDbApi";
import { toast } from "sonner";

const cartRef = collection(db, "cart");

/**
 * Add item to cart or increase quantity if already exists
 * Supports both Meal and Drink types
 */
export const addToCart = async (
  userId: string,
  item: Meal | Drink
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in to add to cart");
      return;
    }

    // Determine if it's a meal or drink
    const isMeal = "idMeal" in item;
    const itemId = isMeal ? item.idMeal : item.idDrink;
    const itemName = isMeal ? item.strMeal : item.strDrink;
    const itemImageUrl = isMeal ? item.strMealThumb : item.strDrinkThumb;
    const itemType = isMeal ? "meal" : "drink";

    // Check if item already exists in cart
    const existingItems = await getUserCart(userId);
    const existingItem = existingItems.find((cartItem) => {
      if (isMeal) {
        return cartItem.mealId === itemId;
      } else {
        return cartItem.drinkId === itemId;
      }
    });

    if (existingItem) {
      // Update quantity
      await updateCartItemQuantity(
        userId,
        existingItem.id,
        existingItem.quantity + 1
      );
      toast.success("Quantity updated in cart");
    } else {
      // Add new item
      const cartItemId = `${userId}_${itemType}_${itemId}`;
      const cartItemData = {
        id: cartItemId,
        userId,
        itemType,
        mealName: itemName,
        mealImageUrl: itemImageUrl,
        price: item.price || 0,
        quantity: 1,
        addedAt: serverTimestamp(),
        ...(isMeal ? { mealId: itemId } : { drinkId: itemId }),
      };

      await setDoc(doc(cartRef, cartItemId), cartItemData);
      toast.success("Added to cart");
    }
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error adding to cart:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied: Please check your Firebase rules");
    } else {
      toast.error("Failed to add to cart");
    }
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in");
      return;
    }

    if (quantity < 1) {
      await removeFromCart(userId, cartItemId);
      return;
    }

    await updateDoc(doc(cartRef, cartItemId), { quantity });
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error updating quantity:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to update quantity");
    }
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (
  userId: string,
  cartItemId: string
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in");
      return;
    }

    await deleteDoc(doc(cartRef, cartItemId));
    toast.success("Removed from cart");
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error removing from cart:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to remove from cart");
    }
    throw error;
  }
};

/**
 * Get all cart items for a user
 */
export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    if (!userId) {
      console.warn("Attempted to get cart for unauthenticated user");
      return [];
    }

    const q = query(cartRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const cartItems: CartItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<CartItem, "addedAt"> & {
        addedAt: Timestamp;
      };
      cartItems.push({
        ...data,
        addedAt: {
          seconds: data.addedAt.seconds,
          nanoseconds: data.addedAt.nanoseconds,
        },
      });
    });

    return cartItems;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error getting cart:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to load cart");
    }
    throw error;
  }
};

/**
 * Clear entire cart for a user
 */
export const clearCart = async (userId: string): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in");
      return;
    }

    const cartItems = await getUserCart(userId);
    const batch = writeBatch(db);

    cartItems.forEach((item) => {
      batch.delete(doc(cartRef, item.id));
    });

    await batch.commit();
    toast.success("Cart cleared");
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error clearing cart:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to clear cart");
    }
    throw error;
  }
};
