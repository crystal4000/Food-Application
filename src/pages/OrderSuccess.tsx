import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getOrderById } from "../services/orderService";
import { Order } from "../types/checkout.types";
import { HiCheckCircle } from "react-icons/hi";

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid && orderId) {
      loadOrder();
    }
  }, [user, orderId]);

  const loadOrder = async () => {
    if (!user?.uid || !orderId) return;
    try {
      const orderData = await getOrderById(user.uid, orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-custom-orange"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-emerald-900 text-xl">Order not found</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-custom-orange text-emerald-900 px-6 py-2 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-8 text-center">
        <HiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-emerald-700 mb-6">
          Your order has been confirmed and is being prepared.
        </p>

        <div className="bg-white/10 rounded-lg p-6 mb-6 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-emerald-700">Order Number</p>
              <p className="font-bold text-emerald-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Total Amount</p>
              <p className="font-bold text-custom-orange">
                ${order.total.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Status</p>
              <p className="font-semibold text-emerald-900 capitalize">
                {order.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Estimated Delivery</p>
              <p className="font-semibold text-emerald-900">
                {order.estimatedDelivery}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/dashboard/orders")}
            className="flex-1 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-bold py-3 rounded-lg transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-white/10 hover:bg-white/20 text-emerald-900 font-semibold py-3 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
