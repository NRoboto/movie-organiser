import { RequestHandler } from "express";
import { User, isUser } from "../models";
import { ReqAuthRequestHandler, SigninRequestHandler } from "./types";

export const signin: SigninRequestHandler = async (req, res, next, user) => {
  res.send({
    token: await user.createToken(),
  });
};

export const signup: RequestHandler = async (req, res, next) => {
  const { username, password, gender, age, location } = req.body;

  const user = await User.findOne({ username });
  if (user) return next({ message: "Email already in use", status: 422 });

  const newUser = await new User({
    username,
    password,
    gender,
    age,
    location,
  }).save();

  if (!newUser) return next({ message: "Error creating user", status: 500 });

  return await signin(req, res, next, newUser);
};

export const signout: ReqAuthRequestHandler = async (req, res, next, user) => {
  const reqToken = req.body.token;

  if (!reqToken) return next({ message: "No token provided", status: 400 });

  user.tokens = user.tokens.filter((token) => token.token !== reqToken);
  const updatedUser = await user.save();

  res.send({ user: updatedUser });
};

export const signoutAll: ReqAuthRequestHandler = async (
  req,
  res,
  next,
  user
) => {
  if (req.body.all !== "true") return next();

  user.tokens = [];
  const updatedUser = await user.save();

  res.send({ user: updatedUser });
};
