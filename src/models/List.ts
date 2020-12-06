import mongoose from "mongoose";
import { User } from ".";
import { isValidIMDBId } from "../utils/omdb";

type MovieIdSchema = { id: string };

const movieIdSchema = new mongoose.Schema<MovieIdSchema>(
  {
    id: {
      type: String,
      validate(value: string) {
        return isValidIMDBId(value);
      },
    },
  },
  {
    timestamps: true,
  }
);

type ListSchema = {
  createdBy: mongoose.Types.ObjectId;
  movieIds: string[];
  isPublic: boolean;
} & mongoose.Document;

const listSchema = new mongoose.Schema<ListSchema>(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      async validate(id: mongoose.Types.ObjectId) {
        return (await User.findById(id)) !== undefined;
      },
    },
    movieIds: {
      type: [movieIdSchema],
    },
    isPublic: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const List = mongoose.model("list", listSchema);
