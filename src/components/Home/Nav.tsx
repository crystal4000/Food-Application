import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import logo from "../../assets/landing_page/logo.svg";
import { HiMenu } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "sonner";

const Nav = () => {
  const [showLinks, setShowLinks] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
    <nav className="w-full h-auto sm:h-20 px-6 sm:px-12 py-4 sm:py-0 flex flex-col sm:flex-row justify-between items-center">
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
            className="sm:hidden border-0 h-8 w-8 bg-transparent rounded-lg text-[#e2b885] cursor-pointer transition-all duration-400 hover:bg-[#00302e] hover:rounded-lg hover:text-[#e2b885]"
          >
            {showLinks ? (
              <CgClose className="h-8 w-8 text-custom-orange" />
            ) : (
              <HiMenu className="h-8 w-8 text-custom-orange" />
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 group"
            >
              <div className="w-16 h-16 rounded-full bg-custom-orange text-color-bg text-xl font-semibold flex items-center justify-center">
                {getInitials(user.displayName || "User Name")}
              </div>
              <IoMdArrowDropdown
                className={`text-custom-orange text-xl transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
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
                      ? "block sm:inline-block bg-custom-orange hover:bg-color-bg text-color-bg hover:text-custom-orange px-5 py-2 sm:py-3 shadow-lg rounded-md w-full sm:w-auto"
                      : "block sm:inline-block text-custom-orange hover:text-custom-orange-hover w-full sm:w-auto"
                  }
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Nav;
