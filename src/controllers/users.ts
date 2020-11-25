import { RequestHandler } from "express";
import { Types as mongooseTypes } from "mongoose";
import { User, isUser } from "../models/User";

export const readSelf: RequestHandler = async (req, res) => {
  if (!isUser(req.user))
    return res.status(500).send({ error: "User is not authenticated" });

  res.send(req.user);
};

export const readUser: RequestHandler = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).send({ error: `User "${username}" not found.` });

    if (isUser(req.user) && req.user.username === username) res.send(user);
    else res.send(user.getPublicDocument());
  } catch (error) {
    res.status(500).send({ error });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  // NOTE: Username in body should be ignored, instead it should be obtained from auth
  const { displayName, password, age, gender, location } = req.body;

  if (!isUser(req.user))
    return res.status(500).send({ error: "User is not authenticated" });

  try {
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      {
        displayName,
        password,
        age,
        gender,
        location,
      },
      {
        new: true,
        omitUndefined: true,
        runValidators: true,
      }
    );

    if (!user) return res.status(404).send({ error: `Invalid authentication` });

    res.send({ user });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  if (!isUser(req.user))
    return res.status(500).send({ error: "User is not authenticated" });

  const username = req.user.username;

  try {
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser)
      return res.status(404).send({ error: `User "${username}" not found.` });

    res.send(deletedUser);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

export const searchUser: RequestHandler = async (req, res, next) => {
  const { name, location } = req.query;

  if (!name && !location) return next();

  const getSearchRegex = (value: any) =>
    value ? new RegExp(`.*${value}.*`, "i") : /.*/;
  const nameRegex = getSearchRegex(name);

  try {
    const users = await User.find({
      $or: [{ username: nameRegex }, { displayName: nameRegex }],
      location: getSearchRegex(location),
    });

    res.send(users.map((user) => user.getPublicDocument()));
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};
