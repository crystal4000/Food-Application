import Sidebar from "../components/Dashboard/Sidebar";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const user = useAuth();
  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-500/20 to-emerald-500/30">
      <Sidebar />
      <main className="flex-1 p-8 mt-[80px] ml-0 sm:ml-64 overflow-y-auto">
        {/* Glassmorphism container */}
        <div className="h-screen rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-lg p-8 relative overflow-hidden">
          {/* Decorative glass elements */}
          <div className="absolute top-12 right-12 w-32 h-32 bg-teal-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-24 left-20 w-40 h-40 bg-emerald-300/20 rounded-full blur-xl"></div>

          {/* Content with increased contrast for readability */}
          <div className="relative z-10">
            <p className="text-sm font-medium text-emerald-900">
              Welcome, {user?.displayName}
            </p>
            <h1 className="text-2xl font-semibold text-emerald-950 mt-2">
              Let's Order Your Food!
            </h1>

            {/* Additional glassmorphism card */}
            <div className="mt-8 p-6 rounded-xl backdrop-blur-sm bg-white/30 border border-white/40 shadow-md">
              <h2 className="text-lg font-medium text-emerald-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 rounded-lg backdrop-blur-sm bg-white/40 border border-white/40 hover:bg-white/50 transition duration-200 text-emerald-800 font-medium flex items-center justify-center">
                  View Menu
                </button>
                <button className="p-4 rounded-lg backdrop-blur-sm bg-emerald-500/40 border border-white/40 hover:bg-emerald-500/50 transition duration-200 text-white font-medium flex items-center justify-center">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
