import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  documentId,
  serverTimestamp,
  Timestamp,
  FirestoreError,
} from "firebase/firestore";
import { Meal } from "../types/mealDB.types";
import { toast } from "sonner";
import { db } from "../utils/firebase";

// Define interface for a Favorite
export interface Favorite {
  id: string;
  userId: string;
  mealId: string;
  mealName: string;
  mealImageUrl: string;
  price?: number;
  dateAdded: {
    seconds: number;
    nanoseconds: number;
  };
}

// Collection references
const favoritesRef = collection(db, "favorites");

/**
 * Add a meal to user's favorites
 */
export const addFavorite = async (
  userId: string,
  meal: Meal
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in to add favorites");
      return;
    }

    const favoriteId = `${userId}_${meal.idMeal}`;
    const favoriteData: Omit<Favorite, "dateAdded"> & {
      dateAdded: ReturnType<typeof serverTimestamp>;
    } = {
      id: favoriteId,
      userId,
      mealId: meal.idMeal,
      mealName: meal.strMeal,
      mealImageUrl: meal.strMealThumb,
      price: meal.price,
      dateAdded: serverTimestamp(),
    };

    await setDoc(doc(favoritesRef, favoriteId), favoriteData);
    toast.success("Added to favorites");
  } catch (error) {
    const firestoreError = error as FirestoreError;

    // Log the error for debugging
    console.error("Error adding favorite:", error);

    // Show user-friendly error message
    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied: Please check your Firebase rules");
    } else {
      toast.error("Failed to add favorite");
    }

    throw error;
  }
};

/**
 * Remove a meal from user's favorites
 */
export const removeFavorite = async (
  userId: string,
  mealId: string
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in to manage favorites");
      return;
    }

    const favoriteId = `${userId}_${mealId}`;
    await deleteDoc(doc(favoritesRef, favoriteId));
    toast.success("Removed from favorites");
  } catch (error) {
    const firestoreError = error as FirestoreError;

    // Log the error for debugging
    console.error("Error removing favorite:", error);

    // Show user-friendly error message
    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied: Please check your Firebase rules");
    } else {
      toast.error("Failed to remove favorite");
    }

    throw error;
  }
};

/**
 * Check if a meal is in user's favorites
 */
export const checkFavorite = async (
  userId: string,
  mealId: string
): Promise<boolean> => {
  try {
    if (!userId) return false;

    const favoriteId = `${userId}_${mealId}`;
    const q = query(favoritesRef, where(documentId(), "==", favoriteId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    // Log the error for debugging but don't show to user
    console.error("Error checking favorite:", error);
    return false;
  }
};

/**
 * Get all favorites for a user
 */
export const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
  try {
    if (!userId) {
      console.warn("Attempted to get favorites for unauthenticated user");
      return [];
    }

    const q = query(favoritesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const favorites: Favorite[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Favorite, "dateAdded"> & {
        dateAdded: Timestamp;
      };
      favorites.push({
        ...data,
        dateAdded: {
          seconds: data.dateAdded.seconds,
          nanoseconds: data.dateAdded.nanoseconds,
        },
      });
    });

    return favorites;
  } catch (error) {
    const firestoreError = error as FirestoreError;

    // Log the error for debugging
    console.error("Error getting user favorites:", error);

    // Show user-friendly error message
    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied: Please check your Firebase rules");
    } else {
      toast.error("Failed to load favorites");
    }

    throw error;
  }
};
