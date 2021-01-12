import mongoose from "mongoose";

export type TokenObject = {
  sub: string; // User ID
  iat: Number;
};

export type TokenDocument = {
  token: string;
  createdAt?: string;
};

export const tokenSchema = new mongoose.Schema<TokenDocument>(
  {
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    _id: false,
  }
);
