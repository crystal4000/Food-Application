import React from "react";
import { Order } from "../../types/checkout.types";
import {
  HiX,
  HiClock,
  HiCheckCircle,
  HiTruck,
  HiXCircle,
  HiLocationMarker,
  HiCreditCard,
} from "react-icons/hi";
import { MdRestaurant } from "react-icons/md";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import { formatPhoneForDisplay } from "../../utils/checkoutValidation";
import { getStateName } from "../../utils/usStates";
import { updateOrderStatus } from "../../services/orderService";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}) => {
  if (!isOpen || !order) return null;

  // Format date
  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get status config
  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: HiClock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          label: "Pending",
        };
      case "confirmed":
        return {
          icon: HiCheckCircle,
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          label: "Confirmed",
        };
      case "preparing":
        return {
          icon: MdRestaurant,
          bgColor: "bg-orange-100",
          textColor: "text-orange-700",
          label: "Preparing",
        };
      case "out-for-delivery":
        return {
          icon: HiTruck,
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
          label: "Out for Delivery",
        };
      case "delivered":
        return {
          icon: HiCheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          label: "Delivered",
        };
      case "cancelled":
        return {
          icon: HiXCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          label: "Cancelled",
        };
      default:
        return {
          icon: HiClock,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          label: status,
        };
    }
  };

  // Get card icon
  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case "visa":
        return <FaCcVisa className="text-xl" />;
      case "mastercard":
        return <FaCcMastercard className="text-xl" />;
      case "amex":
        return <FaCcAmex className="text-xl" />;
      case "discover":
        return <FaCcDiscover className="text-xl" />;
      default:
        return <HiCreditCard className="text-xl" />;
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  // Status timeline steps
  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: HiClock },
    { key: "confirmed", label: "Confirmed", icon: HiCheckCircle },
    { key: "preparing", label: "Preparing", icon: MdRestaurant },
    { key: "out-for-delivery", label: "On the Way", icon: HiTruck },
    { key: "delivered", label: "Delivered", icon: HiCheckCircle },
  ];

  const getStepStatus = (stepKey: string) => {
    const statusOrder = [
      "pending",
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (order.status === "cancelled") return "cancelled";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="backdrop-blur-md bg-white/95 border border-white/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-100 flex-shrink-0">
          <div>
            <p className="text-sm text-emerald-700">Order Details</p>
            <h2 className="text-xl font-bold text-emerald-900">
              {order.orderNumber}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-100 rounded-full transition-colors"
          >
            <HiX className="w-6 h-6 text-emerald-700" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Status Badge and Date */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-0">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              <StatusIcon className="w-5 h-5" />
              <span className="font-semibold">{statusConfig.label}</span>
            </div>
            <p className="text-sm text-emerald-700">
              {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Status Timeline */}
          {order.status !== "cancelled" && (
            <div className="bg-emerald-50/50 rounded-xl p-0 md:p-4">
              <div className="relative flex justify-between">
                {statusSteps.map((step) => {
                  const stepStatus = getStepStatus(step.key);
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center relative z-10"
                      style={{ flex: 1 }}
                    >
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 ${
                          stepStatus === "completed"
                            ? "bg-green-500 text-white"
                            : stepStatus === "current"
                            ? "bg-custom-orange text-emerald-900"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <StepIcon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>

                      {/* Label */}
                      <p
                        className={`hidden md:block text-xs text-center max-w-[80px] ${
                          stepStatus === "current"
                            ? "font-semibold text-emerald-900"
                            : "text-emerald-700"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}

                {/* Connecting Lines - Positioned absolutely behind icons */}
                <div className="absolute top-5 md:top-6 left-0 right-0 flex items-center px-[10%] md:px-[8%] -z-0">
                  {statusSteps.slice(0, -1).map((_, index) => {
                    const stepStatus = getStepStatus(statusSteps[index].key);
                    return (
                      <div
                        key={index}
                        className={`h-1 flex-1 ${
                          stepStatus === "completed"
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cancelled Message */}
          {order.status === "cancelled" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <HiXCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-semibold">
                This order has been cancelled
              </p>
            </div>
          )}

          {/* Estimated Delivery */}
          {order.estimatedDelivery &&
            order.status !== "delivered" &&
            order.status !== "cancelled" && (
              <div className="bg-emerald-50/50 rounded-xl p-4 text-center">
                <p className="text-sm text-emerald-700">Estimated Delivery</p>
                <p className="text-lg font-bold text-emerald-900">
                  {order.estimatedDelivery}
                </p>
              </div>
            )}

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-emerald-900 mb-3">
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/50 rounded-lg"
                >
                  <img
                    src={item.itemImageUrl}
                    alt={item.itemName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-emerald-900 truncate">
                      {item.itemName}
                    </p>
                    <p className="text-sm text-emerald-700">
                      {item.type === "meal" ? "🍽️ Meal" : "🍹 Drink"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-700">x{item.quantity}</p>
                    <p className="font-bold text-emerald-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <HiLocationMarker className="text-custom-orange" />
              Delivery Address
            </h3>
            <div className="p-4 bg-white/50 rounded-lg">
              <p className="font-medium text-emerald-900">
                {order.deliveryAddress.fullName}
              </p>
              <p className="text-sm text-emerald-700">
                {order.deliveryAddress.addressLine1}
                {order.deliveryAddress.addressLine2 &&
                  `, ${order.deliveryAddress.addressLine2}`}
              </p>
              <p className="text-sm text-emerald-700">
                {order.deliveryAddress.city},{" "}
                {getStateName(order.deliveryAddress.state)}{" "}
                {order.deliveryAddress.zipCode}
              </p>
              <p className="text-sm text-emerald-700 mt-1">
                +1 {formatPhoneForDisplay(order.deliveryAddress.phoneNumber)}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <HiCreditCard className="text-custom-orange" />
              Payment Method
            </h3>
            <div className="p-4 bg-white/50 rounded-lg">
              {order.paymentMethod === "card" && order.paymentCard && (
                <div className="flex items-center gap-3">
                  {getCardIcon(order.paymentCard.cardType)}
                  <span className="text-emerald-900">
                    •••• •••• •••• {order.paymentCard.last4}
                  </span>
                </div>
              )}
              {order.paymentMethod === "cash" && (
                <p className="text-emerald-900">💵 Cash on Delivery</p>
              )}
              {order.paymentMethod === "mobile" && (
                <p className="text-emerald-900">📱 Mobile Payment</p>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div>
              <h3 className="font-semibold text-emerald-900 mb-3">
                Special Instructions
              </h3>
              <div className="p-4 bg-white/50 rounded-lg">
                <p className="text-emerald-700 italic">
                  "{order.specialInstructions}"
                </p>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-emerald-900 mb-3">
              Order Summary
            </h3>
            <div className="p-4 bg-white/50 rounded-lg space-y-2">
              <div className="flex justify-between text-emerald-700">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Tax (8%)</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-900 font-bold text-lg pt-2 border-t border-emerald-100">
                <span>Total</span>
                <span className="text-custom-orange">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-emerald-100 space-y-3 flex-shrink-0">
          {order.status === "pending" && (
            <button
              onClick={async () => {
                await updateOrderStatus(order.id, "cancelled");
                onOrderUpdated?.();
                onClose();
              }}
              className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors"
            >
              Cancel Order
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
