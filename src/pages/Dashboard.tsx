import Sidebar from "../components/Dashboard/Sidebar";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const user = useAuth();
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 mt-[80px] ml-0 sm:ml-64 overflow-y-auto">
        <p className="text-sm text-color-bg">Welcome, {user?.displayName}</p>
        <h1 className="text-2xl font-semibold text-color-bg">
          Let's Order Your Food!
        </h1>
      </main>
    </div>
  );
};

export default Dashboard;
