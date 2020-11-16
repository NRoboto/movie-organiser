import { RequestHandler } from "express";
import passport from "passport";
import jswt from "jsonwebtoken";
import { User } from "../models";

export const signin: RequestHandler = async (req, res) => {
  if (!(req.user instanceof User))
    return res.status(500).send({ error: "Could not sign in" });

  res.send({
    token: jswt.sign(req.user.id, process.env.JWT_SECRET!),
  });
};
