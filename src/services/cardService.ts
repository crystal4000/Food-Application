import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  Timestamp,
  FirestoreError,
  writeBatch,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { PaymentCard, CardFormData } from "../types/checkout.types";
import { toast } from "sonner";

const cardsRef = collection(db, "user_cards");

/**
 * Detect card type from card number
 */
const detectCardType = (
  cardNumber: string
): "visa" | "mastercard" | "amex" | "discover" | "other" => {
  const cleaned = cardNumber.replace(/\s/g, "");

  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^6(?:011|5)/.test(cleaned)) return "discover";

  return "other";
};

/**
 * Get all cards for a user
 */
export const getUserCards = async (userId: string): Promise<PaymentCard[]> => {
  try {
    if (!userId) {
      console.warn("Attempted to get cards for unauthenticated user");
      return [];
    }

    const q = query(cardsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const cards: PaymentCard[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<PaymentCard, "createdAt"> & {
        createdAt: Timestamp;
      };
      cards.push({
        ...data,
        createdAt: {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds,
        },
      });
    });

    return cards;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error getting cards:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to load cards");
    }
    throw error;
  }
};

/**
 * Add new card
 */
export const addCard = async (
  userId: string,
  cardData: CardFormData
): Promise<PaymentCard> => {
  try {
    if (!userId) {
      toast.error("You must be logged in to add a card");
      throw new Error("User not authenticated");
    }

    const cardId = doc(cardsRef).id;
    const cardType = detectCardType(cardData.cardNumber);
    const last4 = cardData.cardNumber.slice(-4);

    // If this is set as default, unset other defaults
    if (cardData.isDefault) {
      await unsetDefaultCards(userId);
    }

    const newCard = {
      id: cardId,
      userId,
      cardNumber: last4, // Store only last 4 digits
      cardHolderName: cardData.cardHolderName,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cardType,
      isDefault: cardData.isDefault,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(cardsRef, cardId), newCard);
    toast.success("Card added successfully");

    return {
      ...newCard,
      createdAt: {
        seconds: Date.now() / 1000,
        nanoseconds: 0,
      },
    };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error adding card:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to add card");
    }
    throw error;
  }
};

/**
 * Update existing card
 */
export const updateCard = async (
  userId: string,
  cardId: string,
  cardData: Partial<CardFormData>
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in");
      throw new Error("User not authenticated");
    }

    const updateData: Partial<{
      cardHolderName: string;
      expiryMonth: string;
      expiryYear: string;
      isDefault: boolean;
    }> = {};

    if (cardData.cardHolderName)
      updateData.cardHolderName = cardData.cardHolderName;
    if (cardData.expiryMonth) updateData.expiryMonth = cardData.expiryMonth;
    if (cardData.expiryYear) updateData.expiryYear = cardData.expiryYear;

    if (cardData.isDefault !== undefined) {
      updateData.isDefault = cardData.isDefault;

      // If this is set as default, unset other defaults
      if (cardData.isDefault) {
        await unsetDefaultCards(userId, cardId);
      }
    }

    await updateDoc(doc(cardsRef, cardId), updateData);
    toast.success("Card updated successfully");
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error updating card:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to update card");
    }
    throw error;
  }
};

/**
 * Delete card
 */
export const deleteCard = async (
  userId: string,
  cardId: string
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in");
      throw new Error("User not authenticated");
    }

    await deleteDoc(doc(cardsRef, cardId));
    toast.success("Card deleted successfully");
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error deleting card:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to delete card");
    }
    throw error;
  }
};

/**
 * Unset default flag on all other cards
 */
const unsetDefaultCards = async (
  userId: string,
  excludeId?: string
): Promise<void> => {
  const cards = await getUserCards(userId);
  const batch = writeBatch(db);

  cards
    .filter((card) => card.isDefault && card.id !== excludeId)
    .forEach((card) => {
      batch.update(doc(cardsRef, card.id), { isDefault: false });
    });

  await batch.commit();
};
