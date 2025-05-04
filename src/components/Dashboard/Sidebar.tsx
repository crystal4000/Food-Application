import { useState } from "react";
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
import { BiBell, BiSearch } from "react-icons/bi";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const user = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-white/30 shadow-sm">
        <div className="px-3 py-3 md:px-5 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center p-2 text-sm text-emerald-800 rounded-lg sm:hidden hover:bg-white/40 focus:outline-none focus:ring-0 transition-all duration-300"
              >
                <span className="sr-only">Open sidebar</span>
                <img src={logo} alt="Logo" className="w-12 h-12 mr-3" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-emerald-900">
                  Lilies
                </span>
              </button>

              <div className="hidden md:flex items-center justify-start ms-2 sm:ms-0">
                <img src={logo} alt="Logo" className="w-12 h-12 mr-3" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-emerald-900">
                  Lilies
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-10">
              <div className="relative">
                <input
                  type="text"
                  className="p-2.5 pl-10 text-sm text-emerald-900 backdrop-blur-sm bg-white/50 border border-white/40 rounded-lg w-80 sm:w-96 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                  placeholder="Search for meals, restaurants..."
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BiSearch className="w-5 h-5 text-emerald-800" />
                </div>
              </div>

              <div className="p-2 rounded-full backdrop-blur-sm bg-white/40 border border-white/30 hover:bg-white/60 transition-all duration-300 cursor-pointer">
                <BiBell className="w-5 h-5 text-emerald-800" />
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:ring-4 focus:ring-emerald-300/50 p-1 bg-white/30 backdrop-blur-sm border border-white/30"
                >
                  {user?.photoURL ? (
                    <img
                      className="w-10 h-10 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-lg font-semibold flex items-center justify-center shadow-inner">
                      {getInitials(user?.displayName || "User Name")}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } backdrop-blur-md bg-white/40 border-r border-white/30 shadow-lg sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col pt-8">
          <div className="absolute top-32 right-12 w-32 h-32 bg-teal-400/20 rounded-full blur-xl -z-10"></div>
          <div className="absolute bottom-40 left-5 w-40 h-40 bg-emerald-300/20 rounded-full blur-xl -z-10"></div>

          <ul className="space-y-3 flex-1 relative z-10">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center p-3 text-emerald-800 rounded-lg transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white backdrop-blur-sm shadow-md"
                        : "hover:bg-white/50 backdrop-blur-sm"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                      />
                      <span className="ms-3 font-medium">{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 border-t border-white/30 pt-4 relative z-10">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => `
                flex items-center p-3 text-emerald-800 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white backdrop-blur-sm shadow-md"
                    : "hover:bg-white/50 backdrop-blur-sm"
                }
              `}
            >
              <AiOutlineUser className={`w-5 h-5`} />
              <span className="ms-3 font-medium">Profile</span>
            </NavLink>

            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => `
                flex items-center p-3 text-emerald-800 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white backdrop-blur-sm shadow-md"
                    : "hover:bg-white/50 backdrop-blur-sm"
                }
              `}
            >
              <AiOutlineSetting className={`w-5 h-5`} />
              <span className="ms-3 font-medium">Settings</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-red-600 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
            >
              <AiOutlineLogout className="w-5 h-5" />
              <span className="ms-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
