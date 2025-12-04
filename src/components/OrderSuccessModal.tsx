import { HiCheckCircle } from "react-icons/hi";
import { Order } from "../types/checkout.types";

interface OrderSuccessModalProps {
  isOpen: boolean;
  order: Order | null;
  onGoToDashboard: () => void;
  onGoToHome: () => void;
}

const OrderSuccessModal = ({
  isOpen,
  order,
  onGoToDashboard,
  onGoToHome,
}: OrderSuccessModalProps) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="backdrop-blur-md bg-white/95 border border-white/30 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 transform transition-all">
        <div className="text-center">
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
                <p className="font-bold text-emerald-900">
                  {order.orderNumber}
                </p>
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
                  {order.estimatedDelivery || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onGoToHome}
              className="flex-1 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-bold py-3 rounded-lg transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={onGoToDashboard}
              className="flex-1 bg-white/10 hover:bg-white/20 text-emerald-900 font-semibold py-3 rounded-lg transition-colors border border-emerald-900"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
