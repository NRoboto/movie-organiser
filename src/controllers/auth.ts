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
