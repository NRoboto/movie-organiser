import mongoose from "mongoose";
import { isValidIMDBId } from "../utils/omdb";
import { User, UserDocument, isUser } from "./User";

export type MovieIdDocument = { movieId: string } & mongoose.Document;

const movieIdSchema = new mongoose.Schema<MovieIdDocument>(
  {
    movieId: {
      type: String,
      required: true,
      validate(value: string) {
        return isValidIMDBId(value);
      },
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export type ListDocument = {
  createdBy: mongoose.Types.ObjectId;
  movieIds: mongoose.Types.Array<MovieIdDocument>;
  isPublic: boolean;
  userCanView: (user?: any) => boolean;
} & mongoose.Document;

const listSchema = new mongoose.Schema<ListDocument>(
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
    // Add viewable by ID array
  },
  {
    timestamps: true,
  }
);

listSchema.methods.toJSON = function () {
  const list: ListDocument = this.toObject();

  delete list.__v;

  return list;
};

listSchema.methods.userCanView = function (user) {
  if (this.isPublic) return true;

  if (!isUser(user)) return false;

  if (user) return this.createdBy.equals(user.id);
  // Add condition for user.id in viewable by array

  return false;
};

listSchema.pre<ListDocument>("save", async function () {
  const list = this;

  if (list.movieIds.length > 100)
    throw new Error("Max movieIds length exceeded");
});

type ListModel = {} & mongoose.Model<ListDocument>;

export const List = mongoose.model<ListDocument, ListModel>("list", listSchema);
