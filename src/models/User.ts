import mongoose from "mongoose";
import Filter from "bad-words";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import isEqual from "lodash.isequal";
import { ListDocument } from "./List";

const filter = new Filter();

export type TokenObject = {
  sub: string; // User ID
  iat: Number;
};

export type TokenDocument = {
  token: string;
} & mongoose.Document;

const tokenSchema = new mongoose.Schema<TokenDocument>(
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

export type UserDocument = {
  username: string;
  displayName?: string;
  password: string;
  gender: string;
  age: number;
  location: string;
  tokens: TokenDocument[];
  isPassword: (pass: string) => Promise<boolean>;
  createToken: () => Promise<string>;
  getPublicDocument: () => { [key: string]: any };
  getLists: (
    page?: number,
    itemsPerPage?: number,
    sort?: { [key: string]: any },
    showPrivate?: boolean
  ) => Promise<ListDocument[]>;
} & mongoose.Document;

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
      validate(value: string) {
        if (filter.isProfane(value))
          throw new Error("Username cannot contain profanity.");

        return true;
      },
    },
    displayName: {
      type: String,
      unique: true,
      required: false,
      minlength: 3,
      maxlength: 20,
      trim: true,
      async validate(value: string) {
        if (filter.isProfane(value))
          throw new Error("Display name cannot contain profanity.");

        return true;
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },
    gender: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
      required: false,
      min: 0,
      max: 120,
    },
    location: {
      type: String,
      required: false,
    },
    tokens: [tokenSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("lists", {
  ref: "list",
  localField: "_id",
  foreignField: "createdBy",
});

type UserModel = {
  getByJwt: (token: TokenObject) => Promise<UserDocument | null>;
  getViewableLists: (
    username: string,
    page?: number,
    itemsPerPage?: number,
    sort?: { [key: string]: any },
    currentUser?: UserDocument
  ) => Promise<ListDocument[]>;
} & mongoose.Model<UserDocument>;

(userSchema.statics as UserModel).getByJwt = async (token) => {
  const user = await User.findById(token.sub);

  if (user?.tokens.some((t) => isEqual(jwt.decode(t.token), token)))
    return user;

  return null;
};

(userSchema.statics as UserModel).getViewableLists = async (
  username,
  page = 0,
  itemsPerPage = 5,
  sort,
  currentUser
) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error(`User "${username}" not found.`);

  const showPrivate = currentUser?.id === user.id;

  return await user.getLists(page, itemsPerPage, sort, showPrivate);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user._id;

  return user;
};

userSchema.methods.getPublicDocument = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user._id;
  delete user.updatedAt;
  delete user.age;
  delete user.tokens;

  return user;
};

userSchema.methods.isPassword = async function (pass) {
  const user = this;

  return await bcrypt.compare(pass, user.password);
};

userSchema.methods.createToken = async function () {
  const user = this;

  const iat = new Date().getTime();
  const jwtObject: TokenObject = { sub: user.id, iat };
  const token = jwt.sign(jwtObject, process.env.JWT_SECRET!);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.getLists = async function (
  page = 0,
  itemsPerPage = 5,
  sort,
  showPrivate = false
) {
  const user = this;

  const limit = itemsPerPage;
  const skip = itemsPerPage * page;

  const match: { [key: string]: boolean } = {};
  if (!showPrivate) match["isPublic"] = true;

  await user
    .populate({
      path: "lists",
      match,
      options: {
        limit,
        skip,
        sort,
      },
    })
    .execPopulate(); // NOTE: Currently returns all movie Ids, should only return first

  return (user as any).lists;
};

userSchema.pre<UserDocument>("save", async function (next) {
  const user = this;

  if (user.isNew) {
    user.displayName = user.username;
    user.username = user.username.toLowerCase();
  }

  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 10);

  next();
});

export const User = mongoose.model<UserDocument, UserModel>("user", userSchema);

export const isUser = (user: any): user is UserDocument =>
  user && user.schema === User.schema;
