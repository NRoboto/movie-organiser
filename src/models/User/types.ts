import mongoose from "mongoose";
import { ListDocument, TokenDocument, TokenObject } from "..";

export type UserDocument = {
  username: string;
  displayName?: string;
  password: string;
  gender: string;
  age: number;
  location: string;
  tokens: TokenDocument[];
  createdAt?: string;

  isPassword: (pass: string) => Promise<boolean>;
  createToken: () => Promise<TokenDocument>;
  getLists: (
    page?: number,
    itemsPerPage?: number,
    sort?: { [key: string]: any },
    showPrivate?: boolean
  ) => Promise<ListDocument[]>;
  removeToken: (tokensOrAll: string[] | "all") => Promise<UserDocument>;
  updateDetails: (updates: Record<string, string>) => Promise<UserDocument>;
} & mongoose.Document;

export type UserModel = {
  getByJwt: (token: TokenObject) => Promise<UserDocument | null>;
  getViewableLists: (
    username: string,
    page?: number,
    itemsPerPage?: number,
    sort?: { [key: string]: any },
    currentUser?: UserDocument
  ) => Promise<ListDocument[]>;
  getByUsername: (username: string) => Promise<UserDocument | null>;
  usernameExists: (username: string) => Promise<boolean>;
} & mongoose.Model<UserDocument>;
