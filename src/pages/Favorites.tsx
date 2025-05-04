// src/pages/Favorites.tsx

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import FavoriteButton from "../components/Dashboard/FavoriteButton";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addToCart } from "../store/store";
import { fetchUserFavorites } from "../store/favoritesSlice";
import { Favorite } from "../services/favoritesService";
import { Meal } from "../types/mealDB.types";
import BackButton from "../components/Dashboard/BackButton";

const Favorites = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get favorites from Redux state
  const { items: favorites, loading } = useAppSelector(
    (state) => state.favorites
  );

  // Fetch user favorites when component mounts and user is authenticated
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserFavorites(user.uid));
    }
  }, [user, dispatch]);

  // Convert Favorite to Meal for compatibility with FavoriteButton component
  const favoriteToMeal = (favorite: Favorite): Meal => ({
    idMeal: favorite.mealId,
    strMeal: favorite.mealName,
    strMealThumb: favorite.mealImageUrl,
    price: favorite.price,
  });

  const handleAddToCart = (favorite: Favorite) => {
    const meal = favoriteToMeal(favorite);
    dispatch(addToCart(meal));
    // Show toast notification
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-950 ">
          My Favorites
        </h1>
      </div>

      {/* Favorites Content */}
      <div className="h-auto rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden mb-6">
        <div className="absolute top-4 right-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-pink-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-emerald-300/10 rounded-full blur-xl"></div>

        <div className="relative z-10">
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : favorites.length === 0 ? (
            // Empty state
            <div className="py-12 text-center">
              <div className="inline-block p-4 rounded-full bg-white/40 backdrop-blur-sm mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-emerald-800 mb-6">
                Save your favorite meals to access them quickly later
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="py-2 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
              >
                Explore Meals
              </button>
            </div>
          ) : (
            // Favorites Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white/80"
                >
                  {/* Food image */}
                  <div className="flex justify-center p-3 pb-0 relative">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white overflow-hidden flex items-center justify-center">
                      <img
                        src={favorite.mealImageUrl}
                        alt={favorite.mealName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Favorite button */}
                    <div className="absolute top-4 right-4">
                      <FavoriteButton
                        meal={favoriteToMeal(favorite)}
                        userId={user?.uid}
                        size={22}
                      />
                    </div>
                  </div>

                  {/* Food details */}
                  <div className="p-4 pt-2">
                    <h3 className="font-semibold sm:text-lg text-emerald-900 truncate">
                      {favorite.mealName}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-lg sm:text-xl text-emerald-900">
                        ${favorite.price?.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(favorite)}
                        className="p-2 rounded-full bg-emerald-500/80 text-white hover:shadow-md transition-all duration-300"
                      >
                        <IoMdAdd className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Added{" "}
                      {new Date(
                        favorite.dateAdded.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;
