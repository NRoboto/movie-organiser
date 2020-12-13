import { RequestHandler } from "express";
import { User, isUser } from "../models";

export const signin: RequestHandler = async (req, res) => {
  if (!isUser(req.user) || !(await req.user.isPassword(req.body.password))) {
    return res.status(401).send({ error: "Authentication error" });
  }

  res.send({
    token: await req.user.createToken(),
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

export const signout: RequestHandler = async (req, res) => {
  const reqToken = req.body.token;

  if (!isUser(req.user))
    return res.status(401).send({ error: "Authentication error" });

  if (!reqToken) return res.status(400).send({ error: "No token provided" });

  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== reqToken
    );
    const user = await req.user.save();

    res.send({ user });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

export const signoutAll: RequestHandler = async (req, res, next) => {
  if (!isUser(req.user))
    return res.status(401).send({ error: "Authentication error" });

  if (req.body.all !== "true") return next();

  try {
    req.user.tokens = [];
    const user = await req.user.save();

    res.send({ user });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};
