import { RequestHandler } from "express";
import { isUser, List } from "../models";

export const createList: RequestHandler = async (req, res) => {
  const { isPublic = true, ids = [] } = req.body;

  if (!isUser(req.user))
    return res.status(500).send({ error: "Authentication error" });

  try {
    const list = await new List({
      createdBy: req.user._id,
      movieIds: ids.map((id: string) => ({
        id,
      })),
      isPublic,
    }).save();

    return res.send({ list });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};
