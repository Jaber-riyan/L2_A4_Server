import { z } from "zod";

// Create Book Schema
export const createBookZodSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
  genre: z.string().trim().min(1, "Genre is required"),
  isbn: z.string().trim().min(1, "ISBN is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  copies: z.number().int().nonnegative("Copies cannot be negative"),
  available: z.boolean().optional(),
});

// Update Book Schema
export const updateBookZodSchema = z.object({
  title: z.string().trim().min(1, "Title must be at least 1 character").optional(),
  author: z.string().trim().min(1, "Author is required").optional(),
  genre: z.string().trim().min(1, "Genre is required").optional(),
  isbn: z.string().trim().min(1, "ISBN is required").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  copies: z.number().int().nonnegative("Copies cannot be negative").optional(),
  available: z.boolean().optional(),
});

// Borrow Book Schema
export const borrowBookZodSchema = z.object({
  book: z.string().optional(),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int()
    .positive("Quantity must be greater than 0"),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .refine((val) => new Date(val) > new Date(), {
      message: "Due date must be a future date",
    }),
});

