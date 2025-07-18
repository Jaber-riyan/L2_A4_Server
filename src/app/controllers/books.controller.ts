import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { borrowBookZodSchema, createBookZodSchema, updateBookZodSchema } from '../zodSchemas/book.zod';
import { Book, Borrow } from '../models/books.model';
import { ZodError } from 'zod';
import { User } from '../models/users.model';

export const booksRouter = express.Router();

// Create Book
booksRouter.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = createBookZodSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                error: parsed.error.format(),
            });
            return
        }

        const newBook = await Book.create(parsed.data);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});

// Get All Books
booksRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: books,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Get Single Book by ID
booksRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            success: false,
            message: "Invalid book ID",
        });
        return
    }

    const book = await Book.findById(id);

    if (!book) {
        res.status(404).json({
            success: false,
            message: "Book not found",
        });
        return
    }

    res.status(200).json({
        success: true,
        data: book,
    });
});

// Update Book
booksRouter.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid book ID",
    });
    return;
  }

  const parsed = updateBookZodSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      error: parsed.error.format(),
    });
    return;
  }

  const updateData = parsed.data;

  // যদি copies ফিল্ডটি দেওয়া থাকে তাহলে available ঠিক করে দাও
  if (typeof updateData.copies === "number") {
    updateData.available = updateData.copies > 0;
  }

  const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedBook) {
    res.status(404).json({
      success: false,
      message: "Book not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: updatedBook,
  });
});


// Delete Book
booksRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            success: false,
            message: "Invalid book ID",
        });
        return
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    await Borrow.deleteMany({ book: id });

    if (!deletedBook) {
        res.status(404).json({
            success: false,
            message: "Book not found",
        });
        return
    }

    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook,
    });
});

// Borrow Book
booksRouter.post("/borrow/:bookId", async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
            return
        }

        const parsed = borrowBookZodSchema.safeParse(req.body);

        if (!parsed.success) {
            const simplifiedErrors = parsed.error.errors.map(err => err.message);
            res.status(400).json({
                success: false,
                message: simplifiedErrors[0],
            });
            return
        }

        const book = await Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return
        }

        if (book.copies < parsed.data.quantity) {
            res.status(400).json({
                success: false,
                message: "Not enough copies available",
            });
            return
        }

        // Update book copies
        book.copies -= parsed.data.quantity;
        if (book.copies === 0) {
            book.available = false;
        }
        await book.save();

        const borrowed = await Borrow.create({
            book: book._id,
            quantity: parsed.data.quantity,
            dueDate: new Date(parsed.data.dueDate),
        });

        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowed,
        });
    }
    catch (error: any) {
        if (error instanceof ZodError) {
            const simplifiedErrors = error.errors.map(err => err.message);

            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: simplifiedErrors,
            });
        } else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
});

// Borrow Summary
booksRouter.get("/summary/borrowed", async (_req: Request, res: Response) => {
    try {
        // Get totalBooks count
        const totalBooks = await Book.countDocuments();

        // Get totalUsers count
        const totalUsers = await User.countDocuments();

        // Get totalBorrowings from Borrow collection
        const totalBorrowingsResult = await Borrow.aggregate([
            {
                $group: {
                    _id: null,
                    totalBorrowings: { $sum: "$quantity" },
                },
            },
        ]);
        const totalBorrowings =
            totalBorrowingsResult.length > 0
                ? totalBorrowingsResult[0].totalBorrowings
                : 0;

        // Get availableBooks count (copies > 0)
        const availableBooks = await Book.countDocuments({ copies: { $gt: 0 }, available: true });

        // Get borrowed summary (sorted by totalBorrowed descending)
        const summary = await Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalBorrowed: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: "$bookDetails",
            },
            {
                $project: {
                    title: "$bookDetails.title",
                    isbn: "$bookDetails.isbn",
                    availableCopies: "$bookDetails.copies",
                    totalBorrowed: 1,
                },
            },
            {
                $sort: {
                    totalBorrowed: -1
                }
            }
        ]);

        // Send final response
        res.status(200).json({
            success: true,
            data: {
                totalBooks,
                totalUsers,
                totalBorrowings,
                availableBooks,
                sortByTotalBorrowed: summary,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
