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
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import { useAuth } from "./hooks/useAuth";
import Cart from "./pages/Cart";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-emerald-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-custom-orange"></div>
      </div>
    );
  }

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
          <Route path="cart" element={<Cart />} />
          <Route path="category/:category" element={<CategoryView />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
