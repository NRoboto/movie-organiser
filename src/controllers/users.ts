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
