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

type TokenSchema = { token: string };

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type UserDocument = {
  username: string;
  displayName?: string;
  password: string;
  gender: string;
  age: number;
  location: string;
  tokens: TokenSchema[];
  isPassword: (pass: string) => Promise<boolean>;
  createToken: () => Promise<string>;
  getPublicDocument: () => { [key: string]: any };
  getLists: (
    limit?: number,
    skip?: number,
    sort?: string
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

        // const existingUser = await User.findOne({
        //   username: value.toLowerCase(),
        // });
        //
        // if (existingUser)
        //   throw new Error(
        //     `Display name cannot be the same as another user's username`
        //   );

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
    targetUserId: string | mongoose.Types.ObjectId,
    user?: UserDocument
  ) => Promise<ListDocument[]>;
} & mongoose.Model<UserDocument>;

(userSchema.statics as UserModel).getByJwt = async (token) => {
  const user = await User.findById(token.sub);

  if (user?.tokens.some((t) => isEqual(jwt.decode(t.token), token)))
    return user;

  return null;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user._id;
  delete user.tokens;

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

userSchema.methods.getLists = async function (limit, skip, sort) {
  const user = this;

  await user
    .populate({
      path: "lists",
      options: {
        limit,
        skip,
        sort,
      },
    })
    .execPopulate();

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
