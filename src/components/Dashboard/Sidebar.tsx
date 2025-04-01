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
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 md:px-5 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-0"
              >
                <span className="sr-only">Open sidebar</span>
                <img src={logo} alt="Logo" className="w-12 h-12 mr-3" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-[#00302e]">
                  Lilies
                </span>
              </button>

              <div className="hidden md:flex items-center justify-start ms-2 sm:ms-0">
                <img src={logo} alt="Logo" className="w-12 h-12 mr-3" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-[#00302e]">
                  Lilies
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-10">
              <div className="relative">
                <input
                  type="text"
                  className="p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 sm:w-96 focus:ring-2 focus:ring-custom-orange focus:border-custom-orange"
                  placeholder="Search for meals, restaurants..."
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BiSearch className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <BiBell className="w-6 h-6 text-gray-500 hover:text-custom-orange cursor-pointer" />
              <div className="relative">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                >
                  {user?.photoURL ? (
                    <img
                      className="w-12 h-12 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-custom-orange text-color-bg text-lg font-semibold flex items-center justify-center">
                      {getInitials(user?.displayName || "User Name")}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col pt-8">
          {/* Menu Items */}
          <ul className="space-y-5 flex-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center p-3 text-gray-600 rounded-lg transition-colors duration-200
                    ${
                      isActive ? "bg-[#00302e] text-white" : "hover:bg-gray-100"
                    }
                  `}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="ms-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Profile Section */}
          <div className="mt-auto space-y-2 border-t border-gray-200">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => `
                flex items-center p-3 text-gray-600 rounded-lg transition-colors duration-200
                ${isActive ? "bg-[#00302e] text-white" : "hover:bg-gray-100"}
              `}
            >
              <AiOutlineUser className="w-6 h-6" />
              <span className="ms-3">Profile</span>
            </NavLink>

            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => `
                flex items-center p-3 text-gray-600 rounded-lg transition-colors duration-200
                ${isActive ? "bg-[#00302e] text-white" : "hover:bg-gray-100"}
              `}
            >
              <AiOutlineSetting className="w-6 h-6" />
              <span className="ms-3">Settings</span>
            </NavLink>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-red-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <AiOutlineLogout className="w-6 h-6" />
              <span className="ms-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
