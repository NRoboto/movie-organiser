import { RequestHandler } from "express";
import { User } from "../models/User";

export const createUser: RequestHandler = async (req, res) => {
  const { username, password, age, gender, location } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(403).send("Username is already in use");

  try {
    const user = await User.create({
      username,
      password,
      age,
      gender,
      location,
    });

    res.send(user);
  } catch (error) {
    const message = error.message;
    if (message) return res.status(400).send({ error: message });

    res.status(500).send({ error });
  }
};

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

export const deleteUser: RequestHandler = async (req, res) => {};

export const searchUser: RequestHandler = async (req, res) => {};
