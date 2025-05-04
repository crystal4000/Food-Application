// src/components/FavoriteButton.tsx

import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Meal } from "../../types/mealDB.types";
import {
  addToFavorites,
  removeFromFavorites,
  toggleFavoriteOptimistic,
} from "../../store/favoritesSlice";
import { RootState } from "../../store/store";
import { useAppSelector } from "../../hooks/redux";
import { useAppDispatch } from "../../hooks/redux";

interface FavoriteButtonProps {
  meal: Meal;
  userId: string | undefined;
  size?: number;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  meal,
  userId,
  size = 24,
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(
    (state: RootState) => state.favorites.favoriteIds
  );
  const isFavorite = favoriteIds.includes(meal.idMeal);

  // Local state for immediate UI feedback
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events

    if (!userId) {
      // Handle unauthenticated users - could show login prompt
      console.log("Please log in to save favorites");
      return;
    }

    // Optimistic update
    dispatch(toggleFavoriteOptimistic(meal.idMeal));

    // Start animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Perform the actual API call
    if (isFavorite) {
      dispatch(removeFromFavorites({ userId, mealId: meal.idMeal }));
    } else {
      dispatch(addToFavorites({ userId, meal }));
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`transition-all duration-200 ${
        isAnimating ? "scale-125" : "scale-100"
      } ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <AiFillHeart size={size} className="text-red-500" />
      ) : (
        <AiOutlineHeart
          size={size}
          className="text-gray-600 hover:text-red-500"
        />
      )}
    </button>
  );
};

export default FavoriteButton;
