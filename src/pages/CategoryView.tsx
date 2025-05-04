// src/pages/CategoryView.tsx

import { useState, useEffect } from "react";
import FavoriteButton from "../components/Dashboard/FavoriteButton";
import Pagination from "../components/Dashboard/Pagination";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaFilter, FaSort } from "react-icons/fa";

import { useGetMealsByCategoryQuery } from "../services/mealDbApi";
import { useAppDispatch } from "../hooks/redux";
import { addToCart } from "../store/store";
import { fetchUserFavorites } from "../store/favoritesSlice";
import { Meal } from "../types/mealDB.types";
import BackButton from "../components/Dashboard/BackButton";

// Define sorting options
type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const CategoryView = () => {
  const { category } = useParams<{ category: string }>();
  const user = useAuth();
  const dispatch = useAppDispatch();

  // State for sorting and filtering
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8); // Default 8 items per page

  // Fetch meals for the category
  const {
    data: mealsData,
    isLoading: mealsLoading,
    error: mealsError,
  } = useGetMealsByCategoryQuery(category || "", {
    skip: !category,
  });

  // Format category name for display
  const displayCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "";

  // Fetch user favorites when component mounts and user is authenticated
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserFavorites(user.uid));
    }
  }, [user, dispatch]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption, priceRange]);

  const handleAddToCart = (meal: Meal) => {
    dispatch(addToCart(meal));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };

  // Filter and sort meals
  const getFilteredAndSortedMeals = () => {
    if (!mealsData?.meals) return [];

    // Filter meals by search term and price range
    const filtered = [...mealsData.meals].filter((meal) => {
      const matchesSearch =
        searchTerm === "" ||
        meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice =
        meal.price !== undefined &&
        meal.price >= priceRange[0] &&
        meal.price <= priceRange[1];

      return matchesSearch && matchesPrice;
    });

    // Sort meals
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.strMeal.localeCompare(b.strMeal);
        case "name-desc":
          return b.strMeal.localeCompare(a.strMeal);
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAndSortedMeals = getFilteredAndSortedMeals();

  // Calculate pagination values
  const totalItems = filteredAndSortedMeals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedMeals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
      {/* Header with Back button and Title */}
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">
          {displayCategory} Meals
        </h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="rounded-xl backdrop-blur-md bg-white/20 border border-white/30 shadow-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-emerald-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="min-w-[180px]">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full p-3 pl-10 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
              <FaSort className="absolute left-3 top-3.5 h-5 w-5 text-emerald-800" />
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/60 transition-colors"
          >
            <FaFilter className="h-5 w-5 text-emerald-800 mr-2" />
            <span>Filters</span>
          </button>
        </div>

        {/* Expandable Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40">
            <h3 className="text-emerald-900 font-medium mb-2">Price Range</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
                className="flex-1 accent-emerald-500"
              />
              <span className="text-emerald-900 font-medium">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="flex-1 accent-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Meals Grid */}
      <div className="h-auto rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden mb-6">
        <div className="absolute top-4 right-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-amber-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-emerald-300/10 rounded-full blur-xl"></div>

        <div className="relative z-10">
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

          {/* Empty state */}
          {!mealsLoading &&
            !mealsError &&
            filteredAndSortedMeals.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-emerald-500 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                  No meals found
                </h3>
                <p className="text-emerald-800">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}

          {/* Meals Grid */}
          {!mealsLoading && !mealsError && currentItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {currentItems.map((meal: Meal) => (
                <div
                  key={meal.idMeal}
                  className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white/80"
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

                    {/* Favorite button */}
                    <div className="absolute top-4 right-4">
                      <FavoriteButton
                        meal={meal}
                        userId={user?.uid}
                        size={22}
                      />
                    </div>
                  </div>

                  {/* Food details */}
                  <div className="p-4 pt-2">
                    <h3 className="font-semibold sm:text-lg text-emerald-900 truncate">
                      {meal.strMeal}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-lg sm:text-xl text-emerald-900">
                        ${meal.price?.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(meal)}
                        className="p-2 rounded-full bg-emerald-500/80 text-white hover:shadow-md transition-all duration-300"
                      >
                        <IoMdAdd className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Component (below meals grid) */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPage={true}
              showResultsInfo={true}
              containerClassName="mt-8"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryView;
