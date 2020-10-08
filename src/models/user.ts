import mongoose from "mongoose";
import Filter from "bad-words";

const filter = new Filter();

const userSchema = new mongoose.Schema(
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

export const User = mongoose.model("user", userSchema);
