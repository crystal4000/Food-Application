import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
import EmailVerificationPrompt from "../EmailVerificationPrompt";
import { useAuth } from "../../hooks/useAuth";

const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showVerificationPrompt, setShowVerificationPrompt] =
    useState<boolean>(false);
  const { user } = useAuth();
  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    enabled: true,
  });

  // Check if email is verified
  useEffect(() => {
    if (user && !user.emailVerified) {
      setShowVerificationPrompt(true);
    } else {
      setShowVerificationPrompt(false);
    }
  }, [user]);
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
        <Outlet />
      </main>
      {showVerificationPrompt && (
        <EmailVerificationPrompt
          onClose={() => setShowVerificationPrompt(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
