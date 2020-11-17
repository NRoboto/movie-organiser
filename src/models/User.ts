import mongoose from "mongoose";
import Filter from "bad-words";
import jwt from "jsonwebtoken";

const filter = new Filter();

type UserDocument = {
  username: string;
  displayName?: string;
  password: string;
  gender: string;
  age: number;
  location: string;
  isPassword: (pass: string) => boolean;
  createToken: () => string;
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
  delete user.updatedAt;
  delete user.__v;
  delete user._id;

  return user;
};

userSchema.methods.isPassword = function (pass) {
  const user = this;

  return user.password === pass; // NOTE: Should use bcrypt
};

userSchema.methods.createToken = function () {
  const user = this;

  const iat = new Date().getTime();
  return jwt.sign({ sub: user.id, iat }, process.env.JWT_SECRET!);
};

userSchema.pre<UserDocument>("save", function () {
  const user = this;
  if (user.isNew) {
    user.displayName = user.username;
    user.username = user.username.toLowerCase();
  }
});

export const User = mongoose.model<UserDocument>("user", userSchema);

export const isUser = (user: any): user is UserDocument =>
  user.schema === User.schema;
