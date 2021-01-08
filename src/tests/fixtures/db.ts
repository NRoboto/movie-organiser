import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User, List } from "../../models";
import type { UserDocument, ListDocument } from "../../models";

const user1Id = new mongoose.Types.ObjectId();
const user2Id = new mongoose.Types.ObjectId();

type OptionalUserDoc = Partial<UserDocument>;
type OptionalListDoc = Partial<Omit<ListDocument, "movieIds">> & {
  movieIds?: { movieId: string }[];
};

export const user1: OptionalUserDoc = {
  _id: user1Id,
  username: "Alice",
  password: "myPassword123!",
  gender: "Enby",
  age: 30,
  location: "Trondheim, Norway",
  tokens: [],
};

export const user2: OptionalUserDoc = {
  _id: user2Id,
  username: "Lilly",
  password: "testPassword",
  gender: "Female",
  age: 22,
  location: "Berlin, Germany",
};

export const user1List1: OptionalListDoc = {
  createdBy: user1Id,
  movieIds: [{ movieId: "tt123456" }, { movieId: "tt478945" }],
  isPublic: true,
};

export const user1List2: OptionalListDoc = {
  createdBy: user1Id,
  movieIds: [
    { movieId: "tt678512" },
    { movieId: "tt964852" },
    { movieId: "tt457258" },
    { movieId: "tt238646" },
  ],
  isPublic: true,
};

export const user1List3: OptionalListDoc = {
  createdBy: user1Id,
  movieIds: [{ movieId: "tt575864" }],
  isPublic: false,
};

export const user2List1: OptionalListDoc = {
  createdBy: user2Id,
  movieIds: [{ movieId: "tt584856" }, { movieId: "tt596877" }],
  isPublic: false,
};

export const setupDatabase = async () => {
  await User.deleteMany({});
  await List.deleteMany({});
  await new User(user1).save(); // Create new user
  await new User(user2).save();
  await new List(user1List1).save();
  await new List(user1List2).save();
  await new List(user1List3).save();
  await new List(user2List1).save();
};
