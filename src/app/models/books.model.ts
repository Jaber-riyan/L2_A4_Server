import { Schema, model } from "mongoose";
import { IBook, IBorrow } from "../interfaces/books.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    copies: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book" },
    quantity: { type: Number, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Book = model<IBook>("Book", bookSchema);
export const Borrow = model<IBorrow>("Borrow", borrowSchema);
