import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HiArrowRight } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { GiFireBowl } from "react-icons/gi";
import CategoriesSection from "../components/Dashboard/CategoriesSection";
import FavoriteButton from "../components/Dashboard/FavoriteButton";

// Import APIs
import { useGetMealsByCategoryQuery } from "../services/mealDbApi";
import { useGetDrinksByCategoryQuery } from "../services/cocktailDbApi";

// Import Redux hooks
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addToCart } from "../store/store";
import { fetchUserFavorites } from "../store/favoritesSlice";
import { Meal } from "../types/mealDB.types";
import { Drink } from "../services/cocktailDbApi";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get active category and type from Redux store
  const activeCategory = useAppSelector(
    (state) => state.foodDashboard.activeCategory
  );
  const activeCategoryType = useAppSelector(
    (state) => state.foodDashboard.activeCategoryType
  );

  // Fetch meals for the active category if type is 'food'
  const {
    data: mealsData,
    isLoading: mealsLoading,
    error: mealsError,
  } = useGetMealsByCategoryQuery(activeCategory, {
    // Skip the query if no active category is set or type is not 'food'
    skip: !activeCategory || activeCategoryType !== "food",
  });

  // Fetch drinks for the active category if type is 'drink'
  const {
    data: drinksData,
    isLoading: drinksLoading,
    error: drinksError,
  } = useGetDrinksByCategoryQuery(activeCategory, {
    // Skip the query if no active category is set or type is not 'drink'
    skip: !activeCategory || activeCategoryType !== "drink",
  });

  // Fetch user favorites when component mounts and user is authenticated
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserFavorites(user.uid));
    }
  }, [user, dispatch]);

  // Handle add to cart for both food and drinks
  const handleAddToCart = (item: Meal | Drink) => {
    dispatch(addToCart(item));
    // You could show a toast notification here
  };

  // Handle view all click - navigate to category page with type information
  const handleViewAll = () => {
    navigate(
      `/dashboard/category/${activeCategory.toLowerCase()}?type=${activeCategoryType}`
    );
  };

  // Determine if we're loading data
  const isLoading =
    (activeCategoryType === "food" && mealsLoading) ||
    (activeCategoryType === "drink" && drinksLoading);

  // Determine if there's an error
  const hasError =
    (activeCategoryType === "food" && mealsError) ||
    (activeCategoryType === "drink" && drinksError);

  // Get items to display (limited to 4) based on active category type
  const itemsToDisplay: (Meal | Drink)[] =
    activeCategoryType === "food"
      ? mealsData?.meals?.slice(0, 4) || []
      : drinksData?.drinks?.slice(0, 4) || [];

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="h-auto rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden mb-6">
        <div className="absolute top-6 sm:top-8 md:top-12 right-6 sm:right-8 md:right-12 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-teal-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-10 sm:left-16 md:left-20 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-emerald-300/20 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <p className="text-xs sm:text-sm font-medium text-emerald-900">
            Welcome, {user?.displayName || "Guest"}
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-950 mt-1 sm:mt-2">
            Let's Order Your Food & Drinks!
          </h1>

          {/* Integrated Categories Section Component */}
          <CategoriesSection />

          {/* Best Offers Section */}
          <div className="mt-4 sm:mt-6 md:mt-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-900">
                Best Offers {activeCategory && `- ${activeCategory}`}
              </h2>
              <button
                onClick={handleViewAll}
                className="flex items-center text-emerald-900 font-medium text-sm sm:text-base hover:text-emerald-700 transition-colors"
                disabled={!activeCategory || isLoading}
              >
                View All <HiArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            )}

            {/* Error state */}
            {hasError && (
              <div className="text-center py-8 text-red-500">
                Failed to load items. Please try again.
              </div>
            )}

            {/* Items Grid - works for both food and drinks */}
            {!isLoading && !hasError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {itemsToDisplay.map((item, index) => {
                  const isMeal = "idMeal" in item;
                  const itemId = isMeal ? item.idMeal : item.idDrink;
                  const itemName = isMeal ? item.strMeal : item.strDrink;
                  const itemImage = isMeal
                    ? item.strMealThumb
                    : item.strDrinkThumb;

                  return (
                    <div
                      key={itemId}
                      className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                        index === 0
                          ? "bg-gradient-to-br from-amber-400/80 to-amber-500/80"
                          : "bg-white/80"
                      }`}
                    >
                      {/* Item image */}
                      <div className="flex justify-center p-3 pb-0 relative">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white overflow-hidden flex items-center justify-center">
                          <img
                            src={itemImage}
                            alt={itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Popular badge */}
                        {index === 0 && (
                          <div className="absolute top-4 left-4 bg-red-500/90 rounded-full p-1">
                            <GiFireBowl className="w-4 h-4 text-white" />
                          </div>
                        )}

                        {/* Favorite button */}
                        <div className="absolute top-4 right-4">
                          <FavoriteButton
                            meal={item as Meal}
                            userId={user?.uid}
                            size={22}
                            className={index === 0 ? "text-white" : ""}
                          />
                        </div>
                      </div>

                      {/* Item details */}
                      <div className="p-4 pt-2">
                        <h3
                          className={`font-semibold sm:text-lg ${
                            index === 0 ? "text-white" : "text-emerald-900"
                          } truncate`}
                        >
                          {itemName}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span
                            className={`font-bold text-lg sm:text-xl ${
                              index === 0 ? "text-white" : "text-emerald-900"
                            }`}
                          >
                            ${item.price?.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item as Meal)}
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
                  );
                })}

                {/* Show placeholder if no items available */}
                {itemsToDisplay.length === 0 && !isLoading && (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm">
                    <p className="text-emerald-800 text-center">
                      No {activeCategory} {activeCategoryType}s available right
                      now
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
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
    </div>
  );
};

export default Dashboard;
