import React from "react";
import { Order } from "../../types/checkout.types";
import { HiClock, HiCheckCircle, HiTruck, HiXCircle } from "react-icons/hi";
import { MdRestaurant } from "react-icons/md";

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  // Format date
  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status config (icon, color, label)
  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: HiClock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-300",
          label: "Pending",
        };
      case "confirmed":
        return {
          icon: HiCheckCircle,
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-300",
          label: "Confirmed",
        };
      case "preparing":
        return {
          icon: MdRestaurant,
          bgColor: "bg-orange-100",
          textColor: "text-orange-700",
          borderColor: "border-orange-300",
          label: "Preparing",
        };
      case "out-for-delivery":
        return {
          icon: HiTruck,
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
          borderColor: "border-purple-300",
          label: "Out for Delivery",
        };
      case "delivered":
        return {
          icon: HiCheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-300",
          label: "Delivered",
        };
      case "cancelled":
        return {
          icon: HiXCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-300",
          label: "Cancelled",
        };
      default:
        return {
          icon: HiClock,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-300",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  // Calculate total items count
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Get first 3 item images for preview
  const previewImages = order.items.slice(0, 3);
  const remainingItems = order.items.length - 3;

  return (
    <div
      onClick={onClick}
      className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl p-4 sm:p-5 cursor-pointer hover:bg-white/40 hover:shadow-lg transition-all duration-300"
    >
      {/* Header: Order number and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
        <div>
          <p className="text-xs text-emerald-700">Order</p>
          <p className="font-bold text-emerald-900 text-sm sm:text-base">
            {order.orderNumber}
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} self-start sm:self-auto`}
        >
          <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs font-semibold">{statusConfig.label}</span>
        </div>
      </div>

      {/* Item previews */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-3">
          {previewImages.map((item, index) => (
            <img
              key={index}
              src={item.itemImageUrl}
              alt={item.itemName}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ))}
          {remainingItems > 0 && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-700">
                +{remainingItems}
              </span>
            </div>
          )}
        </div>
        <div className="ml-2">
          <p className="text-sm text-emerald-900 font-medium">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
          <p className="text-xs text-emerald-700 truncate max-w-[150px] sm:max-w-[200px]">
            {order.items.map((item) => item.itemName).join(", ")}
          </p>
        </div>
      </div>

      {/* Footer: Date, Total, and View Details */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-3 border-t border-white/30">
        <div className="flex items-center gap-4 sm:gap-4 justify-between">
          <div>
            <p className="text-xs text-emerald-700">Date</p>
            <p className="text-sm font-medium text-emerald-900">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-emerald-700">Total</p>
            <p className="text-sm font-bold text-custom-orange">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
        <button className="text-sm font-semibold text-emerald-700 hover:text-custom-orange transition-colors self-start sm:self-auto">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
