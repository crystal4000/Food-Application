// Cart item types
export interface CartItem {
  id: string; // Firestore document ID
  userId: string;
  mealId?: string; // For meals
  drinkId?: string; // For drinks
  itemType: "meal" | "drink"; // Type of item
  mealName: string; // Name (works for both meals and drinks)
  mealImageUrl: string; // Image URL (works for both meals and drinks)
  price: number;
  quantity: number;
  addedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

// Checkout data types
export interface DeliveryAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CheckoutData {
  deliveryAddress: DeliveryAddress;
  paymentMethod: "card" | "cash" | "mobile";
  specialInstructions?: string;
}

// Cart summary
export interface CartSummary {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}
