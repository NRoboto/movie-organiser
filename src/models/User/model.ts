import mongoose from "mongoose";
import isEqual from "lodash.isequal";
import jwt from "jsonwebtoken";
import { UserModel } from ".";
import { userSchema } from "./schema";
import { UserDocument } from "..";

(userSchema.statics as UserModel).getByJwt = async (token) => {
  const user = await User.findById(token.sub).select("+tokens");

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

(userSchema.statics as UserModel).getByUsername = async (username: string) =>
  await User.findOne({ username: username.toLowerCase() });

(userSchema.statics as UserModel).usernameExists = async (username: string) =>
  !!(await User.getByUsername(username));

(userSchema.statics as UserModel).search = async (name, location) => {
  // TODO: Don't use regex, or sanitize, can be used for DDOS attacks
  const getSearchRegex = (value: string) =>
    value ? new RegExp(`.*${value}.*`, "i") : /.*/;

  const nameRegex = getSearchRegex(name);

  return await User.find({
    $or: [{ username: nameRegex }, { displayName: nameRegex }],
    location: getSearchRegex(location),
  });
};

export const User = mongoose.model<UserDocument, UserModel>("user", userSchema);
