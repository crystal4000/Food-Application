import { z } from "zod";
import { US_STATES } from "./usStates";

export const formatPhoneForStorage = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

export const formatPhoneForDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const validStateCodes = US_STATES.map((s) => s.code);

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  phoneNumber: z
    .string()
    .transform((val) => val.replace(/\D/g, "")) // Strip non-digits
    .refine((val) => val.length === 10, "Phone number must be 10 digits"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .min(2, "City is required")
    .regex(/^[a-zA-Z\s'-]+$/, "City can only contain letters"),
  state: z
    .string()
    .length(2, "Please select a state")
    .refine(
      (val) => validStateCodes.includes(val),
      "Please select a valid state"
    ),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  isDefault: z.boolean().optional().default(false),
});

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .refine(
      (val) => /^\d{13,19}$/.test(val),
      "Please enter a valid card number"
    ),
  cardHolderName: z
    .string()
    .min(3, "Cardholder name is required")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month (MM)"),
  expiryYear: z
    .string()
    .regex(/^\d{2}$/, "Invalid year (YY)")
    .refine((val) => {
      const year = parseInt(`20${val}`);
      const currentYear = new Date().getFullYear();
      return year >= currentYear && year <= currentYear + 20;
    }, "Card is expired or year is invalid"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  isDefault: z.boolean().optional().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type CardFormData = z.infer<typeof cardSchema>;
