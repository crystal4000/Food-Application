import { useEffect } from "react";
import FavoriteButton from "../components/Dashboard/FavoriteButton";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { GiFireBowl } from "react-icons/gi";

import {
  useGetCategoriesQuery,
  useGetMealsByCategoryQuery,
} from "../services/mealDbApi";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setActiveCategory, addToCart } from "../store/store";
import { Category, Meal } from "../types/mealDB.types";
import { toast } from "sonner";
import { fetchUserFavorites } from "../store/favoritesSlice";

const Dashboard = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const activeCategory = useAppSelector(
    (state) => state.foodDashboard.activeCategory
  );

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const {
    data: mealsData,
    isLoading: mealsLoading,
    error: mealsError,
  } = useGetMealsByCategoryQuery(activeCategory, {
    // Skip the query if no active category is set
    skip: !activeCategory,
  });

  useEffect(() => {
    if (
      categoriesData?.categories &&
      categoriesData.categories.length > 0 &&
      !activeCategory
    ) {
      dispatch(setActiveCategory(categoriesData.categories[0].strCategory));
    }
  }, [categoriesData, activeCategory, dispatch]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserFavorites(user.uid));
    }
  }, [user, dispatch]);

  const handleCategoryClick = (category: Category) => {
    dispatch(setActiveCategory(category.strCategory));
  };

  const handleAddToCart = (meal: Meal) => {
    dispatch(addToCart(meal));
    toast.success("Item added to cart");
  };

  const handleViewAll = () => {
    navigate(`/dashboard/category/${activeCategory.toLowerCase()}`);
  };

  const mealsToDisplay = mealsData?.meals?.slice(0, 4) || [];

  return (
    <>
      {/* Welcome Card Section with Categories */}
      <div className="h-auto rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden mb-6">
        <div className="absolute top-6 sm:top-8 md:top-12 right-6 sm:right-8 md:right-12 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-teal-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-10 sm:left-16 md:left-20 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-emerald-300/20 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <p className="text-xs sm:text-sm font-medium text-emerald-900">
            Welcome, {user?.displayName || "Guest"}
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-950 mt-1 sm:mt-2">
            Let's Order Your Food!
          </h1>

          {/* Food Categories Section */}
          <div className="relative mt-4 sm:mt-6 md:mt-8">
            {categoriesLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : categoriesError ? (
              <div className="text-center py-4 text-red-500">
                Failed to load categories. Please try again.
              </div>
            ) : (
              <div className="overflow-x-auto py-4 hide-scrollbar">
                <div className="flex space-x-4 sm:space-x-6 md:space-x-8 px-1">
                  {categoriesData?.categories.map((category: Category) => (
                    <div
                      key={category.idCategory}
                      className={`flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
                        activeCategory === category.strCategory
                          ? "scale-110"
                          : "scale-100 hover:scale-105"
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div
                        className={`
                        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                        rounded-full flex items-center justify-center 
                        transition-all duration-300
                        backdrop-blur-md 
                        ${
                          activeCategory === category.strCategory
                            ? "bg-white/90 border-2 border-white shadow-lg"
                            : "bg-white/40 border border-white/50"
                        }
                      `}
                      >
                        {/* Use the category thumbnail from API */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden">
                          <img
                            src={category.strCategoryThumb}
                            alt={category.strCategory}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <p
                        className={`
                        mt-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-300
                        ${
                          activeCategory === category.strCategory
                            ? "text-emerald-900"
                            : "text-emerald-800/70"
                        }
                      `}
                      >
                        {category.strCategory}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gradient mask for scrolling indication */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Best Offers Section - Now outside the welcome card */}
      <div className="h-auto rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden mb-6">
        <div className="absolute top-4 right-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-amber-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-emerald-300/10 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-900">
              Best Offers
            </h2>
            <button
              onClick={handleViewAll}
              className="flex items-center text-emerald-900 font-medium text-sm sm:text-base hover:text-emerald-700 transition-colors"
              disabled={!activeCategory || mealsLoading}
            >
              View All <HiArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Loading state */}
          {mealsLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {/* Error state */}
          {mealsError && (
            <div className="text-center py-8 text-red-500">
              Failed to load meals. Please try again.
            </div>
          )}

          {/* Food Item Cards */}
          {!mealsLoading && !mealsError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {mealsToDisplay.map((meal: Meal, index: number) => (
                <div
                  key={meal.idMeal}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    index === 0
                      ? "bg-gradient-to-br from-amber-400/80 to-amber-500/80"
                      : "bg-white/80"
                  }`}
                >
                  {/* Food image */}
                  <div className="flex justify-center p-3 pb-0 relative">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white overflow-hidden flex items-center justify-center">
                      <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Popular badge */}
                    {index === 0 && (
                      <div className="absolute top-4 left-4 bg-red-500/90 rounded-full p-1">
                        <GiFireBowl className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <FavoriteButton
                        meal={meal}
                        userId={user?.uid}
                        size={22}
                        className={index === 0 ? "text-white" : ""}
                      />
                    </div>
                  </div>

                  {/* Food details */}
                  <div className="p-4 pt-2">
                    <h3
                      className={`font-semibold sm:text-lg ${
                        index === 0 ? "text-white" : "text-emerald-900"
                      } truncate`}
                    >
                      {meal.strMeal}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`font-bold text-lg sm:text-xl ${
                          index === 0 ? "text-white" : "text-emerald-900"
                        }`}
                      >
                        ${meal.price?.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(meal)}
                        className={`p-2 rounded-full ${
                          index === 0
                            ? "bg-white text-amber-500"
                            : "bg-emerald-500/80 text-white"
                        } hover:shadow-md transition-all duration-300`}
                      >
                        <IoMdAdd className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show placeholder if no items available */}
              {mealsToDisplay.length === 0 && !mealsLoading && (
                <div className="col-span-full flex flex-col items-center justify-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm">
                  <p className="text-emerald-800 text-center">
                    No {activeCategory} items available right now
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  );
};

export default Dashboard;
