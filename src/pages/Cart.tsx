import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchUserCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../store/cartSlice";
import { CartItem } from "../types/cart.types";
import { HiMinus, HiPlus, HiTrash, HiShoppingCart } from "react-icons/hi";
import { RiShoppingCart2Line } from "react-icons/ri";
import BackButton from "../components/Dashboard/BackButton";
import ConfirmModal from "../components/ConfirmModal";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const { items: cartItems, loading } = useAppSelector((state) => state.cart);

  const [processingItems, setProcessingItems] = useState<Set<string>>(
    new Set()
  );
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserCart(user.uid));
    }
  }, [user, dispatch]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = cartItems.length > 0 ? 4.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleQuantityChange = async (
    cartItemId: string,
    currentQuantity: number,
    change: number
  ) => {
    if (!user?.uid) return;

    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    setProcessingItems((prev) => new Set(prev).add(cartItemId));

    try {
      await dispatch(
        updateQuantity({
          userId: user.uid,
          cartItemId,
          quantity: newQuantity,
        })
      );
    } finally {
      setProcessingItems((prev) => {
        const updated = new Set(prev);
        updated.delete(cartItemId);
        return updated;
      });
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    if (!user?.uid) return;

    setProcessingItems((prev) => new Set(prev).add(cartItemId));

    try {
      await dispatch(removeFromCart({ userId: user.uid, cartItemId }));
    } finally {
      setProcessingItems((prev) => {
        const updated = new Set(prev);
        updated.delete(cartItemId);
        return updated;
      });
    }
  };

  const handleClearCart = () => {
    setShowClearCartModal(true);
  };

  const handleConfirmClearCart = async () => {
    if (!user?.uid) return;
    setShowClearCartModal(false);
    await dispatch(clearCart(user.uid));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/dashboard/checkout");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-custom-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <BackButton />

      {/* Header */}
      <div className="mt-6 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 flex items-center gap-3">
          <HiShoppingCart className="text-custom-orange" />
          Shopping Cart
        </h1>
        <p className="text-emerald-700 mt-5 ms-1">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your
          cart
        </p>
      </div>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-8 sm:p-12 text-center">
          <RiShoppingCart2Line className="w-24 h-24 text-emerald-900/80 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-emerald-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-emerald-900 mb-8">
            Start adding some delicious meals and drinks to your cart!
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-custom-orange hover:bg-amber-500 text-emerald-900 font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
          >
            Browse Meals and Drinks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={handleClearCart}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Items List */}
            {cartItems.map((item: CartItem) => {
              const isProcessing = processingItems.has(item.id);

              return (
                <div
                  key={item.id}
                  className={`backdrop-blur-md bg-white/20 border border-white/30 rounded-xl shadow-lg p-4 transition-opacity ${
                    isProcessing ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <img
                      src={item.mealImageUrl}
                      alt={item.mealName}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-emerald-900 mb-2 truncate">
                        {item.mealName}
                      </h3>
                      <p className="text-custom-orange font-bold text-xl mb-3">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity, -1)
                            }
                            disabled={isProcessing || item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-emerald-900 hover:bg-custom-orange/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <HiMinus />
                          </button>
                          <span className="w-8 text-center text-emerald-900 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity, 1)
                            }
                            disabled={isProcessing}
                            className="w-8 h-8 flex items-center justify-center text-emerald-900 hover:bg-custom-orange/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <HiPlus />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isProcessing}
                          className="ml-auto text-red-400 hover:text-red-300 p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove from cart"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-emerald-900/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-900/80">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-900/80">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/30 pt-3 mt-3">
                  <div className="flex justify-between text-custom-orange font-bold text-lg">
                    <span>Total</span>
                    <span className="text-emerald-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-custom-orange hover:bg-amber-500 text-emerald-900 font-bold py-3 rounded-lg transition-colors duration-300"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full mt-3 bg-none outline-border-emerald-900 border border-emerald-900 hover:bg-emerald-900/10 text-emerald-900 font-semibold py-3 rounded-lg transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
        onConfirm={handleConfirmClearCart}
        title="Are you Sure?"
        message="Are you sure you want to clear your cart?"
        message_contd="This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        confirmButtonColor="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
};

export default Cart;
