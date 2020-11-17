import { RequestHandler } from "express";
import { Types as mongooseTypes } from "mongoose";
import { User } from "../models/User";

export const readUser: RequestHandler = async (req, res) => {
  const username = req.params.username;

  if (!username) {
    // When auth is implemented, get own username from token
    return res
      .status(501)
      .send({ error: "Authentication is not yet implemented" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).send({ error: `User "${username}" not found.` });

    res.send(user);
  } catch (error) {
    res.status(500).send({ error });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  // NOTE: Username in body should be ignored, instead it should be obtained from auth
  const { username, displayName, password, age, gender, location } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username },
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

    if (!user)
      return res.status(404).send({ error: `User "${username}" not found.` });

    res.send({ user });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  // NOTE: Username in body should be ignored, instead it should be obtained from auth
  const { username } = req.body;

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

    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};
