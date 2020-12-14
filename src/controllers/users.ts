import { RequestHandler } from "express";
import { User, UserDocument, isUser } from "../models/User";
import { ReqAuthRequestHandler, UseAuthRequestHandler } from "./types";

export const readSelf: ReqAuthRequestHandler = async (req, res, next, user) => {
  res.send(user);
};

export const readUser: UseAuthRequestHandler = async (req, res, next, user) => {
  const username = req.params.username;

  const foundUser = await User.findOne({ username });
  if (!foundUser)
    return next({ message: `User "${username}" not found.`, status: 404 });

  if (user?.username === username) res.send(foundUser);
  else res.send(foundUser.getPublicDocument());
};

export const updateUser: ReqAuthRequestHandler = async (
  req,
  res,
  next,
  user
) => {
  const updatableFields: (keyof UserDocument)[] = [
    "displayName",
    "password",
    "age",
    "gender",
    "location",
  ];

  const updates = updatableFields
    .filter((field) => req.body[field])
    .reduce((updates, field) => {
      updates[field] = req.body[field];
      return updates;
    }, {} as { [key in keyof UserDocument]?: any });

  const updatedUser = Object.assign(user, updates);
  await updatedUser.save();

  res.send({ user: updatedUser });
};

export const deleteUser: ReqAuthRequestHandler = async (
  req,
  res,
  next,
  user
) => {
  const deletedUser = await user.deleteOne();

  if (!deletedUser)
    return next({ message: "Unable to delete user", status: 500 });

  res.send(deletedUser);
};

export const searchUser: RequestHandler = async (req, res, next) => {
  const { name, location } = req.query;

  if (!name && !location) return next();

  const getSearchRegex = (value: any) =>
    value ? new RegExp(`.*${value}.*`, "i") : /.*/;
  const nameRegex = getSearchRegex(name);

  const users = await User.find({
    $or: [{ username: nameRegex }, { displayName: nameRegex }],
    location: getSearchRegex(location),
  });

  res.send(users.map((user) => user.getPublicDocument()));
};
