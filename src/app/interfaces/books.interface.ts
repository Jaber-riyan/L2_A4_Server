import { Types } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  copies: number;
  available?: boolean;
}

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}
