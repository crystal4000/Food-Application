import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { signOut } from "firebase/auth";
import logo from "../../assets/landing_page/logo.svg";
import { HiMenu } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "sonner";
import { getInitials } from "../../utils/functions";
import { useAuth } from "../../hooks/useAuth";

const Nav = () => {
  const [showLinks, setShowLinks] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out" + error);
    }
  };

  const links = user
    ? []
    : [
        {
          id: 1,
          href: "/",
          text: "Home",
        },
        {
          id: 2,
          href: "/login",
          text: "Login",
        },
        {
          id: 3,
          href: "/signup",
          text: "Signup",
        },
      ];

  return (
    <nav
      className="w-11/12 max-w-7xl mx-auto h-auto sm:h-20 px-6 sm:px-6 xl:px-0 py-4 sm:py-0 backdrop-blur-md bg-transparent mb-8 relative"
      style={{ zIndex: 9999 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="w-full sm:w-auto flex justify-between items-center">
          <a href="/" className="flex justify-center items-center">
            <img src={logo} alt="logo" className="w-8 sm:w-auto" />
            <p className="font-bold text-2xl sm:text-3xl lg:text-4xl text-white ml-2 sm:ml-5">
              Lilies
            </p>
          </a>

          {!user && (
            <button
              onClick={() => setShowLinks(!showLinks)}
              className="sm:hidden h-10 w-10 bg-transparent rounded-lg text-custom-orange cursor-pointer transition-all duration-300 hover:bg-white/10 flex items-center justify-center"
            >
              {showLinks ? (
                <CgClose className="h-6 w-6 text-custom-orange" />
              ) : (
                <HiMenu className="h-6 w-6 text-custom-orange" />
              )}
            </button>
          )}
        </div>

        <div
          className={`w-full sm:w-auto mt-4 sm:mt-0 ${
            showLinks ? "block" : "hidden sm:block"
          }`}
        >
          {user ? (
            <div
              className="relative"
              ref={dropdownRef}
              style={{ zIndex: 9999 }}
            >
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-custom-orange to-amber-500 text-emerald-900 text-lg font-semibold flex items-center justify-center shadow-md">
                  {getInitials(user.displayName || "User Name")}
                </div>
                <IoMdArrowDropdown
                  className={`text-custom-orange text-xl transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg backdrop-blur-md bg-emerald-900/80"
                  style={{ zIndex: 9999 }}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-all duration-200"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-red-300 hover:bg-white/10 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ul className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-14">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="text-lg sm:text-xl text-center font-medium cursor-pointer w-full sm:w-auto"
                >
                  <a
                    href={link.href}
                    className={
                      link.text === "Signup"
                        ? "block sm:inline-block bg-custom-orange hover:bg-amber-500 text-emerald-900 px-5 py-2 sm:py-3 shadow-lg rounded-md w-full sm:w-auto transition-all duration-300"
                        : "block sm:inline-block text-custom-orange hover:text-amber-400 w-full sm:w-auto transition-all duration-300"
                    }
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
