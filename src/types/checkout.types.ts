// Address types
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

// Card types
export interface PaymentCard {
  id: string;
  userId: string;
  cardNumber: string; // Last 4 digits only for display
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: "visa" | "mastercard" | "amex" | "discover" | "other";
  isDefault: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

// Order types
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: {
    itemId: string;
    itemName: string;
    itemImageUrl: string;
    price: number;
    quantity: number;
    type: "meal" | "drink";
  }[];
  deliveryAddress: Address;
  billingAddress?: Address;
  paymentMethod: "card" | "cash" | "mobile";
  paymentCard?: {
    last4: string;
    cardType: string;
  };
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out-for-delivery"
    | "delivered"
    | "cancelled";
  specialInstructions?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  estimatedDelivery?: string;
}

// Form data types
export interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface CardFormData {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault: boolean;
}
