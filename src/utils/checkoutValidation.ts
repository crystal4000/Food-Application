import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s()-]{10,}$/, "Please enter a valid phone number"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  isDefault: z.boolean().optional().default(false),
});

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{13,19}$/, "Please enter a valid card number")
    .transform((val) => val.replace(/\s/g, "")),
  cardHolderName: z.string().min(3, "Cardholder name is required"),
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
