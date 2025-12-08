import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { fetchUserCart, clearCart } from "../store/cartSlice";
import { getUserAddresses, addAddress } from "../services/addressService";
import { getUserCards, addCard } from "../services/cardService";
import { createOrder } from "../services/orderService";
import {
  Address,
  PaymentCard,
  AddressFormData,
  CardFormData,
} from "../types/checkout.types";
import {
  addressSchema,
  cardSchema,
  formatPhoneForDisplay,
} from "../utils/checkoutValidation";
import { getStateName } from "../utils/usStates";
import {
  HiChevronLeft,
  HiChevronRight,
  HiLocationMarker,
  HiCreditCard,
  HiCheckCircle,
} from "react-icons/hi";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import BackButton from "../components/Dashboard/BackButton";
import OrderSuccessModal from "../components/OrderSuccessModal";
import { PhoneInput, StateSelect, FullNameInput } from "../components/Checkout";
import { toast } from "sonner";
import { Order } from "../types/checkout.types";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const { items: cartItems } = useAppSelector((state) => state.cart);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Data states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "cash" | "mobile"
  >("card");
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // UI states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Forms
  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      isDefault: false,
    },
  });

  const cardForm = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      isDefault: false,
    },
  });

  const billingForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      isDefault: false,
    },
  });

  const loadAddresses = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userAddresses = await getUserAddresses(user.uid);
      setAddresses(userAddresses);
      // Auto-select default or first address
      const defaultAddr =
        userAddresses.find((a) => a.isDefault) || userAddresses[0];
      if (defaultAddr) setSelectedAddress(defaultAddr);
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  }, [user?.uid]);

  const loadCards = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userCards = await getUserCards(user.uid);
      setCards(userCards);
      // Auto-select default or first card
      const defaultCard = userCards.find((c) => c.isDefault) || userCards[0];
      if (defaultCard) setSelectedCard(defaultCard);
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  }, [user?.uid]);

  // Load data
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserCart(user.uid));
      loadAddresses();
      loadCards();
    }
  }, [user?.uid, dispatch, loadAddresses, loadCards]);

  // Redirect if cart is empty (but not if we just placed an order)
  useEffect(() => {
    if (
      cartItems.length === 0 &&
      !showSuccessModal &&
      !isProcessing &&
      !orderPlaced
    ) {
      toast.error("Your cart is empty");
      navigate("/dashboard/cart");
    }
  }, [cartItems, navigate, showSuccessModal, isProcessing, orderPlaced]);

  useEffect(() => {
    if (user && !user.emailVerified) {
      toast.error("Please verify your email before placing an order");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const deliveryFee = 4.99;
  const total = subtotal + tax + deliveryFee;

  // Handle address form submission
  const onAddressSubmit = async (data: AddressFormData) => {
    if (!user?.uid) return;
    try {
      const newAddress = await addAddress(user.uid, data);
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddress(newAddress);
      setShowAddressForm(false);
      addressForm.reset();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  // Handle card form submission
  const onCardSubmit = async (data: CardFormData) => {
    if (!user?.uid) return;
    try {
      const newCard = await addCard(user.uid, data);
      setCards((prev) => [...prev, newCard]);
      setSelectedCard(newCard);
      setShowCardForm(false);
      cardForm.reset();
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  // Handle billing address form submission
  const onBillingSubmit = async (data: AddressFormData) => {
    if (!user?.uid) return;
    try {
      const newBillingAddress = await addAddress(user.uid, data);
      setBillingAddress(newBillingAddress);
      setShowBillingForm(false);
      billingForm.reset();
    } catch (error) {
      console.error("Error adding billing address:", error);
    }
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep === 1 && !selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (currentStep === 2 && paymentMethod === "card" && !selectedCard) {
      toast.error("Please select or add a payment card");
      return;
    }
    if (
      currentStep === 2 &&
      paymentMethod === "card" &&
      !billingSameAsDelivery &&
      !billingAddress
    ) {
      toast.error("Please enter billing address");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!user?.uid || !selectedAddress) return;

    if (paymentMethod === "card" && !selectedCard) {
      toast.error("Please select a payment card");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        deliveryAddress: selectedAddress,
        billingAddress: billingSameAsDelivery
          ? selectedAddress
          : billingAddress || selectedAddress,
        paymentMethod,
        paymentCard:
          paymentMethod === "card" && selectedCard
            ? {
                last4: selectedCard.cardNumber,
                cardType: selectedCard.cardType,
              }
            : undefined,
        subtotal,
        tax,
        deliveryFee,
        total,
        specialInstructions: specialInstructions.trim() || undefined,
      };

      const order = await createOrder(user.uid, cartItems, orderData);

      // Clear cart after successful order
      await dispatch(clearCart(user.uid));

      // Show success modal and mark order as placed
      setPlacedOrder(order);
      setOrderPlaced(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case "visa":
        return <FaCcVisa className="text-2xl" />;
      case "mastercard":
        return <FaCcMastercard className="text-2xl" />;
      case "amex":
        return <FaCcAmex className="text-2xl" />;
      case "discover":
        return <FaCcDiscover className="text-2xl" />;
      default:
        return <HiCreditCard className="text-2xl" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <BackButton />

      {/* Header */}
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-4">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step
                    ? "bg-custom-orange text-emerald-900"
                    : "bg-white/20 text-emerald-900"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? "bg-custom-orange" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Delivery Address */}
          {currentStep === 1 && (
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <HiLocationMarker className="text-custom-orange" />
                Delivery Address
              </h2>

              {/* Address List */}
              <div className="space-y-3 mb-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddress(address)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAddress?.id === address.id
                        ? "border-custom-orange bg-custom-orange/10"
                        : "border-white/30 hover:border-white/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-emerald-900">
                          {address.fullName}
                        </p>
                        <p className="text-sm text-emerald-700">
                          +1 {formatPhoneForDisplay(address.phoneNumber)}
                        </p>
                        <p className="text-sm text-emerald-700 mt-1">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm text-emerald-700">
                          {address.city}, {getStateName(address.state)}{" "}
                          {address.zipCode}
                        </p>
                      </div>
                      {address.isDefault && (
                        <span className="text-xs bg-custom-orange text-emerald-900 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Address Button */}
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-3 border-2 border-dashed border-emerald-900/30 rounded-lg text-emerald-900 hover:border-custom-orange hover:text-custom-orange transition-colors"
                >
                  + Add New Address
                </button>
              )}

              {/* Address Form */}
              {showAddressForm && (
                <form
                  onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                  className="space-y-4 mt-4 p-4 bg-white/10 rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FullNameInput
                      register={addressForm.register}
                      errors={addressForm.formState.errors}
                    />
                    <PhoneInput
                      register={addressForm.register}
                      setValue={addressForm.setValue}
                      errors={addressForm.formState.errors}
                    />
                  </div>

                  <div>
                    <input
                      {...addressForm.register("addressLine1")}
                      placeholder="Address Line 1"
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                    />
                    {addressForm.formState.errors.addressLine1 && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressForm.formState.errors.addressLine1.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...addressForm.register("addressLine2")}
                      placeholder="Address Line 2 (Optional)"
                      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <input
                        {...addressForm.register("city")}
                        placeholder="City"
                        className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                      />
                      {addressForm.formState.errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {addressForm.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                    <StateSelect
                      register={addressForm.register}
                      errors={addressForm.formState.errors}
                    />
                    <div>
                      <input
                        {...addressForm.register("zipCode")}
                        placeholder="ZIP Code"
                        className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                      />
                      {addressForm.formState.errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {addressForm.formState.errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...addressForm.register("isDefault")}
                      className="w-4 h-4"
                    />
                    <label className="text-emerald-900 text-sm">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-semibold py-2 rounded-lg transition-colors"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        addressForm.reset();
                      }}
                      className="px-4 bg-white/10 hover:bg-white/20 text-emerald-900 font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <HiCreditCard className="text-custom-orange" />
                Payment Method
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "card"
                        ? "border-custom-orange bg-custom-orange/10"
                        : "border-white/30 hover:border-white/50"
                    }`}
                  >
                    <HiCreditCard className="text-2xl mx-auto mb-2 text-emerald-900" />
                    <p className="text-sm font-semibold text-emerald-900">
                      Card
                    </p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "cash"
                        ? "border-custom-orange bg-custom-orange/10"
                        : "border-white/30 hover:border-white/50"
                    }`}
                  >
                    <span className="text-2xl block mb-2">💵</span>
                    <p className="text-sm font-semibold text-emerald-900">
                      Cash
                    </p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("mobile")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === "mobile"
                        ? "border-custom-orange bg-custom-orange/10"
                        : "border-white/30 hover:border-white/50"
                    }`}
                  >
                    <span className="text-2xl block mb-2">📱</span>
                    <p className="text-sm font-semibold text-emerald-900">
                      Mobile
                    </p>
                  </button>
                </div>
              </div>

              {/* Card Selection (only shown if card payment) */}
              {paymentMethod === "card" && (
                <>
                  <div className="space-y-3 mb-4">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCard?.id === card.id
                            ? "border-custom-orange bg-custom-orange/10"
                            : "border-white/30 hover:border-white/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getCardIcon(card.cardType)}
                          <div>
                            <p className="font-semibold text-emerald-900">
                              •••• •••• •••• {card.cardNumber}
                            </p>
                            <p className="text-sm text-emerald-700">
                              {card.cardHolderName} | Expires {card.expiryMonth}
                              /{card.expiryYear}
                            </p>
                          </div>
                          {card.isDefault && (
                            <span className="ml-auto text-xs bg-custom-orange text-emerald-900 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Card Button */}
                  {!showCardForm && (
                    <button
                      onClick={() => setShowCardForm(true)}
                      className="w-full py-3 border-2 border-dashed border-emerald-900/30 rounded-lg text-emerald-900 hover:border-custom-orange hover:text-custom-orange transition-colors mb-4"
                    >
                      + Add New Card
                    </button>
                  )}

                  {/* Card Form */}
                  {showCardForm && (
                    <form
                      onSubmit={cardForm.handleSubmit(onCardSubmit)}
                      className="space-y-4 mb-4 p-4 bg-white/10 rounded-lg"
                    >
                      <div>
                        <input
                          {...cardForm.register("cardNumber")}
                          placeholder="Card Number"
                          maxLength={19}
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                        />
                        {cardForm.formState.errors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {cardForm.formState.errors.cardNumber.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          {...cardForm.register("cardHolderName")}
                          placeholder="Cardholder Name"
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                        />
                        {cardForm.formState.errors.cardHolderName && (
                          <p className="text-red-500 text-sm mt-1">
                            {cardForm.formState.errors.cardHolderName.message}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <input
                            {...cardForm.register("expiryMonth")}
                            placeholder="MM"
                            maxLength={2}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                          />
                          {cardForm.formState.errors.expiryMonth && (
                            <p className="text-red-500 text-sm mt-1">
                              {cardForm.formState.errors.expiryMonth.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            {...cardForm.register("expiryYear")}
                            placeholder="YY"
                            maxLength={2}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                          />
                          {cardForm.formState.errors.expiryYear && (
                            <p className="text-red-500 text-sm mt-1">
                              {cardForm.formState.errors.expiryYear.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            {...cardForm.register("cvv")}
                            placeholder="CVV"
                            maxLength={4}
                            type="password"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                          />
                          {cardForm.formState.errors.cvv && (
                            <p className="text-red-500 text-sm mt-1">
                              {cardForm.formState.errors.cvv.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...cardForm.register("isDefault")}
                          className="w-4 h-4"
                        />
                        <label className="text-emerald-900 text-sm">
                          Set as default card
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-semibold py-2 rounded-lg transition-colors"
                        >
                          Save Card
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCardForm(false);
                            cardForm.reset();
                          }}
                          className="px-4 bg-white/10 hover:bg-white/20 text-emerald-900 font-semibold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Billing Address */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={billingSameAsDelivery}
                        onChange={(e) =>
                          setBillingSameAsDelivery(e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <label className="text-emerald-900 text-sm">
                        Billing address same as delivery address
                      </label>
                    </div>

                    {!billingSameAsDelivery && (
                      <>
                        {!showBillingForm && (
                          <button
                            onClick={() => setShowBillingForm(true)}
                            className="w-full py-3 border-2 border-dashed border-emerald-900/30 rounded-lg text-emerald-900 hover:border-custom-orange hover:text-custom-orange transition-colors mb-4"
                          >
                            + Add Billing Address
                          </button>
                        )}

                        {showBillingForm && (
                          <form
                            onSubmit={billingForm.handleSubmit(onBillingSubmit)}
                            className="space-y-4 p-4 bg-white/10 rounded-lg"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <FullNameInput
                                register={billingForm.register}
                                errors={billingForm.formState.errors}
                              />
                              <PhoneInput
                                register={billingForm.register}
                                setValue={billingForm.setValue}
                                errors={billingForm.formState.errors}
                              />
                            </div>

                            <div>
                              <input
                                {...billingForm.register("addressLine1")}
                                placeholder="Address Line 1"
                                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                              />
                              {billingForm.formState.errors.addressLine1 && (
                                <p className="text-red-500 text-sm mt-1">
                                  {
                                    billingForm.formState.errors.addressLine1
                                      .message
                                  }
                                </p>
                              )}
                            </div>

                            <div>
                              <input
                                {...billingForm.register("addressLine2")}
                                placeholder="Address Line 2 (Optional)"
                                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <input
                                  {...billingForm.register("city")}
                                  placeholder="City"
                                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                                />
                                {billingForm.formState.errors.city && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {billingForm.formState.errors.city.message}
                                  </p>
                                )}
                              </div>
                              <StateSelect
                                register={billingForm.register}
                                errors={billingForm.formState.errors}
                              />
                              <div>
                                <input
                                  {...billingForm.register("zipCode")}
                                  placeholder="ZIP Code"
                                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700/50"
                                />
                                {billingForm.formState.errors.zipCode && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {
                                      billingForm.formState.errors.zipCode
                                        .message
                                    }
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="flex-1 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-semibold py-2 rounded-lg transition-colors"
                              >
                                Save Address
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowBillingForm(false);
                                  billingForm.reset();
                                }}
                                className="px-4 bg-white/10 hover:bg-white/20 text-emerald-900 font-semibold rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Review Order */}
          {currentStep === 3 && (
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <HiCheckCircle className="text-custom-orange" />
                Review Your Order
              </h2>

              {/* Delivery Address Review */}
              <div className="mb-6">
                <h3 className="font-semibold text-emerald-900 mb-2">
                  Delivery Address
                </h3>
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="font-semibold text-emerald-900">
                    {selectedAddress?.fullName}
                  </p>
                  <p className="text-sm text-emerald-700">
                    {selectedAddress?.addressLine1}
                    {selectedAddress?.addressLine2 &&
                      `, ${selectedAddress.addressLine2}`}
                  </p>
                  <p className="text-sm text-emerald-700">
                    {selectedAddress?.city},{" "}
                    {getStateName(selectedAddress?.state || "")}{" "}
                    {selectedAddress?.zipCode}
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">
                    +1{" "}
                    {formatPhoneForDisplay(selectedAddress?.phoneNumber || "")}
                  </p>
                </div>
              </div>

              {/* Payment Method Review */}
              <div className="mb-6">
                <h3 className="font-semibold text-emerald-900 mb-2">
                  Payment Method
                </h3>
                <div className="p-4 bg-white/10 rounded-lg">
                  {paymentMethod === "card" && selectedCard && (
                    <div className="flex items-center gap-3">
                      {getCardIcon(selectedCard.cardType)}
                      <div>
                        <p className="font-semibold text-emerald-900">
                          •••• •••• •••• {selectedCard.cardNumber}
                        </p>
                        <p className="text-sm text-emerald-700">
                          {selectedCard.cardHolderName}
                        </p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === "cash" && (
                    <p className="text-emerald-900">💵 Cash on Delivery</p>
                  )}
                  {paymentMethod === "mobile" && (
                    <p className="text-emerald-900">📱 Mobile Payment</p>
                  )}
                </div>
              </div>

              {/* Billing Address (if different) */}
              {!billingSameAsDelivery && billingAddress && (
                <div className="mb-6">
                  <h3 className="font-semibold text-emerald-900 mb-2">
                    Billing Address
                  </h3>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <p className="font-semibold text-emerald-900">
                      {billingAddress.fullName}
                    </p>
                    <p className="text-sm text-emerald-700">
                      {billingAddress.addressLine1}
                      {billingAddress.addressLine2 &&
                        `, ${billingAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-emerald-700">
                      {billingAddress.city},{" "}
                      {getStateName(billingAddress.state)}{" "}
                      {billingAddress.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <h3 className="font-semibold text-emerald-900 mb-2">
                  Special Instructions (Optional)
                </h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Add delivery notes, allergies, etc."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-emerald-900 placeholder-emerald-700"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            {currentStep > 1 && (
              <button
                onClick={goToPrevStep}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-emerald-900 font-semibold rounded-lg transition-colors"
              >
                <HiChevronLeft />
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={goToNextStep}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-bold rounded-lg transition-colors"
              >
                Continue
                <HiChevronRight />
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.mealImageUrl}
                    alt={item.mealName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-900 truncate">
                      {item.mealName}
                    </p>
                    <p className="text-xs text-emerald-700">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                    <p className="text-sm font-bold text-custom-orange">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-white/30 pt-4 space-y-2">
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
              <div className="border-t border-white/30 pt-2 mt-2">
                <div className="flex justify-between text-emerald-900 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-custom-orange">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        order={placedOrder}
        onGoToDashboard={() => {
          setShowSuccessModal(false);
          navigate("/dashboard");
        }}
        onGoToHome={() => {
          setShowSuccessModal(false);
          navigate("/");
        }}
      />
    </div>
  );
};

export default Checkout;
