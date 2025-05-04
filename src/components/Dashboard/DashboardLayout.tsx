import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

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
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
