import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Please select gender",
    invalid_type_error: "Please select gender",
  }),
});
