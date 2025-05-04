import { useState, useEffect } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { foodCategories } from "../utils/functions";

const Dashboard = () => {
  const user = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Salad");

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to be passed to Sidebar component to update collapsed state
  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-500/20 to-emerald-500/30">
      <Sidebar onToggleCollapse={handleSidebarToggle} />
      <main
        className={`flex-1 p-4 sm:p-6 md:p-8 mt-14 sm:mt-16 md:mt-[70px] transition-all duration-300 ${
          isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
        } overflow-y-auto`}
      >
        <div className="h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden mb-6">
          <div className="absolute top-6 sm:top-8 md:top-12 right-6 sm:right-8 md:right-12 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-teal-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-10 sm:left-16 md:left-20 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-emerald-300/20 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-medium text-emerald-900">
              Welcome, {user?.displayName || "Guest"}
            </p>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-950 mt-1 sm:mt-2">
              Let's Order Your Food!
            </h1>

            <div className="relative">
              <div className="overflow-x-auto py-4 hide-scrollbar">
                <div className="flex space-x-4 sm:space-x-6 md:space-x-8 px-1">
                  {foodCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
                        activeCategory === category.name
                          ? "scale-110"
                          : "scale-100 hover:scale-105"
                      }`}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      <div
                        className={`
                        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                        rounded-full flex items-center justify-center 
                        transition-all duration-300
                        backdrop-blur-md 
                        ${
                          activeCategory === category.name
                            ? "bg-white/90 border-2 border-white shadow-lg"
                            : "bg-white/40 border border-white/50"
                        }
                      `}
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                          <img
                            src={category.iconUrl}
                            alt={category.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <p
                        className={`
                        mt-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-300
                        ${
                          activeCategory === category.name
                            ? "text-emerald-900"
                            : "text-emerald-800/70"
                        }
                      `}
                      >
                        {category.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient mask for scrolling indication */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Grid for Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-lg rounded-xl p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 bg-teal-400/10 rounded-full blur-lg"></div>
            <h3 className="text-base sm:text-lg font-medium text-emerald-900 mb-2">
              Featured Meals
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800/90">
              Discover our chef's special selections for today.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-lg rounded-xl p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 bg-emerald-400/10 rounded-full blur-lg"></div>
            <h3 className="text-base sm:text-lg font-medium text-emerald-900 mb-2">
              Your Recent Orders
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800/90">
              Quick access to your recent food orders.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-lg rounded-xl p-4 sm:p-6 relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="absolute top-4 right-4 w-16 h-16 bg-teal-400/10 rounded-full blur-lg"></div>
            <h3 className="text-base sm:text-lg font-medium text-emerald-900 mb-2">
              Promotions
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800/90">
              Special deals and discounts just for you.
            </p>
          </div>
        </div>
      </main>
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
