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
import { Address, AddressFormData } from "../types/checkout.types";
import { toast } from "sonner";

const addressesRef = collection(db, "user_addresses");

/**
 * Get all addresses for a user
 */
export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  try {
    if (!userId) {
      console.warn("Attempted to get addresses for unauthenticated user");
      return [];
    }

    const q = query(addressesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const addresses: Address[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Address, "createdAt"> & {
        createdAt: Timestamp;
      };
      addresses.push({
        ...data,
        createdAt: {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds,
        },
      });
    });

    return addresses;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error getting addresses:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied: Please check your Firebase rules");
    } else {
      toast.error("Failed to load addresses");
    }
    throw error;
  }
};

/**
 * Add new address
 */
export const addAddress = async (
  userId: string,
  addressData: AddressFormData
): Promise<Address> => {
  try {
    if (!userId) {
      toast.error("You must be logged in to add an address");
      throw new Error("User not authenticated");
    }

    const addressId = doc(addressesRef).id;

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await unsetDefaultAddresses(userId);
    }

    const newAddress = {
      id: addressId,
      userId,
      ...addressData,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(addressesRef, addressId), newAddress);
    toast.success("Address added successfully");

    return {
      ...newAddress,
      createdAt: {
        seconds: Date.now() / 1000,
        nanoseconds: 0,
      },
    };
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error adding address:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to add address");
    }
    throw error;
  }
};

/**
 * Update existing address
 */
export const updateAddress = async (
  userId: string,
  addressId: string,
  addressData: AddressFormData
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in");
      throw new Error("User not authenticated");
    }

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await unsetDefaultAddresses(userId, addressId);
    }

    await updateDoc(doc(addressesRef, addressId), { ...addressData });
    toast.success("Address updated successfully");
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error updating address:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to update address");
    }
    throw error;
  }
};

/**
 * Delete address
 */
export const deleteAddress = async (
  userId: string,
  addressId: string
): Promise<void> => {
  try {
    if (!userId) {
      toast.error("You must be logged in");
      throw new Error("User not authenticated");
    }

    await deleteDoc(doc(addressesRef, addressId));
    toast.success("Address deleted successfully");
  } catch (error) {
    const firestoreError = error as FirestoreError;
    console.error("Error deleting address:", error);

    if (firestoreError.code === "permission-denied") {
      toast.error("Permission denied");
    } else {
      toast.error("Failed to delete address");
    }
    throw error;
  }
};

/**
 * Unset default flag on all other addresses
 */
const unsetDefaultAddresses = async (
  userId: string,
  excludeId?: string
): Promise<void> => {
  const addresses = await getUserAddresses(userId);
  const batch = writeBatch(db);

  addresses
    .filter((addr) => addr.isDefault && addr.id !== excludeId)
    .forEach((addr) => {
      batch.update(doc(addressesRef, addr.id), { isDefault: false });
    });

  await batch.commit();
};
