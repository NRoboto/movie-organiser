import mongoose from "mongoose";
import Filter from "bad-words";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const filter = new Filter();

export type UserDocument = {
  username: string;
  displayName?: string;
  password: string;
  gender: string;
  age: number;
  location: string;
  isPassword: (pass: string) => Promise<boolean>;
  createToken: () => string;
  getPublicDocument: () => { [key: string]: string };
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

        const existingUser = await User.findOne({
          username: value.toLowerCase(),
        });

        if (existingUser)
          throw new Error(
            `Display name cannot be the same as another user's username`
          );

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
  },
  {
    timestamps: true,
  }
);

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

  return user;
};

userSchema.methods.isPassword = async function (pass) {
  const user = this;

  return await bcrypt.compare(pass, user.password);
};

userSchema.methods.createToken = function () {
  const user = this;

  const iat = new Date().getTime();
  return jwt.sign({ sub: user.id, iat }, process.env.JWT_SECRET!);
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

export const User = mongoose.model<UserDocument>("user", userSchema);

export const isUser = (user: any): user is UserDocument =>
  user && user.schema === User.schema;
