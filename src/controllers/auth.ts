import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User, isUser } from "../models";

export const signin: RequestHandler = async (req, res) => {
  if (!isUser(req.user)) {
    return res.status(500).send({ error: "Could not sign in" });
  }

  res.send({
    token: req.user.createToken(),
  });
};

export const signup: RequestHandler = async (req, res, next) => {
  const { username, password, gender, age, location } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) return res.status(422).send({ error: "Email already in use" });

    const newUser = await new User({
      username,
      password,
      gender,
      age,
      location,
    }).save();

    req.user = newUser;
    return next();
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};
