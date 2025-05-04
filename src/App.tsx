import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import Favorites from "./pages/Favorites";
import CategoryView from "./pages/CategoryView";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Dashboard routes with layout - all routes are automatically protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="category/:category" element={<CategoryView />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
