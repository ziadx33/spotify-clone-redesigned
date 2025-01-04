import { $Enums } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
  name: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const trackDataSchema = z.object({
  title: z.string().min(1),
  genre: z.nativeEnum($Enums.GENRES),
});
