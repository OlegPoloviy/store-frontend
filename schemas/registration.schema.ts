import { z } from "zod";

export const registrationSchema = z
  .object({
    firstName: z.string().min(2, "The name is too short!"),
    lastName: z.string().min(2, "Last name is too short!"),
    email: z.string().email("Invalid email!"),
    phone: z.string().optional(),
    password: z.string().min(6, "The password must be longer!"),
    confirmPassword: z.string(),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match!",
    path: ["confirmPassword"],
  });
