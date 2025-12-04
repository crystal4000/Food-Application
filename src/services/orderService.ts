import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  FirestoreError,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { Order } from "../types/checkout.types";
import { CartItem } from "../types/cart.types";
import { toast } from "sonner";

const ordersRef = collection(db, "orders");

/**
 * Generate unique order number
 */
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
};

/**
 * Create new order
 */
export const createOrder = async (
  userId: string,
  cartItems: CartItem[],
  orderData: {
    deliveryAddress: Order["deliveryAddress"];
    billingAddress?: Order["billingAddress"];
    paymentMethod: Order["paymentMethod"];
    paymentCard?: Order["paymentCard"];
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    specialInstructions?: string;
  }
): Promise<Order> => {
  try {
    if (!userId) {
      toast.error("You must be logged in to place an order");
      throw new Error("User not authenticated");
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      throw new Error("Cart is empty");
    }

    const orderId = doc(ordersRef).id;
    const orderNumber = generateOrderNumber();

    // Calculate estimated delivery (2-3 days from now)
    const estimatedDays = Math.floor(Math.random() * 2) + 2;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
    const estimatedDelivery = estimatedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const newOrder: Omit<Order, "createdAt"> & {
      createdAt: ReturnType<typeof serverTimestamp>;
    } = {
      id: orderId,
      userId,
      orderNumber,
      items: cartItems.map((item) => ({
        itemId: item.mealId || item.drinkId || "",
        itemName: item.mealName,
        itemImageUrl: item.mealImageUrl,
        price: item.price,
        quantity: item.quantity,
        type: item.itemType,
      })),
      deliveryAddress: orderData.deliveryAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentCard: orderData.paymentCard,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      status: "pending",
      ...(orderData.specialInstructions && {
        specialInstructions: orderData.specialInstructions,
      }),
      estimatedDelivery,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(ordersRef, orderId), newOrder);
    toast.success("Order placed successfully!");

    return {
      ...newOrder,
      createdAt: {
        seconds: Date.now() / 1000,
        nanoseconds: 0,
      },
    };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error creating order:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to place order");
    }
    throw error;
  }
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    if (!userId) {
      console.warn("Attempted to get orders for unauthenticated user");
      return [];
    }

    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Order, "createdAt"> & {
        createdAt: Timestamp;
      };
      orders.push({
        ...data,
        createdAt: {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds,
        },
      });
    });

    return orders;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error getting orders:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to load orders");
    }
    throw error;
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (
  userId: string,
  orderId: string
): Promise<Order | null> => {
  try {
    if (!userId) {
      console.warn("Attempted to get order for unauthenticated user");
      return null;
    }

    const q = query(
      ordersRef,
      where("userId", "==", userId),
      where("id", "==", orderId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const data = querySnapshot.docs[0].data() as Omit<Order, "createdAt"> & {
      createdAt: Timestamp;
    };

    return {
      ...data,
      createdAt: {
        seconds: data.createdAt.seconds,
        nanoseconds: data.createdAt.nanoseconds,
      },
    };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error getting order:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to load order");
    }
    throw error;
  }
};
