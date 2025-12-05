import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUserOrders } from "../services/orderService";
import { Order } from "../types/checkout.types";
import { OrderCard, OrderDetailModal} from "../components/Orders";
import BackButton from "../components/Dashboard/BackButton";
import { BsBoxSeam } from "react-icons/bs";
import { HiShoppingCart } from "react-icons/hi";

// Filter tab type
type StatusFilter = "all" | "pending" | "preparing" | "out-for-delivery" | "delivered" | "cancelled";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load orders
  useEffect(() => {
    if (user?.uid) {
      loadOrders();
    }
  }, [user?.uid]);

  const loadOrders = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tabs configuration
  const filterTabs: { key: StatusFilter; label: string; count?: number }[] = [
    { key: "all", label: "All Orders" },
    { key: "pending", label: "Pending" },
    { key: "preparing", label: "Preparing" },
    { key: "out-for-delivery", label: "On the Way" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Get filtered orders
  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  // Get count for each status
  const getStatusCount = (status: StatusFilter) => {
    if (status === "all") return orders.length;
    return orders.filter((order) => order.status === status).length;
  };

  // Handle order click
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-950">
          My Orders
        </h1>
      </div>

      {/* Main Content */}
      <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-4 right-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-teal-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-emerald-300/10 rounded-full blur-xl"></div>

        <div className="relative z-10">
          {/* Filter Tabs */}
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {filterTabs.map((tab) => {
                const count = getStatusCount(tab.key);
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-custom-orange text-emerald-900"
                        : "bg-white/30 text-emerald-800 hover:bg-white/50"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          isActive
                            ? "bg-emerald-900/20 text-emerald-900"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-orange"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && orders.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <BsBoxSeam className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                No orders yet
              </h3>
              <p className="text-emerald-700 mb-6">
                Looks like you haven't placed any orders yet.
                <br />
                Start exploring our delicious menu!
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-bold rounded-lg transition-colors"
              >
                <HiShoppingCart className="w-5 h-5" />
                Browse Menu
              </button>
            </div>
          )}

          {/* No Results for Filter */}
          {!loading && orders.length > 0 && filteredOrders.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <BsBoxSeam className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                No {activeFilter} orders
              </h3>
              <p className="text-emerald-700 mb-6">
                You don't have any orders with this status.
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="text-custom-orange hover:text-amber-600 font-semibold transition-colors"
              >
                View all orders
              </button>
            </div>
          )}

          {/* Orders List */}
          {!loading && filteredOrders.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => handleOrderClick(order)}
                />
              ))}
            </div>
          )}

          {/* Orders Count */}
          {!loading && filteredOrders.length > 0 && (
            <p className="text-center text-sm text-emerald-700 mt-6">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onOrderUpdated={loadOrders}
      />
    </>
  );
};

export default Orders;