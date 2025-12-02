import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setActiveCategory, setActiveCategoryType } from "../../store/store";
import { useGetCategoriesQuery } from "../../services/mealDbApi";
import { useGetDrinkCategoriesQuery } from "../../services/cocktailDbApi";

import { IoFastFoodOutline, IoWineOutline } from "react-icons/io5";

interface CategoriesSectionProps {
  className?: string;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector(
    (state) => state.foodDashboard.activeCategory
  );
  const activeCategoryType = useAppSelector(
    (state) => state.foodDashboard.activeCategoryType
  );

  const {
    data: foodCategoriesData,
    isLoading: foodCategoriesLoading,
    error: foodCategoriesError,
  } = useGetCategoriesQuery();

  const {
    data: drinkCategoriesData,
    isLoading: drinkCategoriesLoading,
    error: drinkCategoriesError,
  } = useGetDrinkCategoriesQuery();

  // Set initial active category if none is set
  useEffect(() => {
    if (
      foodCategoriesData?.categories &&
      foodCategoriesData.categories.length > 0 &&
      !activeCategory &&
      activeCategoryType === "food"
    ) {
      dispatch(setActiveCategory(foodCategoriesData.categories[0].strCategory));
    } else if (
      drinkCategoriesData?.drinks &&
      drinkCategoriesData.drinks.length > 0 &&
      !activeCategory &&
      activeCategoryType === "drink"
    ) {
      dispatch(setActiveCategory(drinkCategoriesData.drinks[0].strCategory));
    }
  }, [
    foodCategoriesData,
    drinkCategoriesData,
    activeCategory,
    activeCategoryType,
    dispatch,
  ]);

  const handleCategoryTypeChange = (type: "food" | "drink") => {
    if (type === activeCategoryType) return;

    dispatch(setActiveCategoryType(type));

    if (
      type === "food" &&
      foodCategoriesData?.categories &&
      foodCategoriesData.categories.length > 0
    ) {
      dispatch(setActiveCategory(foodCategoriesData.categories[0].strCategory));
    } else if (
      type === "drink" &&
      drinkCategoriesData?.drinks &&
      drinkCategoriesData.drinks.length > 0
    ) {
      dispatch(setActiveCategory(drinkCategoriesData.drinks[0].strCategory));
    }
  };

  const handleCategoryClick = (category: string) => {
    dispatch(setActiveCategory(category));
  };

  const isLoading =
    (activeCategoryType === "food" && foodCategoriesLoading) ||
    (activeCategoryType === "drink" && drinkCategoriesLoading);

  const hasError =
    (activeCategoryType === "food" && foodCategoriesError) ||
    (activeCategoryType === "drink" && drinkCategoriesError);

  return (
    <div className={`relative mb-8 ${className}`}>
      {/* Category Type Switcher */}
      <div className="flex mb-4 border border-white/20 rounded-full backdrop-blur-md bg-white/10 p-1 w-fit">
        <button
          onClick={() => handleCategoryTypeChange("food")}
          className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
            activeCategoryType === "food"
              ? "bg-white/80 text-emerald-900 shadow-md"
              : "text-emerald-700 hover:bg-white/20"
          }`}
        >
          <IoFastFoodOutline className="mr-2" />
          <span>Food</span>
        </button>
        <button
          onClick={() => handleCategoryTypeChange("drink")}
          className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
            activeCategoryType === "drink"
              ? "bg-white/80 text-emerald-900 shadow-md"
              : "text-emerald-700 hover:bg-white/20"
          }`}
        >
          <IoWineOutline className="mr-2" />
          <span>Drinks</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : hasError ? (
        <div className="text-center py-4 text-red-500">
          Failed to load categories. Please try again.
        </div>
      ) : (
        <div className="overflow-x-auto py-4 hide-scrollbar">
          <div className="flex space-x-4 sm:space-x-6 md:space-x-8 px-1">
            {activeCategoryType === "food" &&
              foodCategoriesData?.categories?.map((category) => (
                <div
                  key={category.idCategory}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
                    activeCategory === category.strCategory
                      ? "scale-110"
                      : "scale-100 hover:scale-105"
                  }`}
                  onClick={() => handleCategoryClick(category.strCategory)}
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

            {activeCategoryType === "drink" &&
              drinkCategoriesData?.drinks?.map((category, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
                    activeCategory === category.strCategory
                      ? "scale-110"
                      : "scale-100 hover:scale-105"
                  }`}
                  onClick={() => handleCategoryClick(category.strCategory)}
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
                    <IoWineOutline
                      className={`
                    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                    ${
                      activeCategory === category.strCategory
                        ? "text-emerald-600"
                        : "text-emerald-700/70"
                    }
                  `}
                    />
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

      <div className="absolute left-0 top-12 bottom-0 w-8 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-12 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default CategoriesSection;
