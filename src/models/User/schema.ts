import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Filter from "bad-words";
import { UserDocument } from ".";
import { TokenObject, tokenSchema } from "..";

const filter = new Filter();

export const userSchema = new mongoose.Schema<UserDocument>(
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

userSchema.methods.toJSON = function () {
  throw new Error("Model should not be serialised directly");
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

  user.tokens.push({ token });
  await user.save();

  return user.tokens[0];
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
