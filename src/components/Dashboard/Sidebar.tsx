import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { toast } from "sonner";
import {
  AiOutlineHome,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineMessage,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineUser,
} from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import logo from "../../assets/landing_page/logo.svg";
import { getInitials } from "../../utils/functions";
import { BiBell, BiSearch, BiMenu } from "react-icons/bi";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = ({
  onToggleCollapse,
}: {
  onToggleCollapse: (collapsed: boolean) => void;
}) => {
  const user = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (onToggleCollapse) {
      onToggleCollapse(isCollapsed);
    }
  }, [isCollapsed, onToggleCollapse]);

  const menuItems = [
    {
      id: 1,
      name: "Home",
      icon: AiOutlineHome,
      path: "/dashboard",
      exact: true,
    },
    {
      id: 2,
      name: "Favorites",
      icon: AiOutlineHeart,
      path: "/dashboard/favorites",
    },
    {
      id: 3,
      name: "Cart",
      icon: AiOutlineShoppingCart,
      path: "/dashboard/cart",
    },
    {
      id: 4,
      name: "Messages",
      icon: AiOutlineMessage,
      path: "/dashboard/chat",
    },
    {
      id: 5,
      name: "Orders",
      icon: BsBoxSeam,
      path: "/dashboard/orders",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out" + error);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-white/30 shadow-sm">
        <div className="px-3 py-2 sm:py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section - Left Side */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="inline-flex items-center p-2 text-sm text-emerald-800 rounded-lg md:hidden hover:bg-white/40 focus:outline-none transition-all duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isMobileSidebarOpen}
              >
                <span className="sr-only">Open main menu</span>
                <BiMenu className="w-6 h-6" />
              </button>

              {/* Logo - Clickable to toggle sidebar collapse */}
              <div
                onClick={toggleCollapse}
                className="flex items-center cursor-pointer ml-1 sm:ml-2"
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-2"
                />
                {!isMobile && (
                  <span className="self-center text-lg sm:text-xl font-semibold whitespace-nowrap text-emerald-900">
                    Lilies
                  </span>
                )}
              </div>
            </div>

            {/* Right Side Components */}
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-10">
              {/* Search Bar - Responsive */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  className="p-2 pl-8 sm:p-2.5 sm:pl-10 text-xs sm:text-sm text-emerald-900 backdrop-blur-sm bg-white/50 border border-white/40 rounded-lg w-36 sm:w-60 md:w-80 lg:w-96 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                  placeholder="Search for meals, restaurants..."
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                  <BiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
                </div>
              </div>

              {/* Mobile Search Icon */}
              <button className="sm:hidden p-2 rounded-full backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 transition-all duration-300">
                <BiSearch className="w-5 h-5 text-emerald-800" />
              </button>

              {/* Notification Bell */}
              <div className="p-1.5 sm:p-2 rounded-full backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 transition-all duration-300 cursor-pointer">
                <BiBell className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
              </div>

              {/* User Avatar */}
              <div className="relative">
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:ring-2 focus:ring-emerald-300/50 p-0.5 sm:p-1 bg-white/30 backdrop-blur-sm border border-white/30"
                >
                  {user?.photoURL ? (
                    <img
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-sm sm:text-lg font-semibold flex items-center justify-center shadow-inner">
                      {getInitials(user?.displayName || "User Name")}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Desktop */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen pt-16 sm:pt-20 transition-all duration-300 ${
          isCollapsed ? "w-16 sm:w-20" : "w-64"
        } ${
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } backdrop-blur-md bg-white/40 border-r border-white/30 shadow-lg`}
        aria-label="Sidebar"
      >
        <div className="h-full px-2 sm:px-3 pb-4 overflow-y-auto flex flex-col pt-6 sm:pt-8">
          <div className="absolute top-32 right-12 w-32 h-32 bg-teal-400/20 rounded-full blur-xl -z-10"></div>
          <div className="absolute bottom-40 left-5 w-40 h-40 bg-emerald-300/20 rounded-full blur-xl -z-10"></div>

          <ul className="space-y-2 sm:space-y-3 flex-1 relative z-10">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center p-2 sm:p-3 text-emerald-800 rounded-lg transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white backdrop-blur-sm shadow-md"
                        : "hover:bg-white/50 backdrop-blur-sm"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                      />
                      {!isCollapsed && (
                        <span className="ms-3 font-medium whitespace-nowrap overflow-hidden">
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-2 sm:space-y-3 border-t border-white/30 pt-3 sm:pt-4 relative z-10">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => `
                flex items-center p-2 sm:p-3 text-emerald-800 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white backdrop-blur-sm shadow-md"
                    : "hover:bg-white/50 backdrop-blur-sm"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              {({ isActive }) => (
                <>
                  <AiOutlineUser
                    className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                  />
                  {!isCollapsed && (
                    <span className="ms-3 font-medium">Profile</span>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => `
                flex items-center p-2 sm:p-3 text-emerald-800 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white backdrop-blur-sm shadow-md"
                    : "hover:bg-white/50 backdrop-blur-sm"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              {({ isActive }) => (
                <>
                  <AiOutlineSetting
                    className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                  />
                  {!isCollapsed && (
                    <span className="ms-3 font-medium">Settings</span>
                  )}
                </>
              )}
            </NavLink>

            <button
              onClick={handleLogout}
              className={`flex items-center p-2 sm:p-3 text-red-600 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all duration-300 ${
                isCollapsed ? "justify-center w-full" : "w-full"
              }`}
            >
              <AiOutlineLogout className="w-5 h-5" />
              {!isCollapsed && <span className="ms-3 font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
